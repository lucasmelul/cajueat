# SPEC-023 — Consumo de Caju Points en Comercios (nueva)

**Status:** Draft
**Priority:** P3
**Owner:** Claude Code
**Consumers:** Claude Code

Depends On

- SPEC-020 QR Check-in
- SPEC-021 Pasaporte de Cafés
- gamification.md / product-decisions.md (Decisión abierta #4)

---

# Corrección de alcance (2026-07-08)

La primera versión de este spec asumía que CajuEat iba a mover dinero real (pagarle al comercio, retener un margen). El usuario aclaró explícitamente que **no es así**: el sistema nunca maneja plata ni ejecuta ninguna operación financiera. El concepto real es más simple — los Caju Points se **consumen** en un comercio (una transacción dentro del sistema, sin equivalente monetario que la app calcule ni mueva); el Admin puede ver cuántos puntos se consumieron en cada local; y la conversión a pesos y el pago en efectivo al local ocurren **completamente por fuera de CajuEat**, de manera informal, sin ninguna operación formal registrada por el sistema.

Esto baja drásticamente el riesgo del spec — ya no hay saldo que represente valor monetario dentro de la app, ni pago a terceros que ejecute el sistema. Es, en esencia, un **ledger de consumo interno** más un reporte para Admin.

---

# Objetivo

Que los Caju Points se puedan **gastar** en un comercio adherido (no solo acumular) — dándole a los puntos un uso real y tangible — mientras el sistema se mantiene 100% dentro del mundo de "puntos", nunca tocando dinero.

---

# Comportamiento

1. El usuario, en el mostrador, elige "usar mis puntos" en la app y escanea el mismo QR de check-in ([SPEC-020](SPEC-020-qr-checkin.md)) — pero en **modo consumo**, no modo check-in. Mismo estándar de verificación real: geolocalización del usuario + timestamp de servidor, nunca confiado del cliente.
2. El usuario elige cuántos puntos consumir (dentro de su balance disponible) — no hay conversión a un monto en pesos calculado por el sistema, solo una cantidad de puntos.
3. El Brain registra un **Consumo** real: `{ userId, restaurantId, pointsSpent, consumedAt }` — inmutable, mismo principio que un check-in (nunca se edita ni se borra).
4. Los puntos se descuentan del balance del usuario en el momento exacto del consumo confirmado — no antes.
5. El Admin tiene un panel de **Consumo por local**: la suma de puntos consumidos por restaurante en un período — para que el operador humano decida, por fuera del sistema y a su propio criterio, cómo compensar a cada local (efectivo, un producto, lo que hayan acordado). El sistema **no calcula ningún equivalente en pesos** ni asume ninguna tasa de conversión — eso queda completamente afuera del alcance técnico.

## Patrón de Pasito que vale la pena adoptar: cooldown por comercio

Investigando la referencia real que motivó este spec (Pasito, ver [product-decisions.md](../product-decisions.md)), su mecanismo real es: pasos → puntos → canje directo en un comercio, con una regla explícita de **un canje por comercio cada 15 días por usuario** — para repartir la demanda entre todos los locales adheridos en vez de que uno solo concentre todos los canjes. En sus propias pruebas, el 87% de los canjes incluyó compra adicional real — un dato que vale la pena tener en cuenta como argumento para que un local quiera sumarse: el consumo de puntos rara vez es la única venta de esa visita.

Este spec adopta el mismo patrón: un **cooldown configurable por comercio** (mismo local, mismo usuario) para evitar que el consumo se concentre siempre en el mismo lugar — valor exacto a definir (Pasito usa 15 días como punto de partida razonable).

---

# Qué NO hace este spec

No calcula ni muestra ningún equivalente en pesos de los puntos — es intencional, para no acercarse a nada que se parezca a manejar dinero. No ejecuta ningún pago, transferencia, ni liquidación automática al comercio — el Admin solo reporta, un humano decide y actúa por fuera del sistema. No define una tasa de conversión puntos→producto — esa negociación es entre CajuEat y cada local, fuera del alcance técnico.

---

# Acceptance Criteria

✓ Un consumo de puntos exige el mismo nivel de verificación real que un check-in (geolocalización + timestamp de servidor) — nunca se descuentan puntos sin un scan válido.

✓ Los puntos se descuentan en el momento exacto del consumo confirmado, nunca antes ni de forma estimada.

✓ El sistema nunca calcula, muestra, ni persiste un valor en pesos equivalente a los puntos — en ningún endpoint, en ninguna vista.

✓ El panel de Admin muestra consumo real de puntos por local y por período, sin necesitar ningún cálculo manual para armarlo — pero sin proponer ni ejecutar ningún pago.

✓ Un usuario no puede consumir puntos en el mismo local dos veces dentro de la ventana de cooldown configurada.

---

# Open Questions

- Valor exacto del cooldown por comercio — Pasito usa 15 días, punto de partida razonable, a validar con uso real.
- Qué pasa si un usuario intenta consumir más puntos de los que tiene disponibles al momento del scan (debería simplemente no permitirse, pero conviene un mensaje claro en el momento, no un error genérico).
- Si el consumo de puntos debería, además, contar como evidencia de visita para el Pasaporte (SPEC-021) igual que un check-in — probablemente sí, ya que implica estar físicamente ahí con el mismo nivel de verificación.

---

# Notas para Claude Code

Reusar exactamente el flujo de scan de SPEC-020 (check-in), solo cambia el modo — no duplicar la lógica de verificación de geolocalización/timestamp. Nuevo store `consumptionStore.ts`, mismo patrón JSON-persistido que el resto. No agregar ningún campo, cálculo, ni referencia a un valor monetario en ningún lado del modelo — ni siquiera como campo opcional "por si después hace falta". Si en algún momento futuro el usuario pide sumar equivalencia en pesos o liquidación real, es un spec nuevo y aparte, no una extensión de este.
