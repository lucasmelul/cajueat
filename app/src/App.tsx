import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from './components/shell/TabBar';
import { KnowledgeCapture } from './overlays/KnowledgeCapture';
import { Feedback } from './overlays/Feedback';
import { SearchOverlay } from './overlays/SearchOverlay';
import { brain } from './lib/brain';
import { useAppStore } from './lib/store/useAppStore';
import './App.css';

const TOP_LEVEL_ROUTES = ['/', '/profile'];

/** App shell: the 440px canvas, the routed screen, the tab bar (top-level destinations only — Conversation/Restaurant have their own header/back nav), and the Knowledge Capture / Feedback / Search overlays. */
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');
  const showTabBar = TOP_LEVEL_ROUTES.includes(location.pathname);
  const { overlay, overlayRestaurantId, closeOverlay, user, setUser } = useAppStore();

  // First-run gate (PRD-010 Onboarding): route to /onboarding until the Brain says it's done,
  // and don't let an already-onboarded user land back on it (e.g. via a stale/direct URL).
  // /admin (and every nested page under it) is exempt — an operator (SPEC-018) is never an end
  // user going through this quiz.
  const gate = (u: { onboarded: boolean }) => {
    if (isAdmin) return;
    if (!u.onboarded && location.pathname !== '/onboarding') navigate('/onboarding');
    else if (u.onboarded && location.pathname === '/onboarding') navigate('/');
  };
  useEffect(() => {
    if (isAdmin) return;
    if (user) {
      gate(user);
      return;
    }
    brain.getUser().then((u) => {
      setUser(u);
      gate(u);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location.pathname]);

  return (
    <div className="cj-canvas-wrap">
      <div className={`cj-canvas ${isAdmin ? 'cj-canvas--wide' : ''}`}>
        <div className="cj-canvas__main">
          <Outlet />
        </div>
        {showTabBar && <TabBar />}
        {overlay === 'capture' && <KnowledgeCapture onClose={closeOverlay} />}
        {/* Feedback's CTA reads "Volver al mapa" — it always returns Home, not just wherever it was opened from.
            Requires a real restaurantId — never falls back to a fake one if somehow opened without it. */}
        {overlay === 'feedback' && overlayRestaurantId && (
          <Feedback
            restaurantId={overlayRestaurantId}
            onClose={() => {
              closeOverlay();
              navigate('/');
            }}
          />
        )}
        {overlay === 'search' && (
          <SearchOverlay
            onClose={closeOverlay}
            onSelectRestaurant={(id) => navigate(`/restaurant/${id}`)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
