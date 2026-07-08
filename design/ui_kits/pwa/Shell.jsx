/* App shell — phone frame, navigation state, tab bar, overlays.
   Re-runs lucide.createIcons() after every render so icons paint. */

function TabBar({ tab, onTab, onCapture }) {
  const item = (id, icon, label) => (
    <button className={`cj-tab ${tab === id ? 'on' : ''}`} onClick={() => onTab(id)}>
      <window.Icon name={icon} size={22} stroke={tab === id ? 2.3 : 1.8} />
      <span>{label}</span>
    </button>
  );
  return (
    <div className="cj-tabbar">
      {item('map', 'map', 'Mapa')}
      {item('convo', 'sparkles', 'Explorar')}
      <button className="cj-tab-fab" onClick={onCapture} aria-label="Aportar conocimiento">
        <window.Icon name="plus" size={26} stroke={2.2} />
      </button>
      {item('saved', 'bookmark', 'Guardados')}
      {item('profile', 'user', 'Perfil')}
    </div>
  );
}

function App() {
  const [tab, setTab] = React.useState('map');
  const [route, setRoute] = React.useState({ name: 'map' });
  const [overlay, setOverlay] = React.useState(null); // 'capture' | 'feedback'
  const [scan, setScan] = React.useState(null);        // { mode, restaurantId } | null
  const [query, setQuery] = React.useState('');
  const [saved, setSaved] = React.useState({ osaka: true, cuervo: true });

  const openCheckIn = (restaurantId, mode = 'checkin') => setScan({ mode, restaurantId });

  const toggleSave = (id) => setSaved(s => ({ ...s, [id]: !s[id] }));

  // keep lucide icons rendered after every React update
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  const goMap = () => { setTab('map'); setRoute({ name: 'map' }); };
  const openRestaurant = (id) => setRoute({ name: 'restaurant', id });
  const openChat = (q) => { setQuery(q || ''); setTab('convo'); setRoute({ name: 'convo' }); };

  const onTab = (t) => {
    setTab(t);
    if (t === 'map') setRoute({ name: 'map' });
    else if (t === 'convo') { setQuery(''); setRoute({ name: 'convo' }); }
    else if (t === 'saved' || t === 'profile') setRoute({ name: 'profile' });
  };

  let screen;
  if (route.name === 'map') screen = <window.LivingMap onOpenRestaurant={openRestaurant} onOpenChat={openChat} onOpenCapture={() => setOverlay('capture')} saved={saved} toggleSave={toggleSave} />;
  else if (route.name === 'convo') screen = <window.Conversation initialQuery={query} onBack={goMap} onOpenRestaurant={openRestaurant} />;
  else if (route.name === 'restaurant') screen = <window.Restaurant id={route.id} onBack={goMap} onOpenChat={openChat} onOpenRestaurant={openRestaurant} onCheckIn={(id) => openCheckIn(id, 'checkin')} onRedeem={(id) => openCheckIn(id, 'redeem')} saved={saved} toggleSave={toggleSave} />;
  else if (route.name === 'profile') screen = <window.Profile saved={saved} onOpenRestaurant={openRestaurant} onFeedback={() => setOverlay('feedback')} onCapture={() => setOverlay('capture')} onPassport={() => setRoute({ name: 'passport' })} />;
  else if (route.name === 'passport') screen = <window.Passport onBack={() => { setTab('profile'); setRoute({ name: 'profile' }); }} onOpenRestaurant={openRestaurant} onCheckIn={() => openCheckIn('osaka', 'checkin')} />;

  const darkStatus = route.name === 'restaurant';
  const hideTabs = route.name === 'convo' || route.name === 'restaurant' || route.name === 'passport';

  return (
    <div className="cj-desk">
      <div className="cj-phone">
        <div className="cj-notch" />
        <window.StatusBar dark={darkStatus} />
        <div className="cj-viewport">
          {screen}
          {!hideTabs && <TabBar tab={tab} onTab={onTab} onCapture={() => setOverlay('capture')} />}
          {overlay === 'capture' && <window.KnowledgeCapture onClose={() => setOverlay(null)} />}
          {overlay === 'feedback' && <window.Feedback onClose={() => { setOverlay(null); goMap(); }} />}
          {scan && <window.CheckIn mode={scan.mode} restaurantId={scan.restaurantId}
            onClose={() => setScan(null)} onDone={() => setScan(null)} />}
        </div>
        <div className="cj-homebar" />
      </div>
      <p class="cj-hint">Prototipo interactivo · tocá pines, chips, el mapa y la barra de conversación</p>
    </div>
  );
}

const CJ_SHELL_CSS = `
.cj-desk { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 18px; padding: 32px 16px; background:
  radial-gradient(120% 90% at 50% 0%, #F3EFE7, #E7E1D6); }
.cj-phone { position: relative; width: 390px; height: 844px; background: #000; border-radius: 52px;
  padding: 5px; box-shadow: 0 40px 90px -30px rgba(24,20,16,.5), 0 0 0 2px rgba(0,0,0,.85), inset 0 0 0 6px #1a1a1a; }
.cj-notch { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 120px; height: 30px;
  background: #000; border-radius: 18px; z-index: 50; }
.cj-viewport { position: relative; width: 100%; height: 100%; background: var(--paper);
  border-radius: 47px; overflow: hidden; }
.cj-homebar { position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%); width: 134px; height: 5px;
  border-radius: 3px; background: rgba(0,0,0,.28); z-index: 50; pointer-events: none; }
.cj-screen { position: absolute; inset: 0; }

.cj-tabbar { position: absolute; left: 0; right: 0; bottom: 0; height: var(--tabbar-h); z-index: 30;
  display: flex; align-items: center; justify-content: space-around; padding: 0 8px calc(var(--safe-bottom));
  background: rgba(252,251,248,.92); backdrop-filter: saturate(1.3) blur(16px); border-top: 1px solid var(--line-soft); }
.cj-tab { display: flex; flex-direction: column; align-items: center; gap: 3px; border: 0; background: transparent;
  color: var(--ink-400); cursor: pointer; font-family: var(--font-sans); font-size: 10px; font-weight: 500;
  width: 60px; padding: 6px 0; transition: color var(--motion-control); }
.cj-tab.on { color: var(--caju-600); }
.cj-tab-fab { width: 52px; height: 52px; border-radius: 18px; border: 0; cursor: pointer; margin-top: -14px;
  background: var(--caju-500); color: #fff; display: grid; place-items: center;
  box-shadow: 0 10px 22px -8px rgba(219,67,26,.8); transition: transform var(--motion-press); }
.cj-tab-fab:active { transform: scale(.94); }
.cj-hint { font-size: 12.5px; color: var(--ink-400); font-family: var(--font-sans); }
@media (max-width: 430px) { .cj-phone { transform: scale(.92); } }
`;

Object.assign(window, { App, TabBar, CJ_SHELL_CSS });
