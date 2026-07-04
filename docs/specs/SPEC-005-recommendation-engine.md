# SPEC-005 — Recommendation Engine

**Status:** Draft
**Priority:** P0
**Owner:** Product
**Consumers:** Claude Code, Claude Design

---

# Objetivo

Definir el comportamiento funcional del Recommendation Engine.

Este documento NO define modelos de IA.

NO define algoritmos.

NO define bases de datos.

Define qué debe hacer el Brain para recomendar correctamente.

Claude Code decidirá cómo implementarlo.

---

# Filosofía

El Recommendation Engine responde una única pregunta.

> Si realmente conociera a esta persona y conociera perfectamente la ciudad...

¿Qué le recomendaría ahora?

No busca restaurantes.

Busca la mejor decisión posible.

---

# Responsabilidades

El motor debe:

- comprender el contexto;
- generar candidatos;
- priorizarlos;
- explicar la decisión;
- aprender del resultado.

Nunca simplemente ordenar restaurantes.

---

# Inputs

## Usuario

Identidad.

---

## Contexto

- ubicación;
- horario;
- clima;
- presupuesto;
- compañía;
- ocasión.

---

## Memoria

Preferencias.

Experiencias.

Colecciones.

Historial.

---

## Knowledge Graph

Todo el conocimiento disponible.

---

## Trust Engine

Nivel de confianza de cada afirmación.

---

## Señales Externas

Disponibilidad.

Horarios.

Eventos.

---

# Outputs

Restaurant.

Dish.

Collection.

Plan.

Comparison.

Question.

No existe un único tipo de respuesta.

---

# Flujo Conceptual

Contexto

↓

Interpretación

↓

Generación de candidatos

↓

Filtrado

↓

Ranking

↓

Diversificación

↓

Explicación

↓

Entrega

↓

Aprendizaje

---

Claude Code puede modificar la implementación.

Nunca el comportamiento esperado.

---

# Generación de candidatos

El Brain debe producir muchas posibilidades.

No solamente las más cercanas.

---

# Filtrado

Eliminar opciones claramente incorrectas.

Ejemplos.

Cerrado.

↓

Eliminar.

---

Muy lejos.

↓

Probablemente eliminar.

---

No apto para el contexto.

↓

Eliminar.

---

# Ranking

El Brain ordena.

No únicamente por score.

Sino por relevancia.

---

# Diversidad

Las primeras recomendaciones no deberían parecer iguales.

Ejemplo.

Cinco restaurantes japoneses.

↓

Mala experiencia.

---

El Brain mezcla.

Descubrimiento.

Confianza.

Exploración.

---

# Explicabilidad

Toda recomendación responde.

¿Por qué?

---

Ejemplos.

Porque te gusta el sushi tradicional.

Porque hoy tiene baja espera.

Porque ya guardaste lugares similares.

Porque hoy llueve.

Porque está a diez minutos caminando.

---

Nunca.

"Porque tiene 4.8 estrellas."

---

# Personalización

Dos usuarios.

↓

Mismo contexto.

↓

Recomendaciones distintas.

---

# Adaptación

La misma persona.

↓

Distinto contexto.

↓

Distintas recomendaciones.

---

# Context Signals

Ejemplos.

Hora.

↓

Lluvia.

↓

Día.

↓

Vacaciones.

↓

Cumpleaños.

↓

Viaje.

↓

Niños.

↓

Mascotas.

↓

Trabajo.

↓

Turismo.

---

# Recommendation Types

## Descubrimiento

---

## Confirmación

---

## Comparación

---

## Exploración

---

## Predictiva

---

## Reactiva

---

# Confidence

Cada recomendación posee.

Nivel de confianza.

---

Cuando es bajo.

El Brain puede preguntar.

---

# Feedback Loop

Recomendación.

↓

Usuario abre.

↓

Usuario guarda.

↓

Usuario ignora.

↓

Usuario visita.

↓

Usuario responde.

↓

Brain aprende.

---

# Rechazos

Ignorar una recomendación.

No significa automáticamente.

"No le gustó."

El Brain evita conclusiones rápidas.

---

# Cold Start

Si no conoce al usuario.

Debe utilizar.

Contexto.

Conocimiento global.

Preguntas mínimas.

---

# Contradicciones

Si la memoria dice.

Ama sushi.

↓

Pero las últimas experiencias fueron italianas.

↓

No eliminar memoria.

Construir hipótesis.

---

# Edge Cases

Muy poca información.

↓

Preguntar.

---

Demasiadas opciones similares.

↓

Diversificar.

---

No existe recomendación suficientemente buena.

↓

Ser transparente.

---

# Analytics

Recommendation Generated

Recommendation Viewed

Recommendation Accepted

Recommendation Ignored

Recommendation Rejected

Recommendation Explained

---

# Performance

Generación inicial.

<1 segundo.

Re-ranking.

<300 ms.

Cambio de contexto.

Respuesta inmediata.

---

# Acceptance Criteria

✓ Nunca recomienda únicamente por rating.

✓ Nunca recomienda únicamente por distancia.

✓ Siempre puede explicar.

✓ Aprende continuamente.

✓ Respeta contexto.

✓ Respeta memoria.

✓ Produce diversidad.

---

# Open Questions

Modelo híbrido.

Embeddings.

Knowledge Graph Queries.

LLM Orchestrator.

Personalization Weights.

Todo queda abierto para ingeniería.

---

# Notas para Claude Design

El usuario nunca debería percibir el Recommendation Engine.

Solo percibe que:

"Caju siempre entiende lo que necesito."

Las explicaciones deben transmitir confianza.

Nunca complejidad.

---

# Notas para Claude Code

Este documento define comportamiento.

No implementación.

Se espera que Claude Code proponga:

- arquitectura;
- modelos;
- caching;
- scoring;
- pipelines;
- estrategias de ranking;
- optimizaciones.

Siempre respetando los principios definidos aquí.

El Recommendation Engine debe ser completamente desacoplado de:

- UI
- LLM específico
- proveedor de mapas
- proveedor de búsqueda
- proveedor de embeddings

Debe ser reemplazable y evolucionar sin afectar el resto del sistema.
