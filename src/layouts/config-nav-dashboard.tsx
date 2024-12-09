import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

// Role-based route access
const role = localStorage.getItem('role'); // Retrieve role from localStorage
const routes = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
];

if (role === 'SALESMAN') {
  routes.push({
    title: 'DSR-Invoice',
    path: '/dsr-invoice',
    icon: icon('ic-dsrinvoice'),
  });
}
if (role === 'ADMIN') {
  routes.push(
    {
      title: 'User',
      path: '/user',
      icon: icon('ic-user'),
    },
    {
      title: 'Branch',
      path: '/branch',
      icon: icon('faCodeBranch'),
    },
    {
      title: 'DSR-Invoice',
      path: '/dsr-invoice',
      icon: icon('ic-dsrinvoice'),
    },
    {
      title: 'Product',
      path: '/products',
      icon: icon('ic-cart'),
    }
  );
}
if (role === 'SUPER_ADMIN') {
  routes.push(
    {
      title: 'User',
      path: '/user',
      icon: icon('ic-user'),
    },
    {
      title: 'Branch',
      path: '/branch',
      icon: icon('faCodeBranch'),
    },
    {
      title: 'DSR-Invoice',
      path: '/dsr-invoice',
      icon: icon('ic-dsrinvoice'),
    },
    {
      title: 'Product',
      path: '/products',
      icon: icon('ic-cart'),
    }
  );
}

export const navData = routes;
