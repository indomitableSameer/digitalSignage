import { filter } from 'lodash';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
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
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import DeviceListToolbar from './DeviceListToolbar';
import DeviceListHead from './DeviceListHead';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import UpdateDeviceContext from './UpdateDeviceContext';
import baseApi from '../../../api/baseApi';
import DeviceConfigDialog from './DeviceConfigDialog';
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
    return filter(array, (item) => item?.Mac?.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function DeviceList({ OnDevInfoClick, OnContentInfoClick, OnScheduleInfoClick }) {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [pageData, setPageData] = useState([]);

  const triggerUpdate = useContext(UpdateDeviceContext);

  const [devConfigDialog, setOpenDeviceConfigPopup] = useState(null);
  const handleOpenDevConfigPopup = (event, row) => {
    console.log('handleOpenDevConfigPopup is called');
    console.log(row);
    setOpenDeviceConfigPopup(row);
    handleCloseMenu();
  };

  const handleCloseDevConfigPopup = () => {
    setOpenDeviceConfigPopup(null);
  };
  // ----------Api and Update Calls----------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getDeviceList = await baseApi.get('/getDeviceInfoList');
        if (getDeviceList.data != null) {
          setPageData(getDeviceList.data);
        } else {
          setPageData([]);
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
    console.log('device list useeffect called');
  }, [triggerUpdate]);

  // -----------------------------------------------------

  const handleOpenMenu = (mac) => (event) => {
    console.log('handleOpenMenu called');
    const customEventData = {
      Mac: mac,
    };
    const mergedEvent = { ...event, customData: customEventData };
    setOpen(mergedEvent);
  };

  const handleCloseMenu = () => {
    setOpen(null);
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
  // ---------------

  return (
    <Card>
      <DeviceListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
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
                          <Button variant="outlined" color="info" onClick={(event) => OnDevInfoClick(event, row)}>
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
                          onClick={(event) => OnContentInfoClick(event, row)}
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
                          onClick={(event) => OnScheduleInfoClick(event, row)}
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
                        <IconButton size="large" color="inherit" onClick={handleOpenMenu(Mac)}>
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

      <Popover
        open={Boolean(open)}
        anchorEl={open && open.currentTarget}
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
        <MenuItem onClick={(event) => handleOpenDevConfigPopup(event, open.customData.Mac)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Configure
        </MenuItem>
      </Popover>
      <DeviceConfigDialog item={devConfigDialog} OnClose={handleCloseDevConfigPopup} />
    </Card>
  );
}
