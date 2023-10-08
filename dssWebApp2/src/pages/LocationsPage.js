import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Stack, Container, Typography } from '@mui/material';
// components
// sections
import { LocationForm, LocationList } from '../sections/@dashboard/location';
// mock
import { LocationUpdateProvider } from '../sections/@dashboard/location/UpdateLocationContext';

// ----------------------------------------------------------------------

export default function LocationsPage() {
  return (
    <>
      <Helmet>
        <title> Locations | DSS </title>
      </Helmet>

      <Container>
        <LocationUpdateProvider>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Locations
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Card sx={{ width: 'auto' }}>
              <LocationForm />
            </Card>
            <LocationList />
          </Stack>
        </LocationUpdateProvider>
      </Container>

      {/* <Popover
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
      </Popover> */}
    </>
  );
}
