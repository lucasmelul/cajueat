import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Map as MapIcon } from 'lucide-react';
import { BrainMark, ChatBubble, PromptBar, highlightText } from '../../components/brain';
import { Chip } from '../../components/core';
import { RestaurantCard } from '../../components/discovery';
import { brain } from '../../lib/brain';
import { useAppStore } from '../../lib/store/useAppStore';
import type { ConversationTurn } from '../../types';
import './Conversation.css';

const STARTERS = ['Cerca y tranquilo para hablar', 'Buena barra para ir solo', 'Para una cita, sin ruido'];

let localTurnId = 0;
function nextLocalId() {
  localTurnId += 1;
  return `local-${localTurnId}`;
}

export function Conversation() {
  const navigate = useNavigate();
  const { saved, toggleSaved, pendingQuery, setPendingQuery } = useAppStore();
  const [value, setValue] = useState('');
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const consumedPendingQuery = useRef(false);

  const respond = async (text: string) => {
    setTurns((t) => [...t, { id: nextLocalId(), role: 'user', text, createdAt: Date.now() }]);
    setThinking(true);
    const reply = await brain.sendMessage({ text, history: turns });
    setThinking(false);
    setTurns((t) => [...t, reply]);
  };

  // Opens pre-filled with whatever the user typed on the Living Map's Prompt Bar
  // (SPEC-002). Guarded with a ref, not just the dependency array: StrictMode
  // double-invokes this effect in dev, which would otherwise send it twice.
  useEffect(() => {
    if (pendingQuery && !consumedPendingQuery.current) {
      consumedPendingQuery.current = true;
      respond(pendingQuery);
      setPendingQuery(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, thinking]);

  const goMap = () => navigate('/');

  return (
    <div className="cj-convo">
      <div className="cj-convo__head">
        <button className="cj-iconback" onClick={goMap} aria-label="Volver">
          <ChevronLeft size={22} />
        </button>
        <div className="cj-convo__title">
          <BrainMark size={22} radius={7} />
          <div className="cj-convo__titletext">
            <b>Caju</b>
            <span>Concierge gastronómico</span>
          </div>
        </div>
        <button className="cj-iconback" aria-label="Mapa" onClick={goMap}>
          <MapIcon size={20} />
        </button>
      </div>

      <div className="cj-convo__scroll" ref={scrollRef}>
        {turns.length === 0 && !thinking && (
          <div className="cj-convo__empty">
            <BrainMark size={44} radius={14} />
            <p className="cj-convo__hi">
              Soy Caju.
              <br />
              Contame qué se te antoja y te ayudo a decidir.
            </p>
            <div className="cj-convo__starters">
              {STARTERS.map((s) => (
                <Chip key={s} onClick={() => respond(s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {turns.map((t, i) => (
          <div className="cj-turn" key={t.id}>
            <ChatBubble from={t.role}>
              {t.text && (t.role === 'brain' ? highlightText(t.text) : t.text)}
              {t.restaurants && t.restaurants.length > 0 && (
                <div className="cj-turn__cards">
                  {t.restaurants.map((r) => (
                    <RestaurantCard
                      key={r.id}
                      compact
                      name={r.name}
                      cuisine={r.cuisine}
                      neighborhood={r.neighborhood}
                      price={r.price}
                      tags={r.tags}
                      trust={r.trust}
                      saved={!!saved[r.id]}
                      onSave={() => toggleSaved(r.id)}
                      onClick={() => navigate(`/restaurant/${r.id}`)}
                    />
                  ))}
                </div>
              )}
            </ChatBubble>
            {t.chips && !thinking && i === turns.length - 1 && (
              <div className="cj-turn__chips">
                {t.chips.map((c) => (
                  <Chip key={c} onClick={() => respond(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        ))}
        {thinking && <ChatBubble from="brain" thinking />}
      </div>

      <div className="cj-convo__prompt">
        <PromptBar
          value={value}
          onChange={setValue}
          showMark={false}
          placeholder="Escribí o hablá…"
          onSend={(v) => {
            respond(v);
            setValue('');
          }}
        />
      </div>
    </div>
  );
}
