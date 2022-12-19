import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Analytics = Loadable(lazy(() => import('./Analytics')));
const Assets = Loadable(lazy(() => import('../storefront/Assets')));
const Settings = Loadable(lazy(() => import('../settings/Settings')));
const Lessons = Loadable(lazy(()=> import('../lessons/Lessons')));
const AddLesson = Loadable(lazy(()=>import('../lessons/AddLesson')));
const EditLesson = Loadable(lazy(()=>import('../lessons/EditLesson')));
const SkillLevels = Loadable(lazy(()=>import('../lessons/SkillLevels')));
const Availability = Loadable(lazy(()=>import('../lessons/Availability')));
const Transfers = Loadable(lazy(()=>import('../transfers/Transfers')));
const Translations = Loadable(lazy(()=>import('../translations/Translations')));

const dashboardRoutes = [
  { path: '/admin/dashboard', element: <Analytics />, auth: authRoles.admin },
  { path: '/admin/storefront', element: <Assets />, auth: authRoles.admin },
  { path: '/admin/settings', element: <Settings/>, auth: authRoles.admin },
  { path: '/admin/lessons', element: <Lessons/>, auth: authRoles.admin },
  { path: '/admin/lessons/add', element: <AddLesson/>, auth: authRoles.admin },
  { path: '/admin/lessons/edit/:id', element: <EditLesson/>, auth: authRoles.admin },
  { path: '/admin/lessons/skill-levels', element: <SkillLevels/>, auth: authRoles.admin },
  { path: '/admin/lessons/availability', element: <Availability/>, auth: authRoles.admin},
  { path: '/admin/transfers', element: <Transfers/>, auth: authRoles.admin },
  { path: '/admin/translations', element: <Translations/>, auth: authRoles.admin},
];

export default dashboardRoutes;
