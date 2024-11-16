import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

// Role-based route access
  const role = localStorage.getItem('role'); // Retrieve role from localStorage
  const routes = [{
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  }];
  
  if(role === 'SALESMAN' || role === 'SUPER_ADMIN'){
routes.push(  {
  title: 'Branch',
  path: '/branch',
  icon:  icon('faCodeBranch'),
},{
  title: 'DSR-Invoice',
  path: '/dsr-invoice',
  icon:  icon('fareceipt'), 
},{
  title: 'User',
  path: '/user',
  icon: icon('ic-user'),
})
  }
  if(role === 'ADMIN'){
  routes.push(
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  }
  );
  }
  if(role === 'SUPER_ADMIN'){
    routes.push(
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  }
    );
  }

export const navData = routes;
