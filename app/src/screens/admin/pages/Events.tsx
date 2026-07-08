import { useState } from 'react';
import { Button } from '../../../components/core';
import { adminClient } from '../../../lib/admin/adminClient';
import { useAdminData } from '../AdminDataContext';

export function Events() {
  const { events, setEvents } = useAdminData();
  const [newEventName, setNewEventName] = useState('');
  const [newEventWhenAt, setNewEventWhenAt] = useState('');
  const [newEventLat, setNewEventLat] = useState('');
  const [newEventLng, setNewEventLng] = useState('');
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  const createEvent = async () => {
    const lat = Number(newEventLat);
    const lng = Number(newEventLng);
    if (!newEventName.trim() || !newEventWhenAt || Number.isNaN(lat) || Number.isNaN(lng)) return;
    setCreatingEvent(true);
    try {
      await adminClient.createEvent({ name: newEventName.trim(), whenAt: new Date(newEventWhenAt).toISOString(), position: { lat, lng } });
      setNewEventName('');
      setNewEventWhenAt('');
      setNewEventLat('');
      setNewEventLng('');
      setEvents(await adminClient.getEvents());
    } finally {
      setCreatingEvent(false);
    }
  };

  const removeEvent = async (id: string) => {
    setDeletingEventId(id);
    try {
      await adminClient.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } finally {
      setDeletingEventId(null);
    }
  };

  return (
    <div>
      <h1 className="cj-admin-page-title">Eventos</h1>
      <p className="cj-admin-lead">
        Antes solo existía un evento fijo en el código, sin forma de cargar uno real — esto es un CRUD real, igual
        que restaurantes.
      </p>
      {events.length === 0 && <p className="cj-admin-lead">No hay eventos cargados.</p>}
      <div className="cj-admin-table">
        {events.map((e) => (
          <div className="cj-admin-row" key={e.id}>
            <div className="cj-admin-row__head">
              <div className="cj-admin-row__main">
                <b>{e.name}</b>
                <span>{new Date(e.whenAt).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <Button size="sm" variant="secondary" disabled={deletingEventId === e.id} onClick={() => removeEvent(e.id)}>
                Borrar
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="cj-admin-form">
        <input value={newEventName} onChange={(ev) => setNewEventName(ev.target.value)} placeholder="Nombre del evento" />
        <input type="datetime-local" value={newEventWhenAt} onChange={(ev) => setNewEventWhenAt(ev.target.value)} />
        <input value={newEventLat} onChange={(ev) => setNewEventLat(ev.target.value)} placeholder="Latitud (ej: -34.6)" />
        <input value={newEventLng} onChange={(ev) => setNewEventLng(ev.target.value)} placeholder="Longitud (ej: -58.43)" />
        <Button
          variant="primary"
          onClick={createEvent}
          loading={creatingEvent}
          disabled={!newEventName.trim() || !newEventWhenAt || !newEventLat.trim() || !newEventLng.trim()}
        >
          Crear evento
        </Button>
      </div>
    </div>
  );
}
