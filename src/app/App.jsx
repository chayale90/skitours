import '../fake-db';
import { Provider } from 'react-redux';
import { useRoutes, Navigate } from 'react-router-dom';
import { MatxTheme } from './components';
import { AuthProvider } from './contexts/JWTAuthContext';
import {AppProvider} from '../front/contexts/AppContext.js';
import { AdminAppProvider } from './contexts/AppContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Store } from './redux/Store';
import AuthGuard from 'app/auth/AuthGuard';
import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import MatxLayout from './components/MatxLayout/MatxLayout';
import UserLayout from 'front/Layouts/UserLayout';
import UserRoutes from 'front/UserRoutes';

const App = () => {

  const routes = [
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
    {
      element: (
        <AppProvider>
          <UserLayout/>
        </AppProvider>
      ),
      children: [...UserRoutes],
    },
    { path: '*', element: <NotFound /> },
  ];

  const content = useRoutes(routes);

  return (
    <Provider store={Store}>
      <SettingsProvider>
        <MatxTheme>
          <AuthProvider>{content}</AuthProvider>
        </MatxTheme>
      </SettingsProvider>
    </Provider>
  );
};


export default App;
