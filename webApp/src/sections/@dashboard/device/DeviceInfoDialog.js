// @mui
import { Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DeviceInfoDialog({ item, OnClose }) {
  const handleClose = () => {
    OnClose();
  };

  return (
    <BootstrapDialog fullWidth="sm" onClose={handleClose} aria-labelledby="customized-dialog-title" open={item}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Device Info
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>MAC : {item && item.Mac}</Typography>
        <Typography gutterBottom>Added On : {item && item.DevAddedOn}</Typography>
        <Typography gutterBottom>Registered On : {item && item.DevRegOn}</Typography>
        <Typography gutterBottom>Last Status updated : {item && item.LastUpdateAt}</Typography>
        <Typography gutterBottom>Device OS : {item && item.DeviceOS}</Typography>
        <Typography gutterBottom>Device App Version : {item && item.DeviceAppVer}</Typography>
        <Typography gutterBottom>Device IP : {item && item.DeviceIp}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Ok
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
