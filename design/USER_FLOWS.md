# USER_FLOWS.md

> Flujos clave de la PWA de CajuEat. Cada flujo respeta las decisiones de producto de `/docs`.

---

## F1 — Descubrir sin escribir (Map First)

**Objetivo (SPEC-001):** en < 10s el usuario descubre algo interesante sin escribir nada.

1. Abre la app → splash < 500ms → última posición.
2. Aparece el mapa; el Brain calcula; los pines aparecen progresivamente.
3. Aparece **una** Brain Card: *"Cerca tuyo hay una barra nikkei que encaja con lo que te gustó anoche."*
4. El usuario toca **Ver lugar** → Restaurant Experience. **O** ignora y explora pines.

*Edge:* sin ubicación → Buenos Aires + CTA "Usar mi ubicación"; sin internet → modo offline (último mapa).

## F2 — Del pin a la decisión (Bottom Sheet)

1. Tap en un pin → el pin **crece** con anillo caju → Bottom Sheet en **peek** (resumen).
2. Drag up → **half** (info principal: quick facts, por qué). El mapa sigue visible.
3. Drag up → **full** o CTA → **Restaurant Experience**.
4. Swipe-down / tap-mapa / back → vuelve al mapa.

## F3 — Preguntar al Brain (Conversation First)

1. Desde la Prompt Bar o el tab **Explorar**, el usuario escribe/habla: *"algo tranquilo para hablar, cerca"*.
2. El Brain "piensa" (mark + 3 puntos) y responde **corto, con criterio** + 2-3 RestaurantCards + chips de seguimiento.
3. El usuario toca una card → Restaurant Experience, **o** un chip (*"¿cuál es más tranquilo?"*) → refina.
4. Nunca respuestas tipo blog; siempre accionable.

## F4 — ¿Vale la pena? (Restaurant Experience)

**Objetivo (SPEC-003):** responder *"¿vale la pena ir?"* en < 1 min; lo importante antes del primer scroll.

1. Hero (media pantalla): imagen, nombre (serif), tipo, Trust Meter, precio.
2. **Brain Summary** (≤3 párrafos, serif): qué lo hace especial.
3. **CTA único** (Cómo llegar). Quick Facts (≤6). Qué pedir (por perfil). Brain Tips.
4. **¿Por qué te lo recomendé?** → Source Chips ponderados (Trust Engine).
5. Ideal para / No ideal para. Preguntar al Brain sobre el lugar.
6. CTAs secundarios: guardar, comparar, compartir, agregar a plan, marcar visitado.

*Edge:* sin menú/tiempos → el Brain lo dice, no inventa.

## F5 — Aportar conocimiento (< 30s)

**Objetivo (PRD-004):** aportar conocimiento útil en < 30s, sin formularios.

1. Tab **+** o el **mic** de la Prompt Bar → sheet de captura.
2. Elige **voz / foto / reel-link / nota** (o pega un link).
3. **El Brain analiza** (extrae lugar, platos, señales) — estado con pasos.
4. Confirma solo si hace falta. Muestra **lo que aprendió** (en la voz del Brain) + **Caju Points (+30)**.

## F6 — Feedback post-visita (no es review)

**Objetivo (CP-009):** conversación de 3-4 preguntas; el usuario siente que **ayudó al Brain**.

1. El Brain propone (desde Perfil o notificación): *"¿Cómo estuvo Osaka?"*.
2. 3-4 micro-preguntas con respuestas por chips (barra de progreso).
3. Cierre: **lo que el Brain aprendió de vos** + **Caju Points (+45)**. Sin estrellas, sin encuesta larga.

## F7 — Guardar y volver (Memory)

1. En cualquier card/ficha, tap en el marcador → guardado (relleno caju).
2. Tab **Guardados/Perfil** → lista de guardados + ADN gastronómico + aportes/timeline + puntos.
3. El ADN es **editable**: el usuario corrige cómo lo entiende el Brain.

---

### Reglas transversales de flujo

- Siempre existe una recomendación; el mapa nunca está vacío.
- El usuario puede **decidir sin abandonar el mapa**.
- Toda acción táctil tiene equivalente conversacional.
- Ante incertidumbre, el Brain **lo admite** (Trust First).
