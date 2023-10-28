import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import baseApi from '../api/baseApi';
// components
// sections
import { StatusOvervidePieChart, StatusWidgetSummary, LocationsBarChart } from '../sections/@dashboard/app';
// ----------------------------------------------------------------------

function countOccurrences(jsonObj, key, value) {
  return Object.values(jsonObj).reduce((count, obj) => {
    if (key in obj && obj[key] === value) {
      count += 1;
    }
    return count;
  }, 0);
}

const generateCountriesOverview = (arr, key) => {
  const counts = {};

  arr.forEach((item) => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
  });

  const overview = Object.keys(counts).map((label) => ({ label, value: counts[label] }));
  console.log(overview);
  return overview;
};

function genWebData(jsonObj) {
  if (jsonObj != null) {
    const totalEntries = Object.keys(jsonObj).length;
    const registerd = countOccurrences(jsonObj, 'IsRegistered', true);
    const online = countOccurrences(jsonObj, 'IsOnline', true);
    const offline = registerd - online;
    const available = totalEntries - registerd;

    const dashboardData = {
      Online: online,
      Offline: offline,
      Registered: registerd,
      Available: available,
      Countries: generateCountriesOverview(jsonObj, 'Country'),
    };
    return dashboardData;
  }
  return null;
}

export default function DashboardAppPage() {
  const theme = useTheme();
  const [online, setOnline] = useState(0);
  const [offline, setOffline] = useState(0);
  const [available, setAvailable] = useState(0);
  const [registered, setRegistered] = useState(0);
  const [countriesOverview, setCountriesOverview] = useState([{}]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baseApi.get('/getDeviceInfoList');
        if (response.data != null) {
          const devicesData = genWebData(response.data);
          console.log('DashboardAppPage: Devices Data:', devicesData);
          setOnline(devicesData.Online);
          setOffline(devicesData.Offline);
          setRegistered(devicesData.Registered);
          setAvailable(devicesData.Available);
          setCountriesOverview(devicesData.Countries);
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

  return (
    <>
      <Helmet>
        <title> Dashboard | DSS </title>
      </Helmet>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatusWidgetSummary title="Online" total={online} icon={'zondicons:location'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatusWidgetSummary title="Registered" total={registered} color="info" icon={'zondicons:location'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatusWidgetSummary title="Available" total={available} color="warning" icon={'zondicons:location'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatusWidgetSummary title="Offline" total={offline} color="error" icon={'zondicons:location'} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <StatusOvervidePieChart
              title="Current Status"
              chartData={[
                { label: 'Online', value: online },
                { label: 'Registered', value: registered },
                { label: 'Available', value: available },
                { label: 'Offline', value: offline },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <LocationsBarChart title="Locations" subheader="Devices in locations" chartData={countriesOverview} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
