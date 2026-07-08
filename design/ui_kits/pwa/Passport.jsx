/* Screen 8 — Mi Pasaporte de Cafés (SPEC-021). An album of real
   progress: cafés visited (via real check-ins, SPEC-020) with the
   first-visit date, and cafés por visitar grouped by barrio.
   Progress is measured against the REAL catalog size — never an
   invented goal. NO streaks, NO leaderboards, NO FOMO
   (respects gamification.md). Private to the user.  */

function Passport({ onBack, onOpenRestaurant, onCheckIn }) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const { Badge, CajuPoints, Button } = NS;
  const D = window.CAJU_DATA;
  const cafes = D.cafes;
  const visited = cafes.filter(c => c.visited);
  const pending = cafes.filter(c => !c.visited);

  // group "por visitar" by barrio
  const byBarrio = {};
  pending.forEach(c => { (byBarrio[c.neighborhood] = byBarrio[c.neighborhood] || []).push(c); });
  const barrios = Object.keys(byBarrio).sort((a, b) => byBarrio[b].length - byBarrio[a].length);

  const fmt = (d) => new Date(d + 'T12:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  const pct = Math.round((visited.length / cafes.length) * 100);

  return (
    <div className="cj-screen cj-pass">
      <div className="cj-pass__head">
        <button className="cj-iconback" onClick={onBack} aria-label="Volver">
          <window.Icon name="chevron-left" size={22} />
        </button>
        <div className="cj-pass__htitle">Mi Pasaporte</div>
        <span style={{ width: 40 }} />
      </div>

      <div className="cj-pass__scroll">
        {/* progress hero — real catalog, no goal invented */}
        <div className="cj-pass__hero">
          <div className="cj-pass__ring" style={{ '--p': pct }}>
            <div className="cj-pass__ringin">
              <b>{visited.length}</b>
              <span>de {cafes.length}</span>
            </div>
          </div>
          <div className="cj-pass__herotxt">
            <p className="cj-pass__lead">Vas conociendo la ciudad, café por café.</p>
            <p className="cj-pass__sub">{cafes.length - visited.length} lugares del catálogo te esperan. Sumás uno cada vez que hacés check-in real en un lugar nuevo.</p>
          </div>
        </div>

        {/* visited */}
        <section className="cj-pass__sec">
          <div className="cj-pass__sech">
            <Badge tone="over">Visitados</Badge>
            <span className="cj-pass__count">{visited.length}</span>
          </div>
          <div className="cj-stamps">
            {visited.map(c => (
              <button className="cj-stamp" key={c.id} onClick={() => onOpenRestaurant && onOpenRestaurant(c.id)}>
                <span className="cj-stamp__seal"><window.Icon name="check" size={18} /></span>
                <span className="cj-stamp__name">{c.name}</span>
                <span className="cj-stamp__meta">{c.neighborhood} · {fmt(c.visited)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* por visitar, por barrio */}
        <section className="cj-pass__sec">
          <div className="cj-pass__sech">
            <Badge tone="over">Por visitar</Badge>
            <span className="cj-pass__count">{pending.length}</span>
          </div>
          {barrios.map(b => (
            <div className="cj-barrio" key={b}>
              <div className="cj-barrio__h">
                <window.Icon name="map-pin" size={14} /> {b}
                <span className="cj-barrio__n">{byBarrio[b].length}</span>
              </div>
              <div className="cj-barrio__list">
                {byBarrio[b].map(c => (
                  <button className="cj-todo" key={c.id} onClick={() => onOpenRestaurant && onOpenRestaurant(c.id)}>
                    <span className="cj-todo__dot" />
                    <span className="cj-todo__name">{c.name}</span>
                    {c.isNew && <span className="cj-todo__new">Nuevo</span>}
                    <window.Icon name="chevron-right" size={16} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="cj-pass__cta">
          <Button variant="brandGhost" size="lg" block iconLeft={<window.Icon name="qr-code" size={18} />}
                  onClick={onCheckIn}>
            Hacer check-in en un lugar
          </Button>
          <p className="cj-pass__note">Sin rachas ni competencia. Tu pasaporte es tuyo y va a tu ritmo.</p>
        </div>
      </div>
    </div>
  );
}

const CJ_PASS_CSS = `
.cj-pass { display: flex; flex-direction: column; background: var(--paper); }
.cj-pass__head { position: relative; z-index: 10; flex-shrink: 0; padding: 44px 8px 0;
  height: 92px; display: flex; align-items: center; justify-content: space-between;
  background: rgba(252,251,248,.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line-soft); }
.cj-pass__htitle { font-family: var(--font-sans); font-weight: 600; font-size: 17px; color: var(--ink-900); }
.cj-pass__scroll { flex: 1; overflow-y: auto; padding: 18px 18px calc(var(--tabbar-h) + 20px); scrollbar-width: none; }
.cj-pass__scroll::-webkit-scrollbar { display: none; }

.cj-pass__hero { display: flex; gap: 16px; align-items: center; padding: 6px 2px 20px; }
.cj-pass__ring { --p: 25; width: 92px; height: 92px; border-radius: 50%; flex-shrink: 0;
  background: conic-gradient(var(--caju-500) calc(var(--p) * 1%), var(--paper-sunk) 0);
  display: grid; place-items: center; }
.cj-pass__ringin { width: 74px; height: 74px; border-radius: 50%; background: var(--surface);
  box-shadow: var(--shadow-sm); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cj-pass__ringin b { font-family: var(--font-mono); font-size: 26px; color: var(--ink-900); line-height: 1; }
.cj-pass__ringin span { font-size: 11px; color: var(--ink-400); margin-top: 2px; }
.cj-pass__lead { font-family: var(--font-serif); font-size: 21px; line-height: 1.22; color: var(--ink-900); letter-spacing: -0.01em; }
.cj-pass__sub { font-size: 13px; color: var(--ink-500); line-height: 1.5; margin-top: 6px; }

.cj-pass__sec { padding: 18px 0; border-top: 1px solid var(--line-soft); }
.cj-pass__sech { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.cj-pass__count { font-family: var(--font-mono); font-size: 12px; color: var(--ink-400); }

.cj-stamps { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cj-stamp { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; padding: 14px;
  border-radius: var(--r-lg); border: 1px solid var(--leaf-100); background: var(--leaf-050); cursor: pointer;
  text-align: left; transition: transform var(--motion-press); }
.cj-stamp:active { transform: scale(.98); }
.cj-stamp__seal { width: 30px; height: 30px; border-radius: 50%; background: var(--leaf-500); color: #fff;
  display: grid; place-items: center; margin-bottom: 6px; }
.cj-stamp__name { font-size: 15px; font-weight: 600; color: var(--ink-900); }
.cj-stamp__meta { font-size: 12px; color: var(--ink-500); }

.cj-barrio { margin-bottom: 14px; }
.cj-barrio__h { display: flex; align-items: center; gap: 6px; font-family: var(--font-sans);
  font-size: 13px; font-weight: 600; color: var(--ink-700); margin-bottom: 6px; }
.cj-barrio__h i { color: var(--ink-400); }
.cj-barrio__n { font-family: var(--font-mono); font-size: 11px; color: var(--ink-400); margin-left: 2px; }
.cj-barrio__list { display: flex; flex-direction: column; }
.cj-todo { display: flex; align-items: center; gap: 11px; padding: 11px 4px; cursor: pointer;
  border: 0; background: none; border-bottom: 1px solid var(--line-soft); text-align: left; width: 100%; }
.cj-todo:last-child { border-bottom: 0; }
.cj-todo__dot { width: 9px; height: 9px; border-radius: 50%; border: 2px dashed var(--line-strong); flex-shrink: 0; }
.cj-todo__name { flex: 1; font-size: 15px; color: var(--ink-800); font-family: var(--font-sans); }
.cj-todo__new { font-family: var(--font-sans); font-size: 11px; font-weight: 600; color: var(--amber-600);
  background: var(--amber-100); padding: 2px 8px; border-radius: var(--r-full); }
.cj-todo i { color: var(--ink-300); }

.cj-pass__cta { padding: 20px 0 8px; border-top: 1px solid var(--line-soft); }
.cj-pass__note { text-align: center; font-size: 12px; color: var(--ink-400); margin-top: 12px; line-height: 1.5; }
`;

Object.assign(window, { Passport, CJ_PASS_CSS });
