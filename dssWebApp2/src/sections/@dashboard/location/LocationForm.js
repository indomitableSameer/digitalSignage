import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
// @mui
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Autocomplete from '@mui/material/Autocomplete';
// component
import Iconify from '../../../components/iconify';

const top100Films = ['test1', 'test2'];
const countries = ['Germany'];
const cities = ['Frankfurt'];

export default function LocationForm() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [building, setBuilding] = useState('');
  const [area, setArea] = useState('');
  const [mac, setMac] = useState('');
  const [startdate, setStartDate] = useState(null);
  const [enddate, setEndDate] = useState(null);
  const [starttime, setStartTime] = useState(null);
  const [endtime, setEndTime] = useState(null);
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    console.log(country);
    console.log(city);
    console.log(building);
    console.log(area);
    console.log(mac);
    console.log(startdate);
    console.log(endtime);
    console.log(content);
  };

  return (
    <Grid spacing={2}>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <Grid item xs={5}>
          <Autocomplete
            id="country"
            options={countries}
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
            options={cities}
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
            options={top100Films}
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
            options={top100Films}
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
            options={top100Films}
            value={mac}
            onChange={(event, newValue) => {
              setMac(newValue);
            }}
            onInputChange={(event, newValue) => {
              setMac(newValue);
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
              format="HH:MM"
              ampm={false}
              value={starttime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </Grid>
          <Grid item xs={2} sm={3} ms={5}>
            <TimePicker
              label="End Time"
              format="HH:MM"
              ampm={false}
              value={endtime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </Grid>
        </LocalizationProvider>

        <Grid item xs={2} sm={3} ms={5}>
          <Autocomplete
            id="contentselect"
            options={top100Films}
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
      </FormControl>
    </Grid>
  );
}
