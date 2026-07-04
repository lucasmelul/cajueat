# CP-021 — Recommendation Engine

**Estado:** Draft
**Versión:** 1.0
**Owner:** Product
**Consumidores:** Claude Code, Claude Design, Product

---

# Objetivo

Definir cómo el Brain genera recomendaciones.

El Recommendation Engine constituye el corazón operativo del Brain.

Toda interacción del usuario termina, directa o indirectamente, en una recomendación.

---

# Resumen Ejecutivo

El Recommendation Engine no busca responder preguntas.

Busca tomar decisiones.

Su objetivo es responder siempre:

> ¿Qué recomendaría si realmente conociera a esta persona?

---

# Filosofía

No existen recomendaciones universales.

Toda recomendación depende del contexto.

La mejor parrilla de Buenos Aires puede ser una pésima recomendación si el usuario busca un brunch para trabajar.

---

# Principios

## Contexto antes que Popularidad

---

## Calidad antes que Cantidad

---

## Explicabilidad obligatoria

---

## Personalización profunda

---

## Evolución continua

---

# Entradas

El motor utiliza cientos de señales.

Ejemplos.

- ubicación;
- clima;
- horario;
- presupuesto;
- compañía;
- historial;
- gustos;
- restaurantes guardados;
- experiencias;
- conocimiento del Brain;
- confianza;
- disponibilidad.

---

# Tipos de Recomendación

## Descubrimiento

No sabe qué quiere.

---

## Confirmación

Ya eligió.

El Brain valida.

---

## Comparación

Debe elegir entre varias opciones.

---

## Exploración

Busca algo nuevo.

---

## Recomendación Proactiva

El usuario no preguntó.

El Brain igualmente detecta una oportunidad.

---

# Ranking Inicial

El Recommendation Engine genera muchas posibilidades.

Luego otro sistema las ordena.

Nunca devuelve todas.

---

# Diversidad

El Brain evita recomendar siempre lo mismo.

Debe equilibrar:

- confianza;
- novedad;
- exploración;
- preferencias.

---

# Explicación

Toda recomendación puede responder.

¿Por qué?

---

# Aprendizaje

Si el usuario acepta una recomendación.

El Brain aprende.

Si la ignora.

También aprende.

---

# Objetivos

- aumentar confianza;
- reducir tiempo para decidir;
- sorprender;
- mejorar continuamente.

---

# Reglas

- Nunca recomendar únicamente por estrellas.
- Nunca recomendar únicamente por distancia.
- Siempre considerar contexto.

---

# Documentos Derivados

- recommendation-engine.md
- PRD-002
- PRD-003

---

# Estado

El Recommendation Engine constituye el núcleo funcional del Brain.
