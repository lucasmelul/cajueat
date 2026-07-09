/* Screen 1 — Living Map (Home). Map-first: pins, one Brain card,
   a single Filtros button (opens a multi-select AND filter sheet),
   always-present prompt bar. */

const CJ_FILTER_GROUPS = [
  { label: 'Ocasión', items: [
    { key: 'date',  label: 'Para una cita', icon: 'heart',  test: r => r.tags.includes('En pareja') },
    { key: 'work',  label: 'Para trabajar', icon: 'laptop', test: r => r.tags.includes('Para trabajar') },
    { key: 'group', label: 'Grupos',        icon: 'users',  test: r => r.tags.includes('Grupos') },
  ]},
  { label: 'Reserva', items: [
    { key: 'noRes', label: 'Sin reserva',  icon: 'circle-slash', test: r => r.tags.includes('Sin reserva') },
    { key: 'res',   label: 'Con reserva',  icon: 'calendar-check', test: r => r.tags.includes('Reserva') },
  ]},
  { label: 'Precio', items: [
    { key: 'p1', label: '$',   test: r => r.price === '$' },
    { key: 'p2', label: '$$',  test: r => r.price === '$$' },
    { key: 'p3', label: '$$$', test: r => r.price === '$$$' },
  ]},
  { label: 'Tus lugares', items: [
    { key: 'savedOnly', label: 'Guardados', icon: 'bookmark', test: (r, saved) => !!saved[r.id] },
  ]},
];
const CJ_FILTER_MAP = CJ_FILTER_GROUPS.flatMap(g => g.items).reduce((m, f) => (m[f.key] = f, m), {});

