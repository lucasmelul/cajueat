import { useAdminData } from '../AdminDataContext';

export function Curators() {
  const { curators } = useAdminData();

  return (
    <div>
      <h1 className="cj-admin-page-title">Curadores · reputación</h1>
      <p className="cj-admin-lead">
        Por dominio (cocina) — nunca un score único global. Se mueve solo con evidencia real confirmada.
      </p>
      {curators.length === 0 && <p className="cj-admin-lead">Todavía no hay curadores con historial registrado.</p>}
      <div className="cj-admin-table">
        {curators.map((c) => (
          <div className="cj-admin-row" key={c.handle}>
            <b>{c.handle}</b>
            <div className="cj-admin-curator__domains">
              {Object.entries(c.domains).map(([domain, rec]) => (
                <span className="cj-admin-curator__domain" key={domain}>
                  {domain}: +{rec.sustained} / -{rec.contradicted}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
