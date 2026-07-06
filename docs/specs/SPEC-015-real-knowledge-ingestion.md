# SPEC-015 — Real Knowledge Ingestion (Foto y Voz)

**Status:** Draft
**Priority:** P1
**Owner:** Product + Claude Code
**Consumers:** Claude Code

Depends On

- SPEC-004 Knowledge Acquisition
- CP-009 Knowledge Acquisition & Brain Feeding

Igual que SPEC-013, este documento fija una porción de arquitectura además de comportamiento, porque la decisión que resuelve (qué canales de captura son viables sin infraestructura nueva) es en sí misma técnica.

---

# Objetivo

Extender Knowledge Capture (SPEC-004) más allá del texto libre — hoy el único canal genuinamente inteligente (`extractNoteKnowledge`, ver `docs/PENDING-FEATURES.md`) — a Foto y Voz, sin sumar un proveedor externo nuevo.

Reel/TikTok, Video y PDF quedan explícitamente fuera de este documento — no porque sean menos importantes, sino porque requieren una decisión de producto distinta (ver "Fuera de alcance").

---

# Contexto: por qué esto ahora es viable

Cuando se implementó Knowledge Capture originalmente, se descartó construir OCR/transcripción por ser "integraciones externas y decisiones de costo que no correspondía tomar unilateralmente". Ese descarte seguía siendo correcto para Reel/TikTok. No es correcto para Foto y Voz:

- **Foto**: el cliente Claude que ya usa el Brain (`brain/src/llm/claudeClient.ts`) acepta imágenes como parte del mismo mensaje que hoy manda texto. No hace falta un proveedor de OCR separado — es el mismo wrapper, el mismo modelo, un content block más.
- **Voz**: el navegador ya expone reconocimiento de voz nativo (Web Speech API) sin costo ni proveedor externo. La transcripción resultante es texto plano, que se procesa exactamente igual que una Nota hoy (`extractNoteKnowledge`).

Ninguno de los dos requiere una cuenta nueva, un contrato nuevo, ni una decisión de costo por request — por eso se pueden especificar y construir ahora, a diferencia de Reel/TikTok.

---

# Foto

## Flujo

Usuario toca "Foto" en Knowledge Capture → elige/toma una imagen (menú, plato, ticket, carta de vinos, fachada) → se envía junto con el catálogo real al Brain, igual que hoy se envía el texto de una Nota.

## Comportamiento del Brain

Grounded, igual que `extractNoteKnowledge`: identifica a cuál restaurante real del catálogo se refiere la foto (o `null` si no aplica), y describe en una oración qué aprendió — basado únicamente en lo que la imagen realmente muestra, nunca inventando un plato o precio que no sea legible.

Si la imagen es ilegible o ambigua, el Brain lo dice explícitamente en vez de adivinar (mismo principio de SPEC-007: reconocer incertidumbre en vez de completar con inferencia no sostenida).

## Qué NO hacer

No hacer OCR estructurado línea por línea del menú (extraer cada plato con su precio) en esta primera pasada — eso es un parser mucho más ambicioso, con su propio costo de mantenimiento (cartas cambian de formato constantemente). Empezar por "qué aprendió el Brain de esta foto, en una oración", igual de honesto que el canal de texto.

---

# Voz

## Flujo

Usuario toca "Voz" → el navegador transcribe localmente con Web Speech API mientras habla → el texto transcripto se muestra editable (el usuario puede corregir antes de enviar — la transcripción automática no es perfecta, especialmente con nombres propios de restaurantes) → se envía como si fuera una Nota.

## Comportamiento del Brain

No hace falta ninguna lógica nueva en el Brain — la voz, una vez transcripta, es texto, y pasa por `extractNoteKnowledge` sin cambios.

## Qué NO hacer

No enviar audio crudo a ningún lado. No queda ninguna grabación — solo el texto transcripto, igual que si el usuario lo hubiera escrito.

## Edge case

Si el navegador no soporta Web Speech API (no todos lo hacen — es inconsistente entre navegadores), el botón de Voz debe degradar con gracia a texto editable vacío en vez de fallar en silencio o quedar como una simulación falsa.

---

# Fuera de alcance (decisión de producto pendiente, no de este documento)

- **Reel/TikTok/Instagram**: requiere scraping de una plataforma de terceros cuyos Términos de Servicio restringen explícitamente esto, o su API oficial (Graph API, con permisos de cuenta business). Es una decisión legal y de costo real, no una decisión técnica — no se resuelve acá.
- **Video/Shorts propios**: requiere extracción de fotogramas + el mismo análisis de Foto, o transcripción de audio del video — viable en teoría con las mismas piezas de este documento, pero no está pedido todavía y agrega complejidad de procesamiento de archivos grandes.
- **PDF** (cartas, guías, rankings): Claude puede procesar PDFs directamente, sin proveedor nuevo — técnicamente cercano a Foto. Se deja fuera de este documento solo por alcance, no por dificultad; candidato natural para una próxima iteración de este mismo spec.

---

# Acceptance Criteria

✓ Una foto real de un menú/plato/ticket produce una respuesta grounded, nunca una plantilla genérica.

✓ El Brain nunca inventa un precio o plato que no sea legible en la imagen.

✓ La voz transcripta pasa por el mismo camino que una Nota — cero lógica duplicada en el Brain.

✓ El usuario puede corregir la transcripción de voz antes de enviarla.

✓ Si la imagen es ilegible o la transcripción falla, el Brain/la UI lo dice explícitamente — nunca una respuesta inventada para disimularlo.

---

# Notas para Claude Code

Antes de escribir código de integración con la API de Claude para imágenes, consultar el skill `claude-api` para la forma exacta de mandar content blocks de imagen — no asumir la forma del payload de memoria.

`extractNoteKnowledge` en `brain/src/llm/claudeClient.ts` es el punto de partida más cercano para la función de Foto — mismo catálogo grounding, mismo esquema de salida (`restaurantId` + `learned`), solo cambia el tipo de contenido del mensaje enviado a Claude.

No implementar todavía — este documento es la especificación a validar con Producto antes de tocar código.
