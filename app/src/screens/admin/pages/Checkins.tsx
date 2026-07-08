import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '../../../components/core';
import { adminClient, type ConsumptionSummaryRow } from '../../../lib/admin/adminClient';
import { useAdminData } from '../AdminDataContext';

/**
 * SPEC-020/023: this is where an operator generates the QR a real café displays at the
 * counter, and where they see how many Caju Points were consumed at each venue — the
 * system never proposes or executes a payout, it only reports (see SPEC-023 scope note).
 */
export function Checkins() {
  const { catalog } = useAdminData();
  const realRestaurants = catalog.filter((r) => !r.isDemo);

  const [selectedId, setSelectedId] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const [consumption, setConsumption] = useState<ConsumptionSummaryRow[]>([]);
  const [consumptionLoading, setConsumptionLoading] = useState(true);

  useEffect(() => {
    adminClient
      .getConsumption()
      .then(setConsumption)
      .finally(() => setConsumptionLoading(false));
  }, []);

  const showQr = async (id: string) => {
    setSelectedId(id);
    setQrDataUrl(null);
    setQrLoading(true);
    const { token } = await adminClient.getCheckinToken(id);
    const dataUrl = await QRCode.toDataURL(token, { width: 280, margin: 1 });
    setQrDataUrl(dataUrl);
    setQrLoading(false);
  };

  const selectedRestaurant = realRestaurants.find((r) => r.id === selectedId);

  return (
    <div>
      <h1 className="cj-admin-page-title">Check-in · QR y consumo</h1>
      <p className="cj-admin-lead">
        El QR es estático por local — se genera acá y se imprime o se muestra en el mostrador, sin costo ni integración
        para el local (SPEC-020). El escaneo real siempre exige geolocalización del usuario y hora del servidor, nunca
        confía solo en el código.
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
              <Button size="sm" variant="secondary" onClick={() => showQr(r.id)}>
                Ver QR
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedRestaurant && (
        <div className="cj-admin-qr">
          <p className="cj-admin-lead">
            QR de <b>{selectedRestaurant.name}</b>
          </p>
          {qrLoading && <p className="cj-admin-lead">Generando…</p>}
          {qrDataUrl && <img className="cj-admin-qr__img" src={qrDataUrl} alt={`QR de check-in de ${selectedRestaurant.name}`} />}
        </div>
      )}

      <h2 className="cj-admin-page-subtitle">Consumo de puntos por local</h2>
      <p className="cj-admin-lead">
        Suma real de Caju Points consumidos por local — nunca un equivalente en pesos. La conversión y la compensación al
        local ocurren completamente por fuera de CajuEat (SPEC-023).
      </p>
      {consumptionLoading && <p className="cj-admin-lead">Cargando…</p>}
      {!consumptionLoading && consumption.length === 0 && <p className="cj-admin-lead">Todavía no hay puntos consumidos en ningún local.</p>}
      <div className="cj-admin-table">
        {consumption.map((row) => (
          <div className="cj-admin-row" key={row.restaurantId}>
            <div className="cj-admin-row__head">
              <div className="cj-admin-row__main">
                <b>{row.restaurantName}</b>
                <span>{row.count} canje(s)</span>
              </div>
              <span className="cj-admin-row__points">{row.totalPoints.toLocaleString('es-AR')} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
