// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Locations',
    path: '/dashboard/locations',
    icon: icon('ic_location'),
  },
  {
    title: 'Devices',
    path: '/dashboard/devices',
    icon: icon('ic_location'),
  },
  {
    title: 'Content',
    path: '/dashboard/contents',
    icon: icon('ic_cart'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
