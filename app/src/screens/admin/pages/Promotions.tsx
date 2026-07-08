import { useEffect, useState } from 'react';
import { Button } from '../../../components/core';
import { adminClient } from '../../../lib/admin/adminClient';
import type { Promotion, PromotionType } from '../../../types';
import { useAdminData } from '../AdminDataContext';

const TYPE_LABEL: Record<PromotionType, string> = { liquidacion: 'Liquidación de excedente', lanzamiento: 'Lanzamiento de local nuevo' };

/** For a `datetime-local` input's value attribute — local time, no timezone suffix. */
function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * SPEC-022: el operador carga la promo acá — nunca se envía en el momento de crearla,
 * el scheduler tick es el único camino que efectivamente empuja el push, y solo dentro
 * de la ventana [from, until] real, nunca antes ni después.
 */
export function Promotions() {
  const { catalog } = useAdminData();
  const realRestaurants = catalog.filter((r) => !r.isDemo);

  const [selectedId, setSelectedId] = useState<string>('');
  const [text, setText] = useState('');
  const [type, setType] = useState<PromotionType>('liquidacion');
  const [from, setFrom] = useState(() => toLocalInputValue(new Date()));
  const [until, setUntil] = useState(() => toLocalInputValue(new Date(Date.now() + 3 * 3600_000)));
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [history, setHistory] = useState<Promotion[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const selectedRestaurant = realRestaurants.find((r) => r.id === selectedId);

  useEffect(() => {
    if (!selectedId) return;
    setHistoryLoading(true);
    adminClient
      .getPromotions(selectedId)
      .then(setHistory)
      .finally(() => setHistoryLoading(false));
  }, [selectedId]);

  const select = (id: string) => {
    setSelectedId(id);
    setCreateError('');
  };

  const create = async () => {
    if (!selectedId || !text.trim()) return;
    setCreating(true);
    setCreateError('');
    try {
      const fromIso = new Date(from).toISOString();
      const untilIso = new Date(until).toISOString();
      await adminClient.createPromotion(selectedId, { text: text.trim(), type, from: fromIso, until: untilIso });
      setText('');
      const updated = await adminClient.getPromotions(selectedId);
      setHistory(updated);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'No se pudo crear la promoción.');
    } finally {
      setCreating(false);
    }
  };

  const now = Date.now();

  return (
    <div>
      <h1 className="cj-admin-page-title">Promociones en tiempo real</h1>
      <p className="cj-admin-lead">
        Nunca es un broadcast — el Brain calcula a quién le llega según cercanía real, afinidad de ADN, o si ya guardó el
        lugar (SPEC-022). Nunca se envía antes de "Desde" ni después de "Hasta".
      </p>

      <div className="cj-admin-table">
        {realRestaurants.length === 0 && <p className="cj-admin-lead">No hay restaurantes reales cargados todavía.</p>}
        {realRestaurants.map((r) => (
          <div className="cj-admin-row" key={r.id}>
            <div className="cj-admin-row__head">
              <div className="cj-admin-row__main">
                <b>{r.name}</b>
                <span>
                  {r.cuisine} · {r.neighborhood}
                </span>
              </div>
              <Button size="sm" variant={selectedId === r.id ? 'primary' : 'secondary'} onClick={() => select(r.id)}>
                {selectedId === r.id ? 'Seleccionado' : 'Cargar promo'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedRestaurant && (
        <div className="cj-admin-promo-form">
          <p className="cj-admin-lead">
            Nueva promo para <b>{selectedRestaurant.name}</b>
          </p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder='Ej: "quedan 6 medialunas, 50% off hasta las 20hs"' />
          <div className="cj-admin-promo-row">
            <select value={type} onChange={(e) => setType(e.target.value as PromotionType)}>
              <option value="liquidacion">{TYPE_LABEL.liquidacion}</option>
              <option value="lanzamiento">{TYPE_LABEL.lanzamiento}</option>
            </select>
          </div>
          <div className="cj-admin-promo-row">
            <label>
              Desde
              <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label>
              Hasta
              <input type="datetime-local" value={until} onChange={(e) => setUntil(e.target.value)} />
            </label>
          </div>
          {createError && <p className="cj-admin-gate__error">{createError}</p>}
          <Button size="sm" variant="primary" loading={creating} disabled={!text.trim()} onClick={create}>
            Cargar promoción
          </Button>

          <h2 className="cj-admin-page-subtitle">Historial</h2>
          {historyLoading && <p className="cj-admin-lead">Cargando…</p>}
          {!historyLoading && history.length === 0 && <p className="cj-admin-lead">Todavía no hay promos cargadas para este lugar.</p>}
          <div className="cj-admin-table">
            {history.map((p) => {
              const active = p.from <= now && now <= p.until;
              return (
                <div className="cj-admin-row" key={p.id}>
                  <div className="cj-admin-row__head">
                    <div className="cj-admin-row__main">
                      <b>{TYPE_LABEL[p.type]}</b>
                      <span>{p.text}</span>
                    </div>
                    <span className={`cj-admin-promo-status ${active ? 'is-active' : ''}`}>{active ? 'Activa' : 'Vencida'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
