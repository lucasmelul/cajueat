/* Screen 2 — Conversation. Chat as a way to navigate the product,
   not a support bot. Brain replies with text + rich cards. */

function Conversation({ initialQuery, onBack, onOpenRestaurant }) {
  const NS = window.CajuEatDesignSystem_dbeea0;
  const { ChatBubble, PromptBar, RestaurantCard, Chip } = NS;
  const D = window.CAJU_DATA;
  const [q, setQ] = React.useState('');
  const [turns, setTurns] = React.useState([]);
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);

  const respond = (userText) => {
    setTurns(t => [...t, { from: 'user', text: userText }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setTurns(t => [...t, {
        from: 'brain',
        text: <>Tres lugares con <b>buena mesa para hablar</b> cerca tuyo. Ninguno necesita reserva un martes:</>,
        cards: ['osaka', 'anafe', 'cuervo'],
        chips: ['¿Cuál es más tranquilo?', 'Algo más barato', 'Para 4 personas'],
      }]);
    }, 1100);
  };

  React.useEffect(() => { if (initialQuery) respond(initialQuery); /* eslint-disable-next-line */ }, []);
  React.useEffect(() => {
    const s = scrollRef.current; if (s) s.scrollTop = s.scrollHeight;
  }, [turns, thinking]);

  return (
    <div className="cj-screen cj-convo">
      <div className="cj-convo__head">
        <button className="cj-iconback" onClick={onBack} aria-label="Volver">
          <window.Icon name="chevron-left" size={22} />
        </button>
        <div className="cj-convo__title">
          <window.BrainMarkMini />
          <div className="cj-convo__titletext"><b>Caju</b><span>Concierge gastronómico</span></div>
        </div>
        <button className="cj-iconback" aria-label="Mapa" onClick={onBack}>
          <window.Icon name="map" size={20} />
        </button>
      </div>

      <div className="cj-convo__scroll" ref={scrollRef}>
        {turns.length === 0 && !thinking && (
          <div className="cj-convo__empty">
            <NS.BrainMark size={44} radius={14} />
            <p className="cj-convo__hi">Soy Caju.<br />Contame qué se te antoja y te ayudo a decidir.</p>
            <div className="cj-convo__starters">
              {['Cerca y tranquilo para hablar', 'Buena barra para ir solo', 'Para una cita, sin ruido'].map((s, i) => (
                <Chip key={i} onClick={() => respond(s)}>{s}</Chip>
              ))}
            </div>
          </div>
        )}
        {turns.map((t, i) => (
          <div className="cj-turn" key={i}>
            <ChatBubble from={t.from}>
              {t.text}
              {t.cards && (
                <div className="cj-turn__cards">
                  {t.cards.map(id => {
                    const r = D.restaurants.find(x => x.id === id);
                    return <RestaurantCard key={id} compact name={r.name} cuisine={r.cuisine}
                      neighborhood={r.neighborhood} price={r.price} tags={r.tags} trust={r.trust}
                      onClick={() => onOpenRestaurant(id)} />;
                  })}
                </div>
              )}
            </ChatBubble>
            {t.chips && !thinking && i === turns.length - 1 && (
              <div className="cj-turn__chips">
                {t.chips.map((c, j) => (
                  <Chip key={j} onClick={() => respond(c)}>{c}</Chip>
                ))}
              </div>
            )}
          </div>
        ))}
        {thinking && <ChatBubble from="brain" thinking />}
      </div>

      <div className="cj-convo__prompt">
        <PromptBar value={q} onChange={setQ} showMark={false}
          onSend={(v) => { respond(v); setQ(''); }} placeholder="Escribí o hablá…" />
      </div>
    </div>
  );
}

// tiny inline brain mark for the title
function BrainMarkMini() {
  const NS = window.CajuEatDesignSystem_dbeea0;
  return <NS.BrainMark size={22} radius={7} />;
}

const CJ_CONVO_CSS = `
.cj-convo { display: flex; flex-direction: column; background: var(--paper); }
.cj-convo__head { position: relative; z-index: 10; flex-shrink: 0; padding-top: 44px;
  height: 92px; display: flex; align-items: center; justify-content: space-between; padding-left: 8px; padding-right: 8px;
  background: rgba(252,251,248,.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line-soft); }
.cj-convo__title { display: flex; align-items: center; gap: 8px; font-family: var(--font-sans);
  font-weight: 600; font-size: 17px; color: var(--ink-900); }
.cj-iconback { width: 40px; height: 40px; border: 0; background: transparent; border-radius: 50%;
  display: grid; place-items: center; color: var(--ink-700); cursor: pointer; }
.cj-iconback:active { background: var(--paper-sunk); }
.cj-convo__scroll { flex: 1; overflow-y: auto; padding: 18px 16px 8px; display: flex; flex-direction: column; gap: 16px;
  scrollbar-width: none; }
.cj-convo__scroll::-webkit-scrollbar { display: none; }
.cj-convo__titletext { display: flex; flex-direction: column; line-height: 1.1; }
.cj-convo__titletext b { font-weight: 600; font-size: 16px; color: var(--ink-900); }
.cj-convo__titletext span { font-size: 11px; color: var(--ink-400); font-weight: 500; }
.cj-convo__empty { display: flex; flex-direction: column; align-items: flex-start; gap: 14px;
  padding: 24px 6px 8px; animation: cjTurnIn var(--dur-base) var(--ease-out); }
.cj-convo__hi { font-family: var(--font-serif); font-size: 26px; line-height: 1.2; color: var(--ink-900);
  letter-spacing: -0.01em; }
.cj-convo__starters { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.cj-turn { display: flex; flex-direction: column; gap: 10px; animation: cjTurnIn var(--dur-base) var(--ease-out); }
@keyframes cjTurnIn { from { opacity: 0; transform: translateY(8px); } }
.cj-turn__cards { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.cj-turn__chips { display: flex; flex-wrap: wrap; gap: 8px; padding-left: 38px; }
.cj-convo__prompt { flex-shrink: 0; padding: 10px 14px calc(10px + var(--safe-bottom));
  background: rgba(252,251,248,.92); backdrop-filter: blur(12px); border-top: 1px solid var(--line-soft); }
`;

Object.assign(window, { Conversation, BrainMarkMini, CJ_CONVO_CSS });
