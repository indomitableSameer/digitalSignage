// @mui
import {
  Snackbar,
  Alert,
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://device.dss.com:4001',
});
// ----------------------------------------------------------------------

export default function DeviceContentUpdateDialog({ item, OnClose }) {
  const [contentList, setContentList] = useState([]);
  const [selected, setSelected] = useState();

  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [alertMsg, setAlertMsg] = useState('None');

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMsg('None');
    setAlertType('error');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getContent = await api.get('/getContentList');
        if (getContent.data != null) {
          setContentList(getContent.data);
        }
      } catch (error) {
        if (error.response) {
          console.log('Data:', error.response.data);
          console.log('Status:', error.response.status);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error:', error.message);
        }
      }
    };
    fetchData();
  }, []);

  const handleClose = () => {
    OnClose();
  };

  const handleSubmit = async () => {
    const msg = { Mac: item.Mac, ContentInfoId: selected.Id };
    try {
      const response = await api.post('/updateAllocSchedule', msg, { headers: { 'Content-Type': 'application/json' } });
      if (response.status === 200) {
        handleClose();
        setAlertMsg('Content updated successfully!');
        setAlertType('success');
        setAlert(true);
        // triggerUpdate();
      }
    } catch (error) {
      if (error.response) {
        console.log('Data:', error.response.data);
        console.log('Status:', error.response.status);
        setAlertMsg('Content update failed!');
        setAlertType('error');
        setAlert(true);
      } else if (error.request) {
        console.log(error.request);
        setAlertMsg('Content update failed!');
        setAlertType('error');
        setAlert(true);
      } else {
        console.log('Error:', error.message);
        setAlertMsg('Content update failed!');
        setAlertType('error');
        setAlert(true);
      }
    }
  };

  return (
    <>
      <Dialog fullWidth="sm" open={item} onClose={handleClose}>
        <DialogTitle>Update Content</DialogTitle>
        <DialogContent dividers>
          <Autocomplete
            autoHighlight
            id="contentselect"
            options={contentList}
            getOptionLabel={(option) => option.Name}
            onChange={(event, newValue) => {
              setSelected(newValue);
            }}
            onInputChange={(event, newValue) => {
              setSelected(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="select to update new content to play at location" />}
          />
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
