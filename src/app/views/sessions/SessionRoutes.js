import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotFound = Loadable(lazy(() => import('./NotFound')));
const ForgotPassword = Loadable(lazy(() => import('./ForgotPassword')));
const JwtLogin = Loadable(lazy(() => import('./JwtLogin')));
const JwtRegister = Loadable(lazy(() => import('./JwtRegister')));
const ResetPassword = Loadable(lazy(()=>import('./ResetPassword')));

const sessionRoutes = [
  { path: '/admin/session/signup', element: <JwtRegister /> },
  { path: '/admin/session/signin', element: <JwtLogin /> },
  { path: '/admin/session/forgot-password', element: <ForgotPassword /> },
  { path: '/admin/session/reset-password/:token', element: <ResetPassword/> },
  { path: '/admin/session/404', element: <NotFound /> },
];

export default sessionRoutes;
