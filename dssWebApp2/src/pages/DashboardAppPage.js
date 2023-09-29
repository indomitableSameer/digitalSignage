import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import GetDevices from '../apidata/devicelist';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const devicesData = GetDevices();
  const [online, setOnline] = useState(0);
  const [offline, setOffline] = useState(0);
  const [available, setAvailable] = useState(0);
  const [registered, setRegistered] = useState(0);

  useEffect(() => {
    // Use devicesData as needed
    if (devicesData != null) {
      console.log('DashboardAppPage: Devices Data:', devicesData);
      setOnline(devicesData.Online);
      setOffline(devicesData.Offline);
      setRegistered(devicesData.Registered);
      setAvailable(devicesData.Available);
    }
  }, [devicesData]);

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
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

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Online',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Offline',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Registered',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Status"
              chartData={[
                { label: 'Online', value: 4344 },
                { label: 'Registered', value: 5435 },
                { label: 'Available', value: 1443 },
                { label: 'Ofline', value: 4443 },
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
            <AppConversionRates
              title="Locations"
              subheader="Devices in locations"
              chartData={[
                { label: 'Italy', value: 0 },
                { label: 'Japan', value: 0 },
                { label: 'China', value: 0 },
                { label: 'Canada', value: 0 },
                { label: 'France', value: 0 },
                { label: 'Germany', value: 2 },
                { label: 'South Korea', value: 0 },
                { label: 'Netherlands', value: 0 },
                { label: 'United States', value: 0 },
                { label: 'United Kingdom', value: 0 },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
