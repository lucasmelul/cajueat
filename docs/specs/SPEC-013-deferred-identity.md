# SPEC-013 — Deferred Identity ("Guardar mi Brain")

**Status:** Draft
**Priority:** P0
**Owner:** Product + Claude Code
**Consumers:** Claude Design, Claude Code

Depends On

- SPEC-006 Memory Engine
- SPEC-010 Onboarding
- product-decisions.md — Decisión abierta #1 (método de autenticación)

A diferencia de los demás SPEC, este documento sí fija arquitectura, no solo comportamiento — la decisión que resuelve es precisamente arquitectónica. Nace de un análisis conjunto Producto/Claude Code registrado en la sesión que lo originó; no fue escrito por Claude Design.

---

# Objetivo

Eliminar el login obligatorio como condición para usar CajuEat.

El usuario abre la app, entra directo al Living Map, y el Brain empieza a aprender de inmediato — sin cuenta, sin teléfono, sin onboarding forzado.

Recién cuando ya construyó algo de valor (guardados, colecciones, Caju Points, conversaciones), se le ofrece **proteger ese Brain**, no "crear una cuenta".

---

# Filosofía

No estamos pidiendo que el usuario se registre.

Estamos ofreciendo proteger algo que ya construyó.

El copy nunca dice "Creá tu cuenta". Dice **"Guardá tu Brain"** o **"Sincronizá tu Brain"**.

La pérdida de algo propio pesa más que la promesa de algo nuevo — este flujo se apoya en eso, no en la urgencia de "no perderte nada" de un onboarding tradicional.

---

# Decisión de arquitectura

Se evaluaron dos variantes (ver el análisis completo, resumido aquí):

**Descartada — Brain local real.** El Trust Engine y el Recommendation Engine correrían en el dispositivo hasta el sync. Se descarta porque contradice CP-002 ("la inteligencia vive únicamente en el Brain") y obliga a duplicar lógica de negocio en el cliente, más un motor de merge tipo CRDT para reconciliar dispositivos. Complejidad alta para un beneficio que no es el que este spec busca — CajuEat no necesita uso sin conexión, necesita no pedir login antes de tiempo.

**Adoptada — Identidad anónima server-side.** El Brain sigue siendo 100% server-side, sin cambios en Trust Engine, Recommendation Engine ni Memory Engine. Lo único que cambia es cómo se identifica al usuario ante el Brain:

```
Primera apertura de la app
  ↓
El cliente genera un ID anónimo (UUID) y lo persiste localmente
  ↓
Cada request al Brain lleva ese ID
  ↓
El Brain crea una fila de usuario la primera vez que ve ese ID
  ↓
Memoria, Caju Points, Colecciones, ADN — todo vive ya en el servidor,
exactamente igual que hoy, solo que la fila no tiene teléfono todavía
  ↓
"Guardá tu Brain" → OTP → el teléfono se ADJUNTA a esa misma fila
  ↓
No hay migración de datos. No hay merge en el caso simple.
```

"Sincronizar" deja de ser un problema técnico — el dato nunca se movió.

---

# Qué NO cambia

- El BrainClient sigue siendo la única frontera entre UI e inteligencia.
- El Trust Engine, el Recommendation Engine y el Memory Engine no se tocan.
- SPEC-010 Onboarding no se reescribe: sus 2-3 preguntas de ADN dejan de ser un paso obligatorio de "primera pantalla" y pasan a ser una invitación que puede aparecer después (ver más abajo), pero el flujo en sí ya era 100% opcional y no incluía login.

# Qué sí cambia

- El Memory Engine deja de asumir un único usuario hardcodeado (`u1`) y pasa a ser multi-tenant, keyed por ID anónimo o por teléfono una vez vinculado.
- Los identificadores generados server-side (tags de ADN, colecciones) dejan de ser contadores secuenciales de proceso y pasan a ser UUIDs — necesario en cuanto hay más de un usuario concurrente.

---

# Flujo

Abrir la app.

↓

Living Map, inmediato. Sin pantalla intermedia.

↓

El Brain aprende con cada guardado, cada conversación, cada colección — igual que hoy, solo que atado a un ID anónimo.

↓

En algún punto (ver "Trigger de sync"), se ofrece "Guardá tu Brain".

↓

Teléfono + OTP.

↓

El teléfono se adjunta a la fila anónima existente. No se crea un usuario nuevo.

---

# Trigger de sync

No es un botón pasivo escondido en Configuración — necesita reglas explícitas, porque la única red de seguridad contra pérdida de datos es que el usuario sincronice a tiempo:

- Nudge después de N acciones de valor acumuladas (guardar el 3er lugar, crear la 1ra colección, sumar los primeros X Caju Points).
- Nudge después de M días de uso.
- Nunca bloqueante — siempre descartable, pero recurrente (no se muestra una sola vez y se olvida para siempre).

