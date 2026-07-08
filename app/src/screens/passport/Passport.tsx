import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, MapPin, QrCode } from 'lucide-react';
import { Badge, Button } from '../../components/core';
import { brain } from '../../lib/brain';
import type { Passport as PassportData } from '../../types';
import './Passport.css';

const fmt = (ms: number) => new Date(ms).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

export function Passport() {
  const navigate = useNavigate();
  const [data, setData] = useState<PassportData | null>(null);

  useEffect(() => {
    let alive = true;
    brain.getPassport().then((d) => {
      if (alive) setData(d);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!data) {
    return (
      <div className="cj-screen cj-pass">
        <div className="cj-pass__head">
          <button className="cj-iconback" onClick={() => navigate(-1)} aria-label="Volver">
            <ChevronLeft size={22} />
          </button>
          <div className="cj-pass__htitle">Mi Pasaporte</div>
          <span style={{ width: 40 }} />
        </div>
      </div>
    );
  }

  const { catalogSize, visited, pendingByNeighborhood } = data;
  const pendingCount = catalogSize - visited.length;
  const pct = catalogSize > 0 ? Math.round((visited.length / catalogSize) * 100) : 0;

  return (
    <div className="cj-screen cj-pass">
      <div className="cj-pass__head">
        <button className="cj-iconback" onClick={() => navigate(-1)} aria-label="Volver">
          <ChevronLeft size={22} />
        </button>
        <div className="cj-pass__htitle">Mi Pasaporte</div>
        <span style={{ width: 40 }} />
      </div>

      <div className="cj-pass__scroll">
        {/* Progress against the real catalog size — never an invented goal (SPEC-021). */}
        <div className="cj-pass__hero">
          <div className="cj-pass__ring" style={{ '--p': pct } as React.CSSProperties}>
            <div className="cj-pass__ringin">
              <b>{visited.length}</b>
              <span>de {catalogSize}</span>
            </div>
          </div>
          <div className="cj-pass__herotxt">
            <p className="cj-pass__lead">Vas conociendo la ciudad, café por café.</p>
            <p className="cj-pass__sub">
              {pendingCount} lugar{pendingCount === 1 ? '' : 'es'} del catálogo te esperan. Sumás uno cada vez que hacés check-in real en un
              lugar nuevo.
            </p>
          </div>
        </div>

        <section className="cj-pass__sec">
          <div className="cj-pass__sech">
            <Badge tone="over">Visitados</Badge>
            <span className="cj-pass__count">{visited.length}</span>
          </div>
          {visited.length === 0 ? (
            <p className="cj-pass__empty">Todavía no hiciste check-in en ningún lugar — arrancá con el que tengas más cerca.</p>
          ) : (
            <div className="cj-stamps">
              {visited.map(({ restaurant, firstVisitAt }) => (
                <button className="cj-stamp" key={restaurant.id} onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
                  <span className="cj-stamp__seal">
                    <Check size={18} />
                  </span>
                  <span className="cj-stamp__name">{restaurant.name}</span>
                  <span className="cj-stamp__meta">
                    {restaurant.neighborhood} · {fmt(firstVisitAt)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="cj-pass__sec">
          <div className="cj-pass__sech">
            <Badge tone="over">Por visitar</Badge>
            <span className="cj-pass__count">{pendingCount}</span>
          </div>
          {pendingByNeighborhood.map(({ neighborhood, restaurants }) => (
            <div className="cj-barrio" key={neighborhood}>
              <div className="cj-barrio__h">
                <MapPin size={14} /> {neighborhood}
                <span className="cj-barrio__n">{restaurants.length}</span>
              </div>
              <div className="cj-barrio__list">
                {restaurants.map((r) => (
                  <button className="cj-todo" key={r.id} onClick={() => navigate(`/restaurant/${r.id}`)}>
                    <span className="cj-todo__dot" />
                    <span className="cj-todo__name">{r.name}</span>
                    {r.type === 'new' && <span className="cj-todo__new">Nuevo</span>}
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="cj-pass__cta">
          <Button variant="brandGhost" size="lg" block iconLeft={<QrCode size={18} />} onClick={() => navigate('/checkin')}>
            Hacer check-in en un lugar
          </Button>
          <p className="cj-pass__note">Sin rachas ni competencia. Tu pasaporte es tuyo y va a tu ritmo.</p>
        </div>
      </div>
    </div>
  );
}
