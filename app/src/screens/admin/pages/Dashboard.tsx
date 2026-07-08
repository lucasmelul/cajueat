import { useEffect, useState } from 'react';
import { Badge } from '../../../components/core';
import { adminClient } from '../../../lib/admin/adminClient';
import type { AdminStats } from '../../../lib/admin/adminClient';

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="cj-admin-stat-card">
      <span className="cj-admin-stat-card__value">{value.toLocaleString('es-AR')}</span>
      <span className="cj-admin-stat-card__label">{label}</span>
      {sub && <span className="cj-admin-stat-card__sub">{sub}</span>}
    </div>
  );
}

/** Every number here is a direct read of real data (GET /admin/stats) — never a placeholder metric. */
export function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminClient
      .getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="cj-admin-lead">Cargando métricas…</p>;
  if (!stats) return <p className="cj-admin-lead">No se pudieron cargar las métricas.</p>;

  const pendingTotal = stats.pending.contributions + stats.pending.newPlaces;

  return (
    <div>
      <h1 className="cj-admin-page-title">Dashboard</h1>
      <p className="cj-admin-lead">Estado real del catálogo y de quién usa la app — nada de esto se estima, todo sale de datos que el Brain ya guarda.</p>

      <div className="cj-admin-stats-grid">
        <StatCard label="Lugares reales cargados" value={stats.restaurants.total} sub={`+${stats.restaurants.demo} demo (ocultos a usuarios)`} />
        <StatCard label="Usuarios totales" value={stats.users.totalUsers} sub={`${stats.users.phoneLinked} con teléfono vinculado`} />
        <StatCard label="Activos, últimos 7 días" value={stats.users.activeLast7d} sub={`${stats.users.activeLast30d} en los últimos 30`} />
        <StatCard label="Caju Points otorgados" value={stats.users.totalCajuPoints} />
        <StatCard label="Lugares guardados (total)" value={stats.users.totalSavedRestaurants} />
        <StatCard label="Vinculados a Google Places" value={stats.restaurants.linkedToGoogle} sub={`de ${stats.restaurants.total} reales`} />
        <StatCard label="Desactualizados" value={stats.restaurants.stale} sub="sin señal fresca hace +180 días" />
        <StatCard label="Pendientes de revisión" value={pendingTotal} sub="aportes + lugares nuevos" />
        <StatCard label="Curadores con historial" value={stats.curators} />
        <StatCard label="Eventos cargados" value={stats.events} />
      </div>

      <section className="cj-admin-sec">
        <Badge tone="over">Confianza del catálogo real</Badge>
        {stats.restaurants.total === 0 ? (
          <p className="cj-admin-lead">Todavía no hay restaurantes reales cargados.</p>
        ) : (
          <>
            <div className="cj-admin-trust-bar">
              <span className="cj-admin-trust-bar__seg high" style={{ flex: stats.restaurants.byTrust.high || 0.0001 }} />
              <span className="cj-admin-trust-bar__seg mid" style={{ flex: stats.restaurants.byTrust.mid || 0.0001 }} />
              <span className="cj-admin-trust-bar__seg low" style={{ flex: stats.restaurants.byTrust.low || 0.0001 }} />
            </div>
            <p className="cj-admin-lead">
              {stats.restaurants.byTrust.high} alta · {stats.restaurants.byTrust.mid} media · {stats.restaurants.byTrust.low} baja
            </p>
          </>
        )}
      </section>
    </div>
  );
}
