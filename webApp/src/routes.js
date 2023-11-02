import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LocationsPage from './pages/LocationsPage';
import DevicesPage from './pages/DevicesPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ContentsPage from './pages/ContentsPage';
import DashboardAppPage from './pages/DashboardAppPage';
// ----------------------------------------------------------------------

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  // const navigate = useNavigate();

  const handleLoginSuccessful = () => {
    setIsLoggedIn(true);
    // navigate('/dashboard/app', { replace: true });
  };

  const routes = useRoutes([
    {
      path: '/',
      element: isLoggedIn ? (
        <Navigate to="/dashboard/app" />
      ) : (
        <LoginPage OnLoginSuccessCallback={handleLoginSuccessful} />
      ),
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: 'login', element: <LoginPage OnLoginSuccessCallback={handleLoginSuccessful} /> },
      ],
    },
    {
      path: '/dashboard',
      element: isLoggedIn ? (
        <DashboardLayout />
      ) : (
        //   <Navigate to="/dashboard/app" replace />
        // </DashboardLayout>
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <Navigate to="/dashboard/app" /> },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'locations', element: <LocationsPage /> },
        { path: 'devices', element: <DevicesPage /> },
        { path: 'contents', element: <ContentsPage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
