import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
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

  const handleOpenDevInfoPopup = (event) => {
    setOpenDeviceInfoPopup(event.currentTarget);
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
                                <Button variant="outlined" color="info" onClick={handleOpenDevInfoPopup}>
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

                            <TableCell align="left">{ContentFileName}</TableCell>
                            <TableCell align="left">
                              <Typography variant="subtitle4">
                                {StartDate}-{EndDate}, {StartTime}-{EndTime}
                              </Typography>
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

      <BootstrapDialog onClose={handleCloseDevInfoPopup} aria-labelledby="customized-dialog-title" open={devInfoPopup}>
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
          <Typography gutterBottom>MAC : AB:AC:AD:AE:AF</Typography>
          <Typography gutterBottom>Added On : 23-01-2023 00:00</Typography>
          <Typography gutterBottom>Registered On : 24-01-2023 10:00</Typography>
          <Typography gutterBottom>Last Status updated : 23-01-2023 00:00</Typography>
          <Typography gutterBottom>Device OS : Linux6.1.21-v8+</Typography>
          <Typography gutterBottom>Device App Version : 1.1</Typography>
          <Typography gutterBottom>Device Ip : 127.0.0.1</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDevInfoPopup}>
            Ok
          </Button>
        </DialogActions>
      </BootstrapDialog>

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
