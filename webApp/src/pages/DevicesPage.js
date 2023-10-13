import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import { styled } from '@mui/material/styles';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { DeviceListHead, DeviceListToolbar } from '../sections/@dashboard/device';
// mock
import GetDevicesData from '../apidata/devicesData';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Device', label: 'Device', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: 'Content', label: 'Content', alignRight: false },
  { id: 'Schedule', label: 'Schedule', alignRight: false },
  { id: 'Location', label: 'Location', alignRight: false },
  { id: '' },
];

const api = axios.create({
  baseURL: 'https://device.dss.com:4001',
});

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DevicesPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [devInfoPopup, setOpenDeviceInfoPopup] = useState(null);

  const devicesData = GetDevicesData();

  const [pageData, setPageData] = useState([]);

  const [devContentUpdatePopup, setOpenDevContentUpdatePopup] = useState(null);
  const [contentlist, setContentList] = useState([]);
  const [updateContentItem, setUpdateContentItem] = useState();

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

  useEffect(() => {
    // Use devicesData as needed
    if (devicesData != null) {
      console.log('DashboardAppPage: Devices Data:', devicesData);
      setPageData(devicesData);
    }
  }, [devicesData]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenContentUpdatePopup = (event, data) => {
    console.log(data);
    setOpenDevContentUpdatePopup(data);
  };

  const handleSubmitContentUpdate = (event, data) => {
    console.log(data);
    console.log(updateContentItem);
  };

  const handleCloseContentUpdatePopup = () => {
    setOpenDevContentUpdatePopup(null);
  };

  const handleOpenDevInfoPopup = (event, row) => {
    setOpenDeviceInfoPopup(row);
  };

  const handleCloseDevInfoPopup = () => {
    setOpenDeviceInfoPopup(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = pageData.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pageData.length) : 0;

  const filteredUsers = applySortFilter(pageData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Devices | DSS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Devices
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Card>
            <DeviceListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <DeviceListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={pageData.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers != null &&
                      filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        const {
                          Mac,
                          IsOnline,
                          ContentFileName,
                          StartDate,
                          EndDate,
                          StartTime,
                          EndTime,
                          Area,
                          Building,
                          City,
                          Country,
                        } = row;
                        const selectedUser = selected.indexOf(Mac) !== -1;

                        return (
                          <TableRow hover key={Mac} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Mac)} />
                            </TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Button
                                  variant="outlined"
                                  color="info"
                                  onClick={(event) => handleOpenDevInfoPopup(event, row)}
                                >
                                  <Typography variant="subtitle1" noWrap>
                                    {Mac}
                                  </Typography>
                                </Button>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">
                              <Label color={(IsOnline === false && 'error') || 'success'}>
                                {IsOnline ? 'Online' : 'Offline'}
                              </Label>
                            </TableCell>

                            <TableCell align="left">
                              <Button
                                variant="text"
                                color="info"
                                size="small"
                                startIcon={<SmartDisplayIcon fontSize="medium" />}
                                onClick={(event) => handleOpenContentUpdatePopup(event, row)}
                              >
                                {ContentFileName}
                              </Button>
                            </TableCell>
                            <TableCell align="left">
                              <Button
                                variant="text"
                                color="info"
                                size="small"
                                startIcon={<ScheduleIcon fontSize="medium" />}
                                onClick={(event) => handleOpenContentUpdatePopup(event, row)}
                              >
                                {StartDate}-{EndDate}, {StartTime}-{EndTime}
                              </Button>
                            </TableCell>
                            <TableCell align="left">
                              <Typography variant="subtitle4">
                                {Area}, {Building}, {City}, {Country}
                              </Typography>
                            </TableCell>

                            <TableCell align="right">
                              <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                <Iconify icon={'eva:more-vertical-fill'} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
              {/* <Dialog open={devInfoPopup} onClose={handleCloseDevInfoPopup}>
                <DialogTitle>Device Informations</DialogTitle>
                <Typography variant="subtitle1" noWrap>
                  Added On : 12-02-2023
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  Location : abc dbb aa cc
                </Typography>
              </Dialog> */}
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pageData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Stack>
      </Container>

      <BootstrapDialog
        fullWidth="sm"
        onClose={handleCloseDevInfoPopup}
        aria-labelledby="customized-dialog-title"
        open={devInfoPopup}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Device Info
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDevInfoPopup}
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
          <Typography gutterBottom>MAC : {devInfoPopup && devInfoPopup.Mac}</Typography>
          <Typography gutterBottom>Added On : {devInfoPopup && devInfoPopup.DevAddedOn}</Typography>
          <Typography gutterBottom>Registered On : {devInfoPopup && devInfoPopup.DevRegOn}</Typography>
          <Typography gutterBottom>Last Status updated : {devInfoPopup && devInfoPopup.LastUpdateAt}</Typography>
          <Typography gutterBottom>Device OS : {devInfoPopup && devInfoPopup.DeviceOS}</Typography>
          <Typography gutterBottom>Device App Version : {devInfoPopup && devInfoPopup.DeviceAppVer}</Typography>
          <Typography gutterBottom>Device IP : {devInfoPopup && devInfoPopup.DeviceIp}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDevInfoPopup}>
            Ok
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Dialog fullWidth="sm" open={devContentUpdatePopup} onClose={handleCloseContentUpdatePopup}>
        <DialogTitle>Update Content</DialogTitle>
        <DialogContent>
          <Autocomplete
            autoHighlight
            id="contentselect"
            options={contentlist}
            getOptionLabel={(option) => option.Name}
            onChange={(event, newValue) => {
              setUpdateContentItem(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="select to update new content to play at location" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContentUpdatePopup}>Cancel</Button>
          <Button onClick={handleSubmitContentUpdate}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
