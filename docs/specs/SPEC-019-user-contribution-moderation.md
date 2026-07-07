# SPEC-019 — User Contribution Moderation (nueva)

**Status:** Draft
**Priority:** P1
**Owner:** Claude Code
**Consumers:** Claude Code

Depends On

- SPEC-004 Knowledge Acquisition
- SPEC-007 Trust Engine
- SPEC-018 Admin CMS

---

# Objetivo

Cerrar el círculo que SPEC-004 promete ("todo termina integrado al Knowledge Graph") pero que las implementaciones de Nota, Foto, Voz, link y "desde conversación" no cumplen hoy: lo que un usuario común le enseña al Brain sobre un restaurante real queda solo en su propio historial privado (`memory.json`), nunca llega al catálogo compartido (`catalog.json`) que ven los demás usuarios.

---

# Por qué no se resolvió como "auto-agregar directo"

La alternativa más simple —agregar cada aporte de usuario directo al catálogo, con peso bajo— rompe la garantía central del Trust Engine (SPEC-007): "el Brain nunca inventa, nunca confía ciegamente". Cualquiera podría escribir una afirmación falsa sobre un restaurante real y verla reflejada de inmediato para todos los demás usuarios, sin ningún filtro humano en el medio.

El Admin CMS (SPEC-018) ya resolvió exactamente este problema para contenido de curadores: nunca se aplica solo, el operador confirma sugerencia por sugerencia (Confirmación Inteligente, CP-009) antes de que se vuelva una `Source` real. Este spec extiende ese mismo mecanismo — no lo duplica — para que también cubra el aporte espontáneo de un usuario común.

---

# Comportamiento

Cuando un aporte de un usuario (Nota, Foto, Voz, o un mensaje de Conversation) identifica, de forma grounded, un restaurante real y algo que aprender sobre él:

1. Se sigue registrando de inmediato como `Contribution` en el `memory.json` privado del usuario — puntos otorgados sin demora, sin bloquear en la moderación. Esto no cambia.
2. Además, se encola como **aporte pendiente** — una entidad nueva, separada tanto del `memory.json` privado como del `catalog.json` compartido, en estado `pending`.
3. El aporte pendiente aparece en el Admin CMS, en una sección nueva junto a "Analizar contenido de curador" — mismo patrón visual, mismo flujo de un tap para confirmar.
4. Si el operador confirma: se agrega como `Source` real al restaurante, con `kind: 'community'` (ya existe en `SourceKind`) y `weight: 'weak'` (el nivel más bajo que el Trust Engine ya sabe ponderar) — nunca se inventa un peso mayor solo porque un operador lo aprobó rápido.
5. Si el operador rechaza: el aporte pendiente queda marcado `rejected`, nunca se borra — mismo principio de historial que ya usa `docs/PENDING-FEATURES.md`.
6. Ningún aporte pendiente se aplica solo, nunca, bajo ninguna condición — ni por antigüedad, ni por cantidad de aportes similares. El operador es siempre el filtro.

---

# Qué NO hace este spec

No introduce lógica nueva de confianza — reusa `computeTrust`/`addSourceToRestaurant` tal cual existen. No expone la identidad del usuario contribuyente al operador ni a otros usuarios — el aporte pendiente lleva el texto y el restaurante, no quién lo escribió, consistente con la identidad mínima que ya define SPEC-013. No resuelve reputación por contribuyente individual (eso es lo que SPEC-017 ya hace para curadores específicamente) — un usuario común no acumula una reputación propia todavía, cada aporte se evalúa solo.

---

# Acceptance Criteria

✓ Un aporte de usuario común nunca llega al catálogo compartido sin que un operador lo confirme.

✓ El operador ve el aporte pendiente con el mismo patrón de un tap para confirmar que ya usa para curadores — no una interfaz nueva y distinta.

✓ Confirmar un aporte pendiente lo agrega como `Source` real, `kind: 'community'`, `weight: 'weak'` — nunca un peso inventado.

✓ Rechazar un aporte pendiente lo marca como tal, nunca lo borra.

✓ El usuario que originó el aporte sigue recibiendo sus puntos de inmediato, sin esperar la moderación — la demora de revisión nunca es visible para el usuario final.

---

# Open Questions

- Si en algún momento conviene acumular reputación por usuario contribuyente (no solo por curador) para priorizar la cola de moderación — no resuelto acá, mismo tipo de decisión que SPEC-017 dejó abierta para curadores.
- Si el operador debería poder editar el `claim` antes de confirmar (hoy es todo o nada: confirmar tal cual, o rechazar).

---

# Notas para Claude Code

Reusar `addSourceToRestaurant` tal cual existe — no crear un camino paralelo de escritura al catálogo. El nuevo store de aportes pendientes es un tercer store junto a `memoryStore.ts` (privado) y `catalogStore.ts` (compartido), mismo patrón JSON-persistido que ambos.
