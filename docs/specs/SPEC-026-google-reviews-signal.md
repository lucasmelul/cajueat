# SPEC-026 — Rating y Reviews de Google como Señal Informativa (nueva)

**Status:** Draft
**Priority:** P3
**Owner:** Claude Code
**Consumers:** Claude Code

Depends On

- Integración de Google Places ya existente (`brain/src/integrations/googlePlaces.ts`)
- SPEC-007 Trust Engine

---

# Objetivo

Traer el rating agregado y algunas reseñas reales de Google para un restaurante ya vinculado (misma integración que ya existe para dirección/horarios), y decidir con criterio dónde encaja eso frente al Trust Engine que ya existe.

---

# La pregunta real detrás del pedido: ¿esto alimenta al Trust Engine?

El pedido original lo plantea como "guardarnos esa data para alimentar el Brain" — pero eso choca con una separación de diseño que ya se estableció explícitamente al construir la integración de Google Places (SPEC de esa sesión, ya implementado): **los datos de Google son hechos objetivos (dirección, horarios, si está abierto), nunca opiniones** — el Trust Engine (SPEC-007) solo se alimenta de evidencia humana curada (curadores, comunidad, visitas confirmadas), nunca de un agregador externo sin filtro.

Un rating de Google es, en el fondo, una opinión agregada de terceros — pero sin el mismo nivel de curaduría que exige el resto del sistema (nadie de CajuEat revisa esas reviews una por una, no hay Confirmación Inteligente sobre ellas). Meterlo directo al cálculo de confianza rompería la garantía central del Trust Engine sin que nadie lo haya decidido explícitamente. Este spec propone lo contrario: **mostrarlo como una señal externa aparte, clara y separada, nunca fusionada con la confianza real del Brain.**

---

# ⚠️ Restricciones reales de la API de Google — esto no es "traer y guardar libremente"

- La Places API permite mostrar rating agregado (`rating`, `userRatingCount`) y hasta 5 reseñas por lugar (`reviews`), pero los Términos de Servicio de Google restringen cuánto tiempo se puede **cachear/persistir** ese contenido sin volver a pedirlo — no es un dato que se pueda guardar para siempre como el resto del catálogo propio.
- Mostrar reviews de Google exige atribución visible ("según Google", logo cuando corresponda) — no se pueden presentar como si fueran contenido propio de CajuEat.
- El contenido textual de una review es de su autor, no de CajuEat ni del restaurante — usarlo tiene los mismos límites de cualquier contenido de terceros (nunca reproducir extensamente, resumir en vez de copiar).

---

# Comportamiento

1. Para un restaurante ya vinculado a Google Places (`googlePlaceId`, de la integración existente), el mismo flujo de "Refrescar desde Google" que ya existe en Admin (`refresh-google`) se extiende para traer también `rating` y `userRatingCount` — nunca una llamada nueva separada, mismo Details fetch de siempre.
2. Estos dos valores se guardan como campos propios del restaurante (`googleRating`, `googleRatingCount`), **nunca como un `Source`** — no entran al array que alimenta `computeTrust`.
3. En la ficha del restaurante (SPEC-003), se muestran en una sección claramente separada de "confianza CajuEat" — con atribución a Google visible, nunca mezclados visualmente con el `trustRationale` propio.
4. Reviews individuales de Google (texto): **fuera del alcance de este spec por default**, dado el límite de cacheo real de Google — si en algún momento se decide mostrarlas, tendría que ser en vivo (pedidas en el momento, no persistidas) para no violar los términos de uso, lo cual es una decisión de producto/costo aparte (más llamadas a la API por cada vista de ficha).
5. El refresco de estos dos campos respeta el mismo re-cacheo que ya define Google para Place Details — se refrescan junto con el resto de los datos factuales, no se guardan indefinidamente sin volver a pedirse.

---

# Qué NO hace este spec

No mete el rating de Google en `computeTrust` ni en `trustRationale` — quedan visualmente y funcionalmente separados. No persiste reviews individuales de Google más allá del límite de cacheo real de sus Términos de Servicio. No usa ninguna otra API de reviews (Yelp, TripAdvisor) — el pedido menciona solo Google, este spec no expande el alcance por su cuenta.

---

# Acceptance Criteria

✓ El rating de Google nunca aparece en el cálculo de `trust`/`trustRationale` del restaurante — es un campo separado, mostrado aparte.

✓ Toda vista que muestre el rating de Google incluye atribución visible a Google.

✓ Ninguna review individual de Google se persiste más allá de lo que sus Términos de Servicio permiten cachear.

✓ El rating de Google se refresca junto con el resto de los datos factuales del mismo restaurante (reusa `refresh-google`), nunca un pipeline aparte.

---

# Open Questions

- Si vale la pena, en una iteración futura, mostrar 1-2 reviews de Google **en vivo** (pedidas en el momento de ver la ficha, no guardadas) — implica más costo de API por vista, a evaluar si vale la pena frente al valor real que aporta.
- Cómo se relaciona el rating de Google con el indicador de "novedad" del mapa (SPEC-024) — probablemente no debería disparar el mismo indicador que un post nuevo de Instagram o una promo, son señales de naturaleza distinta (una es "contenido nuevo del local", la otra es "opinión externa"), pero queda a definir en diseño.

---

# Notas para Claude Code

Extender `getPlaceDetails`/`PlaceDetails` en `brain/src/integrations/googlePlaces.ts` (agregar `rating`/`userRatingCount` al fieldMask y al tipo de retorno) en vez de crear una segunda función que pega a la misma API — mismo principio de "una sola integración, no lógica paralela" que ya rige el resto del proyecto. No tocar `computeTrust` ni `Source`/`SourceKind` para este spec — el rating de Google vive como campo propio de `Restaurant`, fuera del sistema de confianza.
