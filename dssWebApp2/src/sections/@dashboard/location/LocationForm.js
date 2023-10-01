import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import axios, { HttpStatusCode } from 'axios';
import PropTypes from 'prop-types';
// @mui
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Autocomplete from '@mui/material/Autocomplete';
// component
import Iconify from '../../../components/iconify';

const api = axios.create({
  baseURL: 'http://api.dss.com:8000',
});

LocationForm.propTypes = {
  countrylist: PropTypes.array.isRequired,
  citylist: PropTypes.array.isRequired,
  buildinglist: PropTypes.array.isRequired,
  arealist: PropTypes.array.isRequired,
  devicelist: PropTypes.array.isRequired,
  contentlist: PropTypes.array.isRequired,
};

export default function LocationForm({
  countrylist,
  citylist,
  buildinglist,
  arealist,
  devicelist,
  contentlist,
  ...other
}) {
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [building, setBuilding] = useState();
  const [area, setArea] = useState();
  const [device, setDevice] = useState();
  const [startdate, setStartDate] = useState(dayjs());
  const [enddate, setEndDate] = useState(dayjs());
  const [starttime, setStartTime] = useState(dayjs('2022-04-17T00:00'));
  const [endtime, setEndTime] = useState(dayjs('2022-04-17T00:00'));
  const [content, setContent] = useState();

  const handleSubmit = async () => {
    console.log(country);
    console.log(city);
    console.log(building);
    console.log(area);
    console.log(device);
    console.log(startdate.format('DD-MM-YYYY'));
    console.log(endtime.format('HH:mm'));
    console.log(content);

    const data = {
      Country: country.Name,
      City: city.Name,
      Building: building.Name,
      Area: area.Name,
      Mac: device,
      StartDate: startdate.format('DD-MM-YYYY'),
      EndDate: enddate.format('DD-MM-YYYY'),
      StartTime: starttime.format('HH:mm'),
      EndTime: endtime.format('HH:mm'),
      ContentInfoId: content.Id,
    };

    console.log(data);
    api
      .post('/addLocation', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        // handle the response
        console.log(response);
      })
      .catch((error) => {
        // handle errors
        console.log(error);
      });
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 150 }}>
      <Grid container spacing={2}>
        <Grid item xs={2} sm={3} ms={5}>
          <Autocomplete
            id="country"
            options={countrylist}
            getOptionLabel={(option) => option.Name}
            value={country}
            onChange={(event, newValue) => {
              setCountry(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Country" />}
          />
        </Grid>

        <Grid item xs={2} sm={3} ms={5}>
          <Autocomplete
            id="city"
            freeSolo
            options={citylist}
            getOptionLabel={(option) => option.Name}
            value={city}
            onChange={(event, newValue) => {
              setCity(newValue);
            }}
            onInputChange={(event, newValue) => {
              setCity(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="City" />}
          />
        </Grid>

        <Grid item xs={2} sm={3} ms={5}>
          <Autocomplete
            id="building"
            freeSolo
            options={buildinglist}
            getOptionLabel={(option) => option.Name}
            value={building}
            onChange={(event, newValue) => {
              setBuilding(newValue);
            }}
            onInputChange={(event, newValue) => {
              setBuilding(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Building" />}
          />
        </Grid>

        <Grid item xs={2} sm={3} ms={5}>
          <Autocomplete
            id="area"
            freeSolo
            options={arealist}
            getOptionLabel={(option) => option.Name}
            value={area}
            onChange={(event, newValue) => {
              setArea(newValue);
            }}
            onInputChange={(event, newValue) => {
              setArea(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Area" />}
          />
        </Grid>

        <Grid item xs={2} sm={3} ms={5}>
          <Autocomplete
            id="mac"
            freeSolo
            options={devicelist}
            getOptionLabel={(option) => option.Name}
            value={device}
            onChange={(event, newValue) => {
              setDevice(newValue);
            }}
            onInputChange={(event, newValue) => {
              setDevice(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Device Mac" />}
          />
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid item xs={2} sm={3} ms={5}>
            <DatePicker
              label="Start Date"
              format="DD-MM-YYYY"
              value={startdate}
              disablePast
              onChange={(event) => setStartDate(event.target.value)}
            />
          </Grid>
          <Grid item xs={2} sm={3} ms={5}>
            <DatePicker
              label="End Date"
              format="DD-MM-YYYY"
              value={enddate}
              disablePast
              onChange={(event) => setEndDate(event.target.value)}
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

        <Grid item xs={2} sm={3} ms={5}>
          <Autocomplete
            autoHighlight
            id="contentselect"
            options={contentlist}
            getOptionLabel={(option) => option.Name}
            value={content}
            onChange={(event, newValue) => {
              setContent(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Content" />}
          />
        </Grid>

        <Grid item xs={2} sm={3} ms={5}>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleSubmit}>
            Add
          </Button>
        </Grid>
      </Grid>
    </FormControl>
  );
}
