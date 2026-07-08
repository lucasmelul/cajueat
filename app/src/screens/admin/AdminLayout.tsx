import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronLeft, Inbox, LayoutDashboard, LogOut, MapPin, PlusCircle, QrCode, Radar, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/core';
import { adminClient, AdminAuthError, clearOperatorToken, getOperatorToken, setOperatorToken } from '../../lib/admin/adminClient';
import type { CuratorRecord, NewPlaceSuggestion, PendingContribution } from '../../lib/admin/adminClient';
import type { MapEvent, Restaurant } from '../../types';
import { AdminDataContext } from './AdminDataContext';
import './AdminLayout.css';
import './Admin.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/catalogo', label: 'Catálogo', icon: MapPin, end: false },
  { to: '/admin/radar', label: 'Radar', icon: Radar, end: false },
  { to: '/admin/moderacion', label: 'Moderación', icon: Inbox, end: false },
  { to: '/admin/curadores', label: 'Curadores', icon: ShieldCheck, end: false },
  { to: '/admin/eventos', label: 'Eventos', icon: CalendarDays, end: false },
  { to: '/admin/agregar', label: 'Agregar contenido', icon: PlusCircle, end: false },
  { to: '/admin/checkins', label: 'Check-in', icon: QrCode, end: false },
];

/**
 * SPEC-018 Admin CMS: another client of the Brain — never a login for regular users, gated by an
 * operator shared secret. Was a single scrolling page with every feature stacked on top of each
 * other; now a real shell with a sidebar so it reads like its own app, not a debug panel.
 */
export function AdminLayout() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);

  const [catalog, setCatalog] = useState<Restaurant[]>([]);
  const [curators, setCurators] = useState<CuratorRecord[]>([]);
  const [pendingContributions, setPendingContributions] = useState<PendingContribution[]>([]);
  const [pendingNewPlaces, setPendingNewPlaces] = useState<NewPlaceSuggestion[]>([]);
  const [events, setEvents] = useState<MapEvent[]>([]);

  const loadAll = async () => {
    setGateLoading(true);
    try {
      const [data, curatorData, pending, newPlaces, evts] = await Promise.all([
        adminClient.getCatalog(),
        adminClient.getCurators(),
        adminClient.getPendingContributions(),
        adminClient.getPendingNewPlaces(),
        adminClient.getEvents(),
      ]);
      setCatalog(data);
      setCurators(curatorData);
      setPendingContributions(pending);
      setPendingNewPlaces(newPlaces);
      setEvents(evts);
      setAuthed(true);
      setGateError('');
    } catch (err) {
      clearOperatorToken();
      setAuthed(false);
      setGateError(err instanceof AdminAuthError ? 'Token incorrecto.' : 'No se pudo conectar con el Brain.');
    } finally {
      setGateLoading(false);
    }
  };

  useEffect(() => {
    if (getOperatorToken()) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = () => {
    if (!tokenInput.trim()) return;
    setOperatorToken(tokenInput.trim());
    loadAll();
  };

  const logout = () => {
    clearOperatorToken();
    setAuthed(false);
    setCatalog([]);
    setTokenInput('');
  };

  if (!authed) {
    return (
      <div className="cj-admin cj-admin--gate">
        <div className="cj-admin-gate">
          <h1>Admin CMS</h1>
          <p>Acceso de operador — separado de la identidad de usuario final (SPEC-013).</p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Token de operador"
            onKeyDown={(e) => e.key === 'Enter' && enter()}
          />
          <Button variant="primary" block onClick={enter} loading={gateLoading}>
            Entrar
          </Button>
          {gateError && <p className="cj-admin-gate__error">{gateError}</p>}
        </div>
      </div>
    );
  }

  return (
    <AdminDataContext.Provider
      value={{ catalog, curators, pendingContributions, pendingNewPlaces, events, loadAll, setPendingContributions, setPendingNewPlaces, setEvents }}
    >
      <div className="cj-admin-app">
        <nav className="cj-admin-nav">
          <div className="cj-admin-nav__head">
            <button className="cj-admin-iconback" onClick={() => navigate('/')} aria-label="Volver a la app">
              <ChevronLeft size={20} />
            </button>
            <span className="cj-admin-nav__title">Admin CMS</span>
          </div>
          <div className="cj-admin-nav__items">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `cj-admin-nav__item ${isActive ? 'is-active' : ''}`}>
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </div>
          <button className="cj-admin-nav__logout" onClick={logout}>
            <LogOut size={16} /> Salir
          </button>
        </nav>
        <main className="cj-admin-main">
          <Outlet />
        </main>
      </div>
    </AdminDataContext.Provider>
  );
}
