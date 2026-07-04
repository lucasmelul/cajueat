# PRD-011 — Recommendation Engine

**Status:** Draft
**Priority:** P0
**Owner:** Product

Depends On

- Context Engine
- Memory Engine
- Trust Engine
- Discovery Engine

---

# Objetivo

Construir el sistema que decide qué recomendar.

Este es el corazón del Brain.

Todo el producto existe para alimentar este motor.

---

# Problema

Encontrar restaurantes es fácil.

Elegir el correcto para una persona, en un contexto específico, es extremadamente difícil.

---

# Filosofía

El Recommendation Engine no busca responder.

Busca tomar la mejor decisión posible.

---

# Inputs

Usuario.

↓

Contexto.

↓

Memoria.

↓

Ubicación.

↓

Knowledge Graph.

↓

Trust.

↓

Tiempo.

↓

Clima.

↓

Disponibilidad.

↓

Preferencias.

---

# Outputs

Restaurant.

Dish.

Collection.

Plan.

Barrio.

Experiencia.

Comparación.

---

# Pipeline

Generar candidatos.

↓

Eliminar irrelevantes.

↓

Rankear.

↓

Diversificar.

↓

Explicar.

↓

Aprender.

---

# Restricciones

Nunca recomendar solamente por:

- rating
- distancia
- popularidad

---

# Acceptance Criteria

✓ Explicaciones.

✓ Personalización.

✓ Contexto.

✓ Diversidad.

✓ Aprendizaje continuo.
