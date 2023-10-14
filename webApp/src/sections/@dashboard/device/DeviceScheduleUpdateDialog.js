import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import axios from 'axios';
// @mui
import { Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState, useContext } from 'react';
import UpdateDeviceContext from './UpdateDeviceContext';

const api = axios.create({
  baseURL: 'https://device.dss.com:4001',
});

// ----------------------------------------------------------------------

export default function DeviceScheduleUpdateDialog({ item, OnClose }) {
  const triggerUpdate = useContext(UpdateDeviceContext);

  const [startdate, setStartDate] = useState(dayjs());
  const [enddate, setEndDate] = useState(dayjs());
  const [starttime, setStartTime] = useState(dayjs('2022-04-17T00:00'));
  const [endtime, setEndTime] = useState(dayjs('2022-04-17T00:00'));

  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [alertMsg, setAlertMsg] = useState('None');

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMsg('None');
    setAlertType('error');
  };

  const handleClose = () => {
    OnClose();
  };

  const handleSubmit = async () => {
    const msg = {
      Mac: item.Mac,
      StartDate: startdate.format('DD-MM-YYYY'),
      EndDate: enddate.format('DD-MM-YYYY'),
      StartTime: starttime.format('HH:mm'),
      EndTime: endtime.format('HH:mm'),
    };

    console.log(msg);
    try {
      const response = await api.post('/updateAllocSchedule', msg, { headers: { 'Content-Type': 'application/json' } });
      if (response.status === 200) {
        handleClose();
        setAlertMsg('Schedule updated successfully!');

        setAlertType('success');
        setAlert(true);
        triggerUpdate();
      }
    } catch (error) {
      if (error.response) {
        console.log('Data:', error.response.data);
        console.log('Status:', error.response.status);
        setAlertMsg('Schedule update failed!');
        setAlertType('error');
        setAlert(true);
      } else if (error.request) {
        console.log(error.request);
        setAlertMsg('Schedule update failed!');
        setAlertType('error');
        setAlert(true);
      } else {
        console.log('Error:', error.message);
        setAlertMsg('Schedule update failed!');
        setAlertType('error');
        setAlert(true);
      }
    }
  };

  return (
    <>
      <Dialog fullWidth="sm" open={item} onClose={handleClose}>
        <DialogTitle>Update Schedule</DialogTitle>
        <DialogContent dividers>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid item xs={2} sm={3} ms={5}>
              <DatePicker
                label="Start Date"
                format="DD-MM-YYYY"
                value={startdate}
                disablePast
                onChange={(newValue) => setStartDate(newValue)}
              />
            </Grid>
            <Grid item xs={2} sm={3} ms={5}>
              <DatePicker
                label="End Date"
                format="DD-MM-YYYY"
                value={enddate}
                disablePast
                onChange={(newValue) => setEndDate(newValue)}
              />
            </Grid>
            <Grid item xs={2} sm={3} ms={5}>
              <TimePicker
                label="Start Time"
                ampm={false}
                value={starttime}
                onChange={(newValue) => setStartTime(newValue)}
              />
            </Grid>
            <Grid item xs={2} sm={3} ms={5}>
              <TimePicker label="End Time" ampm={false} value={endtime} onChange={(newValue) => setEndTime(newValue)} />
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alert} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
