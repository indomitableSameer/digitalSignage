import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Stack, Container, Typography } from '@mui/material';
// components
// sections
import {
  DeviceContentUpdateDialog,
  DeviceInfoDialog,
  DeviceList,
  DeviceScheduleUpdateDialog,
} from '../sections/@dashboard/device';
// mock
import { DeviceUpdateProvider } from '../sections/@dashboard/device/UpdateDeviceContext';

export default function DevicesPage() {
  // ----------------Dialog -----------------------------

  const [devContentUpdateDialog, setOpenDevContentUpdateDialog] = useState(null);
  const handleOpenContentUpdateDialog = (event, data) => {
    setOpenDevContentUpdateDialog(data);
  };
  const handleCloseContentUpdateDialog = () => {
    setOpenDevContentUpdateDialog(null);
  };

  const [devSchedUpdateDialog, setOpenSchedUpdateDialog] = useState(null);
  const handleOpenSchedUpdateDialog = (event, data) => {
    setOpenSchedUpdateDialog(data);
  };

  const handleCloseSchedUpdateDialog = () => {
    setOpenSchedUpdateDialog(null);
  };

  const [devInfoPopup, setOpenDeviceInfoPopup] = useState(null);
  const handleOpenDevInfoPopup = (event, row) => {
    setOpenDeviceInfoPopup(row);
  };

  const handleCloseDevInfoPopup = () => {
    setOpenDeviceInfoPopup(null);
  };

  return (
    <>
      <Helmet>
        <title> Devices | DSS </title>
      </Helmet>
      <DeviceUpdateProvider>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Devices
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <DeviceList
              OnDevInfoClick={handleOpenDevInfoPopup}
              OnContentInfoClick={handleOpenContentUpdateDialog}
              OnScheduleInfoClick={handleOpenSchedUpdateDialog}
            />
          </Stack>
        </Container>

        <DeviceInfoDialog item={devInfoPopup} OnClose={handleCloseDevInfoPopup} />
        <DeviceContentUpdateDialog item={devContentUpdateDialog} OnClose={handleCloseContentUpdateDialog} />
        <DeviceScheduleUpdateDialog item={devSchedUpdateDialog} OnClose={handleCloseSchedUpdateDialog} />
      </DeviceUpdateProvider>
    </>
  );
}
