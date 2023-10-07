import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
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
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { LocationForm, LocationListHead, LocationListToolbar } from '../sections/@dashboard/location';
// mock
import GetFromCloud from '../apidata/getApiCalls';

// ----------------------------------------------------------------------

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

export default function LocationsPage() {
  const [contentList, setContentList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);

  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('country');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const contentListData = GetFromCloud('contentlist');
  const countryListData = GetFromCloud('countrylist');
  const cityListData = GetFromCloud('citylist');
  const buildingListData = GetFromCloud('buildinglist');
  const areaListData = GetFromCloud('arealist');
  const deviceListData = GetFromCloud('deviceInfoList');

  const [locationListingData, setlocationListingData] = useState([]);

  useEffect(() => {
    // TODO : there check the if condition
    if (contentListData != null) {
      setContentList(contentListData);
    }
    if (countryListData != null) {
      setCountryList(countryListData);
    }
    if (cityListData != null) {
      setCityList(cityListData);
    }
    if (buildingListData != null) {
      setBuildingList(buildingListData);
    }
    if (areaListData != null) {
      setAreaList(areaListData);
    }
    if (deviceListData != null) {
      setlocationListingData(deviceListData);
    }
  }, [
    contentListData,
    contentList,
    countryListData,
    countryList,
    cityListData,
    cityList,
    buildingListData,
    buildingList,
    areaListData,
    areaList,
    deviceListData,
    deviceList,
  ]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
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

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Locations | DSS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Locations
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Card sx={{ width: 'auto' }}>
            <LocationForm
              countrylist={countryList}
              citylist={cityList}
              buildinglist={buildingList}
              arealist={areaList}
              devicelist={deviceList}
              contentlist={contentList}
            />
          </Card>

          <Card>
            <LocationListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
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
          </Card>
        </Stack>
      </Container>

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
