# SPEC-018 — Admin CMS

**Status:** Draft
**Priority:** P1
**Owner:** Product + Claude Code
**Consumers:** Claude Code

Depends On

- PRD-009 Admin CMS
- CP-030 Admin CMS
- CP-034 Operations & Moderation
- SPEC-013 Deferred Identity
- SPEC-017 Curators & Sources

Igual que SPEC-013/015/016/017, este documento fija arquitectura además de comportamiento — es la pieza que faltaba para que SPEC-017 (Curators & Sources) tenga una vía real de ingesta, y hoy no existe ningún cliente administrativo del Brain.

---

# Objetivo

Construir la herramienta interna para hacer crecer el Brain — importar conocimiento, editar entidades, revisar confianza, resolver conflictos.

No es un panel administrativo tradicional. Es otro cliente del Brain, conversacional primero.

---

# Filosofía

El CMS no administra datos.

Administra conocimiento.

Administrar CajuEat debería sentirse como conversar con el Brain — no como llenar formularios en un panel.

---

# Por qué esto ahora

Sin esto, SPEC-017 (Curators & Sources) no tiene ninguna vía real para que el contenido de un curador entre al sistema — hoy la única forma de agregar o corregir algo en el catálogo es editar `brain/src/data/restaurants.ts` a mano y reiniciar el proceso. Ese es, en los hechos, el "Admin CMS" que existe hoy: un editor de texto.

---

# Decisión de arquitectura: otro cliente del Brain, nunca lógica paralela

El CMS no es un servicio ni un backend separado. Es un cliente más de `brain/` — mismas rutas Express, mismo `claudeClient.ts`, mismo Trust/Recommendation/Memory Engine — con dos diferencias:

1. Requiere una capa de autorización propia (ver siguiente sección), distinta de la identidad de usuario final (SPEC-013).
2. Expone operaciones de escritura directa sobre entidades (crear/editar/fusionar restaurantes y curadores) que un usuario final nunca tiene — pero implementadas llamando a las mismas funciones de `memoryStore`/`trustEngine`/`recommendationEngine`, nunca una copia paralela de esa lógica.

## Acceso

Un usuario final anónimo o con teléfono verificado (SPEC-013) no es lo mismo que un operador del equipo. Se necesita un tercer nivel de identidad, separado:

- Alcanza con un allowlist simple (lista de teléfonos/emails del equipo, o un secreto compartido) — no hace falta un sistema de roles/permisos granular para el tamaño de equipo actual. Sobre-construir esto ahora sería ir en contra del principio de "operación mínima" que ya fija CP-034.

## Requisito previo: el catálogo deja de ser código

`getCatalog()` hoy lee `RAW_RESTAURANTS`, un array de TypeScript hardcodeado en el mismo archivo que lo consume. Un CMS que edita restaurantes no puede escribir sobre código fuente en runtime.

Antes de que "Actualizar restaurante" o "Fusionar entidades" tengan sentido, el catálogo necesita moverse a datos reales — mismo patrón que ya existe para la memoria del usuario (`brain/data/memory.json`, ver `memoryStore.ts`): un JSON persistido en disco, no una base de datos nueva todavía. Es el mismo nivel de "suficiente para este pase" que ya se usó ahí.

---

# Casos, mapeados contra lo que ya existe

## "Analizá esta lista" / "Analizá a @buenospaladaires_"
Implementa el punto ciego que dejó SPEC-017: un operador pega el contenido real de un curador (texto, no scraping automático) y el mismo `claudeClient.ts` — una función nueva, con el mismo patrón grounded que `extractNoteKnowledge` — identifica qué restaurantes reales menciona y qué reputación/dominio sugiere, dejando la confirmación final al operador (ver "Confirmación Inteligente" en CP-009: "creo que esto habla de X e Y, ¿es correcto?").

