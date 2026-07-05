import { Outlet, useLocation } from 'react-router-dom';
import { TabBar } from './components/shell/TabBar';
import './App.css';

/** App shell: the 440px canvas, the routed screen, and the tab bar (hidden on screens with their own header/back nav). */
function App() {
  const location = useLocation();
  const showTabBar = location.pathname === '/';

  return (
    <div className="cj-canvas-wrap">
      <div className="cj-canvas">
        <div className="cj-canvas__main">
          <Outlet />
        </div>
        {showTabBar && <TabBar />}
      </div>
    </div>
  );
}

export default App;
