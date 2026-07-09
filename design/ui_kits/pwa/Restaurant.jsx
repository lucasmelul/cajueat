/* Screen 3 — Restaurant Experience (ficha). Editorial, not a
   directory. Answers "¿vale la pena ir?" before the first scroll. */

function Restaurant({ id, onBack, onOpenChat, onOpenRestaurant, onCheckIn, onRedeem, saved, toggleSave }) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const { TrustMeter, SourceChip, Badge, Button, IconButton, Chip, RestaurantCard } = NS;
  const D = window.CAJU_DATA;
  const r = D.restaurants.find(x => x.id === id) || D.restaurants[0];
  const isSaved = !!saved[r.id];

  return (
    <div className="cj-screen cj-rest-scr">
      <div className="cj-rest-scroll">
        {/* HERO */}
        <div className="cj-hero">
          <div className="cj-hero__img">
            <div className="cj-hero__ph"><window.Icon name="utensils-crossed" size={40} /></div>
          </div>
          <div className="cj-hero__grad" />
          <div className="cj-hero__top">
            <button className="cj-round" onClick={onBack} aria-label="Volver"><window.Icon name="chevron-left" size={22} /></button>
            <div className="cj-hero__top-r">
              <button className="cj-round" aria-label="Compartir"><window.Icon name="share" size={18} /></button>
              <button className={`cj-round ${isSaved ? 'on' : ''}`} onClick={() => toggleSave(r.id)} aria-label="Guardar">
                <window.Icon name="bookmark" size={18} />
              </button>
            </div>
          </div>
          <div className="cj-hero__info">
            <div className="cj-hero__meta"><Badge tone="brand">Recomendado</Badge><span>{r.cuisine} · {r.neighborhood}</span></div>
            <h1 className="cj-hero__name">{r.name}</h1>
            <div className="cj-hero__row">
              <TrustMeter level={r.trust} pill />
              <span className="cj-hero__price">{r.price}</span>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="cj-rest-body">
          {/* Brain summary */}
          <section className="cj-sec">
            <div className="cj-brainlead">
              <NS.BrainMark size={28} radius={9} />
              <p className="cj-brainlead__txt">{r.summary}</p>
            </div>
          </section>

          {/* Quick facts */}
          <section className="cj-sec">
            <div className="cj-facts">
              {r.quickFacts.map((f, i) => (
                <div className="cj-fact" key={i}><window.Icon name={f.icon} size={17} /> {f.label}</div>
              ))}
            </div>
          </section>

          {/* Personality */}
          <section className="cj-sec">
            <Badge tone="over">Así es este lugar</Badge>
            <div className="cj-personality">
              {r.personality.map((p, i) => <Chip key={i} as="span">{p}</Chip>)}
            </div>
          </section>

          {/* Qué pedir */}
          <section className="cj-sec">
            <Badge tone="over">Qué pedir</Badge>
            <div className="cj-order">
              {r.order.map((o, i) => (
                <div className="cj-order__row" key={i}>
                  <span className="cj-order__when">{o.when}</span>
                  <span className="cj-order__dish">{o.dish}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Brain tips */}
          <section className="cj-sec">
            <Badge tone="over">Brain Tips</Badge>
            <div className="cj-tips">
              {r.tips.map((t, i) => (
                <div className="cj-tip" key={i}><window.Icon name="check" size={15} /> {t}</div>
              ))}
            </div>
          </section>

          {/* Why / sources */}
          <section className="cj-sec">
            <Badge tone="over">¿Por qué te lo recomendé?</Badge>
            <p className="cj-why">Coincide con tu gusto por el pescado bien tratado, y lo respaldan fuentes en las que confiás:</p>
            <div className="cj-sources">
              {r.sources.map((s, i) => <SourceChip key={i} name={s.name} kind={s.kind} weight={s.weight} />)}
            </div>
          </section>

          {/* Ideal / no ideal */}
          <section className="cj-sec cj-idealgrid">
            <div className="cj-ideal">
              <div className="cj-ideal__h cj-ideal__h--yes"><window.Icon name="thumbs-up" size={15} /> Ideal para</div>
              {r.idealFor.map((x, i) => <div className="cj-ideal__row" key={i}>{x}</div>)}
            </div>
            <div className="cj-ideal">
              <div className="cj-ideal__h cj-ideal__h--no"><window.Icon name="circle-minus" size={15} /> No ideal para</div>
              {r.notFor.map((x, i) => <div className="cj-ideal__row" key={i}>{x}</div>)}
            </div>
          </section>

          {/* Nearby */}
          <section className="cj-sec">
            <Badge tone="over">Cerca de acá</Badge>
            <p className="cj-why">Si venís hasta acá, a pocas cuadras tenés:</p>
            <div className="cj-nearby">
              {D.restaurants.filter(x => x.id !== r.id).slice(0, 2).map(n => (
                <RestaurantCard key={n.id} compact name={n.name} cuisine={n.cuisine}
                  neighborhood={n.neighborhood} price={n.price} tags={n.tags} trust={n.trust}
                  onClick={() => onOpenRestaurant && onOpenRestaurant(n.id)} />
              ))}
            </div>
          </section>

          {/* Instagram — SPEC-024 */}
          <section className="cj-sec">
            <div className="cj-ig__h">
              <Badge tone="over">En Instagram</Badge>
              <a className="cj-ig__handle" href="#" onClick={(e)=>e.preventDefault()}>@{r.id}.bsas <window.Icon name="external-link" size={13} /></a>
            </div>
            <div className="cj-ig__strip">
              {[0,1,2,3].map(i => (
                <div className={`cj-ig__cell cj-ig__cell--${i%4}`} key={i}>
                  <window.Icon name={['image','utensils','coffee','image'][i]} size={20} />
                  {i === 0 && <span className="cj-ig__reel"><window.Icon name="play" size={11} /></span>}
                </div>
              ))}
            </div>
            <p className="cj-ig__note">El Brain leyó sus últimos posteos para mantener el menú y las novedades al día.</p>
          </section>

          {/* Check-in — SPEC-020 entry */}
          <section className="cj-sec">
            <button className="cj-checkin" onClick={() => onCheckIn && onCheckIn(r.id)}>
              <span className="cj-checkin__ic"><window.Icon name="qr-code" size={22} /></span>
              <span className="cj-checkin__tx">
                <b>Hacé check-in acá</b>
                <span>Escaneá el QR del mostrador para sumar la visita y poder dejar tu reseña.</span>
              </span>
              <window.Icon name="chevron-right" size={18} />
            </button>
          </section>

          {/* Ask */}
          <section className="cj-sec">
            <button className="cj-ask" onClick={() => onOpenChat(`¿Vale la pena ${r.name} para una cita?`)}>
              <NS.BrainMark size={26} radius={8} />
              <span>Preguntale a Lugarcito sobre este lugar</span>
              <window.Icon name="arrow-right" size={18} />
            </button>
          </section>
        </div>
      </div>

      {/* Sticky primary CTA */}
      <div className="cj-rest-cta">
        <Button variant="secondary" size="lg" iconLeft={<window.Icon name="wallet" size={18} />} aria-label="Usar puntos" onClick={() => onRedeem && onRedeem(r.id)} />
        <Button variant="primary" size="lg" block iconLeft={<window.Icon name="navigation" size={18} />}>Cómo llegar</Button>
      </div>
    </div>
  );
}

const CJ_REST_CSS = `
.cj-rest-scr { display: flex; flex-direction: column; background: var(--paper); }
.cj-rest-scroll { flex: 1; overflow-y: auto; scrollbar-width: none; }
.cj-rest-scroll::-webkit-scrollbar { display: none; }
.cj-hero { position: relative; height: 380px; }
.cj-hero__img { position: absolute; inset: 0; background:
  radial-gradient(120% 100% at 20% 0%, var(--caju-200), transparent 55%),
  radial-gradient(120% 120% at 100% 100%, var(--amber-100), var(--caju-100)); }
.cj-hero__ph { position: absolute; inset: 0; display: grid; place-items: center; color: var(--caju-300); }
.cj-hero__grad { position: absolute; inset: 0; background:
  linear-gradient(to top, rgba(24,20,16,.72) 0%, rgba(24,20,16,.1) 42%, rgba(24,20,16,.15) 100%); }
.cj-hero__top { position: absolute; top: 50px; left: 12px; right: 12px; display: flex; justify-content: space-between; }
.cj-hero__top-r { display: flex; gap: 8px; }
.cj-round { width: 40px; height: 40px; border-radius: 50%; border: 0; cursor: pointer;
  background: rgba(255,255,255,.9); backdrop-filter: blur(8px); color: var(--ink-800);
  display: grid; place-items: center; box-shadow: var(--shadow-sm); }
.cj-round.on { background: var(--caju-500); color: #fff; }
.cj-hero__info { position: absolute; left: 20px; right: 20px; bottom: 20px; color: #fff; }
.cj-hero__meta { display: flex; align-items: center; gap: 10px; font-size: 13px; font-family: var(--font-sans);
  color: rgba(255,255,255,.92); margin-bottom: 8px; }
.cj-hero__name { font-family: var(--font-serif); font-size: 46px; line-height: 1; color: #fff;
  letter-spacing: -0.01em; font-weight: 400; }
.cj-hero__row { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.cj-hero__price { font-family: var(--font-mono); font-size: 13px; color: rgba(255,255,255,.9); }

.cj-rest-body { position: relative; margin-top: -18px; background: var(--paper);
  border-radius: 22px 22px 0 0; padding: 8px 20px 24px; }
.cj-sec { padding: 16px 0; border-bottom: 1px solid var(--line-soft); }
.cj-sec:last-child { border-bottom: 0; }
.cj-brainlead { display: flex; gap: 12px; align-items: flex-start; }
.cj-brainlead__txt { font-family: var(--font-serif); font-size: 21px; line-height: 1.32; color: var(--ink-900);
  letter-spacing: -0.005em; }
.cj-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
.cj-fact { display: flex; align-items: center; gap: 9px; font-size: 14px; color: var(--ink-700); font-family: var(--font-sans); }
.cj-fact i { color: var(--caju-500); flex-shrink: 0; }
.cj-order { margin-top: 12px; display: flex; flex-direction: column; gap: 12px; }
.cj-order__row { display: flex; flex-direction: column; gap: 2px; }
.cj-order__when { font-family: var(--font-mono); font-size: 11px; letter-spacing: .03em; text-transform: uppercase; color: var(--caju-600); }
.cj-order__dish { font-size: 15px; color: var(--ink-800); font-family: var(--font-sans); }
.cj-tips { margin-top: 12px; display: flex; flex-direction: column; gap: 9px; }
.cj-tip { display: flex; align-items: center; gap: 9px; font-size: 14px; color: var(--ink-700); }
.cj-tip i { color: var(--leaf-600); flex-shrink: 0; }
.cj-personality { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.cj-nearby { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.cj-why { margin-top: 10px; margin-bottom: 12px; font-size: 14px; color: var(--ink-600); line-height: 1.5; }
.cj-sources { display: flex; flex-wrap: wrap; gap: 8px; }
.cj-idealgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.cj-ideal__h { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; margin-bottom: 10px; }
.cj-ideal__h--yes { color: var(--leaf-700); }
.cj-ideal__h--no { color: var(--ink-400); }
.cj-ideal__row { font-size: 14px; color: var(--ink-700); padding: 5px 0; border-top: 1px solid var(--line-soft); }
.cj-ask { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer;
  background: var(--caju-050); border: 1px solid var(--caju-100); border-radius: var(--r-lg);
  font-family: var(--font-sans); font-size: 15px; font-weight: 500; color: var(--caju-700); }
.cj-ask span { flex: 1; text-align: left; }
.cj-ig__h { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.cj-ig__handle { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600;
  color: var(--caju-600); font-family: var(--font-sans); }
.cj-ig__strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.cj-ig__cell { position: relative; aspect-ratio: 1; border-radius: var(--r-sm); display: grid; place-items: center;
  color: rgba(255,255,255,.85); }
.cj-ig__cell--0 { background: linear-gradient(140deg, var(--caju-300), var(--caju-500)); }
.cj-ig__cell--1 { background: linear-gradient(140deg, var(--amber-500), var(--caju-400)); }
.cj-ig__cell--2 { background: linear-gradient(140deg, #B98A5E, #8A6248); }
.cj-ig__cell--3 { background: linear-gradient(140deg, var(--caju-400), var(--amber-500)); }
.cj-ig__reel { position: absolute; top: 5px; right: 5px; width: 18px; height: 18px; border-radius: 50%;
  background: rgba(0,0,0,.35); display: grid; place-items: center; }
.cj-ig__note { font-size: 12px; color: var(--ink-400); line-height: 1.5; margin-top: 10px; }
.cj-checkin { width: 100%; display: flex; align-items: center; gap: 13px; padding: 15px 16px; cursor: pointer;
  background: var(--surface); border: 1px solid var(--line-strong); border-radius: var(--r-lg); text-align: left; }
.cj-checkin:active { transform: scale(.99); }
.cj-checkin__ic { width: 44px; height: 44px; border-radius: 13px; background: var(--ink-900); color: #fff;
  display: grid; place-items: center; flex-shrink: 0; }
.cj-checkin__tx { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.cj-checkin__tx b { font-size: 15px; color: var(--ink-900); font-weight: 600; }
.cj-checkin__tx span { font-size: 12.5px; color: var(--ink-500); line-height: 1.4; }
.cj-checkin i { color: var(--ink-300); }
.cj-rest-cta { flex-shrink: 0; display: flex; gap: 10px; padding: 12px 16px calc(12px + var(--safe-bottom));
  background: rgba(252,251,248,.94); backdrop-filter: blur(12px); border-top: 1px solid var(--line-soft); }
`;

Object.assign(window, { Restaurant, CJ_REST_CSS });
