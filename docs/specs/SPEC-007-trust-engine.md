# SPEC-007 — Trust Engine

**Status:** Draft
**Priority:** P0
**Owner:** Product
**Consumers:** Claude Code

---

# Objetivo

Definir cómo el Brain administra la confianza del conocimiento.

El Trust Engine es transversal.

No pertenece a una pantalla.

Participa en absolutamente todas las decisiones.

---

# Filosofía

El Brain nunca debería responder únicamente:

"Esto es verdad."

Debería responder.

"Con esta evidencia, creo que esto es muy probable."

---

# Responsabilidades

Administrar.

- confianza;
- evidencia;
- contradicciones;
- antigüedad;
- consenso.

---

# Qué posee confianza

Restaurantes.

↓

Platos.

↓

Horarios.

↓

Chefs.

↓

Usuarios.

↓

Curadores.

↓

Fuentes.

↓

Experiencias.

↓

Recomendaciones.

↓

Memorias.

Todo.

---

# Componentes

## Confidence

---

## Evidence

---

## Source Quality

---

## Freshness

---

## Consensus

---

## Contradictions

---

# Evidencia

Una afirmación puede tener.

Una.

O muchas evidencias.

---

# Consenso

Varias fuentes.

↓

Mayor confianza.

---

# Antigüedad

El conocimiento envejece.

La confianza disminuye.

---

# Conflictos

Dos fuentes.

↓

Información distinta.

↓

Nunca elegir arbitrariamente.

↓

Buscar evidencia adicional.

---

# Recomendaciones

El Recommendation Engine consulta siempre al Trust Engine.

---

# UX

El usuario nunca ve números.

Ve explicaciones.

---

# Analytics

Confidence Increased

Confidence Decreased

Conflict Detected

Conflict Resolved

---

# Acceptance Criteria

✓ Ninguna afirmación importante carece de evidencia.

✓ El Brain reconoce incertidumbre.

✓ La confianza evoluciona con el tiempo.

✓ Las contradicciones nunca se ignoran.

---

# Notas para Claude Code

Implementación libre.

El comportamiento no.

Todo conocimiento debe pasar por el Trust Engine antes de utilizarse para tomar decisiones.
