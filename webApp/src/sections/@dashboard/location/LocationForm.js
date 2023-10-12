import dayjs from 'dayjs';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
// @mui
import { Grid, FormControl, TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Autocomplete from '@mui/material/Autocomplete';
// component
import Iconify from '../../../components/iconify';
import UpdateLocationContext from './UpdateLocationContext';

const api = axios.create({
  baseURL: 'https://device.dss.com:4001',
});

export default function LocationForm() {
  const [countrylist, setCountryList] = useState([]);
  const [citylist, setCityList] = useState([]);
  const [buildinglist, setBuildingList] = useState([]);
  const [arealist, setAreaList] = useState([]);
  const [devicelist, setDeviceList] = useState([]);
  const [contentlist, setContentList] = useState([]);

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

  const triggerUpdate = useContext(UpdateLocationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCountry = await api.get('/getCountryList');
        if (getCountry.data != null) {
          setCountryList(getCountry.data);
        }
        const getCity = await api.get('/getCityList');
        if (getCity.data != null) {
          setCityList(getCity.data);
        }
        const getBuilding = await api.get('/getBuildingList');
        if (getBuilding.data != null) {
          setBuildingList(getBuilding.data);
        }
        const getArea = await api.get('/getAreaList');
        if (getArea.data != null) {
          setAreaList(getArea.data);
        }
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
    console.log('called sync location form page');
    fetchData();
  }, [triggerUpdate]);

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
      Country: country,
      City: city,
      Building: building,
      Area: area,
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
        triggerUpdate();
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
            options={countrylist.map((option) => option.Name)}
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
            options={citylist.map((option) => option.Name)}
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
            options={buildinglist.map((option) => option.Name)}
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
            options={arealist.map((option) => option.Name)}
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
