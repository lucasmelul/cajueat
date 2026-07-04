# PRD-003 — Restaurant Experience

**Status:** Draft
**Priority:** P0
**Owner:** Product

---

# Objetivo

Construir la mejor ficha inteligente de restaurante del mercado.

No queremos una página de información.

Queremos una página que ayude a decidir.

---

# Problema

Las fichas actuales muestran datos.

Pero no ayudan a responder:

¿Vale la pena ir?

---

# Hipótesis

Si el Brain resume toda la información importante.

El usuario decidirá muchísimo más rápido.

---

# Objetivos

Responder en menos de un minuto:

- qué es;
- por qué ir;
- qué pedir;
- cuándo ir;
- con quién ir.

---

# Layout

Hero.

↓

Brain Summary.

↓

Qué pedir.

↓

Por qué ir.

↓

Experiencias.

↓

Preguntas frecuentes.

↓

Restaurantes similares.

↓

Mapa.

---

# Hero

Imagen.

Nombre.

Resumen.

CTA principal.

---

# Brain Summary

Tres párrafos máximo.

Debe transmitir personalidad.

---

# Qué pedir

Platos destacados.

No menú completo.

El menú completo queda como información secundaria.

---

# Brain Tips

Ejemplos.

Sentate en la barra.

Reservá.

Pedí media porción.

No vengas sin reserva.

---

# Comparaciones

Botón.

Comparar con...

---

# Conversación

Siempre disponible.

Ejemplos.

¿Qué pedirías?

¿Vale la pena?

¿Es para una cita?

---

# Similar Restaurants

Generados por el Brain.

No por categorías.

---

# Acciones

Guardar.

Compartir.

Agregar al plan.

Cómo llegar.

Preguntar.

Marcar visitado.

---

# Personalización

La ficha cambia según el usuario.

---

# Casos

Usuario vegetariano.

↓

Cambian recomendaciones.

---

Usuario amante del vino.

↓

Cambian sugerencias.

---

# Edge Cases

Menú desconocido.

↓

El Brain lo dice.

---

Poca información.

↓

Explica incertidumbre.

---

# Acceptance Criteria

✓ El usuario entiende el restaurante en menos de un minuto.

✓ El Brain recomienda platos.

✓ La ficha responde preguntas importantes.

✓ La explicación tiene prioridad sobre los datos.

---

# Notas para Claude Design

No copiar Google Maps.

No copiar TripAdvisor.

La ficha debe sentirse editorial.

---

# Notas para Claude Code

Restaurant Entity completamente desacoplada de la UI.

Toda la lógica proviene del Brain.
