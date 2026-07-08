# SPEC-021 — Pasaporte de Cafés (Descubrimiento Gamificado) (nueva)

**Status:** Draft
**Priority:** P2
**Owner:** Claude Code
**Consumers:** Claude Code

Depends On

- SPEC-020 QR Check-in
- SPEC-006 Memory Engine
- gamification.md
- product-decisions.md (Decisión abierta #4 — Tabla de Caju Points)

---

# Objetivo

Que descubrir la ciudad tenga una forma visible de progreso — un álbum de cafés visitados y por visitar, por zona — usando check-ins reales (SPEC-020) como la única evidencia de "visitado", nunca una afirmación sin verificar.

---

# De dónde viene esto y por qué encaja (o no) con lo que ya está decidido

El pedido original menciona una app de "pasitos" como referencia — pasos/rachas que se completan. `gamification.md` ya fija un principio que hay que respetar acá explícitamente: **"la gamificación existe para mejorar el Brain, no para generar adicción"**, y nombra como cosas a evitar exactamente el tipo de mecánica de la que hay que cuidarse al copiar una referencia así: *"Leaderboards competitivos que premien cantidad por sobre calidad"* y *"mecánicas de urgencia o pérdida (streaks que castigan, notificaciones de FOMO)"*.

Este spec toma la parte del pedido que sí encaja — un álbum de progreso real, basado en evidencia real (check-ins), que efectivamente empuja a conocer lugares nuevos — y descarta explícitamente la parte que no encajaría: no hay racha que se "rompe" si un día no visitás nada, no hay ranking público entre usuarios, no hay urgencia artificial.

## Qué es real de la referencia (Pasito) y qué es una extensión propia

Investigando la app real (pasito.app, y una nota de La Nación sobre su funcionamiento, 2026-07-08): el mecanismo real de Pasito es más simple de lo que el pedido original sugería — **1.000 pasos = 1 "pasito"**, con 20 pasitos canjeables directo por un premio (medialunas, entradas de cine), y una regla real de **un canje por comercio cada 15 días** para repartir la demanda entre todos los locales adheridos, en vez de que todos se concentren en el mismo. En sus propias pruebas, el 87% de los canjes incluyó una compra adicional — un dato de peso para argumentarle a un local por qué le conviene sumarse.

Pasito **no tiene** álbum, zonas que se desbloquean, ni rankings — eso es una extensión que el pedido original agregó sobre la referencia, no algo que Pasito en sí haga. Este spec la conserva porque encaja bien con lo que ya define `gamification.md` (conocer la ciudad, no solo acumular), pero vale aclarar que no es "copiar Pasito 1 a 1" — es tomar prestada la idea de convertir una acción real (caminar / visitar) en puntos con canje real, y sumarle el álbum como una capa propia. El patrón real del cooldown de 15 días por comercio sí se adoptó tal cual — ver [SPEC-023](SPEC-023-points-as-redeemable-credit.md), que es donde vive el consumo/canje de puntos.

---

# Comportamiento

## El álbum

Cada usuario tiene una vista ("Mi Pasaporte", en Profile) con:

- **Cafés visitados**: todo restaurante con al menos un check-in real (SPEC-020) del usuario, con la fecha del primero.
- **Cafés por visitar**: el resto del catálogo real (no demo), agrupado por barrio/zona (`neighborhood`, ya existe en el modelo) — mostrando cuántos faltan por zona, no una lista infinita sin estructura.
- Progreso expresado como el propio catálogo real crece con el tiempo, nunca como una meta fija inventada (ej. "5 de 12" solo tiene sentido si 12 es el tamaño real del catálogo en ese momento, no un número de marketing).

## Puntos por descubrimiento real

Reusa `Caju Points` (ya existe, `gamification.md`/PRD-006) — no crea una moneda paralela. Nuevas reglas de otorgamiento, todas atadas a un check-in real, nunca a una afirmación:

- Primer check-in real en un restaurante nuevo para ese usuario → puntos de "descubrimiento" (monto exacto: Decisión abierta #4 de `product-decisions.md`, ya pendiente de fijar — este spec no la resuelve, la hereda).
- Dejar un review real (ya exige check-in previo, por SPEC-020) en un restaurante con pocas o ninguna fuente de comunidad todavía → puntos extra sobre el monto base de review — el pedido original lo plantea como incentivo para que los primeros reviews de un local nuevo pasen algo ("para que el café nuevo quiera participar de estar en nuestra app"). El umbral exacto de "pocas fuentes" puede reusar el mismo concepto que ya calcula el Radar de desactualizados en Admin (antigüedad/cantidad de `sources[]`).

## Qué decisiones de `gamification.md` este spec respeta explícitamente

- Sin leaderboard público entre usuarios — el pasaporte es privado, visible solo a su dueño (mismo nivel de privacidad que el resto de Profile).
- Sin streaks que castiguen inactividad — un mes sin check-ins no resta nada, no muestra ninguna advertencia ni notificación de urgencia.
- Los puntos siguen midiendo aporte real (una visita real, comprobada) — nunca apertura de la app ni scroll.

---

# Qué NO hace este spec

No inventa una "temporada" ni una fecha de cierre del álbum — es acumulativo, sin vencimiento. No construye ranking ni comparación entre usuarios. No define el monto exacto de puntos (hereda la Decisión abierta #4, no la resuelve acá). No incluye zonas/barrios curados a mano como "colecciones especiales" (ej. "Ruta del café de especialidad") — es una extensión natural pero queda como Open Question, no como parte de este alcance.

---

# Acceptance Criteria

✓ Un restaurante solo aparece como "visitado" en el pasaporte de un usuario si existe al menos un check-in real (SPEC-020) de ese usuario en ese restaurante.

✓ Los cafés "por visitar" se agrupan por barrio real del catálogo, nunca por una lista plana sin estructura.

✓ Los puntos de descubrimiento y el bonus de review en lugares nuevos solo se otorgan sobre evidencia real (check-in / review con check-in previo) — nunca por abrir el pasaporte o mirarlo.

✓ El pasaporte nunca muestra una racha, un contador de días consecutivos, ni una advertencia de inactividad.

✓ El pasaporte es privado del usuario — no hay ninguna vista donde un usuario vea el progreso de otro.

---

# Open Questions

- Monto exacto de puntos de descubrimiento y del bonus por review en un local nuevo — Decisión abierta #4 de `product-decisions.md`, este spec la hereda sin resolverla.
- Si conviene sumar "colecciones curadas" (ej. una ruta temática armada por un curador/operador, no solo agrupación automática por barrio) — encaja naturalmente con este spec pero se deja para una iteración futura.
- Nombre de marca para los puntos ("Caju Points" ya existe — el pedido original sugiere "Coffee Points"/"Stars"; es una decisión de naming/branding, no de producto, se deja fuera de este spec).

---

# Notas para Claude Code

No crear una segunda moneda de puntos — todo pasa por `addCajuPoints`/`recordContribution` que ya existen en `memoryStore.ts`. El agrupamiento por zona reusa el campo `neighborhood` que el catálogo ya tiene, sin ETL nuevo. Depende en firme de que SPEC-020 (check-ins) ya exista — no tiene sentido construir esto antes.
