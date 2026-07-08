# SPEC-022 — Promociones en Tiempo Real (nueva)

**Status:** Draft
**Priority:** P2
**Owner:** Claude Code
**Consumers:** Claude Code

Depends On

- SPEC-016 Notifications
- SPEC-005 Recommendation Engine
- SPEC-018 Admin CMS

---

# Objetivo

Que un café pueda avisar a la comunidad de CajuEat, en tiempo real, de dos situaciones reales de negocio: (1) que le queda pastelería/producto del día por vender antes de cierre, y (2) que es un local nuevo que quiere darse a conocer — sin que esto se vuelva spam para quien no le interesa.

---

# Dos casos de uso, un mismo mecanismo

El pedido original los describe como dos ideas separadas, pero ambas son la misma forma: **un local publica una oferta con vigencia corta, el Brain decide a quién de verdad le interesa, y solo a esos usuarios les llega una notificación real.**

## Caso 1 — Liquidación de excedente

Un café, cerca del cierre, carga una promo tipo "quedan 6 medialunas, 50% off hasta las 20hs" — vigencia de horas, no de días. Pensado para reducir descarte real, con beneficio real para quien lo recibe.

## Caso 2 — Lanzamiento de un local nuevo

Cuando un restaurante nuevo entra al catálogo (por Admin, por un curador, o confirmado desde la cola de "lugares nuevos sugeridos" de SPEC-019 — incluyendo el caso que el pedido menciona explícitamente, que la sugerencia la haga el propio dueño del local como si fuera un usuario más), puede cargar una promo de bienvenida con vigencia más larga (días, no horas) para generar las primeras visitas.

---

# A quién le llega — nunca un broadcast a todo el mundo

Este es el punto que decide si esto suma valor real o se convierte en spam. La promo nunca se manda a todos los usuarios con push activado — se calcula a quién le interesa, reusando señales que el Brain ya tiene, sin inventar un motor de targeting nuevo:

- **Cercanía real**: mismo cálculo de `haversineKm` que ya usa el chip "Cerca" (SPEC-001) — solo usuarios dentro de un radio razonable del local en ese momento (requiere que el usuario tenga geolocalización activa y push habilitado; sin ambas cosas, no puede recibir promos de cercanía).
- **Afinidad de ADN**: mismo `matchDna` que ya usa el disparador "Nuevos lugares" de Notifications (SPEC-016) — si el local matchea el ADN gastronómico del usuario, prioridad más alta.
- **Ya lo tiene guardado**: si el usuario ya guardó ese restaurante, la promo le llega igual sin necesidad de estar cerca en ese momento — ya mostró interés real antes.

Ninguna de estas tres señales es nueva — todas ya existen en el Brain (SPEC-001, SPEC-005, SPEC-016). Este spec las combina para decidir el destinatario de una promo, no inventa un sistema de segmentación aparte.

---

# Comportamiento

1. El operador del local (o el Admin en su nombre) carga la promo desde el Admin CMS: texto, vigencia (`from`/`until`, timestamps reales, no aproximados), y tipo (`liquidacion` | `lanzamiento`) — el tipo decide el tono del mensaje, no la lógica de targeting.
2. Al crear la promo, el Brain calcula los destinatarios reales según las señales de arriba y dispara notificaciones push (mismo pipeline de `pushSender.ts` que ya existe, SPEC-016) — nunca antes de la hora `from`, nunca después de `until`.
3. La promo vencida deja de mostrarse en cualquier lado — ni en notificaciones nuevas, ni en la ficha del restaurante — pero queda en el historial (mismo principio de "nunca se borra, se marca" del resto del proyecto).
4. En la ficha del restaurante (SPEC-003), una promo activa se muestra de forma visible mientras dura — no hace falta esperar a la notificación para verla.

---

# Qué NO hace este spec

No construye un sistema de cupones/códigos de descuento canjeables — la promo es informativa ("hay descuento, andá"), el canje en el mostrador es una conversación entre el usuario y el local, fuera del alcance técnico de este spec (a menos que se una con [SPEC-023](SPEC-023-points-as-redeemable-credit.md), que si maneja crédito real). No decide el precio ni el descuento — eso lo tipea el operador como texto libre, el Brain no calcula porcentajes. No prioriza promos pagas por sobre orgánicas — no existe un concepto de "promo pauteada" en este spec; si en algún momento se monetiza así, es una decisión de negocio explícita, no algo que este spec asuma.

---

# Acceptance Criteria

✓ Una promo nunca se envía antes de su `from` ni después de su `until`.

✓ Los destinatarios de una promo se calculan con las mismas señales reales que ya existen (cercanía real, ADN, guardado) — nunca un broadcast sin filtro a todos los usuarios con push activo.

✓ Un usuario sin geolocalización activa puede seguir recibiendo promos por afinidad de ADN o por tener el lugar guardado — la ausencia de una señal no bloquea las demás.

✓ Una promo vencida no aparece en ninguna vista nueva, pero queda en el historial del restaurante.

✓ La ficha del restaurante muestra una promo activa sin necesidad de haber recibido la notificación.

---

# Open Questions

- Límite de frecuencia por usuario — si un usuario está cerca de 5 locales con promo activa a la vez, ¿le llegan las 5, o hay un tope razonable por franja horaria? (mismo tipo de decisión de cooldown que `RENOTIFY_COOLDOWN_MS` ya resuelve para otros tipos de notificación en SPEC-016 — probablemente se pueda reusar el mismo patrón).
- Si el operador puede segmentar manualmente (ej. "solo a quienes ya me guardaron") en vez de dejar que el Brain decida todo automático — hoy este spec asume que el Brain decide, no da control manual fino.
- Métricas de efectividad (cuántos check-ins reales se atribuyen a una promo) — depende de [SPEC-020](SPEC-020-qr-checkin.md) existir primero para poder medirlo con evidencia real, no con autodeclaración.

---

# Notas para Claude Code

Reusar `matchDna` (exportado de `recommendationEngine.ts`) y `haversineKm` (`geo.ts`) tal cual existen — no reimplementar ninguno de los dos cálculos. El envío reusa `pushSender.ts` sin cambios en su lógica de envío/limpieza de subscriptions inválidas. Nuevo store `promotionsStore.ts`, mismo patrón JSON-persistido que el resto.
