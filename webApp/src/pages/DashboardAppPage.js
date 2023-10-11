import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import GetDashboardData from '../apidata/dashboardData';
// components
// sections
import { AppCurrentVisits, AppWidgetSummary, AppConversionRates } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const devicesData = GetDashboardData();
  const [online, setOnline] = useState(0);
  const [offline, setOffline] = useState(0);
  const [available, setAvailable] = useState(0);
  const [registered, setRegistered] = useState(0);
  const [countriesOverview, setCountriesOverview] = useState([{}]);

  useEffect(() => {
    // Use devicesData as needed
    if (devicesData != null) {
      console.log('DashboardAppPage: Devices Data:', devicesData);
      setOnline(devicesData.Online);
      setOffline(devicesData.Offline);
      setRegistered(devicesData.Registered);
      setAvailable(devicesData.Available);
      setCountriesOverview(devicesData.Countries);
    }
  }, [devicesData]);

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
            <AppWidgetSummary title="Online" total={online} icon={'zondicons:location'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Registered" total={registered} color="info" icon={'zondicons:location'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Available" total={available} color="warning" icon={'zondicons:location'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Offline" total={offline} color="error" icon={'zondicons:location'} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
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
            <AppConversionRates title="Locations" subheader="Devices in locations" chartData={countriesOverview} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
