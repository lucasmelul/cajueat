# SPEC-025 — Catálogo de Platos (Conocimiento a Nivel de Producto) (nueva)

**Status:** Draft
**Priority:** P2
**Owner:** Claude Code
**Consumers:** Claude Code

Depends On

- SPEC-002 Conversation Experience
- SPEC-005 Recommendation Engine
- SPEC-007 Trust Engine
- SPEC-017 Curators & Sources

---

# Objetivo

Que el Brain pueda responder preguntas a nivel de plato ("¿dónde como el mejor chirashi?", "¿la mejor torta vasca?", "¿el mejor avocado toast?"), no solo a nivel de restaurante — algo que hoy es imposible con el modelo de datos actual.

---

# Por qué no alcanza con lo que ya existe

Cada restaurante ya tiene un campo `order: OrderSuggestion[]` (`{ when, dish }`, ej. "Si vas por primera vez → Pedí el omakase corto") — pero es texto descriptivo suelto, sin identidad propia: no se puede comparar "el chirashi de Osaka" contra "el chirashi de otro lugar" porque el nombre del plato no es una entidad, es una frase dentro de un string. Preguntarle al Brain "¿dónde está el mejor X?" hoy no tiene con qué responder — tendría que inventar una comparación que ningún dato respalda, exactamente lo que SPEC-007 prohíbe.

---

# ⚠️ Esto no sale de Google Places

El pedido pregunta explícitamente si el menú/los platos podrían salir de Google Places. La respuesta real: **no, no de forma estructurada.** La Places API (la misma que ya se integró en `googlePlaces.ts` para direcciones/horarios) no expone un menú ni platos individuales con datos confiables — en el mejor de los casos, algunos locales tienen un link externo a un menú (PDF o web propia), nunca un dato estructurado por plato con nombre/categoría/valoración. No es una limitación de la integración actual — es que ese dato, a nivel de industria, no existe estructurado en ninguna API pública gratuita. Tiene que construirse con la misma filosofía que el resto del catálogo: curado, nunca inventado, nunca scrapeado de un tercero sin revisión.

---

# Comportamiento

## Nueva entidad: `Dish`

Un plato es una entidad propia, no un string suelto — con nombre, categoría (ej. "torta vasca", "sushi", "brunch"), y asociado a uno o más restaurantes reales que lo sirven. Igual que un restaurante, un `Dish` acumula `sources[]` (mismo modelo que `Source` ya usa el Trust Engine: `kind`, `weight`, `claim`, `capturedAt`) — un curador que dice "el mejor chirashi de la zona" es una fuente real, un usuario que lo confirma en una Nota es otra.

## Cómo entra un plato al sistema

Mismos tres caminos que ya existen para restaurantes, sin inventar un cuarto:

1. **Admin**: el operador carga un plato directo, asociado a un restaurante real.
2. **Curadores**: "Analizar contenido de curador" (SPEC-018) ya identifica restaurantes mencionados en un texto — se extiende para también identificar platos mencionados con su claim (ej. "el tiradito de toro de Osaka es espectacular" → plato "tiradito de toro", restaurante Osaka, claim real).
3. **Usuarios**: Nota/Foto/Voz (SPEC-004/SPEC-015) ya identifican qué restaurante y qué se aprendió — se extiende para también poder identificar qué plato específico, cuando el texto lo menciona, con la misma cola de moderación de SPEC-019 (nunca se aplica solo).

## Preguntas a nivel de plato en Conversation

`interpretQuery` (SPEC-002) gana la capacidad de reconocer cuando una pregunta es sobre un plato/categoría, no sobre un lugar (ej. "¿dónde como el mejor avocado toast?") y responder con los restaurantes reales que sirven ese plato, ordenados por la misma lógica de confianza que ya existe — nunca inventando que un lugar sirve algo que no tiene cargado.

Si ningún restaurante tiene ese plato cargado, la respuesta correcta es decirlo honestamente ("todavía no tengo información sobre eso") — nunca inventar una recomendación genérica.

---

# Qué NO hace este spec

No genera platos automáticamente a partir del nombre/tipo de cocina del restaurante (ej. no asume que un lugar "Nikkei" sirve chirashi solo por la categoría — tiene que estar cargado real). No trae menús completos ni precios — solo los platos que alguien real identificó como destacables, no un menú exhaustivo. No usa ninguna API de Google para esto, por la restricción explicada arriba.

---

# Acceptance Criteria

✓ Un plato nunca se muestra asociado a un restaurante sin al menos una fuente real (`Source`) que lo respalde — mismo estándar que ya aplica a `Restaurant.sources`.

✓ Una pregunta de Conversation sobre un plato/categoría que no tiene ningún dato cargado responde con honestidad explícita, nunca con una recomendación inventada.

✓ Un plato puede tener confianza calculada con la misma lógica del Trust Engine (`computeTrust`) que ya existe — no una lógica de confianza paralela.

✓ Los tres caminos de carga (Admin, curador, usuario) reusan exactamente los mecanismos de moderación que ya existen (Confirmación Inteligente de SPEC-018, cola de SPEC-019) — ninguno se aplica directo al catálogo sin revisión humana.

---

# Open Questions

- Si un plato debería poder existir "suelto" (una categoría reconocida, ej. "torta vasca", sin ningún restaurante todavía) para que el Brain sepa que es una categoría real y pueda decir "no tengo ninguno cargado todavía" en vez de no reconocer la pregunta — probablemente sí, pero es un detalle de modelado a resolver en implementación.
- Cómo se relaciona esto con el campo `order` que ya existe (¿se migra a la nueva entidad, o conviven — uno es "qué pedir en este lugar puntual", el otro es "comparación entre lugares"?).
- Si vale la pena, en una iteración futura, dejar que un usuario busque directamente por plato desde Search (SPEC-008), no solo por Conversation.

---

# Notas para Claude Code

Reusar el mismo shape de `Source`/`SignalWeight`/`computeTrust` del Trust Engine — no crear un sistema de confianza paralelo para platos. La extracción de plato en Nota/Foto/Voz y en "Analizar contenido de curador" es una extensión de los prompts de `claudeClient.ts` que ya existen (`extractNoteKnowledge`, `analyzeCuratorContent`), no funciones nuevas separadas — mismo principio de grounding (nunca inventar un plato que el texto no menciona).
