import { Badge } from '../../../components/core';
import { useAdminData } from '../AdminDataContext';

/** Nothing new from the backend — the catalog already carries sources[] with real capturedAt, so the age of the freshest signal is derived here. "Sin fuentes" counts as the most urgent case, not as "no info". */
export function StaleRadar() {
  const { catalog } = useAdminData();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const staleRestaurants = catalog
    .filter((r) => !r.isDemo)
    .map((r) => {
      const freshestMs = r.sources.reduce((max, s) => Math.max(max, new Date(s.capturedAt).getTime()), 0);
      const daysSinceFresh = freshestMs === 0 ? null : Math.floor((Date.now() - freshestMs) / DAY_MS);
      return { restaurant: r, daysSinceFresh };
    })
    .sort((a, b) => {
      if (a.daysSinceFresh === null) return -1;
      if (b.daysSinceFresh === null) return 1;
      return b.daysSinceFresh - a.daysSinceFresh;
    });

  return (
    <div>
      <h1 className="cj-admin-page-title">Radar de desactualizados</h1>
      <p className="cj-admin-lead">
        Ordenado por antigüedad de la señal más reciente — nada te avisa solo, pero acá ves dónde conviene
        reverificar primero. La confianza ya baja sola con el tiempo (semivida de 270 días); esto es para que vos
        decidas dónde poner el esfuerzo.
      </p>
      {staleRestaurants.length === 0 && <p className="cj-admin-lead">Todavía no hay restaurantes reales cargados.</p>}
      <div className="cj-admin-table">
        {staleRestaurants.map(({ restaurant: r, daysSinceFresh }) => (
          <div className="cj-admin-row" key={r.id}>
            <div className="cj-admin-row__head">
              <div className="cj-admin-row__main">
                <b>{r.name}</b>
                <span>
                  {r.cuisine} · {r.neighborhood}
                </span>
              </div>
              <Badge tone={daysSinceFresh === null || daysSinceFresh > 180 ? 'danger' : daysSinceFresh > 60 ? 'brand' : 'success'}>
                {daysSinceFresh === null ? 'Sin fuentes' : `Hace ${daysSinceFresh} días`}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
