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
    icon: icon('ic_device'),
  },
  {
    title: 'Content',
    path: '/dashboard/contents',
    icon: icon('ic_content'),
  },
];

export default navConfig;
