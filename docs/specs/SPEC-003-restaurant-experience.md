# SPEC-003 — Restaurant Experience

**Status:** Draft
**Priority:** P0
**Owner:** Product
**Consumers:** Claude Design, Claude Code

---

# Objetivo

Definir el comportamiento completo de la ficha de un restaurante.

No es una página de información.

Es una página para tomar una decisión.

El usuario debe responder una única pregunta:

> ¿Vale la pena ir?

En menos de un minuto.

---

# Filosofía

No queremos mostrar todos los datos.

Queremos mostrar únicamente lo necesario para decidir.

Toda la información secundaria queda debajo.

Toda la información importante aparece primero.

---

# Objetivos

El usuario debe entender rápidamente:

- qué es;
- por qué ir;
- cuándo ir;
- con quién ir;
- qué pedir;
- cuánto cuesta aproximadamente;
- por qué el Brain lo recomienda.

---

# Entry Points

Desde el Living Map.

↓

Desde una conversación.

↓

Desde una colección.

↓

Desde un link compartido.

↓

Desde un restaurante similar.

↓

Desde una búsqueda.

---

# Layout

Restaurant Hero

↓

Brain Summary

↓

Primary CTA

↓

Quick Facts

↓

Qué pedir

↓

¿Por qué este lugar?

↓

Experiencias

↓

Restaurantes similares

↓

Información completa

---

# Hero

Debe ocupar aproximadamente media pantalla.

Contiene:

Imagen principal.

Nombre.

Tipo de cocina.

Resumen.

Nivel de confianza.

CTA.

---

# Brain Summary

Siempre aparece primero.

Nunca más de tres párrafos.

Debe responder:

¿Qué hace especial a este lugar?

---

Ejemplo.

"Una barra japonesa tradicional donde el foco está completamente puesto en el producto. Ideal para quienes buscan sushi clásico sin fusiones."

---

# Primary CTA

Solo una acción principal.

Ejemplos.

- Cómo llegar.
- Reservar.
- Abrir conversación.

Nunca cinco botones iguales.

---

# Quick Facts

Información extremadamente resumida.

Ejemplo.

$$$

↓

Ideal para parejas

↓

Excelente barra

↓

Reserva recomendada

↓

40 minutos promedio

↓

Abierto ahora

---

No más de 6 elementos.

---

# Qué pedir

El Brain recomienda.

No simplemente lista.

Ejemplo.

Si vas por primera vez.

↓

Pedí...

---

Si te gusta el atún.

↓

No te pierdas...

---

Si buscás algo liviano.

↓

Probá...

---

# Brain Tips

Pequeños consejos.

Ejemplos.

Sentate en la barra.

No vayas sin reserva.

Pedí media porción.

El postre vale la pena.

No aceptan efectivo.

---

# Explicación

Siempre visible.

¿Por qué te lo recomendé?

---

Puede utilizar.

Memoria.

Contexto.

Historial.

Experiencias.

---

Nunca decir únicamente.

"Porque tiene 4.8 estrellas."

---

# Restaurant Personality

Debe existir una sección.

Así es este restaurante.

Ejemplos.

Elegante.

Minimalista.

Tradicional.

Caótico.

Ruidoso.

Romántico.

---

# Ideal Para

El Brain responde.

Ideal para...

Primera cita.

↓

Negocios.

↓

Familia.

↓

Solo.

↓

Grupo.

↓

Turistas.

---

# No Ideal Para

También debe existir.

Ejemplo.

No vengas con chicos.

No es buena opción para trabajar.

No aceptan grupos grandes.

---

# Restaurant Timeline

Futuro.

Cómo evolucionó.

Chef nuevo.

Carta nueva.

Premios.

Mudanzas.

---

# Gallery

No queremos 200 fotos.

Queremos pocas fotos.

Muy representativas.

---

# Menu

Resumen primero.

Carta completa después.

---

# Reviews

No mostrar cientos.

Mostrar experiencias relevantes.

---

# Similar Restaurants

Generados por el Brain.

Nunca por categoría.

---

# Nearby Suggestions

Puede mostrar.

Si venís hasta acá.

A cinco cuadras tenés...

---

# Conversation

Siempre disponible.

Ejemplos.

¿Qué pedirías?

¿Vale la pena?

¿Es para una cita?

¿Qué vino combinarías?

---

# Personalización

La ficha cambia.

Vegetariano.

↓

Cambian platos.

↓

Cambian recomendaciones.

↓

Cambian tips.

---

# Memory

El Brain puede recordar.

Ya viniste.

Hace seis meses.

Te encantó el sashimi.

---

# CTA secundarios

Guardar.

Comparar.

Compartir.

Agregar al plan.

Marcar visitado.

---

# Scroll

Toda la información importante aparece antes del primer scroll.

---

# Performance

Apertura.

<500 ms.

Información incremental.

---

# Skeleton

Hero.

↓

Summary.

↓

Cards.

Nunca pantalla vacía.

---

# Empty States

No conocemos menú.

↓

Lo explicamos.

---

No conocemos tiempos.

↓

No inventamos.

---

# Analytics

Restaurant Opened

Restaurant Closed

Dish Viewed

Menu Opened

Conversation Started

Navigation Started

Restaurant Saved

Restaurant Compared

Experience Shared

---

# Accessibility

Texto escalable.

Imágenes accesibles.

Botones grandes.

Gestos alternativos.

---

# Acceptance Criteria

✓ El usuario entiende el restaurante en menos de un minuto.

✓ El Brain resume toda la información importante.

✓ Siempre existe una explicación.

✓ La conversación está disponible.

✓ La ficha cambia según el usuario.

✓ Nunca parece Google Maps.

✓ Nunca parece TripAdvisor.

---

# Open Questions

Mostrar videos.

Mostrar fotos generadas por IA.

Mostrar experiencias similares.

Modo storytelling.

---

# Notas para Claude Design

Inspirarse en revistas editoriales premium.

No en directorios.

Cada restaurante debe sentirse como una historia.

No como una ficha técnica.

La jerarquía visual debe responder:

1. ¿Por qué debería ir?
2. ¿Qué pedir?
3. ¿Cómo es la experiencia?

Todo lo demás es secundario.

---

# Notas para Claude Code

Separar claramente:

Restaurant UI

↓

Restaurant View Model

↓

Restaurant Service

↓

Recommendation Service

↓

Memory Service

↓

Knowledge Graph

↓

Trust Engine

La pantalla nunca consulta directamente múltiples fuentes.

Toda la información debe llegar ya enriquecida desde el Brain.
