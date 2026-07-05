# Features Pendientes / Gaps Conocidos

Documento vivo de nivel **implementación** — distinto de [product-decisions.md](product-decisions.md), que registra decisiones de producto abiertas. Acá se anota todo lo que quedó simulado, a medias, o directamente sin construir mientras se implementaba cada spec, para no perderlo de vista.

Convención: cuando un gap se cierra, se mueve a "Resueltos" con fecha y commit, no se borra — así queda historial de qué se decidió postergar y cuándo se resolvió.

## Por spec

### SPEC-001 — Living Map
- [ ] Chips "Cerca" y "Abierto ahora" no filtran de verdad — pasan sin filtrar en el Recommendation Engine. Falta geolocalización real del usuario y datos de horario de apertura por restaurante (no existen en el catálogo hoy).
- [ ] Botones flotantes "Capas" y "Mi ubicación" del mapa no tienen handler — son decorativos.

### SPEC-002 — Conversation Experience
- [ ] Sin streaming: la respuesta del Brain llega completa de una sola vez (spinner → bloque de texto), no token a token como pide el spec.

### SPEC-004 — Knowledge Acquisition
- [ ] Voz, Foto y Reel/TikTok siguen siendo simulaciones honestas (animación falsa + respuesta plantilla). Requieren integrar transcripción de audio, OCR y scraping/parsing de Instagram-TikTok respectivamente — son decisiones de costo e infraestructura externa, no las tomé unilateralmente.
- [ ] El input de link (Reel/TikTok) ni siquiera envía el texto pegado al Brain hoy — el botón "Enviar" llama a `start('link')` sin pasar el valor de `link`. Ligado al punto anterior: no hay nada real que hacer con ese link todavía.
- [ ] Entry points del spec sin cubrir: compartir desde el Share Sheet nativo del OS, y captura "desde la conversación" (que mencionar un lugar al chatear quede grabado como aporte).
- [x] Texto libre ("Nota") — resuelto, ver abajo.

### SPEC-005 — Recommendation Engine
- [ ] Sin señales externas (curadores/foodies) — el catálogo son 6 restaurantes hand-authored (subieron de 3), no hay ingesta real de fuentes (eso es SPEC-004 a nivel de fuente, no de captura de usuario).
- [x] Context Chips con filtro real (date/work/saved) — resuelto, ver abajo.
- [x] Catálogo ampliado de 3 a 6 restaurantes — resuelto, ver abajo.

### SPEC-006 — Memory Engine
- [ ] Solo modela guardados + ADN (tags planos) + puntos + colecciones. Los tipos de memoria más ricos del spec (hábitos, patrones, contextual, temporal) no están implementados.

### SPEC-007 — Trust Engine
- [ ] Consensus y Contradictions (2 de los 6 componentes del spec) no están modelados. El cálculo actual pondera weight/kind/freshness de cada fuente, pero no detecta señales contradictorias entre fuentes ni cuenta consenso real entre curadores independientes.

### Estructural / fuera de un spec puntual
- [ ] Sin autenticación ni multi-usuario — un solo usuario demo hardcodeado (decisión de scope explícita para este pase de implementación).
- [ ] Persistencia en un JSON file, no en una base de datos real (decisión de scope explícita, ver el plan original).
- [ ] PRD-011 a PRD-015 (Compare, Planning, Notifications, Onboarding — Collections ya resuelto en SPEC-009): sin spec ni implementación todavía. Ver "Decisión abierta #6" en [product-decisions.md](product-decisions.md).

## Resueltos

- **2026-07-05** — Nota de texto libre en Knowledge Capture ahora es genuinamente Claude-backed (`extractNoteKnowledge`), en vez de una respuesta plantilla para cualquier tipo de aporte. Commit `480a371`.
- **2026-07-05** — Bug: el `sub` de la Brain Card no pasaba por `highlightText()`, mostrando `**asteriscos**` literales en vez de negrita. Commit `347ba18`.
- **2026-07-05** — Context Chips "Para una cita", "Trabajar" y "Guardados" ahora filtran de verdad contra el Recommendation Engine (antes eran puramente visuales). Commit `6c43a31`.
- **2026-07-05** — Catálogo ampliado de 3 a 6 restaurantes (Nonna Emma, Terraza Norte, Brote), mismo formato hand-authored. Da variedad real a diversify/search/trust (ahora sí aparece un ejemplo de confianza "low") y más de una opción por filtro de contexto. Sigue sin ser ingesta real de fuentes externas. Commit `3af1405`.
