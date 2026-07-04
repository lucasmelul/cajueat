# SPEC-008 — Search Experience

**Status:** Draft
**Priority:** P1
**Owner:** Product
**Consumers:** Claude Design, Claude Code

---

# Objetivo

Definir el funcionamiento completo de la búsqueda.

La búsqueda no es un buscador.

Es otra forma de conversar con el Brain.

---

# Filosofía

Google busca palabras.

Caju entiende intención.

El usuario nunca debería pensar qué escribir.

Simplemente describe lo que necesita.

---

# Entry Points

Prompt Bar.

↓

Conversation.

↓

Search Overlay.

↓

Restaurant.

↓

Collections.

---

# Tipos de búsqueda

## Restaurante

---

## Comida

---

## Plato

---

## Chef

---

## Barrio

---

## Experiencia

---

## Contexto

---

## Conversacional

---

# Ejemplos

Quiero sushi.

---

Algo romántico.

---

Quiero gastar poco.

---

Sorprendeme.

---

¿Dónde comería un japonés?

---

Una cafetería donde pueda trabajar cuatro horas.

---

# Comprensión

La búsqueda intenta detectar.

Intención.

↓

Restricciones.

↓

Contexto.

↓

Preferencias.

↓

Objetivo.

---

Nunca depende únicamente de palabras.

---

# Autocomplete

No completa texto.

Sugiere ideas.

Ejemplo.

"sus..."

↓

Sushi tradicional.

↓

Sushi premium.

↓

Omakase.

↓

Barras japonesas.

---

# Resultados

Nunca lista infinita.

Máximo.

5-10 resultados destacados.

---

# Ranking

Contexto.

↓

Memoria.

↓

Trust.

↓

Relevancia.

---

# Sin resultados

Nunca mostrar.

"No encontramos resultados."

Siempre responder.

"No encontré exactamente eso, pero creo que estas opciones resuelven el mismo problema."

---

# Search Overlay

Debe sentirse como Spotlight o Raycast.

No como Google.

---

# Performance

Resultados iniciales.

<300 ms.

---

# Analytics

Search Started

Search Completed

Suggestion Selected

Search Abandoned

Recommendation Accepted

---

# Acceptance Criteria

✓ Comprende lenguaje natural.

✓ Nunca devuelve listas infinitas.

✓ Siempre propone alternativas.

✓ Se siente como conversar.

---

# Notas para Claude Design

Inspirarse en Raycast.

Arc Search.

Spotlight.

Perplexity.

No copiar Google Search.

---

# Notas para Claude Code

Separar:

Intent Detection

↓

Query Builder

↓

Knowledge Search

↓

Ranking

↓

Recommendation

La UI nunca consulta directamente el índice de búsqueda.
