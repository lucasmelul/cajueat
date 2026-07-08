# SPEC-020 — QR Check-in: Verificación Real de Visita (nueva)

**Status:** Draft
**Priority:** P1
**Owner:** Claude Code
**Consumers:** Claude Code

Depends On

- SPEC-003 Restaurant Experience
- SPEC-007 Trust Engine
- SPEC-013 Deferred Identity
- SPEC-018 Admin CMS

Es la pieza fundacional de la que dependen [SPEC-021 — Pasaporte de Cafés](SPEC-021-coffee-passport.md) y [SPEC-023 — Puntos como Crédito Canjeable](SPEC-023-points-as-redeemable-credit.md): ambas necesitan poder distinguir "el usuario dice que fue" de "el usuario probadamente fue". Sin este spec, esas dos son honestamente imposibles de construir sin inventar confianza (violaría SPEC-007).

---

# Objetivo

Un mecanismo para que el Brain sepa, con evidencia real y no autodeclarada, que un usuario estuvo físicamente en un restaurante — sin costo operativo para el local (ni hardware, ni integración con su caja) y sin poder compartirse ni reusarse entre personas.

---

# Por qué hace falta esto y no alcanza con "dejame escribir que fui"

Hoy, un feedback o review post-visita (SPEC-011) es 100% autodeclarado — el usuario dice que fue, el Brain le cree. Eso es correcto para lo que SPEC-011 resuelve (opinión sobre una visita), pero es la base equivocada para dos cosas nuevas que se piden:

1. **Un álbum/pasaporte de lugares visitados** (SPEC-021) pierde todo su sentido si "visitar" un lugar es tan fácil como tocar un botón — no genera ningún conocimiento real ni ninguna razón para que el usuario se mueva por la ciudad.
2. **Crédito canjeable por dinero real** (SPEC-023) directamente no puede depender de una afirmación no verificable — sería regalar plata contra un click.

## Cómo funciona

1. Un operador de café, **al firmarse el convenio** (verificación humana de que es el dueño/encargado real del local — fuera del alcance técnico de este spec, es un paso operativo/comercial de Admin), recibe un QR único generado desde el Admin CMS y ligado a ese `restaurantId`. Se imprime o se muestra en una tablet/cartel en el mostrador — sin ningún costo ni integración de sistemas para el local.
2. El QR no es un link estático a una URL pública — codifica un token firmado (`restaurantId` + secreto del local + ventana de validez corta, ej. se regenera cada N minutos vía un valor rotativo, o el token es estático pero el request de scan exige geolocalización real cerca del local para ser válido — ver Open Questions, es una decisión de anti-fraude que conviene validar con casos reales antes de fijar).
3. El usuario escanea desde la app (cámara nativa vía un flujo dentro de CajuEat, no la cámara del sistema — así el resultado cae directo en la sesión autenticada del usuario, sin fricción de copiar/pegar un link).
4. El Brain valida el scan contra tres señales, todas reales:
   - **Identidad del restaurante**: el token decodifica a un `restaurantId` real y activo.
   - **Timestamp**: el scan se registra con la hora real del servidor, no la del cliente (un cliente podría mentir la suya).
   - **Geolocalización real del usuario en el momento del scan**, comparada con la posición real del restaurante (mismo `haversineKm` que ya existe para "Cerca", SPEC-001) — dentro de un radio corto (ej. 100m, a definir).
5. Si las tres validan: se registra un **Check-in** real — `{ userId, restaurantId, scannedAt, position }` — persistido, nunca inventado ni reconstruido después.
6. **Un check-in por usuario por restaurante por día** — no ilimitado (evita que alguien escanee 50 veces seguidas parado en la puerta para inflar puntos), pero si vuelve otro día, cuenta como una visita nueva real (a diferencia de "una vez en la vida", que no reflejaría a alguien que va todas las semanas).
7. El check-in es lo que **desbloquea** poder dejar un review real de ese restaurante (a diferencia de SPEC-011, que hoy no lo exige) y lo que alimenta el pasaporte (SPEC-021) y la redención de crédito (SPEC-023).

---

# Qué NO hace este spec

No define el mecanismo de generación de QR imprimible en sí (librería de QR, diseño del cartel) — es un detalle de implementación, no de producto. No resuelve qué pasa si un local cierra o cambia de dueño (el QR debería invalidarse — Open Question). No construye el pasaporte ni la redención de crédito — solo la señal de verificación de la que ambos dependen.

---

# Acceptance Criteria

✓ Un check-in solo se registra si el token del QR decodifica a un restaurante real y activo.

✓ Un check-in solo se registra si la geolocalización del usuario en el momento del scan está dentro del radio de validez del restaurante — nunca se confía en una posición que el cliente podría falsear sin este chequeo.

✓ El timestamp de un check-in es siempre el del servidor, nunca el que reporta el cliente.

✓ Un mismo usuario no puede generar más de un check-in por restaurante por día natural.

✓ Un check-in, una vez creado, nunca se edita ni se borra — es el registro de evidencia del que dependen puntos y crédito ya otorgados.

✓ Dejar un review de un restaurante exige al menos un check-in real previo en ese restaurante — sin excepción, ni siquiera para el operador.

---

# Open Questions

- Mecanismo exacto anti-replay del QR: ¿token rotativo (expira cada N minutos, el local necesita conectividad para refrescarlo) o token estático + geolocalización estricta como única defensa? El segundo es más simple y de cero costo operativo real para el local (que es un requisito explícito del pedido), pero depende 100% de la geolocalización del cliente no siendo falseable — un usuario con GPS spoofeado en un teléfono rooteado podría burlarlo. Vale la pena definirlo con el volumen de fraude real que se observe, no de antemano.
- Qué pasa con un check-in si el restaurante se da de baja o el QR se revoca después — ¿el historial del usuario se conserva igual (probablemente sí, es evidencia de que la visita ocurrió, no del estado actual del local)?
- Radio de validez exacto (propuesto 100m como punto de partida, mismo tipo de decisión de placeholder documentado que `NEAR_RADIUS_KM` en SPEC-001) — ajustar con uso real.
- Límite de "un check-in por día" es una decisión de producto, no técnica — podría ser por visita real (si alguien vuelve dos veces el mismo día, ¿cuenta como dos?). Se deja en uno por día como default conservador.

---

# Notas para Claude Code

Nuevo store `checkinStore.ts`, mismo patrón JSON-persistido que el resto (`catalogStore.ts`, `memoryStore.ts`, `pendingContributionsStore.ts`). Nueva sección en Admin CMS para que el operador genere/vea el QR de un restaurante — reusa el mismo patrón de "otro cliente del Brain" de SPEC-018, nunca lógica paralela. La verificación de geolocalización reusa `haversineKm` de `brain/src/geo/geo.ts` tal cual existe — no reimplementar la fórmula.