function LivingMap({ onOpenRestaurant, onOpenChat, onOpenCapture, saved, toggleSave }) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const { BrainCard, PromptBar, MapPin, Chip, RestaurantCard, IconButton, CajuPoints, Button, Wordmark } = NS;
  const D = window.CAJU_DATA;
  const [sel, setSel] = React.useState(null);
  const [q, setQ] = React.useState('');
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [active, setActive] = React.useState([]);   // applied filters (AND)
  const [draft, setDraft] = React.useState([]);      // editing inside the sheet

  const selRest = D.restaurants.find(r => r.id === sel);

  const toggleDraft = (key) => setDraft(d => d.includes(key) ? d.filter(k => k !== key) : [...d, key]);
  const openFilters = () => { setDraft(active); setFilterOpen(true); };
  const applyFilters = () => { setActive(draft); setFilterOpen(false); };
  const clearFilters = () => setDraft([]);

  // AND across every active filter
  const matches = (r) => active.every(key => CJ_FILTER_MAP[key] && CJ_FILTER_MAP[key].test(r, saved));

  return (
    <div className="cj-screen">
      <window.MapCanvas>
        {/* pins */}
        {D.restaurants.map(r => {
          const dim = active.length > 0 && !matches(r);
          return (
            <span key={r.id} className={`cj-pin-at ${dim ? 'cj-pin-at--dim' : ''}`} style={r.pos}>
              {r.type === 'recommended' && r.id !== sel && !dim && <span className="cj-pin-halo" />}
              <MapPin type={r.type} label={r.id === sel ? r.name : (r.type === 'recommended' ? r.name : null)}
                      selected={r.id === sel} novelty={r.type === 'new'} onClick={() => setSel(r.id)} />
            </span>
          );
        })}
        {D.events.map(e => (
          <span key={e.id} className="cj-pin-at" style={e.pos}>
            <MapPin type="event" label={`${e.name.split(' ')[0]} · ${e.when}`} />
          </span>
        ))}
      </window.MapCanvas>

      {/* header: wordmark + points + avatar */}
      <div className="cj-map-head">
        <Wordmark size={19} />
        <div className="cj-map-head__right">
          <CajuPoints value={D.user.points} size="sm" chip />
          <button className="cj-avatar" aria-label="Perfil">{D.user.initials}</button>
        </div>
      </div>

      {/* location + single filter entry point */}
      <div className="cj-filterbar">
        <button className="cj-loc"><window.Icon name="map-pin" size={14} /> Palermo <window.Icon name="chevron-down" size={13} /></button>
        <button className={`cj-filterbtn ${active.length ? 'on' : ''}`} onClick={openFilters}>
          <window.Icon name="sliders-horizontal" size={15} />
          Filtros
          {active.length > 0 && <span className="cj-filterbtn__count">{active.length}</span>}
        </button>
      </div>

      {/* floating map controls */}
      <div className="cj-map-fabs">
        <IconButton icon={<window.Icon name="layers" size={20} />} label="Capas" variant="float" size="md" />
        <IconButton icon={<window.Icon name="locate-fixed" size={20} />} label="Mi ubicación" variant="float" size="md" />
      </div>

      {/* bottom stack: brain card OR peek + prompt bar */}
      <div className="cj-bottom">
        {selRest ? (
          <div className="cj-peek" onClick={() => onOpenRestaurant(selRest.id)}>
            <RestaurantCard compact name={selRest.name} cuisine={selRest.cuisine}
              neighborhood={selRest.neighborhood} price={selRest.price}
              tags={selRest.tags} trust={selRest.trust} />
            <div className="cj-peek__go"><window.Icon name="chevron-up" size={18} /></div>
          </div>
        ) : (
          <BrainCard eyebrow="LUGARCITO · PARA VOS"
            message={<>Cerca tuyo hay una <b>barra nikkei</b> que encaja con lo que te gustó anoche.</>}
            sub="Osaka · a 2 cuadras · reserva recomendada"
            actions={<>
              <Button size="sm" variant="primary" onClick={() => onOpenRestaurant('osaka')}>Ver lugar</Button>
              <Button size="sm" variant="ghost" onClick={() => onOpenChat('mostrame más opciones')}>Más opciones</Button>
            </>} />
        )}

        <div className="cj-prompt-wrap">
          <PromptBar value={q} onChange={setQ}
            onSend={(v) => { onOpenChat(v); setQ(''); }}
            onVoice={onOpenCapture} placeholder="Preguntá dónde comer…" />
        </div>
      </div>

      {/* Filters sheet — multi-select, AND logic */}
      {filterOpen && (
        <div className="cj-fov">
          <div className="cj-fov__scrim" onClick={() => setFilterOpen(false)} />
          <div className="cj-fov__sheet">
            <div className="cj-ov-grip" />
            <div className="cj-fov__head">
              <h2>Filtros</h2>
              <p>Combiná los que quieras — se aplican todos juntos.</p>
            </div>
            <div className="cj-fov__body">
              {CJ_FILTER_GROUPS.map(g => (
                <div className="cj-fov__group" key={g.label}>
                  <span className="cj-fov__glabel">{g.label}</span>
                  <div className="cj-fov__row">
                    {g.items.map(it => (
                      <Chip key={it.key} selected={draft.includes(it.key)}
                            icon={it.icon ? <window.Icon name={it.icon} size={15} /> : null}
                            onClick={() => toggleDraft(it.key)}>
                        {it.label}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="cj-fov__foot">
              <Button variant="ghost" size="lg" onClick={clearFilters} disabled={draft.length === 0}>Limpiar</Button>
              <Button variant="primary" size="lg" block onClick={applyFilters}>
                Ver lugares{draft.length > 0 ? ` (${draft.length})` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CJ_MAP_SCREEN_CSS = `
.cj-pin-at { position: absolute; transform: translate(-50%, -50%); transition: opacity var(--motion-card); }
.cj-pin-at--dim { opacity: .28; }
.cj-map-head { position: absolute; top: 50px; left: 0; right: 0; z-index: 20;
  display: flex; align-items: center; justify-content: space-between; padding: 0 14px; }
.cj-loc { display: inline-flex; align-items: center; gap: 4px; height: 36px; padding: 0 12px;
  background: rgba(255,255,255,.9); backdrop-filter: blur(8px); border: 0; border-radius: var(--r-full);
  box-shadow: var(--shadow-md); font-family: var(--font-sans); font-weight: 600; font-size: 13px;
  color: var(--ink-800); cursor: pointer; flex-shrink: 0; }
.cj-map-head__right { display: flex; align-items: center; gap: 8px; }
.cj-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--ink-800); color: #fff;
  display: grid; place-items: center; font-family: var(--font-mono); font-size: 13px; font-weight: 500;
  box-shadow: var(--shadow-md); border: 0; cursor: pointer; }
.cj-pin-halo { position: absolute; left: 17px; top: 50%; width: 16px; height: 16px;
  transform: translate(-50%, -50%); border-radius: 50%; background: var(--caju-500); z-index: -1;
  animation: cjPinPulse 2.6s var(--ease-out) infinite; }
@keyframes cjPinPulse {
  0% { transform: translate(-50%,-50%) scale(1); opacity: .5; }
  70% { opacity: 0; }
  100% { transform: translate(-50%,-50%) scale(3.6); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .cj-pin-halo { animation: none; opacity: 0; } }

.cj-filterbar { position: absolute; top: 96px; left: 0; right: 0; z-index: 20;
  display: flex; gap: 8px; padding: 0 14px; }
.cj-filterbtn { display: inline-flex; align-items: center; gap: 7px; height: 36px; padding: 0 14px 0 13px;
  background: rgba(255,255,255,.9); backdrop-filter: blur(8px); border: 0; border-radius: var(--r-full);
  box-shadow: var(--shadow-md); font-family: var(--font-sans); font-weight: 600; font-size: 13px;
  color: var(--ink-800); cursor: pointer; transition: background var(--motion-control), color var(--motion-control); }
.cj-filterbtn.on { background: var(--ink-900); color: #fff; }
.cj-filterbtn__count { display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 4px; border-radius: var(--r-full);
  background: var(--caju-500); color: #fff; font-family: var(--font-mono); font-size: 11px; }

.cj-map-fabs { position: absolute; right: 14px; bottom: 250px; z-index: 20;
  display: flex; flex-direction: column; gap: 10px; }
.cj-bottom { position: absolute; left: 0; right: 0; bottom: 0; z-index: 25;
  padding: 0 14px calc(var(--tabbar-h) + 12px); display: flex; flex-direction: column; gap: 12px; }
.cj-prompt-wrap { }
.cj-peek { position: relative; cursor: pointer; }
.cj-peek__go { position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  color: var(--ink-300); }

/* Filters sheet */
.cj-fov { position: absolute; inset: 0; z-index: 60; display: flex; align-items: flex-end; }
.cj-fov__scrim { position: absolute; inset: 0; background: var(--scrim); animation: cjFade var(--dur-base) var(--ease-out); }
.cj-fov__sheet { position: relative; width: 100%; max-height: 78%; display: flex; flex-direction: column;
  background: var(--surface); border-radius: var(--r-2xl) var(--r-2xl) 0 0; box-shadow: var(--elev-sheet);
  padding: 8px 20px calc(20px + var(--safe-bottom)); animation: cjSheetUp var(--dur-slow) var(--ease-spring); }
.cj-fov__head { padding: 6px 0 4px; }
.cj-fov__head h2 { font-size: 21px; font-weight: 600; color: var(--ink-900); }
.cj-fov__head p { font-size: 13px; color: var(--ink-500); margin-top: 4px; }
.cj-fov__body { flex: 1; overflow-y: auto; padding: 14px 0 4px; scrollbar-width: none; }
.cj-fov__body::-webkit-scrollbar { display: none; }
.cj-fov__group { margin-bottom: 18px; }
.cj-fov__glabel { display: block; font-family: var(--font-mono); font-size: 11px; letter-spacing: .06em;
  text-transform: uppercase; color: var(--ink-400); margin-bottom: 10px; }
.cj-fov__row { display: flex; flex-wrap: wrap; gap: 8px; }
.cj-fov__foot { display: flex; gap: 10px; padding-top: 10px; border-top: 1px solid var(--line-soft); }
`;

Object.assign(window, { LivingMap, CJ_MAP_SCREEN_CSS, CJ_FILTER_GROUPS });
