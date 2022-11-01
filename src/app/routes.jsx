import AuthGuard from 'app/auth/AuthGuard';
import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import Step1Screen from 'front/screens/Step1Screen';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';

const routes = [
  { path: '/', element: <Step1Screen/> },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [...dashboardRoutes, ...chartsRoute, ...materialRoutes],
  },
  ...sessionRoutes,
  { path: '/admin', element: <Navigate to="dashboard" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
