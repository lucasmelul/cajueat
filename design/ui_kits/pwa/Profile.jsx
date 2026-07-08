/* Screen 6 — Profile / Memory. How the Brain understands you.
   Not a social profile: gastronomic DNA, points, saved, feedback. */

function Profile({ saved, onOpenRestaurant, onFeedback, onCapture, onPassport }) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const { CajuPoints, Badge, Chip, RestaurantCard, Button } = NS;
  const D = window.CAJU_DATA;
  const savedList = D.restaurants.filter(r => saved[r.id]);
  const [editing, setEditing] = React.useState(false);
  const [dna, setDna] = React.useState(['Sushi tradicional', 'Barras de chef', 'Pescado', 'Café de especialidad', 'Poco ruido', 'Palermo · Chacarita']);

  return (
    <div className="cj-screen cj-prof">
      <div className="cj-prof-scroll">
        <div className="cj-prof-head">
          <div className="cj-prof-av">{D.user.initials}</div>
          <h1>{D.user.name}</h1>
          <CajuPoints value={D.user.points} size="lg" unit="Caju Points" />
        </div>

        {/* Passport preview (SPEC-021) */}
        <button className="cj-prof-passport" onClick={onPassport}>
          <div className="cj-prof-passport__ring">
            <b>{D.cafes.filter(c=>c.visited).length}</b>
            <span>/{D.cafes.length}</span>
          </div>
          <div className="cj-prof-passport__t">
            <b>Mi Pasaporte de Cafés</b>
            <span>Vas conociendo la ciudad, café por café.</span>
          </div>
          <div className="cj-prof-passport__stamps">
            {D.cafes.filter(c=>c.visited).slice(0,3).map(c => (
              <span className="cj-prof-passport__seal" key={c.id}><window.Icon name="check" size={12} /></span>
            ))}
          </div>
        </button>

        {/* pending feedback nudge */}
        <div className="cj-prof-nudge" onClick={onFeedback}>
          <NS.BrainMark size={34} radius={11} />
          <div className="cj-prof-nudge__t">
            <b>¿Cómo estuvo Osaka?</b>
            <span>Contame en 20s y mejorás tus próximas recomendaciones.</span>
          </div>
          <window.Icon name="chevron-right" size={20} />
        </div>

        <section className="cj-prof-sec">
          <div className="cj-prof-sech">
            <Badge tone="over">Tu ADN gastronómico</Badge>
            <button className="cj-prof-edit" onClick={() => setEditing(e => !e)}>{editing ? 'Listo' : 'Editar'}</button>
          </div>
          <p className="cj-prof-lead">Así te entiende el Brain hoy. Editá lo que no cuadre.</p>
          <div className="cj-dna">
            {dna.map((d) => (
              <Chip key={d} as={editing ? 'button' : 'span'}
                icon={editing ? <window.Icon name="x" size={13} /> : null}
                onClick={editing ? () => setDna(list => list.filter(x => x !== d)) : undefined}>{d}</Chip>
            ))}
            {editing && <Chip as="button" brand selected icon={<window.Icon name="plus" size={13} />}>Agregar</Chip>}
          </div>
        </section>

        <section className="cj-prof-sec">
          <div className="cj-prof-sech">
            <Badge tone="over">Guardados</Badge>
            <span className="cj-prof-count">{savedList.length}</span>
          </div>
          <div className="cj-prof-saved">
            {savedList.length ? savedList.map(r => (
              <RestaurantCard key={r.id} compact name={r.name} cuisine={r.cuisine}
                neighborhood={r.neighborhood} price={r.price} tags={r.tags} trust={r.trust}
                onClick={() => onOpenRestaurant(r.id)} />
            )) : <p className="cj-empty">Todavía no guardaste lugares. Tocá el marcador en cualquier ficha.</p>}
          </div>
        </section>

        <section className="cj-prof-sec">
          <Badge tone="over">Tus aportes</Badge>
          <div className="cj-timeline">
            <div className="cj-tl"><span className="cj-tl__dot" /><div><b>Confirmaste horarios de Anafe</b><span>hace 2 días · +15</span></div></div>
            <div className="cj-tl"><span className="cj-tl__dot" /><div><b>Subiste una foto del omakase</b><span>hace 1 semana · +20</span></div></div>
            <div className="cj-tl"><span className="cj-tl__dot" /><div><b>Respondiste un quiz de ambiente</b><span>hace 2 semanas · +10</span></div></div>
          </div>
          <Button variant="brandGhost" size="md" block iconLeft={<window.Icon name="plus" size={18} />} onClick={onCapture}>
            Aportar conocimiento
          </Button>
        </section>
      </div>
    </div>
  );
}

