import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import { Badge, Button } from '../../components/core';
import { adminClient, AdminAuthError, clearOperatorToken, getOperatorToken, setOperatorToken } from '../../lib/admin/adminClient';
import type { CuratorAnalysis } from '../../lib/admin/adminClient';
import type { Restaurant } from '../../types';
import './Admin.css';

const TRUST_TONE: Record<Restaurant['trust'], 'success' | 'brand' | 'danger'> = { high: 'success', mid: 'brand', low: 'danger' };

/** SPEC-018 Admin CMS: another client of the Brain — never a login for regular users, gated by an operator shared secret (SPEC-018 §Acceso). */
export function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);
  const [catalog, setCatalog] = useState<Restaurant[]>([]);

  const [curatorText, setCuratorText] = useState('');
  const [analysis, setAnalysis] = useState<CuratorAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [confirmedIdx, setConfirmedIdx] = useState<Set<number>>(new Set());

  const [newName, setNewName] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newWhy, setNewWhy] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdMsg, setCreatedMsg] = useState('');

  const loadCatalog = async () => {
    setGateLoading(true);
    try {
      const data = await adminClient.getCatalog();
      setCatalog(data);
      setAuthed(true);
      setGateError('');
    } catch (err) {
      clearOperatorToken();
      setAuthed(false);
      setGateError(err instanceof AdminAuthError ? 'Token incorrecto.' : 'No se pudo conectar con el Brain.');
    } finally {
      setGateLoading(false);
    }
  };

  useEffect(() => {
    if (getOperatorToken()) loadCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = () => {
    if (!tokenInput.trim()) return;
    setOperatorToken(tokenInput.trim());
    loadCatalog();
  };

  const logout = () => {
    clearOperatorToken();
    setAuthed(false);
    setCatalog([]);
    setTokenInput('');
  };

  const runAnalysis = async () => {
    if (!curatorText.trim()) return;
    setAnalyzing(true);
    setAnalysis(null);
    setConfirmedIdx(new Set());
    try {
      setAnalysis(await adminClient.analyze(curatorText.trim()));
    } finally {
      setAnalyzing(false);
    }
  };

  // Nunca se escribe sola — el operador confirma cada sugerencia una por una (Confirmación Inteligente, CP-009).
  const confirmMatch = async (index: number) => {
    if (!analysis) return;
    const match = analysis.matches[index];
    await adminClient.addSource(match.restaurantId, {
      name: 'Operador (contenido analizado)',
      kind: 'curator',
      weight: match.suggestedWeight,
      claim: match.claim,
    });
    setConfirmedIdx((prev) => new Set(prev).add(index));
    loadCatalog();
  };

  const createRestaurant = async () => {
    if (!newName.trim() || !newCuisine.trim() || !newNeighborhood.trim()) return;
    setCreating(true);
    setCreatedMsg('');
    try {
      const created = await adminClient.createRestaurant({
        name: newName.trim(),
        cuisine: newCuisine.trim(),
        neighborhood: newNeighborhood.trim(),
        why: newWhy.trim(),
      });
      setCreatedMsg(`Creado: ${created.name}`);
      setNewName('');
      setNewCuisine('');
      setNewNeighborhood('');
      setNewWhy('');
      loadCatalog();
    } finally {
      setCreating(false);
    }
  };

  if (!authed) {
    return (
      <div className="cj-admin cj-admin--gate">
        <div className="cj-admin-gate">
          <h1>Admin CMS</h1>
          <p>Acceso de operador — separado de la identidad de usuario final (SPEC-013).</p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Token de operador"
            onKeyDown={(e) => e.key === 'Enter' && enter()}
          />
          <Button variant="primary" block onClick={enter} loading={gateLoading}>
            Entrar
          </Button>
          {gateError && <p className="cj-admin-gate__error">{gateError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="cj-admin">
      <div className="cj-admin__head">
        <button className="cj-admin-iconback" onClick={() => navigate('/')} aria-label="Volver">
          <ChevronLeft size={22} />
        </button>
        <h1>Admin CMS</h1>
        <button className="cj-admin-iconback" onClick={logout} aria-label="Salir">
          <LogOut size={18} />
        </button>
      </div>

      <div className="cj-admin__scroll">
        <section className="cj-admin-sec">
          <Badge tone="over">Catálogo · confianza</Badge>
          <div className="cj-admin-table">
            {catalog.map((r) => (
              <div className="cj-admin-row" key={r.id}>
                <div className="cj-admin-row__head">
                  <div className="cj-admin-row__main">
                    <b>{r.name}</b>
                    <span>
                      {r.cuisine} · {r.neighborhood}
                    </span>
                  </div>
                  <Badge tone={TRUST_TONE[r.trust]}>{r.trust}</Badge>
                </div>
                <p className="cj-admin-row__rationale">{r.trustRationale}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cj-admin-sec">
          <Badge tone="over">Analizar contenido de curador</Badge>
          <p className="cj-admin-lead">
            Pegá texto real que ya leíste (caption, comentario, lista) — nunca se lee la plataforma directamente.
          </p>
          <textarea
            value={curatorText}
            onChange={(e) => setCuratorText(e.target.value)}
            placeholder="Ej: fui a Osaka de nuevo, la barra sigue espectacular…"
          />
          <Button variant="primary" onClick={runAnalysis} loading={analyzing} disabled={!curatorText.trim()}>
            Analizar
          </Button>

          {analysis && (
            <div className="cj-admin-analysis">
              {analysis.matches.map((m, i) => (
                <div className={`cj-admin-match ${confirmedIdx.has(i) ? 'is-confirmed' : ''}`} key={`${m.restaurantId}-${i}`}>
                  <div className="cj-admin-match__head">
                    <b>{m.restaurantName}</b>
                    <Badge tone="brand">{m.suggestedWeight}</Badge>
                  </div>
                  <p>{m.claim}</p>
                  <Button
                    size="sm"
                    variant={confirmedIdx.has(i) ? 'secondary' : 'primary'}
                    disabled={confirmedIdx.has(i)}
                    onClick={() => confirmMatch(i)}
                  >
                    {confirmedIdx.has(i) ? 'Agregado' : 'Confirmar y agregar como fuente'}
                  </Button>
                </div>
              ))}
              {analysis.unmatchedMentions.length > 0 && (
                <p className="cj-admin-unmatched">No reconocido en el catálogo: {analysis.unmatchedMentions.join(', ')}</p>
              )}
              {analysis.matches.length === 0 && analysis.unmatchedMentions.length === 0 && (
                <p className="cj-admin-lead">No se identificó ningún restaurante real en el texto.</p>
              )}
            </div>
          )}
        </section>

        <section className="cj-admin-sec">
          <Badge tone="over">Agregar restaurante</Badge>
          <div className="cj-admin-form">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre" />
            <input value={newCuisine} onChange={(e) => setNewCuisine(e.target.value)} placeholder="Cocina" />
            <input value={newNeighborhood} onChange={(e) => setNewNeighborhood(e.target.value)} placeholder="Barrio" />
            <input value={newWhy} onChange={(e) => setNewWhy(e.target.value)} placeholder="Por qué ir (una línea)" />
            <Button
              variant="primary"
              onClick={createRestaurant}
              loading={creating}
              disabled={!newName.trim() || !newCuisine.trim() || !newNeighborhood.trim()}
            >
              Crear
            </Button>
            {createdMsg && <p className="cj-admin-created">{createdMsg}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
