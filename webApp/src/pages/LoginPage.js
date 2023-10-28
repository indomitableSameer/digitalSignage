import { Helmet } from 'react-helmet-async';
import { HttpStatusCode } from 'axios';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
// sections
import { LoginForm } from '../sections/auth/login';
import baseApi from '../api/baseApi';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage({ OnLoginSuccessCallback }) {
  const mdUp = useResponsive('up', 'md');

  const onSubmit = async () => {
    try {
      const response = await baseApi.post('/login');
      if (response.status === HttpStatusCode.Ok) {
        OnLoginSuccessCallback();
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

  return (
    <>
      <Helmet>
        <title> Login | DSS </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to FRA-DSS
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link variant="subtitle2">Request Account</Link>
            </Typography>
            <LoginForm OnLoginSuccessCallbackFunc={onSubmit} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
