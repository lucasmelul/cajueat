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
import { Checkins } from './screens/admin/pages/Checkins';
import { Promotions } from './screens/admin/pages/Promotions';
import { Share } from './screens/share/Share';
import { CheckIn } from './screens/checkin/CheckIn';
import { Passport } from './screens/passport/Passport';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <LivingMap /> },
      { path: '/conversation', element: <Conversation /> },
      { path: '/restaurant/:id', element: <Restaurant /> },
      { path: '/profile', element: <Profile /> },
      { path: '/passport', element: <Passport /> },
      { path: '/checkin/:restaurantId?', element: <CheckIn /> },
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
          { path: 'checkins', element: <Checkins /> },
          { path: 'promociones', element: <Promotions /> },
        ],
      },
      { path: '/share', element: <Share /> },
    ],
  },
]);
