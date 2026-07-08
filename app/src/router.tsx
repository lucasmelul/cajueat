import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { LivingMap } from './screens/living-map/LivingMap';
import { Conversation } from './screens/conversation/Conversation';
import { Restaurant } from './screens/restaurant/Restaurant';
import { Profile } from './screens/profile/Profile';
import { Onboarding } from './screens/onboarding/Onboarding';
import { AdminLayout } from './screens/admin/AdminLayout';
import { Dashboard } from './screens/admin/pages/Dashboard';
import { Catalog } from './screens/admin/pages/Catalog';
import { StaleRadar } from './screens/admin/pages/StaleRadar';
import { Moderation } from './screens/admin/pages/Moderation';
import { Curators } from './screens/admin/pages/Curators';
import { Events } from './screens/admin/pages/Events';
import { AddContent } from './screens/admin/pages/AddContent';
import { Share } from './screens/share/Share';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <LivingMap /> },
      { path: '/conversation', element: <Conversation /> },
      { path: '/restaurant/:id', element: <Restaurant /> },
      { path: '/profile', element: <Profile /> },
      { path: '/onboarding', element: <Onboarding /> },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'catalogo', element: <Catalog /> },
          { path: 'radar', element: <StaleRadar /> },
          { path: 'moderacion', element: <Moderation /> },
          { path: 'curadores', element: <Curators /> },
          { path: 'eventos', element: <Events /> },
          { path: 'agregar', element: <AddContent /> },
        ],
      },
      { path: '/share', element: <Share /> },
    ],
  },
]);
