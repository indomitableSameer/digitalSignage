import axios from 'axios';
import { filter } from 'lodash';
import { useState, useEffect, useContext } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
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
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

import LocationListToolbar from './LocationListToolbar';
import LocationListHead from './LocationListHead';
import UpdateLocationContext from './UpdateLocationContext';
// ----------------------------------------------------------------------

const api = axios.create({
  baseURL: 'http://api.dss.com:8001',
});

const TABLE_HEAD = [
  { id: 'Country', label: 'Country', alignRight: false },
  { id: 'City', label: 'City', alignRight: false },
  { id: 'Building', label: 'Building', alignRight: false },
  { id: 'Area', label: 'Area', alignRight: false },
  { id: 'Devices', label: 'Active Devices', alignRight: false },
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
  if (array === null) return array;
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_loc) => _loc.country.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function LocationList() {
  // -----States-----------------------------------
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('country');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [locationListingData, setlocationListingData] = useState([]);
  const triggerUpdate = useContext(UpdateLocationContext);

  // -----Api and Update Calls-----------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const getLocationList = await api.get('/getDeviceInfoList');
        if (getLocationList.data != null) {
          setlocationListingData(getLocationList.data);
        } else {
          setlocationListingData([]);
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
  }, [triggerUpdate]);

  // -----Functions-----------------------------------
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
      const newSelecteds = locationListingData.map((n) => n.country);
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

  const handleLocationDelete = async (event, newPage) => {
    const data = { DeviceId: open.customData.Mac };
    try {
      const response = await api.post('/removeLocation', data, { headers: { 'Content-Type': 'application/json' } });
      if (response.status === 200) {
        handleCloseMenu();
        triggerUpdate();
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

  const handleLocationEdit = (mac) => (event, newPage) => {
    console.log(mac);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - locationListingData.length) : 0;

  const filteredUsers = applySortFilter(locationListingData, getComparator(order, orderBy), filterName);

  const isNotFound = filteredUsers != null && !filteredUsers.length && !!filterName;

  return (
    <Card>
      <LocationListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <LocationListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={locationListingData.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers != null &&
                filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { Mac, Area, Building, City, Country } = row;
                  const selectedUser = selected.indexOf(Country) !== -1;

                  return (
                    <TableRow hover key={Mac} tabIndex={-1} role="checkbox" selected={selectedUser}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, Country)} />
                      </TableCell>

                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {Country}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="left">{City}</TableCell>

                      <TableCell align="left">{Building}</TableCell>

                      <TableCell align="left">{Area}</TableCell>

                      <TableCell align="left">{Mac}</TableCell>

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
        count={locationListingData.length}
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
        <MenuItem onClick={handleLocationEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleLocationDelete}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </Card>
  );
}
