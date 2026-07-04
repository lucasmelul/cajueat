# SPEC-004 — Knowledge Acquisition

**Status:** Draft
**Priority:** P0
**Owner:** Product
**Consumers:** Claude Design, Claude Code

---

# Objetivo

Definir el comportamiento completo del sistema mediante el cual el Brain aprende nuevo conocimiento.

Este documento describe uno de los diferenciales más importantes de CajuEat.

El objetivo es que alimentar el Brain sea tan fácil como compartir un Reel por WhatsApp.

---

# Filosofía

El usuario nunca "carga datos".

Simplemente comparte algo interesante.

El Brain hace todo el trabajo difícil.

---

# Principios

## Zero Friction

Compartir debe demorar menos de 10 segundos.

---

## Conversation First

No existen formularios.

---

## Automatic Extraction

El Brain intenta entender todo automáticamente.

---

## Human Validation Only When Needed

Solo pregunta cuando existe incertidumbre.

---

# Entry Points

## Share Sheet (Principal)

Instagram

↓

Compartir

↓

CajuEat

---

## Desde conversación

"Quiero enseñarte algo."

---

## Desde cámara

Foto.

---

## Desde galería

Imagen.

Video.

---

## Copiar/Pegar URL

---

## Texto

---

## Voz

---

## PDF

---

# Supported Sources MVP

Instagram Reel

Instagram Post

Instagram Profile

Google Maps Link

Texto

Imagen

Voz

---

# Supported Sources Future

TikTok

YouTube

Threads

X

Newsletters

PDFs

Spotify Podcasts

Blogs

RSS

Email

---

# UX Flow

Usuario comparte.

↓

CajuEat abre automáticamente.

↓

Loader corto.

↓

Brain analiza.

↓

Brain resume.

↓

Confirma.

↓

Aprende.

↓

Listo.

---

Tiempo objetivo.

< 15 segundos.

---

# Loader

Nunca mostrar.

"Procesando..."

Mostrar algo útil.

Ejemplo.

"Estoy identificando restaurantes..."

↓

"Encontré dos lugares..."

↓

"Analizando recomendaciones..."

El Brain debe sentirse vivo.

---

# Extraction Pipeline (Conceptual)

Contenido

↓

Parser

↓

Entity Extraction

↓

Knowledge Matching

↓

Conflict Detection

↓

Confidence Evaluation

↓

Knowledge Graph Update

↓

Memory Update

---

Claude Code decidirá la implementación.

---

# Qué intenta detectar

## Restaurantes

---

## Platos

---

## Chefs

---

## Ingredientes

---

## Bebidas

---

## Barrios

---

## Opiniones

---

## Rankings

---

## Recomendaciones

---

## Experiencias

---

## Horarios

---

## Precios

---

## Eventos

---

# Matching

Si el restaurante ya existe.

Actualizar.

Nunca duplicar.

---

Si no existe.

Crear nueva entidad.

---

# Ambigüedad

Si aparecen dos candidatos.

El Brain pregunta.

Ejemplo.

"¿Te referís a XXXXX o XXXXX?"

Nunca inventa.

---

# Conflict Resolution

Ejemplo.

Instagram dice:

Abierto.

Google dice:

Cerrado.

↓

El Brain.

No elige.

↓

Busca más evidencia.

---

# Brain Summary

Antes de aprender.

Siempre resume.

Ejemplo.

Encontré:

• 2 restaurantes

• 7 platos

• 1 chef

• 3 recomendaciones

¿Los agrego?

---

# Confirmación

Idealmente.

Un solo botón.

↓

Agregar conocimiento.

---

# Preguntas

Solo si hacen falta.

Ejemplos.

"No pude identificar este restaurante."

↓

"¿Cuál es?"

---

Nunca formularios.

---

# Voice Import

Usuario.

"Hoy fui a..."

↓

Brain.

Hace preguntas inteligentes.

↓

Aprende.

---

# Image Import

Foto.

↓

OCR.

↓

Entity Detection.

↓

Knowledge.

---

# Reel Import

Idealmente.

Extraer.

Audio.

Texto.

Comentarios (futuro).

Descripción.

Lugar.

---

# Learning Feedback

Luego del proceso.

El Brain comunica.

Aprendí:

• Menú actualizado.

• Nuevo plato.

• Cambió el chef.

• Confirmé horario.

No mostrar detalles técnicos.

---

# Failure Cases

No pude abrir el contenido.

↓

Explicar.

---

No encontré restaurantes.

↓

Preguntar.

---

Contenido privado.

↓

Explicar limitación.

---

# Analytics

Import Started

Import Finished

Entities Extracted

Questions Asked

Knowledge Added

Knowledge Updated

Import Failed

Average Processing Time

---

# Performance Goals

Apertura.

<500 ms.

Primer feedback.

<2 segundos.

Proceso completo.

<15 segundos.

---

# Accessibility

Todo el flujo debe poder hacerse.

Solo con voz.

---

Solo con teclado.

---

Solo con lector de pantalla.

---

# Acceptance Criteria

✓ Compartir desde Instagram requiere un solo paso.

✓ El Brain resume antes de guardar.

✓ Nunca aparecen formularios.

✓ Solo pregunta cuando realmente no entiende.

✓ Todo termina integrado al Knowledge Graph.

✓ El usuario siente que le enseñó algo al Brain.

---

# Open Questions

Importación masiva.

Sincronización automática.

Conectores oficiales.

Importación de listas.

Importación de Google Saved Places.

---

# Notas para Claude Design

Inspirarse en la experiencia de compartir contenido de iOS.

La interacción debe sentirse instantánea.

Nunca administrativa.

Nunca mostrar conceptos técnicos como:

- entidades
- embeddings
- knowledge graph
- extracción

El usuario únicamente siente que "Caju aprendió algo nuevo".

---

# Notas para Claude Code

Este módulo probablemente sea uno de los más importantes del proyecto.

Diseñar como un pipeline completamente desacoplado.

Cada etapa debe poder reemplazarse sin afectar las demás.

Ejemplo conceptual:

Input Adapter

↓

Content Parser

↓

AI Extractor

↓

Normalizer

↓

Entity Resolver

↓

Knowledge Validator

↓

Trust Engine

↓

Knowledge Graph

↓

Memory Engine

↓

Event Bus

Todo debe ser orientado a eventos para permitir re-procesamiento, nuevas versiones de modelos de IA y nuevos importadores sin reescribir el sistema.