Valores exactos de N/M: **Open Question**, ver abajo.

---

# Conflictos de datos

**Segundo dispositivo antes de sincronizar.** Si el usuario abre CajuEat en otro dispositivo (o reinstala tras borrar datos) antes de vincular un teléfono, se crea un segundo ID anónimo sin ninguna relación con el primero. No hay forma de detectarlo ni fusionarlo retroactivamente — es una pérdida irreversible por diseño. Se mitiga solo con el trigger de sync temprano, no se resuelve técnicamente.

**Mismo teléfono, dos Brains anónimos.** Si al verificar un teléfono ya existe una cuenta con ese número (vinculada desde otro dispositivo), **nunca fusionar en silencio**. Preguntar explícitamente: "Encontramos un Brain con este número — ¿fusionamos lo de este dispositivo, o seguís con el que ya tenías?". Fusionar Caju Points a ciegas abre una grieta de abuso (sumar puntos de dos Brains "gratis").

---

# Seguridad y abuso

El riesgo real no es el ID anónimo en sí (bajo blast radius — no hay PII ni pagos detrás antes del sync). El riesgo real es de costo: sin ningún gate de identidad, cualquiera puede generar IDs anónimos ilimitados y consumir Conversation / Knowledge Capture (ambos llamando a Claude, con costo real por request) sin verificación humana.

Esto se resuelve antes de shippear, no después:

- Rate limiting por ID anónimo (mensajes de Conversation por día, notas de Knowledge Capture por día).
- Umbral de uso de Claude antes de exigir sync para seguir usando esas dos features específicamente (el resto de la app — Living Map, Search, guardar, colecciones — no tiene por qué verse afectado, esas no llaman a Claude).

---

# Retención

Un ID anónimo que nunca se vincula a un teléfono no puede vivir para siempre en el servidor sin límite. Se necesita una política de purga (ej. borrar Brains anónimos inactivos después de N días sin actividad y sin teléfono adjunto) — valor exacto de N: **Open Question**.

---

# Relación con SPEC-010 Onboarding

El Onboarding actual (Bienvenida → 3 preguntas de ADN opcionales → Living Map) nunca pedía cuenta — pedía preferencias, no identidad. Bajo este spec no hace falta reescribirlo, pero sí repensar cuándo aparece:

- Puede seguir apareciendo en la primera apertura (como hoy), ya que es 100% opcional y no es la fricción que este spec busca eliminar.
- Alternativa a evaluar con Producto: correrlo más tarde, como parte del mismo momento en que se ofrece "Guardá tu Brain" (agrupar ambas invitaciones en vez de separarlas). Queda como **Open Question**, no una decisión de este documento.

---

# Acceptance Criteria

✓ Ninguna pantalla pide teléfono, email o cuenta antes de llegar al Living Map.

✓ Toda acción de valor (guardar, crear colección, conversar, sumar Caju Points) funciona sin cuenta.

✓ "Guardar mi Brain" nunca se presenta como creación de cuenta — el copy protege, no registra.

✓ Vincular un teléfono nunca migra ni duplica datos — adjunta.

✓ Un teléfono que ya tiene Brain vinculado nunca se fusiona con uno nuevo sin preguntar.

✓ El Trust Engine, el Recommendation Engine y el Memory Engine no requieren cambios de comportamiento, solo de alcance (multi-tenant).

✓ Conversation y Knowledge Capture tienen un límite de uso anónimo antes de requerir sync.

---

# Open Questions

- Valores exactos del trigger de sync (N acciones, M días).
- Días de retención antes de purgar un Brain anónimo sin vincular.
- Límite exacto de mensajes/notas anónimas por día antes de exigir sync.
- Si el Onboarding de ADN debe seguir en la primera apertura o moverse junto al momento de "Guardar mi Brain".
- Mecanismo final de OTP (SMS, WhatsApp, u otro) — sigue siendo la Decisión abierta #1 de `product-decisions.md`, este spec no la resuelve, solo define cuándo se dispara.

---

# Notas para Claude Code

Este documento sí fija la arquitectura (identidad anónima server-side, nunca Brain local) — no queda abierta a reinterpretación como en los demás SPEC.

Sí queda abierto a Claude Code:

- el mecanismo exacto de generación y transporte del ID anónimo (header, cookie, u otro);
- el esquema de rate limiting;
- la migración de `brain/src/memory/memoryStore.ts` de single-tenant a multi-tenant;
- el paso de IDs secuenciales a UUIDs en tags de ADN y colecciones.

No implementar todavía — este documento es la especificación a validar con Producto antes de tocar código.
