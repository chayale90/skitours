import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Analytics = Loadable(lazy(() => import('./Analytics')));
const Assets = Loadable(lazy(() => import('../storefront/Assets')));
const Settings = Loadable(lazy(() => import('../settings/Settings')));
const Lessons = Loadable(lazy(()=> import('../storefront/Lessons')));
const AddLesson = Loadable(lazy(()=>import('../storefront/AddLesson')));
const EditLesson = Loadable(lazy(()=>import('../storefront/EditLesson')));

const dashboardRoutes = [
  { path: '/admin/dashboard', element: <Analytics />, auth: authRoles.admin },
  { path: '/admin/storefront', element: <Assets />, auth: authRoles.admin },
  { path: '/admin/settings', element: <Settings/>, auth: authRoles.admin },
  { path: '/admin/lessons', element: <Lessons/>, auth: authRoles.admin },
  { path: '/admin/lessons/add', element: <AddLesson/>, auth: authRoles.admin },
  { path: '/admin/lessons/edit/:id', element: <EditLesson/>, auth: authRoles.admin },
];

export default dashboardRoutes;
