// @mui
import {
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import UpdateDeviceContext from './UpdateDeviceContext';
import baseApi from '../../../api/baseApi';
// ----------------------------------------------------------------------

export default function DeviceConfigDialog({ item, OnClose }) {
  const triggerUpdate = useContext(UpdateDeviceContext);

  const [contentList, setContentList] = useState([]);
  const [mode, setMode] = useState(null);
  const [orientation, setOrientation] = useState(null);

  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState('error');
  const [alertMsg, setAlertMsg] = useState('None');

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMsg('None');
    setAlertType('error');
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const getContent = await baseApi.get('/getContentList');
  //       if (getContent.data != null) {
  //         setContentList(getContent.data);
  //       }
  //     } catch (error) {
  //       if (error.response) {
  //         console.log('Data:', error.response.data);
  //         console.log('Status:', error.response.status);
  //       } else if (error.request) {
  //         console.log(error.request);
  //       } else {
  //         console.log('Error:', error.message);
  //       }
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleClose = () => {
    OnClose();
  };

  const handleSubmit = async () => {
    if (mode === null) {
      handleClose();
      // return;
    }

    // const msg = { Mac: item.Mac, mode: selected.Id };
    // try {
    //   const response = await baseApi.post('/web/setDeviceConfig', msg, {
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    //   if (response.status === 200) {
    //     handleClose();
    //     setAlertMsg('Content updated successfully!');
    //     setAlertType('success');
    //     setAlert(true);
    //     triggerUpdate();
    //   }
    // } catch (error) {
    //   if (error.response) {
    //     console.log('Data:', error.response.data);
    //     console.log('Status:', error.response.status);
    //     setAlertMsg('Content update failed!');
    //     setAlertType('error');
    //     setAlert(true);
    //   } else if (error.request) {
    //     console.log(error.request);
    //     setAlertMsg('Content update failed!');
    //     setAlertType('error');
    //     setAlert(true);
    //   } else {
    //     console.log('Error:', error.message);
    //     setAlertMsg('Content update failed!');
    //     setAlertType('error');
    //     setAlert(true);
    //   }
    // }
  };

  return (
    <>
      <Dialog fullWidth="sm" open={item} onClose={handleClose}>
        <DialogTitle>Update Device Config</DialogTitle>
        <DialogContent dividers>
          <InputLabel id="deviceMode">Mode</InputLabel>
          <Select
            labelId="deviceMode"
            id="deviceMode"
            value={mode}
            label="Mode"
            onChange={(event) => {
              setMode(event.target.value);
            }}
          >
            <MenuItem value={10}>Service</MenuItem>
            <MenuItem value={20}>Maintenance</MenuItem>
          </Select>
        </DialogContent>
        <DialogContent>
          <InputLabel id="orientation">Screen Orientation</InputLabel>
          <Select
            labelId="orientation"
            id="orientation"
            value={orientation}
            label="Rotate Screen"
            onChange={(event) => {
              setOrientation(event.target.value);
            }}
          >
            <MenuItem value={11}>90 degrees</MenuItem>
            <MenuItem value={22}>180 degrees</MenuItem>
            <MenuItem value={33}>270 degrees</MenuItem>
          </Select>
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
