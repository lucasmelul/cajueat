import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TabBar } from './components/shell/TabBar';
import { KnowledgeCapture } from './overlays/KnowledgeCapture';
import { Feedback } from './overlays/Feedback';
import { useAppStore } from './lib/store/useAppStore';
import './App.css';

const TOP_LEVEL_ROUTES = ['/', '/profile'];

/** App shell: the 440px canvas, the routed screen, the tab bar (top-level destinations only — Conversation/Restaurant have their own header/back nav), and the Knowledge Capture / Feedback overlays. */
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const showTabBar = TOP_LEVEL_ROUTES.includes(location.pathname);
  const { overlay, closeOverlay } = useAppStore();

  return (
    <div className="cj-canvas-wrap">
      <div className="cj-canvas">
        <div className="cj-canvas__main">
          <Outlet />
        </div>
        {showTabBar && <TabBar />}
        {overlay === 'capture' && <KnowledgeCapture onClose={closeOverlay} />}
        {/* Feedback's CTA reads "Volver al mapa" — it always returns Home, not just wherever it was opened from. */}
        {overlay === 'feedback' && (
          <Feedback
            onClose={() => {
              closeOverlay();
              navigate('/');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
