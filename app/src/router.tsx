import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { LivingMap } from './screens/living-map/LivingMap';
import { Conversation } from './screens/conversation/Conversation';
import { Restaurant } from './screens/restaurant/Restaurant';
import { Profile } from './screens/profile/Profile';
import { Onboarding } from './screens/onboarding/Onboarding';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <LivingMap /> },
      { path: '/conversation', element: <Conversation /> },
      { path: '/restaurant/:id', element: <Restaurant /> },
      { path: '/profile', element: <Profile /> },
      { path: '/onboarding', element: <Onboarding /> },
    ],
  },
]);
