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
- [ ] Reel/TikTok sigue como simulación honesta y explícitamente fuera de alcance de SPEC-015 — requiere scraping/API oficial de una plataforma de terceros, una decisión legal y de costo real, no técnica.
- [ ] El input de link (Reel/TikTok) ni siquiera envía el texto pegado al Brain hoy — el botón "Enviar" llama a `start('link')` sin pasar el valor de `link`. No se corrige hasta resolver el punto anterior — hoy no hay nada real que hacer con ese link.
- [ ] Entry points del spec sin cubrir: compartir desde el Share Sheet nativo del OS, y captura "desde la conversación" (que mencionar un lugar al chatear quede grabado como aporte).
- [x] Texto libre ("Nota") — resuelto, ver abajo.
- [x] Foto y Voz ([SPEC-015](specs/SPEC-015-real-knowledge-ingestion.md)) — resuelto, ver abajo.

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
- [x] Identidad anónima server-side + "Guardá tu Brain" (teléfono + OTP) — resuelto, ver abajo.

### SPEC-014 — Compare Experience (nueva)
- [x] Comparar 2-3 restaurantes con una conclusión real (nunca una tabla) — resuelto, ver abajo.

### SPEC-016 — Notifications (nueva)
- [ ] Especificado, no implementado: seis tipos de notificación (recomendaciones, recordatorios, cambios importantes, nuevos lugares, feedback pendiente, eventos), todos reusando lógica que el Recommendation/Trust Engine ya calculan — lo que falta es 100% infraestructura de entrega (push real), no lógica de negocio. Depende explícitamente de SPEC-013 (necesita una identidad server-side estable para atar una subscription). El service worker de `vite-plugin-pwa` hoy solo cachea/instala, no maneja push. Ver [SPEC-016](specs/SPEC-016-notifications.md).
- Planning (CP-071) quedó deliberadamente sin especificar — no se ve útil para el uso actual de la app.

### SPEC-017 — Curators & Sources (nueva)
- [x] Curador como Source Entity con reputación real por dominio (cocina), recalculada solo con evidencia real — resuelto, ver abajo.

### SPEC-018 — Admin CMS (nueva)
- [x] CMS como "otro cliente del Brain" (nunca lógica paralela), con un tercer nivel de identidad (allowlist de operadores) — resuelto, ver abajo.

### Estructural / fuera de un spec puntual
- [x] Multi-tenant real por `userId` anónimo (antes un solo usuario `u1` hardcodeado) — resuelto vía SPEC-013, ver abajo. Sigue sin login tradicional (contraseña/email) por decisión de producto explícita — identidad diferida, no ausente.
- [ ] Persistencia en un JSON file, no en una base de datos real (decisión de scope explícita, ver el plan original).
- [ ] PRD-015 (Planning Engine): sin spec ni implementación, deliberadamente pospuesto por decisión de producto — no se lo considera útil para el uso actual de la app.

## Resueltos