## "Importá este Reel"
Un operador humano copia y pega el texto que ya leyó en un Reel/post público (caption, comentarios) — esto evita por completo el problema de scraping/ToS identificado en SPEC-015, porque no hay ninguna automatización leyendo la plataforma de terceros, solo una persona compartiendo lo que ya vio. Automatizar la lectura directa de Instagram/TikTok sigue fuera de alcance, igual que en SPEC-015.

## "Agregá este restaurante" / "Corregí este horario"
Escritura directa sobre el catálogo (una vez resuelto el punto anterior) — mismo modelo de datos (`Restaurant`, `Source`) que ya existe, sin campos nuevos.

## "Mostrame restaurantes sin menú" / Revisar confianza
Panel de solo lectura sobre lo que el Trust Engine ya calcula — ninguna lógica nueva, solo visibilidad de `trust`/`trustRationale`/`sources` que hoy nadie ve agregado (el usuario final ve un restaurante a la vez, nunca el catálogo completo con sus rationale).

## Resolver conflictos
Vista directa sobre los casos donde `computeTrust` devuelve `'low'` por contradicción (SPEC-007) — el operador ve exactamente qué dos fuentes se contradicen (ya lo dice el `rationale`, ver `trustEngine.ts`) y decide si busca evidencia adicional o corrige una de las dos.

## Fusionar entidades
El caso más delicado — dos restaurantes que resultaron ser el mismo lugar. Fusionar implica reconciliar todo lo que ya referencia el ID que desaparece: `saved`, `collections`, historial de conversación. No es solo borrar un duplicado — ver "Open Questions".

---

# Interfaz

Principalmente conversacional — un chat con el Brain, en modo operador, igual que Conversation (SPEC-002) pero con un system prompt y un esquema de salida distintos (acciones de escritura, no solo respuestas).

Vistas especializadas solo donde agreguen valor real por sobre el chat — ej. una tabla de restaurantes con su nivel de confianza, para escanear de un vistazo, no para editar campo por campo.

---

# Qué NO hacer

No construir formularios enormes.

No construir un sistema de roles/permisos granular todavía — un allowlist simple alcanza (ver "Acceso").

No automatizar moderación de contenido de usuario todavía (spam, abuso) — a la escala actual (unos pocos usuarios reales), es prematuro; CP-034 ya lo marca como algo que debe automatizarse "eventualmente", no desde el día uno.

---

# Acceptance Criteria

✓ El equipo puede alimentar el Brain sin usar formularios complejos.

✓ Todo lo que entra por el CMS termina en el mismo Memory/Trust/Recommendation Engine que usa el usuario final — nunca una base de datos ni una lógica paralela.

✓ Ninguna automatización lee directamente Instagram/TikTok — todo contenido de "Reel"/curador llega porque un humano lo copió.

✓ El operador ve exactamente qué fuentes se contradicen antes de resolver un conflicto — nunca se resuelve en silencio.

✓ El acceso al CMS está separado del acceso de usuario final (SPEC-013) — un ID anónimo o un teléfono verificado de un usuario común nunca alcanza.

---

# Open Questions

- Mecanismo exacto de fusión de entidades: qué pasa con los IDs ya referenciados en `saved`/`collections`/conversaciones de usuarios cuando dos restaurantes se fusionan. No resuelto acá — necesita su propio diseño antes de implementarse.
- Mecanismo exacto del allowlist de operadores (variable de entorno, tabla simple, u otro) — no es una decisión de producto, es de implementación, pero no está tomada.
- Si "aprobar cambios sensibles" (CP-034) requiere doble confirmación humana para algunas acciones (ej. fusionar entidades) o alcanza con que el operador ya sea de confianza por estar en el allowlist.

---

# Notas para Claude Code

No implementar antes de mover el catálogo de `RAW_RESTAURANTS` (TypeScript hardcodeado) a un JSON persistido — es un prerequisito real, no un detalle menor.

Reusar `claudeClient.ts` para la función de "analizar curador/Reel pegado" — mismo patrón que `extractNoteKnowledge`, nunca un cliente de Claude separado para el CMS.

No implementar todavía — este documento es la especificación a validar con Producto antes de tocar código.
