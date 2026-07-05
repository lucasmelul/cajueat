/* Screen 1 — Living Map (Home). Map-first: pins, one Brain card,
   context chips, always-present prompt bar. */

function LivingMap({ onOpenRestaurant, onOpenChat, onOpenCapture, saved, toggleSave }) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const { BrainCard, PromptBar, MapPin, Chip, RestaurantCard, IconButton, CajuPoints, Button, Wordmark } = NS;
  const D = window.CAJU_DATA;
  const [ctx, setCtx] = React.useState('open');
  const [sel, setSel] = React.useState(null);
  const [q, setQ] = React.useState('');

  const selRest = D.restaurants.find(r => r.id === sel);

  return (
    <div className="cj-screen">
      <window.MapCanvas>
        {/* pins */}
        {D.restaurants.map(r => (
          <span key={r.id} className="cj-pin-at" style={r.pos}>
            {r.type === 'recommended' && r.id !== sel && <span className="cj-pin-halo" />}
            <MapPin type={r.type} label={r.id === sel ? r.name : (r.type === 'recommended' ? r.name : null)}
                    selected={r.id === sel} onClick={() => setSel(r.id)} />
          </span>
        ))}
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

      {/* location + context chips */}
      <div className="cj-chips">
        <button className="cj-loc"><window.Icon name="map-pin" size={14} /> Palermo <window.Icon name="chevron-down" size={13} /></button>
        <span className="cj-chips__div" />
        <Chip selected={ctx==='near'} icon={<window.Icon name="map-pin" size={15} />} onClick={()=>setCtx('near')}>Cerca</Chip>
        <Chip selected={ctx==='open'} icon={<window.Icon name="clock" size={15} />} onClick={()=>setCtx('open')}>Abierto ahora</Chip>
        <Chip selected={ctx==='date'} icon={<window.Icon name="heart" size={15} />} onClick={()=>setCtx('date')}>Para una cita</Chip>
        <Chip selected={ctx==='work'} icon={<window.Icon name="laptop" size={15} />} onClick={()=>setCtx('work')}>Trabajar</Chip>
        <Chip selected={ctx==='saved'} brand icon={<window.Icon name="bookmark" size={15} />} onClick={()=>setCtx('saved')}>Guardados</Chip>
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
          <BrainCard eyebrow="CAJU · PARA VOS"
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
    </div>
  );
}

const CJ_MAP_SCREEN_CSS = `
.cj-pin-at { position: absolute; transform: translate(-50%, -50%); }
.cj-map-head { position: absolute; top: 50px; left: 0; right: 0; z-index: 20;
  display: flex; align-items: center; justify-content: space-between; padding: 0 14px; }
.cj-loc { display: inline-flex; align-items: center; gap: 4px; height: 36px; padding: 0 12px;
  background: rgba(255,255,255,.9); backdrop-filter: blur(8px); border: 0; border-radius: var(--r-full);
  box-shadow: var(--shadow-md); font-family: var(--font-sans); font-weight: 600; font-size: 13px;
  color: var(--ink-800); cursor: pointer; flex-shrink: 0; }
.cj-chips__div { width: 1px; height: 20px; background: var(--line-strong); align-self: center;
  flex-shrink: 0; margin: 0 2px; }
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
.cj-chips { position: absolute; top: 96px; left: 0; right: 0; z-index: 20;
  display: flex; gap: 8px; padding: 4px 14px; overflow-x: auto; scrollbar-width: none; }
.cj-chips::-webkit-scrollbar { display: none; }
.cj-map-fabs { position: absolute; right: 14px; bottom: 250px; z-index: 20;
  display: flex; flex-direction: column; gap: 10px; }
.cj-bottom { position: absolute; left: 0; right: 0; bottom: 0; z-index: 25;
  padding: 0 14px calc(var(--tabbar-h) + 12px); display: flex; flex-direction: column; gap: 12px; }
.cj-prompt-wrap { }
.cj-peek { position: relative; cursor: pointer; }
.cj-peek__go { position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  color: var(--ink-300); }
`;

Object.assign(window, { LivingMap, CJ_MAP_SCREEN_CSS });
