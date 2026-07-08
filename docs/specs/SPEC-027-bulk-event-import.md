# SPEC-027 — Carga Masiva de Eventos desde Imagen (nueva)

**Status:** Draft
**Priority:** P2
**Owner:** Claude Code
**Consumers:** Claude Code

Depends On

- SPEC-015 Real Knowledge Ingestion (patrón de extracción por visión)
- SPEC-018 Admin CMS
- SPEC-001 Living Map (Eventos ya se muestran como pines reales en el mapa)

Relacionado, no bloqueante:

- SPEC-024 Contenido de Instagram (si el `@` de la imagen coincide con un restaurante ya conectado, se puede autocompletar posición)

---

# Objetivo

Que un operador pueda cargar varios eventos de una sola vez, a partir de una captura de pantalla (una historia de Instagram con una agenda, un flyer, un cronograma) — en vez de tipear cada uno a mano en el formulario que ya existe. Esto es clave para que el mapa se sienta vivo: cuantos más eventos reales haya cargados, más se nota que "algo pasa" en la ciudad.

---

# Por qué esto encaja con lo que ya existe, sin construir un sistema paralelo

Ya existen dos piezas que este spec combina, sin duplicar ninguna:

1. **Extracción por visión** (SPEC-015, `extractPhotoKnowledge`): el Brain ya sabe leer una imagen real con el cliente multimodal de Claude y devolver solo lo que la imagen realmente muestra, nunca inventando un dato que no sea legible.
2. **Eventos con CRUD real** (ya implementado): `createEvent`, `eventsStore.ts`, pines reales en el mapa — lo único que falta es una forma más rápida de cargar varios a la vez.

Este spec no inventa un motor de extracción nuevo — extiende el mismo principio de `extractPhotoKnowledge` para devolver una **lista** de eventos en vez de un solo dato, y lo conecta al `createEvent` que ya existe.

---

# Comportamiento

1. El operador, desde una sección nueva en Admin ("Cargar eventos desde imagen"), sube una captura real (historia de Instagram, flyer, cronograma tipeado).
2. El Brain la analiza con visión (mismo cliente de Claude, prompt nuevo pero mismo principio de grounding: **nunca inventar un evento, una fecha, o un handle que la imagen no muestre claramente**). Por cada evento que la imagen realmente contiene, devuelve:
   - `name`: el nombre del evento tal cual aparece.
   - `whenRaw`: el texto de fecha/hora tal cual está escrito (ej. "Sábado 12/7, 19hs") — **nunca se resuelve a una fecha ISO automáticamente**, porque una imagen que solo dice "este sábado" es ambigua sin saber el año/mes real de cuándo se sacó la captura; forzar una fecha exacta ahí sería inventar.
   - `instagramHandle`: el `@usuario` de la cuenta fuente, si aparece en la imagen.
   - `claim`: cualquier texto adicional relevante (lugar mencionado, tipo de evento), igual que el `claim` que ya usan otras extracciones.
3. Se muestra al operador una lista de **eventos sugeridos** de esa imagen — mismo patrón visual que "Lugares nuevos sugeridos" (SPEC-019/020): cada uno con campos editables (nombre, fecha/hora exacta vía `datetime-local`, posición lat/lng), prellenados con lo que se pudo extraer, nunca bloqueando si algo quedó vacío.
4. Si `instagramHandle` coincide con un restaurante ya conectado en el catálogo (vía SPEC-024, cuando exista), se autocompleta la posición con la del restaurante — solo como sugerencia editable, nunca fijo.
5. El operador confirma **evento por evento**, nunca todos de una — mismo principio de "nunca se aplica solo" que rige el resto del proyecto. Confirmar reusa `createEvent` tal cual existe hoy, sin lógica paralela.
6. Rechazar un evento sugerido de la imagen no afecta a los demás de la misma captura.

---

# Qué NO hace este spec

No resuelve fechas relativas ("el sábado que viene") a una fecha exacta de forma automática — siempre lo hace el operador a partir del texto extraído. No crea restaurantes nuevos a partir de un `@handle` desconocido — si el handle no matchea nada del catálogo, el evento se puede confirmar igual con posición manual, pero no dispara la creación de un restaurante (eso es un flujo aparte, SPEC-019/020, si en algún momento se quiere conectar). No lee directamente la cuenta de Instagram de origen — el operador sigue subiendo la captura que ya vio, mismo principio de "nunca se scrapea Instagram directamente" que ya rige "Analizar contenido de curador".

---

# Acceptance Criteria

✓ Ningún evento se crea directo desde la imagen sin que el operador lo confirme individualmente.

✓ La extracción nunca inventa una fecha exacta que la imagen no muestre con claridad — el texto crudo queda visible para que el operador lo resuelva.

✓ Una imagen con varios eventos genera varias sugerencias independientes, cada una confirmable o rechazable por separado.

✓ Confirmar un evento sugerido reusa `createEvent` sin cambios — el evento resultante es indistinguible de uno cargado a mano.

✓ Si la imagen no contiene ningún evento identificable, el Brain lo dice explícitamente en vez de forzar una sugerencia vacía o inventada.

---

# Open Questions

- Si vale la pena, además de imagen, aceptar el video corto de una historia (algunas agendas se postean en video, no solo foto) — más costoso de procesar, se puede dejar para una iteración futura.
- Cómo se relaciona esto con la fuente del evento a nivel de confianza — hoy los eventos no tienen `sources[]` como los restaurantes; si conviene sumarles el mismo modelo (para que un evento cargado desde una cuenta reconocida como confiable tenga más peso que uno de una fuente anónima) queda abierto, no es parte de este alcance.
- Autocompletar posición por `instagramHandle` depende de que SPEC-024 exista — mientras tanto, el operador siempre completa la posición a mano, igual que hoy.

---

# Notas para Claude Code

Extender `claudeClient.ts` con una función nueva (ej. `extractEventsFromImage`), mismo patrón de content block de imagen que `extractPhotoKnowledge` ya usa — no crear un cliente de visión aparte. El resultado es una lista, no un solo objeto, a diferencia de las extracciones existentes — el schema de `output_config.format` tiene que reflejar un array. La cola de sugerencias puede vivir en el mismo `pendingContributionsStore.ts` (un cuarto array, junto a `contributions` y `newPlaces`) o en un store nuevo si el modelo de datos de un evento se aleja demasiado del de un restaurante — a decidir en implementación, lo que sea menos forzado.
