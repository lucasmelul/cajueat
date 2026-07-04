# PRD-002 — Conversation Experience

**Status:** Draft
**Priority:** P0
**Owner:** Product

Depends On

- CP-017 Conversation System
- CP-011 User Memory
- CP-021 Recommendation Engine
- CP-026 Context Engine

---

# Objetivo

Construir la mejor experiencia conversacional gastronómica posible.

La conversación no reemplaza únicamente el buscador.

Reemplaza prácticamente toda la navegación de la aplicación.

El usuario debería sentir que habla con el mejor foodie de Buenos Aires.

---

# Problema

Hoy un usuario debe aprender una aplicación.

Con CajuEat.

La aplicación aprende al usuario.

---

# Hipótesis

Si conversar es más rápido que navegar.

Los usuarios utilizarán el chat incluso cuando exista una interfaz gráfica.

---

# Objetivos

Primarios

- descubrir lugares
- resolver dudas
- comparar opciones
- enseñar al Brain

Secundarios

- alimentar memoria
- reducir fricción
- aumentar confianza

---

# Entradas

Texto.

Voz.

Imagen.

Reel.

TikTok.

YouTube.

Google Maps.

PDF.

URL.

---

# Salidas

Texto.

Restaurant Cards.

Comparaciones.

Mapa.

Colecciones.

Planes.

Preguntas.

Quizzes.

Acciones.

Nunca únicamente texto.

---

# Casos de Uso

## Descubrimiento

Quiero sushi.

---

## Inspiración

Sorprendeme.

---

## Comparación

¿Este o este?

---

## Enseñanza

Quiero enseñarte algo.

---

## Corrección

Ese horario está mal.

---

## Planeamiento

Organizame la cena del sábado.

---

## Explicación

¿Por qué me recomendaste esto?

---

## Seguimiento

¿Qué pedirías ahí?

---

# Principios

## Una sola pregunta por vez

Nunca bombardear.

---

## Inferir antes de preguntar

El Brain intenta deducir.

---

## Conversaciones cortas

No responder con paredes de texto.

---

## Conversaciones accionables

Cada respuesta debe terminar con una acción posible.

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

Waiting

↓

Completed

---

# Streaming

Las respuestas aparecen progresivamente.

El usuario siente que el Brain está pensando.

---

# Contexto

El Brain recuerda.

- restaurante actual
- barrio
- presupuesto
- personas
- clima
- conversación previa

Nunca vuelve a preguntar lo mismo.

---

# Ejemplos

Usuario

Quiero ramen.

↓

Brain

Tengo tres lugares que creo que te van a gustar.

---

Usuario

Algo más tranquilo.

↓

Brain entiende que sigue hablando de ramen.

---

No pregunta nuevamente.

---

# Acciones desde el chat

Abrir restaurante.

Guardar.

Comparar.

Agregar al plan.

Cómo llegar.

Compartir.

Enseñar al Brain.

---

# Casos especiales

El usuario cambia completamente de tema.

↓

El Brain detecta cambio de contexto.

---

# Error

Cuando no entiende.

Pregunta.

Nunca inventa.

---

# Integración con el mapa

Toda conversación puede modificar el Living Map.

Mapa y chat representan la misma sesión.

---

# Métricas

Conversaciones iniciadas.

Conversaciones exitosas.

Tiempo hasta decisión.

Cantidad de aclaraciones.

Uso de voz.

Uso de imágenes.

---

# Acceptance Criteria

✓ Conversaciones naturales.

✓ Memoria contextual.

✓ El usuario nunca repite información.

✓ Las respuestas producen acciones.

✓ El Brain explica cuando es necesario.

---

# Notas para Claude Design

El chat debe sentirse mucho más cercano a iMessage que a ChatGPT.

Muchísimas cards.

Muy poco texto.

El mapa nunca desaparece completamente.

---

# Notas para Claude Code

Separar claramente:

Conversation UI

↓

Conversation Session

↓

Brain

↓

Recommendation Engine

↓

Memory

La conversación nunca debe contener lógica de negocio.
