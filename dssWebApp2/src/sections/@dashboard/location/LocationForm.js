import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
// @mui
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// component
import Iconify from '../../../components/iconify';

export default function LocationForm() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState();
  const [building, setBuilding] = useState('');
  const [area, setArea] = useState('');
  const [mac, setMac] = useState('');
  const [startdate, setStartDate] = useState(null);
  const [enddate, setEndDate] = useState(null);
  const [starttime, setStartTime] = useState(null);
  const [endtime, setEndTime] = useState(null);

  return (
    <Grid spacing={2}>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <Grid item xs={5}>
          <InputLabel id="country">Country</InputLabel>
          <Select labelId="demo-select-small-label" id="demo-select-small" label="country" size="medium">
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Germany</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={2} sm={3} ms={5}>
          <TextField name="city" label="City" size="medium" onChange={(newValue) => setCity(newValue)} />
        </Grid>

        <Grid item xs={2} sm={3} ms={5}>
          <TextField name="building" label="Building" size="medium" />
        </Grid>

        <Grid item xs={2} sm={3} ms={5}>
          <TextField name="Area" label="Area" size="medium" />
        </Grid>

        <Grid item xs={2} sm={3} ms={5}>
          <TextField name="Mac" label="Device ID" size="medium" />
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid item xs={2} sm={3} ms={5}>
            <DatePicker
              label="Start Date"
              format="DD-MM-YYYY"
              value={startdate}
              disablePast
              onChange={(newValue) => setStartDate(newValue)}
            />
          </Grid>
          <Grid item xs={2} sm={3} ms={5}>
            <DatePicker
              label="End Date"
              format="DD-MM-YYYY"
              value={enddate}
              disablePast
              onChange={(newValue) => setEndDate(newValue)}
            />
          </Grid>
          <Grid item xs={2} sm={3} ms={5}>
            <TimePicker
              label="Start Time"
              format="HH:MM"
              ampm={false}
              value={starttime}
              onChange={(newValue) => setStartTime(newValue)}
            />
          </Grid>
          <Grid item xs={2} sm={3} ms={5}>
            <TimePicker
              label="End Time"
              format="HH:MM"
              ampm={false}
              value={endtime}
              onChange={(newValue) => setEndTime(newValue)}
            />
          </Grid>
        </LocalizationProvider>

        <Grid item xs={2} sm={3} ms={5}>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add
          </Button>
        </Grid>
      </FormControl>
    </Grid>
  );
}
