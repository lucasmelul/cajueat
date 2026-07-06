import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import { Badge, Button, Chip, IconButton } from '../../components/core';
import { CajuPoints, RestaurantCard } from '../../components/discovery';
import { BrainMark } from '../../components/brain';
import { brain } from '../../lib/brain';
import { getCurrentSubscription, getPermissionState, isPushSupported, subscribeToPush, unsubscribeFromPush } from '../../lib/push/pushClient';
import { useAppStore } from '../../lib/store/useAppStore';
import type { Restaurant } from '../../types';
import './Profile.css';

const CONTRIBUTIONS = [
  { label: 'Confirmaste horarios de Anafe', when: 'hace 2 días', points: 15 },
  { label: 'Subiste una foto del omakase', when: 'hace 1 semana', points: 20 },
  { label: 'Respondiste un quiz de ambiente', when: 'hace 2 semanas', points: 10 },
];

/** How the Brain understands the user — not a social profile (SPEC-010, CP-011). */
export function Profile() {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    saved,
    dna,
    removeDnaTag,
    addDnaTag,
    openOverlay,
    hydrateMemory,
    collections,
    loadCollections,
    createCollection,
    removeFromCollection,
    deleteCollection,
  } = useAppStore();
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [editing, setEditing] = useState(false);
  const [syncStage, setSyncStage] = useState<'idle' | 'codeSent' | 'conflict'>('idle');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState('');
  const [syncError, setSyncError] = useState('');
  const [pushState, setPushState] = useState<'idle' | 'checking' | 'granted' | 'denied' | 'unsupported'>('idle');

  useEffect(() => {
    if (!user) brain.getUser().then(setUser);
    hydrateMemory();
    loadCollections();
    brain.getAllRestaurants().then(setAllRestaurants);
    if (!isPushSupported()) {
      setPushState('unsupported');
    } else {
      getCurrentSubscription().then((sub) => {
        if (sub) setPushState('granted');
        else if (getPermissionState() === 'denied') setPushState('denied');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savedList = allRestaurants.filter((r) => saved[r.id]);
  const restaurantById = (id: string) => allRestaurants.find((r) => r.id === id);

  const addTag = () => {
    const label = window.prompt('¿Qué más le enseñamos al Brain sobre vos?')?.trim();
    if (label) addDnaTag(label);
  };

  const addCollection = () => {
    const name = window.prompt('¿Cómo se llama la colección?')?.trim();
    if (name) createCollection(name);
  };

  // SPEC-016 Notifications: pedido en contexto (acá, no al abrir la app por primera vez).
  const enableNotifications = async () => {
    setPushState('checking');
    const ok = await subscribeToPush();
    setPushState(ok ? 'granted' : getPermissionState() === 'denied' ? 'denied' : 'idle');
  };

  const disableNotifications = async () => {
    await unsubscribeFromPush();
    setPushState('idle');
  };

  // SPEC-013 "Guardá tu Brain": adjunta un teléfono a la fila anónima existente — nunca migra, nunca fusiona en silencio.
  const sendCode = async () => {
    if (!phone.trim()) return;
    setSyncError('');
    const { devCode: sentCode } = await brain.requestSyncCode(phone.trim());
    setDevCode(sentCode ?? '');
    setSyncStage('codeSent');
  };

  const confirmCode = async () => {
    setSyncError('');
    const result = await brain.verifySyncCode(phone.trim(), code.trim());
    if (result.conflict) {
      setSyncStage('conflict');
      return;
    }
    if (!result.linked) {
      setSyncError('Código incorrecto o vencido — pedí uno nuevo.');
      return;
    }
    if (user) setUser({ ...user, phone: phone.trim() });
    setSyncStage('idle');
    setCode('');
  };

  return (
    <div className="cj-prof">
      <div className="cj-prof-scroll">
        <div className="cj-prof-head">
          <div className="cj-prof-av">{user?.initials ?? '…'}</div>
          <h1>{user?.name ?? 'Vos'}</h1>
          {user && <CajuPoints value={user.cajuPoints} size="lg" unit="Caju Points" />}
        </div>

        <div className="cj-prof-nudge" onClick={() => openOverlay('feedback')}>
          <BrainMark size={34} radius={11} />
          <div className="cj-prof-nudge__t">
            <b>¿Cómo estuvo Osaka?</b>
            <span>Contame en 20s y mejorás tus próximas recomendaciones.</span>
          </div>
          <ChevronRight size={20} />
        </div>

        <section className="cj-prof-sec">
          <div className="cj-prof-sech">
            <Badge tone="over">Tu ADN gastronómico</Badge>
            <button className="cj-prof-edit" onClick={() => setEditing((e) => !e)}>
              {editing ? 'Listo' : 'Editar'}
            </button>
          </div>
          <p className="cj-prof-lead">Así te entiende el Brain hoy. Editá lo que no cuadre.</p>
          <div className="cj-dna">
            {dna.map((d) => (
              <Chip key={d.id} as={editing ? 'button' : 'span'} icon={editing ? <X size={13} /> : null} onClick={editing ? () => removeDnaTag(d.id) : undefined}>
                {d.label}
              </Chip>
            ))}
            {editing && (
              <Chip as="button" brand selected icon={<Plus size={13} />} onClick={addTag}>
                Agregar
              </Chip>
            )}
          </div>
        </section>

        <section className="cj-prof-sec">
          <div className="cj-prof-sech">
            <Badge tone="over">Guardados</Badge>
            <span className="cj-prof-count">{savedList.length}</span>
          </div>
          <div className="cj-prof-saved">
            {savedList.length > 0 ? (
              savedList.map((r) => (
                <RestaurantCard
                  key={r.id}
                  compact
                  name={r.name}
                  cuisine={r.cuisine}
                  neighborhood={r.neighborhood}
                  price={r.price}
                  tags={r.tags}
                  trust={r.trust}
                  onClick={() => navigate(`/restaurant/${r.id}`)}
                />
              ))
            ) : (
              <p className="cj-empty">Todavía no guardaste lugares. Tocá el marcador en cualquier ficha.</p>
            )}
          </div>
        </section>

        {savedList.length > 0 && pushState !== 'unsupported' && (
          <section className="cj-prof-sec">
            <Badge tone="over">Notificaciones</Badge>
            {pushState === 'granted' ? (
              <>
                <div className="cj-sync-linked">
                  <Bell size={18} />
                  <span>Avisos activados — solo si aparece algo que matchea con vos, o cambia la confianza de un lugar guardado.</span>
                </div>
                <button className="cj-prof-edit" onClick={disableNotifications}>
                  Desactivar
                </button>
              </>
            ) : pushState === 'denied' ? (
              <p className="cj-prof-lead">
                Bloqueaste las notificaciones del navegador — para activarlas de nuevo, hacelo desde la configuración del
                sitio.
              </p>
            ) : (
              <>
                <p className="cj-prof-lead">
                  Te avisamos solo cuando aparece un lugar nuevo que matchea fuerte con tu ADN, o cambia la confianza de
                  algo que guardaste — nunca promociones.
                </p>
                <Button size="sm" variant="primary" onClick={enableNotifications} loading={pushState === 'checking'}>
                  Activar avisos
                </Button>
              </>
            )}
          </section>
        )}

        <section className="cj-prof-sec">
          <div className="cj-prof-sech">
            <Badge tone="over">Tus colecciones</Badge>
            <button className="cj-prof-edit" onClick={addCollection}>
              Crear
            </button>
          </div>
          <p className="cj-prof-lead">Agrupá lugares como quieras — Sushi, Primera cita, lo que sea.</p>
          {collections.length === 0 ? (
            <p className="cj-empty">Todavía no armaste ninguna. Desde una ficha, tocá "Agregar a colección".</p>
          ) : (
            collections.map((c) => (
              <div className="cj-collection" key={c.id}>
                <div className="cj-collection__head">
                  <span className="cj-collection__name">{c.name}</span>
                  <span className="cj-prof-count">{c.restaurantIds.length}</span>
                  <IconButton icon={<Trash2 size={15} />} label="Eliminar colección" variant="plain" size="sm" onClick={() => deleteCollection(c.id)} />
                </div>
                <div className="cj-prof-saved">
                  {c.restaurantIds.map((rid) => {
                    const r = restaurantById(rid);
                    if (!r) return null;
                    return (
                      <div className="cj-collection__row" key={rid}>
                        <RestaurantCard
                          compact
                          name={r.name}
                          cuisine={r.cuisine}
                          neighborhood={r.neighborhood}
                          price={r.price}
                          tags={r.tags}
                          trust={r.trust}
                          onClick={() => navigate(`/restaurant/${r.id}`)}
                        />
                        <IconButton
                          icon={<X size={14} />}
                          label="Quitar de la colección"
                          variant="plain"
                          size="sm"
                          onClick={() => removeFromCollection(c.id, rid)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        <section className="cj-prof-sec">
          <Badge tone="over">Guardá tu Brain</Badge>
          {user?.phone ? (
            <div className="cj-sync-linked">
              <ShieldCheck size={18} />
              <span>Tu Brain está protegido — sincronizado con {user.phone}.</span>
            </div>
          ) : (
            <>
              <p className="cj-prof-lead">
                Ya construiste algo acá — guardados, ADN, puntos. No es crear una cuenta, es no perderlo si cambiás de
                dispositivo.
              </p>
              {syncStage === 'conflict' ? (
                <p className="cj-sync-error">
                  Ese número ya tiene un Brain guardado en otro dispositivo. Por ahora no fusionamos automáticamente —
                  iniciá sesión desde ese dispositivo en vez de crear uno nuevo acá.
                </p>
              ) : syncStage === 'codeSent' ? (
                <div className="cj-sync-form">
                  {devCode && (
                    <p className="cj-sync-devcode">Modo demo (sin SMS conectado todavía): tu código es {devCode}.</p>
                  )}
                  <div className="cj-sync-link">
                    <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de 6 dígitos" inputMode="numeric" />
                    <Button size="sm" variant="primary" onClick={confirmCode} disabled={!code.trim()}>
                      Confirmar
                    </Button>
                  </div>
                  {syncError && <p className="cj-sync-error">{syncError}</p>}
                </div>
              ) : (
                <div className="cj-cap-link">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Tu número de teléfono" inputMode="tel" />
                  <Button size="sm" variant="primary" onClick={sendCode} disabled={!phone.trim()}>
                    Enviar código
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        <section className="cj-prof-sec">
          <Badge tone="over">Tus aportes</Badge>
          <div className="cj-timeline">
            {CONTRIBUTIONS.map((c) => (
              <div className="cj-tl" key={c.label}>
                <span className="cj-tl__dot" />
                <div>
                  <b>{c.label}</b>
                  <span>
                    {c.when} · +{c.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="brandGhost" size="md" block iconLeft={<Plus size={18} />} onClick={() => openOverlay('capture')}>
            Aportar conocimiento
          </Button>
        </section>
      </div>
    </div>
  );
}
