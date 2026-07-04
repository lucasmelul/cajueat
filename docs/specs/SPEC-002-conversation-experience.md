# SPEC-002 — Conversation Experience

**Status:** Draft
**Priority:** P0
**Owner:** Product
**Consumers:** Claude Design, Claude Code

---

# Objetivo

Definir el comportamiento completo del sistema conversacional de CajuEat.

La conversación es la interfaz principal del Brain.

Todo debería poder resolverse conversando.

---

# Principios

Conversación primero.

UI después.

---

No existen comandos.

Existe lenguaje natural.

---

El usuario nunca aprende comandos.

El Brain aprende al usuario.

---

# Arquitectura Conceptual

Usuario

↓

Conversation Session

↓

Brain

↓

Memory

↓

Knowledge Graph

↓

Recommendation Engine

↓

Respuesta

---

La UI nunca contiene lógica.

---

# Tipos de Mensajes

## Usuario

Texto.

---

Voz.

---

Imagen.

---

Video.

---

Reel.

---

Link.

---

Ubicación.

---

Documento.

---

## Brain

Texto.

Restaurant Cards.

Comparison Cards.

Collection Cards.

Plan Cards.

Questions.

Maps.

Actions.

---

# Inicio de Conversación

Puede comenzar desde:

Prompt Bar.

↓

Restaurant.

↓

Collection.

↓

Notification.

↓

Voice.

↓

Share Sheet.

↓

Widget futuro.

---

# Estados

Idle

↓

Listening

↓

Thinking

↓

Streaming

↓

Interactive

↓

Waiting

↓

Finished

---

# Streaming

Las respuestas nunca aparecen completas.

Siempre progresivamente.

El usuario debe sentir que el Brain está razonando.

---

# Context Window

La conversación recuerda.

Tema.

↓

Restaurante.

↓

Barrio.

↓

Presupuesto.

↓

Compañía.

↓

Objetivo.

↓

Preferencias.

↓

Memoria relevante.

---

No vuelve a preguntar.

---

# Cambio de Tema

El Brain detecta.

Ejemplo.

Usuario.

Quiero sushi.

↓

Cinco mensajes después.

↓

¿Cuánto cuesta ChatGPT Plus?

↓

Nuevo contexto.

---

# Tipos de Conversaciones

## Descubrimiento

Quiero comer.

---

## Comparación

¿Cuál elegirías?

---

## Planeamiento

Organizame el sábado.

---

## Enseñanza

Quiero enseñarte algo.

---

## Corrección

Eso está mal.

---

## Conversación Casual

¿Qué pedirías vos?

---

## Aprendizaje

Me encantó ese restaurante.

---

# Respuestas

Siempre deben producir una acción.

Ejemplo.

Te recomiendo XXXXX.

↓

Abrir restaurante.

---

Nunca terminar únicamente con texto.

---

# Acciones Inline

Guardar.

Comparar.

Cómo llegar.

Agregar al plan.

Preguntar.

Compartir.

---

# Preguntas

Solo cuando agregan valor.

Nunca preguntar por rutina.

---

Mal ejemplo.

¿En qué barrio estás?

Cuando el GPS ya lo sabe.

---

Buen ejemplo.

¿Es para una cita o una salida con amigos?

---

# Longitud

Ideal.

50-150 palabras.

---

Nunca responder con páginas de texto.

---

Si el usuario pide profundidad.

Expandir.

---

# Personalidad

Experto.

Curioso.

Natural.

Humilde.

Nunca arrogante.

Nunca marketinero.

Nunca exagerado.

---

# Incertidumbre

Si no sabe.

Debe decirlo.

Y explicar.

---

# Conversaciones Multimodales

Usuario envía:

Reel.

↓

Brain responde.

↓

Usuario habla.

↓

Brain pregunta.

↓

Usuario comparte foto.

↓

Todo pertenece a una única conversación.

---

# Share Sheet

Desde Instagram.

↓

Compartir.

↓

CajuEat.

↓

Conversation abierta automáticamente.

---

# Restaurant Context

Si el usuario conversa desde una ficha.

El Brain ya conoce el restaurante.

Nunca vuelve a preguntar.

---

# Follow-ups

El Brain propone naturalmente.

Ejemplo.

Ya que vas ahí.

¿Querés que te recomiende un buen bar cerca?

---

# Memory

Toda conversación puede producir memoria.

Pero no toda conversación debe hacerlo.

---

# Safety

Nunca inventar.

Nunca ocultar incertidumbre.

Nunca asumir visitas.

---

# Errores

No entiendo.

↓

Pedir aclaración.

---

No existe restaurante.

↓

Proponer similares.

---

Contenido ambiguo.

↓

Preguntar.

---

# Analytics

Conversation Started

Conversation Finished

Message Sent

Voice Used

Image Used

Share Imported

Recommendation Accepted

Recommendation Ignored

Memory Created

Knowledge Updated

---

# Performance

Primera respuesta.

< 2 segundos.

Streaming inmediato.

---

# Acceptance Criteria

✓ El usuario siente que conversa con una persona.

✓ El Brain recuerda el contexto.

✓ Nunca hace preguntas redundantes.

✓ Toda conversación genera acciones.

✓ Puede mezclarse texto, voz, imágenes y links.

✓ La conversación alimenta automáticamente al Brain.

---

# Notas para Claude Design

La conversación debe parecer un híbrido entre:

- iMessage
- Perplexity
- Arc Search

No copiar ChatGPT.

Debe sentirse como una conversación con un concierge gastronómico.

---

# Notas para Claude Code

Separar completamente:

Conversation UI

↓

Conversation Session

↓

Conversation Context

↓

Memory Service

↓

Recommendation Service

↓

Knowledge Service

↓

Brain Orchestrator

Toda la lógica de negocio debe vivir fuera de la UI.

Las respuestas deben construirse mediante composición de componentes (Cards, Map, Actions, etc.), no únicamente mediante texto.
