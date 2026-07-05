import type { ReactNode } from 'react';
import { Bookmark, Map, Plus, Sparkles, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store/useAppStore';
import './TabBar.css';

/** Bottom navigation for the top-level destinations (Living Map, Conversation, Profile) plus the Aportar FAB. */
export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const openOverlay = useAppStore((s) => s.openOverlay);
  const tab = location.pathname === '/profile' ? 'profile' : location.pathname.startsWith('/conversation') ? 'convo' : 'map';

  const item = (id: 'map' | 'convo' | 'profile', icon: ReactNode, label: string, onClick: () => void) => (
    <button className={`cj-tab ${tab === id ? 'on' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="cj-tabbar">
      {item('map', <Map size={22} strokeWidth={tab === 'map' ? 2.3 : 1.8} />, 'Mapa', () => navigate('/'))}
      {item('convo', <Sparkles size={22} strokeWidth={tab === 'convo' ? 2.3 : 1.8} />, 'Explorar', () => navigate('/conversation'))}
      <button className="cj-tab-fab" onClick={() => openOverlay('capture')} aria-label="Aportar conocimiento">
        <Plus size={26} strokeWidth={2.2} />
      </button>
      {item('profile', <Bookmark size={22} strokeWidth={tab === 'profile' ? 2.3 : 1.8} />, 'Guardados', () => navigate('/profile'))}
      {item('profile', <User size={22} strokeWidth={tab === 'profile' ? 2.3 : 1.8} />, 'Perfil', () => navigate('/profile'))}
    </div>
  );
}
