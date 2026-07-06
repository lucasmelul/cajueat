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
- [ ] Foto y Voz especificadas en [SPEC-015](specs/SPEC-015-real-knowledge-ingestion.md) — vía multimodal de Claude (foto) y Web Speech API del navegador (voz), sin proveedor nuevo. Especificado, no implementado.
- [ ] Reel/TikTok sigue como simulación honesta y explícitamente fuera de alcance de SPEC-015 — requiere scraping/API oficial de una plataforma de terceros, una decisión legal y de costo real, no técnica.
- [ ] El input de link (Reel/TikTok) ni siquiera envía el texto pegado al Brain hoy — el botón "Enviar" llama a `start('link')` sin pasar el valor de `link`. No se corrige hasta resolver el punto anterior — hoy no hay nada real que hacer con ese link.
- [ ] Entry points del spec sin cubrir: compartir desde el Share Sheet nativo del OS, y captura "desde la conversación" (que mencionar un lugar al chatear quede grabado como aporte).
- [x] Texto libre ("Nota") — resuelto, ver abajo.

### SPEC-005 — Recommendation Engine
- [ ] Sin señales externas (curadores/foodies) — el catálogo son 6 restaurantes hand-authored (subieron de 3), no hay ingesta real de fuentes (eso es SPEC-004 a nivel de fuente, no de captura de usuario).
- [x] Context Chips con filtro real (date/work/saved) — resuelto, ver abajo.
- [x] Catálogo ampliado de 3 a 6 restaurantes — resuelto, ver abajo.

### SPEC-006 — Memory Engine
- [ ] Solo modela guardados + ADN (tags planos) + puntos + colecciones. Los tipos de memoria más ricos del spec (hábitos, patrones, contextual, temporal) no están implementados.

### SPEC-007 — Trust Engine
- [x] Consensus y Contradictions — resuelto, ver abajo.

### PRD-010 — Onboarding
- [x] Flujo de primer uso (Bienvenida → 2-3 preguntas opcionales → Living Map) — resuelto, ver abajo.
- [ ] El mecanismo exacto de OTP (SMS/WhatsApp/otro) sigue sin definir — sigue siendo la "Decisión abierta #1" en [product-decisions.md](product-decisions.md). El *momento* en que se dispara ya se especificó, ver siguiente punto.

### SPEC-013 — Deferred Identity (nueva)
- [ ] Especificado, no implementado todavía: identidad anónima server-side desde la primera apertura, sin login obligatorio; "Guardar mi Brain" adjunta un teléfono verificado a la fila ya existente en vez de crear una cuenta nueva. Requiere: Memory Engine multi-tenant (hoy asume un único usuario `u1` hardcodeado), IDs de ADN/colecciones pasando de contadores secuenciales a UUIDs, rate limiting anónimo en Conversation/Knowledge Capture (riesgo de costo real de Claude sin ningún gate de identidad). Ver [SPEC-013](specs/SPEC-013-deferred-identity.md).

### SPEC-014 — Compare Experience (nueva)
- [ ] Especificado, no implementado: comparar 2-3 restaurantes que el usuario ya identificó, siempre con una conclusión (nunca una tabla), apoyado en Trust Engine + una nueva función grounded en `claudeClient.ts`. Recupera contenido real de CP-052, ya que PRD-012 (Compare) había quedado sin contenido. Ver [SPEC-014](specs/SPEC-014-compare-experience.md).

### Estructural / fuera de un spec puntual
- [ ] Sin autenticación ni multi-usuario — un solo usuario demo hardcodeado (decisión de scope explícita para este pase de implementación).
- [ ] Persistencia en un JSON file, no en una base de datos real (decisión de scope explícita, ver el plan original).
- [ ] PRD-013/014 (Planning, Notifications — Collections ya resuelto en SPEC-009, Onboarding ya resuelto en PRD-010, Compare ya especificado en SPEC-014): Planning/Notifications siguen sin spec ni implementación. Ver "Decisión abierta #6" en [product-decisions.md](product-decisions.md).

## Resueltos

- **2026-07-05** — Nota de texto libre en Knowledge Capture ahora es genuinamente Claude-backed (`extractNoteKnowledge`), en vez de una respuesta plantilla para cualquier tipo de aporte. Commit `480a371`.
- **2026-07-05** — Bug: el `sub` de la Brain Card no pasaba por `highlightText()`, mostrando `**asteriscos**` literales en vez de negrita. Commit `347ba18`.
- **2026-07-05** — Context Chips "Para una cita", "Trabajar" y "Guardados" ahora filtran de verdad contra el Recommendation Engine (antes eran puramente visuales). Commit `6c43a31`.
- **2026-07-05** — Catálogo ampliado de 3 a 6 restaurantes (Nonna Emma, Terraza Norte, Brote), mismo formato hand-authored. Da variedad real a diversify/search/trust (ahora sí aparece un ejemplo de confianza "low") y más de una opción por filtro de contexto. Sigue sin ser ingesta real de fuentes externas. Commit `3af1405`.
- **2026-07-05** — Trust Engine ahora detecta contradicciones reales entre fuentes (`claim` + ejes de contradicción determinísticos) y las nombra en el rationale en vez de promediarlas en silencio; Consensus ya existía de forma implícita (diversidad de `kind`), quedó documentado como tal. De paso se descubrió que `trustRationale` se calculaba pero nunca llegaba a la UI — ahora se muestra en la ficha del restaurante. Anafe quedó con una contradicción real de ejemplo (ahora "Señales en conflicto"). Commit `55947e1`.
- **2026-07-05** — Onboarding (PRD-010) implementado: Bienvenida → 3 preguntas opcionales (chip-based) → Living Map. Las respuestas se guardan como DNA tags reales y ya afectan recomendaciones reales (verificado: elegir "Palermo" hizo que la próxima Brain Card mencionara "está en tu barrio"). No toca el método de autenticación (sigue como decisión abierta separada). Commit `15015af`.
