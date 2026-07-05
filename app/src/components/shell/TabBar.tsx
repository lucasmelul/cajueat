import { Map, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TabBar.css';

/**
 * Bottom navigation. Only wires the two destinations that exist in this
 * pass (Living Map, Conversation). Guardados / Perfil / Aportar (the FAB)
 * come back once Profile (SPEC-010) and Knowledge Capture (SPEC-004) are
 * implemented — omitted rather than left as dead-end taps.
 */
export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const tab = location.pathname.startsWith('/conversation') ? 'convo' : 'map';

  return (
    <div className="cj-tabbar">
      <button className={`cj-tab ${tab === 'map' ? 'on' : ''}`} onClick={() => navigate('/')}>
        <Map size={22} strokeWidth={tab === 'map' ? 2.3 : 1.8} />
        <span>Mapa</span>
      </button>
      <button className={`cj-tab ${tab === 'convo' ? 'on' : ''}`} onClick={() => navigate('/conversation')}>
        <Sparkles size={22} strokeWidth={tab === 'convo' ? 2.3 : 1.8} />
        <span>Explorar</span>
      </button>
    </div>
  );
}
