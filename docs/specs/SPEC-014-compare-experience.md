# SPEC-014 — Compare Experience

**Status:** Draft
**Priority:** P1
**Owner:** Product
**Consumers:** Claude Design, Claude Code

Depends On

- CP-052 Restaurant Comparison Engine
- SPEC-002 Conversation Experience
- SPEC-005 Recommendation Engine
- SPEC-007 Trust Engine

Este documento reemplaza a PRD-012 (Compare), que quedó sin contenido en la consolidación original. Se recupera acá a partir de CP-052, el único documento previo con sustancia real sobre esta feature.

---

# Objetivo

Definir cómo el Brain ayuda a elegir entre alternativas que el usuario ya identificó.

Comparar no es el primer paso del descubrimiento — es el último. El usuario llega acá cuando ya redujo sus opciones a 2 o 3 y necesita un empujón para decidir, no una lista más larga.

---

# Filosofía

No queremos tablas.

Queremos criterio.

Una tabla le devuelve el trabajo al usuario. Un criterio se lo saca de encima.

---

# Cuándo aparece

Comparar nunca es una pantalla que el usuario busca activamente en un menú — aparece donde ya está pensando en elegir:

- Dentro de una Conversación, cuando el Brain ya propuso 2+ restaurantes (el chip "Comparar con otro" ya existe hoy en las respuestas de Conversation — este spec le da un destino real, hoy no hace nada distinto de una recomendación más).
- Desde la Ficha de un restaurante (SPEC-003), como una acción secundaria: "Comparar con otro lugar".
- Desde Guardados o una Colección, seleccionando 2-3 lugares.

Nunca aparece como una pantalla vacía pidiendo elegir de cero — siempre parte de restaurantes que el usuario ya tiene en pantalla.

---

# Entrada

2 o 3 restaurantes. Nunca más de 3 — más que eso deja de ser "ayudar a decidir" y vuelve a ser una lista.

Opcionalmente, una pregunta explícita del usuario ("¿cuál para una primera cita?", "¿vale la pena pagar más por el de Palermo?"). Si no hay pregunta explícita, el Brain infiere el criterio más relevante del contexto (ver SPEC-005 Cold Start).

---

# Variables que el Brain considera

- comida;
- ambiente;
- precio;
- contexto (la ocasión que trajo al usuario hasta acá);
- distancia;
- espera;
- personalidad (ver `personality` del Restaurant Entity Model);
- experiencia previa del usuario (memoria);
- confianza (Trust Engine — nunca comparar dos afirmaciones sin considerar cuánto pesa cada una).

---

# Salida

Siempre existe una conclusión. Nunca solamente una comparación lado a lado.

Formato:

1. Una recomendación (cuál elegir, o "depende de X").
2. El motivo — anclado en variables reales, igual que SPEC-005 (nunca "porque tiene mejor rating").
3. Cuándo elegir la opción NO recomendada — la conclusión reconoce que la otra opción también es válida en otro contexto, no la descarta.

Ejemplo de salida (no UI final, solo el contenido):

> Para una primera cita, Osaka. Es más íntimo y vos ya lo probaste — Terraza Norte es mejor si van a ser más de 4 personas.

---

# Cuando no hay ganador claro

El Brain lo dice explícitamente — nunca fuerza una conclusión que no tiene evidencia detrás. Empata explícitamente y ofrece el criterio que faltaría para desempatar ("si te importa más el precio que el ambiente, elegí X").

Esto es consistente con SPEC-007: ante evidencia insuficiente o contradictoria entre las opciones, el Brain reconoce incertidumbre en vez de elegir arbitrariamente.

---

# UI

No es una pantalla nueva de navegación de nivel superior — vive dentro de Conversation (como una respuesta más, con las cards de los restaurantes comparados) o como un modo dentro de una Colección/Guardados ("Seleccionar para comparar", máximo 3).

No hay una vista de "tabla comparativa" con filas de atributos — eso es exactamente lo que la filosofía de este spec descarta.

---

# Analytics

Compare Started

Compare Completed

Compare Result Accepted (el usuario abrió la opción recomendada)

Compare Result Ignored

---

# Acceptance Criteria

✓ Nunca compara más de 3 restaurantes a la vez.

✓ Siempre entrega una conclusión, nunca solo datos lado a lado.

✓ Reconoce cuándo la opción no recomendada también es válida, y en qué caso.

✓ Nunca ignora el Trust Engine al pesar las señales de cada opción.

✓ Ante evidencia insuficiente, lo dice — no elige arbitrariamente.

---

# Notas para Claude Code

Se apoya en `claudeClient.ts` (mismo wrapper ya usado por `interpretQuery` y `explainRecommendation`) — una nueva función, ej. `compareRestaurants(input: { restaurants: Restaurant[]; question?: string })`, grounded únicamente en los restaurantes reales pasados, nunca inventando un cuarto lugar ni datos fuera de `sources`/`why`/`personality`.

El chip "Comparar con otro" que ya emite `interpretQuery` en Conversation puede seguir siendo generado por el mismo prompt, pero su acción debe pasar a invocar este flujo en vez de simplemente reabrir una recomendación genérica.

No implementar todavía — este documento es la especificación a validar con Producto antes de tocar código.