- **2026-07-05** — Nota de texto libre en Knowledge Capture ahora es genuinamente Claude-backed (`extractNoteKnowledge`), en vez de una respuesta plantilla para cualquier tipo de aporte. Commit `480a371`.
- **2026-07-05** — Bug: el `sub` de la Brain Card no pasaba por `highlightText()`, mostrando `**asteriscos**` literales en vez de negrita. Commit `347ba18`.
- **2026-07-05** — Context Chips "Para una cita", "Trabajar" y "Guardados" ahora filtran de verdad contra el Recommendation Engine (antes eran puramente visuales). Commit `6c43a31`.
- **2026-07-05** — Catálogo ampliado de 3 a 6 restaurantes (Nonna Emma, Terraza Norte, Brote), mismo formato hand-authored. Da variedad real a diversify/search/trust (ahora sí aparece un ejemplo de confianza "low") y más de una opción por filtro de contexto. Sigue sin ser ingesta real de fuentes externas. Commit `3af1405`.
- **2026-07-05** — Trust Engine ahora detecta contradicciones reales entre fuentes (`claim` + ejes de contradicción determinísticos) y las nombra en el rationale en vez de promediarlas en silencio; Consensus ya existía de forma implícita (diversidad de `kind`), quedó documentado como tal. De paso se descubrió que `trustRationale` se calculaba pero nunca llegaba a la UI — ahora se muestra en la ficha del restaurante. Anafe quedó con una contradicción real de ejemplo (ahora "Señales en conflicto"). Commit `55947e1`.
- **2026-07-05** — Onboarding (PRD-010) implementado: Bienvenida → 3 preguntas opcionales (chip-based) → Living Map. Las respuestas se guardan como DNA tags reales y ya afectan recomendaciones reales (verificado: elegir "Palermo" hizo que la próxima Brain Card mencionara "está en tu barrio"). No toca el método de autenticación (sigue como decisión abierta separada). Commit `15015af`.
- **2026-07-05** — SPEC-014 (Compare) implementado: nueva función `compareRestaurants` en `claudeClient.ts` + ruta `/api/compare`, wireada al chip "Comparar con otro" en Conversation. Siempre termina en una conclusión (`recommendedId` real o `null` honesto si no hay evidencia suficiente), nunca una tabla. Verificado con `curl` contra el Brain real en dos casos (empate y ganador claro). Commit `5d22df7`.
- **2026-07-05** — SPEC-015 (Foto y Voz) implementado: Foto usa el input multimodal nativo de Claude (`extractPhotoKnowledge`, sin proveedor de OCR) para identificar el restaurante y resumir solo lo legible en la imagen; Voz usa la Web Speech API del navegador para transcribir y reusa el mismo `extractNoteKnowledge` que Nota. Ambos flujos verificados en vivo contra el Brain real (Voz con una nota hablada sobre Anafe, Foto con una imagen de menú sintetizada para Osaka), con resúmenes correctos y puntos otorgados. Commit `5d22df7`.
- **2026-07-06** — SPEC-013 (Deferred Identity) implementado: `memoryStore.ts` pasó de un usuario `u1` hardcodeado a estar keyeado por `userId` (Map de filas independientes); un nuevo `identityMiddleware` lee `X-Caju-User-Id` y lo adjunta a `req.userId` sin bloquear rutas de solo catálogo; rutas que leen/escriben memoria personal (`saved`, `dna`, `collections`, mensajes, capturas) exigen el header vía `requireUserId` (400 si falta). El cliente PWA genera y guarda un UUID anónimo en `localStorage` (`getAnonId()`) y lo manda en cada request — nunca lo emite el Brain. Conversation y Knowledge Capture (los dos únicos flujos con costo real de Claude) quedaron detrás de un rate limit diario por usuario anónimo (15 mensajes / 8 capturas); al agotarse, el Brain responde `429 { error: 'anon_limit_reached', requiresSync: true }` en vez de dejar pasar costo ilimitado sin ninguna identidad detrás. "Guardá tu Brain" en Profile adjunta un teléfono a la fila anónima existente vía OTP de un solo uso (sin vendor de SMS conectado todavía — el código se devuelve directo en la respuesta para que el flujo sea end-to-end testeable); un teléfono ya vinculado a otro `userId` vuelve como conflicto explícito en vez de fusionar filas en silencio. Verificado con `curl` (aislamiento de `saved`/`dna`/`collections` entre dos `userId`, el límite 15→429, y las tres ramas de OTP: código incorrecto, código correcto, conflicto de teléfono) y en el navegador real (flujo completo de "Guardá tu Brain" hasta "Tu Brain está protegido — sincronizado con +541155667788."). El mecanismo real de envío de SMS/WhatsApp sigue como decisión abierta (ver product-decisions.md). Commit `b4a9e7e`.
- **2026-07-06** — SPEC-018 (Admin CMS) implementado: prerequisito real resuelto primero — el catálogo pasó de `RAW_RESTAURANTS` hardcodeado en TypeScript a `brain/data/catalog.json` (mismo patrón de `memoryStore.ts`; `catalogSeed.ts` solo bootstrapea el archivo la primera vez), con `createRestaurant`/`updateRestaurant`/`addSourceToRestaurant` nuevos y `trust`/`trustRationale` recalculados en cada lectura en vez de cachearse (ya no es seguro cachear una vez que el CMS puede escribir). Tercer nivel de identidad vía `requireOperator` (header `X-Caju-Operator-Token` contra `ADMIN_TOKEN`), completamente separado de la identidad de usuario final (SPEC-013) — nunca alcanza con un teléfono verificado común. Nuevas rutas `/api/admin/*`: overview de solo lectura del catálogo completo con confianza y rationale (algo que ningún usuario final ve junto), alta/edición directa de restaurantes, y `/api/admin/analyze` + `/api/admin/restaurants/:id/sources` para el caso "Analizá esta lista/@curador" — un operador pega texto real ya leído (nunca se scrapea Instagram/TikTok), `analyzeCuratorContent` (nueva función en `claudeClient.ts`, mismo patrón grounded que `extractNoteKnowledge`) identifica qué restaurantes reales menciona con qué claim y peso sugerido, y **nunca se aplica solo** — el operador confirma sugerencia por sugerencia (Confirmación Inteligente, CP-009) antes de que se sume como Source real. Fusionar entidades quedó deliberadamente sin implementar (el propio spec lo deja como Open Question sin mecanismo resuelto). UI mínima nueva en `/admin` dentro de la misma PWA (gate por token, tabla de confianza, analizar+confirmar, alta de restaurante) — excluida del gate de Onboarding, ya que un operador no es un usuario final. Verificado con `curl` (auth 401 sin token/con token incorrecto, alta y edición de restaurantes, análisis grounded que correctamente distinguió a Osaka/Anafe reales de "La Fonda del Puerto" inventado) y en el navegador real (login con token, tabla de confianza completa incluida la contradicción de Anafe, análisis de un texto sobre Cuervo Café que subió su confianza de `mid` a `high` al confirmar la fuente en vivo, alta de un restaurante nuevo reflejada al instante en la tabla). SPEC-017 (Curators & Sources) queda desbloqueado para una futura sesión. Commit `589fe5a`.
- **2026-07-06** — SPEC-017 (Curators & Sources) implementado: un curador deja de ser un string repetido en `sources[]` y pasa a ser una entidad real (`brain/src/curators/curatorStore.ts`, JSON-persistido igual que `memoryStore.ts`/`catalogStore.ts`), identificada por el mismo handle que ya se usaba como `Source.name` — sin ID nuevo, sin migración. La reputación se trackea por dominio (cocina) vía `{ sustained, contradicted }` y nunca se asigna una vez: `getCatalog()` ahora reemplaza el `weight` de cada fuente `curator` por su reputación efectiva (`getEffectiveWeight`) antes de pasarlas a `computeTrust`, y `addSourceToRestaurant` decide si una fuente nueva sostiene o contradice reusando exactamente `detectContradiction` (ahora exportada de `trustEngine.ts`) y el chequeo de diversidad de `kind` que ya existía — nunca lógica paralela. Un curador sin corroboración real (ni sostenida ni contradicha) nunca mueve su reputación por una afirmación aislada. Se hizo un backfill único desde el catálogo semilla al primer boot: `@buenospaladaires` arrancó con evidencia sostenida real en Nikkei/Café de especialidad/Trattoria italiana, `@salt_argentina` con la contradicción real de Anafe en Bodegón moderno. Bug real encontrado y corregido durante la verificación en vivo: la UI de "Analizar contenido" inicialmente atribuía toda fuente confirmada a un placeholder genérico ("Operador (contenido analizado)") en vez del handle real del curador pegado — mezclaba la reputación de curadores distintos en un mismo bucket sin sentido; se agregó un campo obligatorio de handle en el Admin CMS antes de poder analizar o confirmar. Verificado con `curl` y en el navegador: el peso efectivo de `@buenospaladaires` en Osaka bajó de `strong` (hardcodeado) a `medium` por reputación insuficiente, y volvió a `strong` tras 3 confirmaciones netas sostenidas; un handle de prueba nuevo (`@test_verificacion`) apareció correctamente con su propio historial aislado tras confirmar una sugerencia real desde el Admin CMS. Reputación visible solo a operadores (no a usuarios finales) y umbral exacto de sostenidas/contradichas quedan como decisiones de implementación explícitas, no de producto (el propio spec las deja como Open Questions sin resolver); "curador vs. curador" contradictorio tampoco se resuelve acá — mismo principio de SPEC-007 (nunca elegir arbitrariamente), caso específico pendiente. Commit `PENDING_COMMIT_HASH`.
