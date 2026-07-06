# SPEC-016 — Notifications

**Status:** Draft
**Priority:** P2
**Owner:** Product + Claude Code
**Consumers:** Claude Code

Depends On

- CP-029 Notifications
- SPEC-013 Deferred Identity
- SPEC-005 Recommendation Engine
- SPEC-007 Trust Engine

Igual que SPEC-013 y SPEC-015, este documento fija una porción de infraestructura además de comportamiento, porque parte de lo que pide (push real) no existe hoy en el proyecto y conviene ser explícito sobre qué falta antes de especificar el comportamiento sobre una base que no existe.

Planning (CP-071) queda deliberadamente fuera de este pase — no se ve útil para el uso actual de la app.

---

# Objetivo

Definir cuándo vale la pena interrumpir al usuario fuera de la app.

---

# Filosofía

Cada notificación debe responder: ¿por qué vale la pena recibirla?

Si no existe una buena respuesta, no se envía.

Esto es la misma exigencia que ya aplicamos al Trust Engine ("el usuario nunca ve números, ve explicaciones") — acá se traduce en que toda notificación pueda mostrar su propio motivo si el usuario lo pide, nunca aparecer sin explicación.

---

# Tipos, y de dónde sale cada uno hoy

CP-029 nombra 6 tipos sin definir su origen. Mapeados contra lo que el Brain ya sabe hacer:

## Recomendaciones
Ya existe — `getRecommendations()` ya arma la Brain Card completa. Lo nuevo es decidir cuándo vale la pena empujarla afuera de la app en vez de esperar a que el usuario la abra.

## Recordatorios
Ya existe *dentro* de la app — el nudge "¿Cómo estuvo Osaka?" en Profile (SPEC-011 Feedback). Esto es llevar ese mismo disparador a una notificación real cuando el usuario no abrió la app en un tiempo razonable después de una visita.

## Cambios importantes
Requiere que el catálogo cambie con el tiempo (hoy es estático, 6 restaurantes hand-authored) — depende de que exista ingesta real de conocimiento (SPEC-004/SPEC-015) que actualice `sources` de un lugar ya guardado por el usuario, y que el Trust Engine detecte que el nivel cambió entre una consulta y otra.

## Nuevos lugares
El Recommendation Engine ya sabe puntuar esto — `scoreRestaurant` ya calcula `matchedDna` para un restaurante nuevo contra el ADN del usuario. Falta el disparador: avisar cuando se agrega un lugar al catálogo que matchea fuerte, en vez de esperar a que el usuario lo descubra solo.

## Feedback pendiente
Mismo caso que Recordatorios — ya vive in-app, esto es la versión push.

## Eventos
El modelo `MapEvent` ya existe (`Feria gastronómica`, ver `brain/src/data/restaurants.ts`). Falta decidir con cuánta anticipación avisar y a quién (¿todo el que tiene DNA relacionado con la zona/tipo de evento?).

Ninguno de los 6 tipos requiere lógica de negocio nueva en el Brain — el Recommendation/Trust Engine ya calculan lo necesario. Lo que falta es 100% infraestructura de entrega (ver siguiente sección) y las reglas de cuándo disparar cada uno.

---

# Infraestructura que falta (no existe hoy)

- **Service worker de push.** El proyecto ya usa `vite-plugin-pwa` (`app/vite.config.ts`), pero en modo `generateSW` — un service worker autogenerado para instalación y cacheo, sin ningún manejador de `push`/`notificationclick`. Notificaciones reales requieren pasar a `injectManifest` (o sumar un service worker propio) con esos handlers.
- **Permiso del navegador.** Pedir `Notification`/`Push` permission — con el mismo criterio de fricción mínima que el resto del producto: nunca al abrir la app por primera vez, solo cuando hay una razón concreta en pantalla (ej. justo después de guardar el primer lugar, ofrecer "avisarte si aparece algo así de nuevo").
- **Identidad a quién mandarle algo.** Push necesita una subscription (endpoint + claves) asociada a un usuario server-side. Esto depende directamente de SPEC-013 — no tiene sentido diseñar el guardado de subscriptions antes de tener una identidad estable (aunque sea anónima) a la cual atarlas. Con SPEC-013 implementado, la subscription se guarda contra el mismo ID anónimo, sin esperar a que el usuario verifique teléfono.
- **VAPID keys + endpoint server-side** en `brain/` para disparar los pushes (Web Push protocol).

---

# Reglas

- Pocas.
- Útiles — nunca sin una razón real detrás.
- Personalizadas — nunca la misma notificación para todos los usuarios al mismo tiempo.
- Explicables — el usuario puede tocar y ver por qué le llegó, igual que puede ver el rationale de una recomendación.

# Qué NO hacer

No enviar promociones.

No enviar spam.

No usar notificaciones para "recuperar" usuarios inactivos — CP-029 lo dice explícito: "las notificaciones existen para ayudar, no para recuperar usuarios." Esto descarta cualquier notificación tipo "che, hace rato no venís" sin una razón de contenido real detrás.

---

# Acceptance Criteria

✓ Ninguna notificación se envía sin un motivo concreto y explicable.

✓ El permiso del navegador se pide en contexto, nunca en el primer uso.

✓ El usuario puede ver por qué le llegó cada notificación.

✓ Ningún tipo de notificación duplica lógica de negocio que el Brain ya tiene — todas reusan Recommendation/Trust Engine existentes.

✓ Nunca hay notificaciones de reactivación sin contenido real (nada de "te extrañamos").

---

# Open Questions

- Frecuencia máxima (¿por día? ¿por semana?) — no está definida ni en CP-029 ni acá.
- Si el opt-out es todo-o-nada o granular por tipo (ej. querer Eventos pero no Recomendaciones).
- Con cuánta anticipación avisar de un Evento.
- Umbral exacto de "matchea fuerte" para disparar una notificación de Nuevos lugares — reusa el score de `matchedDna`, pero falta el punto de corte.

---

# Notas para Claude Code

No implementar antes de SPEC-013 (Deferred Identity) — este spec asume que ya existe una identidad server-side estable (anónima o vinculada) a la cual atar una subscription de push.

No implementar "Cambios importantes" hasta que exista ingesta real de conocimiento que efectivamente cambie `sources` de un restaurante ya en el catálogo — hoy no hay ningún mecanismo que actualice un restaurante existente después de su creación.

No implementar todavía — este documento es la especificación a validar con Producto antes de tocar código.
