import { Label } from 'src/components/label';
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
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  }];
  
  if(role === 'SALESMAN'){
routes.push(  {
  title: 'Branch',
  path: '/branch',
  icon:  icon('faCodeBranch'),
},)
  }
  if(role === 'ADMIN'){
  routes.push();
  }
  if(role === 'SUPER_ADMIN'){
    routes.push();
  }

export const navData = routes;
