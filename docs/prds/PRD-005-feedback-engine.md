# PRD-005 — Feedback Engine

**Status:** Draft
**Priority:** P0
**Owner:** Product

Depends On

- PRD-003 Restaurant Experience
- PRD-004 Knowledge Acquisition
- CP-010 Gamification
- CP-055 Feedback Engine

---

# Objetivo

Construir el principal mecanismo de aprendizaje del Brain.

El objetivo NO es obtener reviews.

El objetivo es aprender.

Cada feedback debe mejorar las recomendaciones futuras.

---

# Problema

Las reviews tradicionales tienen muchos problemas.

- largas;
- difíciles de escribir;
- subjetivas;
- poco estructuradas;
- muy pocas personas las completan.

Queremos cambiar completamente ese paradigma.

---

# Hipótesis

Si dar feedback demora menos de 30 segundos.

Y además resulta entretenido.

Entonces muchas más personas colaborarán.

Y el Brain aprenderá muchísimo más.

---

# Filosofía

El usuario nunca escribe una review.

Simplemente conversa.

O responde pequeñas preguntas.

---

# Objetivos

## Aprender

## Validar

## Corregir

## Enriquecer

## Construir memoria

---

# Cuándo aparece

Idealmente.

Después de una visita.

Nunca antes.

---

# Cómo detectar una visita

- confirmación manual;
- conversación;
- navegación iniciada;
- check-in futuro;
- reserva futura.

---

# Modalidades

## Conversación

"¿Qué te pareció?"

---

## Quick Feedback

Cards.

Tap.

Swipe.

Emoji.

---

## Quiz

Micro preguntas.

---

## Voz

El usuario habla.

El Brain interpreta.

---

# Principio

Nunca más de cinco preguntas.

Idealmente tres.

---

# Preguntas Dinámicas

No existe un formulario fijo.

El Brain decide.

---

Ejemplo

Ya conoce el ambiente.

No vuelve a preguntarlo.

---

Conoce poco el menú.

Pregunta platos.

---

Existe contradicción.

Pregunta específicamente eso.

---

# Tipos de Preguntas

## Volverías

---

## Mejor plato

---

## Tiempo de espera

---

## Atención

---

## Ambiente

---

## Precio

---

## Ruido

---

## Recomendación

---

## Qué evitar

---

## Qué pedir

---

# Cards

Ejemplo.

¿Cuánto esperaste?

○ Nada

○ Poco

○ Normal

○ Mucho

---

Swipe.

↓

Siguiente.

---

# Conversación

Usuario.

"La carbonara fue increíble."

↓

Brain.

Aprende.

No obliga a completar nada.

---

# Feedback Negativo

También es extremadamente valioso.

No penaliza.

Enseña.

---

# Caju Points

Cada feedback útil genera puntos.

No todos valen igual.

---

# Calidad

Un feedback muy detallado.

↓

Más valor.

---

Información repetida.

↓

Poco valor.

---

# Aprendizaje

Cada respuesta puede modificar.

Restaurant.

↓

Dish.

↓

Experience.

↓

Memory.

↓

Trust.

↓

Recommendation.

---

# Casos

## Caso 1

Tres preguntas.

↓

Listo.

---

## Caso 2

El usuario habla un minuto.

↓

Brain aprende muchísimo.

---

## Caso 3

El usuario no quiere responder.

↓

No insistir.

---

# UX

Debe sentirse divertido.

No administrativo.

---

# Edge Cases

El usuario cambia de opinión.

↓

Actualizar.

---

Restaurant cerró.

↓

Aprender.

---

No recuerda.

↓

Permitir omitir.

---

# Métricas

Feedback completado.

Tiempo promedio.

Aprendizajes generados.

Preguntas omitidas.

Calidad.

---

# Acceptance Criteria

✓ Feedback menor a 30 segundos.

✓ Nunca formularios.

✓ Brain adapta preguntas.

✓ Cada respuesta mejora conocimiento.

✓ El usuario entiende que ayudó al Brain.

---

# Futuro

Feedback por voz.

Feedback automático.

Fotos.

Video.

Sensores.

Tickets.

---

# Notas para Claude Design

Inspirarse más en Tinder y Duolingo que en Google Reviews.

Muchísimo swipe.

Muy poco texto.

Sensación de progreso constante.

---

# Notas para Claude Code

Separar:

Feedback Session

↓

Question Generator

↓

Knowledge Extractor

↓

Memory Update

↓

Trust Update

↓

Reward Engine

Cada componente debe poder evolucionar independientemente.