const CJ_PROF_CSS = `
.cj-prof { background: var(--paper); }
.cj-prof-scroll { height: 100%; overflow-y: auto; padding: 56px 20px calc(var(--tabbar-h) + 20px); scrollbar-width: none; }
.cj-prof-scroll::-webkit-scrollbar { display: none; }
.cj-prof-head { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 12px 0 22px; }
.cj-prof-av { width: 76px; height: 76px; border-radius: 50%; background: var(--ink-800); color: #fff;
  display: grid; place-items: center; font-family: var(--font-mono); font-size: 28px; box-shadow: var(--shadow-md); }
.cj-prof-head h1 { font-size: 24px; font-weight: 600; }
.cj-prof-nudge { display: flex; align-items: center; gap: 12px; padding: 14px; margin-bottom: 8px; cursor: pointer;
  background: var(--caju-050); border: 1px solid var(--caju-100); border-radius: var(--r-lg); }
.cj-prof-nudge__t { flex: 1; display: flex; flex-direction: column; }
.cj-prof-nudge__t b { font-size: 15px; color: var(--ink-900); }
.cj-prof-nudge__t span { font-size: 13px; color: var(--ink-500); }
.cj-prof-nudge i { color: var(--caju-400); }
.cj-prof-passport { width: 100%; display: flex; align-items: center; gap: 13px; padding: 15px; margin-bottom: 8px;
  cursor: pointer; border: 0; text-align: left; border-radius: var(--r-lg);
  background: var(--ink-900); color: #fff; position: relative; overflow: hidden; }
.cj-prof-passport::before { content: ''; position: absolute; right: -24px; bottom: -30px; width: 110px; height: 110px;
  border-radius: 50%; background: radial-gradient(circle, rgba(248,122,69,.34), transparent 70%); }
.cj-prof-passport__ring { width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
  background: conic-gradient(var(--caju-500) 33%, rgba(255,255,255,.14) 0);
  display: grid; place-items: center; }
.cj-prof-passport__ring b { font-family: var(--font-mono); font-size: 15px; line-height: 1; }
.cj-prof-passport__ring span { display: none; }
.cj-prof-passport__t { flex: 1; display: flex; flex-direction: column; gap: 2px; z-index: 1; }
.cj-prof-passport__t b { font-size: 15px; font-weight: 600; }
.cj-prof-passport__t span { font-size: 12.5px; color: rgba(255,255,255,.65); }
.cj-prof-passport__stamps { display: flex; gap: -4px; z-index: 1; }
.cj-prof-passport__seal { width: 24px; height: 24px; border-radius: 50%; background: var(--leaf-500); color: #fff;
  display: grid; place-items: center; margin-left: -6px; border: 2px solid var(--ink-900); }
.cj-prof-sec { padding: 20px 0; border-top: 1px solid var(--line-soft); }
.cj-prof-lead { font-size: 13px; color: var(--ink-500); margin: 8px 0 12px; }
.cj-dna { display: flex; flex-wrap: wrap; gap: 8px; }
.cj-prof-sech { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
.cj-prof-edit { border: 0; background: transparent; color: var(--caju-600); font-family: var(--font-sans);
  font-size: 13px; font-weight: 600; cursor: pointer; padding: 4px 2px; }
.cj-prof-count { font-family: var(--font-mono); font-size: 12px; color: var(--ink-400); }
.cj-prof-saved { display: flex; flex-direction: column; gap: 10px; }
.cj-empty { font-size: 14px; color: var(--ink-400); line-height: 1.5; }
.cj-timeline { display: flex; flex-direction: column; gap: 4px; margin: 6px 0 16px; }
.cj-tl { display: flex; gap: 12px; padding: 8px 0; }
.cj-tl__dot { width: 9px; height: 9px; border-radius: 50%; background: var(--caju-400); margin-top: 5px; flex-shrink: 0;
  box-shadow: 0 0 0 4px var(--caju-050); }
.cj-tl div { display: flex; flex-direction: column; }
.cj-tl b { font-size: 14px; color: var(--ink-800); font-weight: 500; }
.cj-tl span { font-size: 12px; color: var(--ink-400); font-family: var(--font-mono); }
`;

Object.assign(window, { Profile, CJ_PROF_CSS });
