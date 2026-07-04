# CP-033 — Data Quality & Knowledge Validation

**Estado:** Draft
**Versión:** 1.0
**Owner:** Product
**Consumidores:** Claude Code, Product

---

# Objetivo

Definir cómo el Brain mantiene la calidad del conocimiento.

Construir conocimiento es importante.

Mantenerlo correcto es todavía más importante.

El Brain debe desconfiar por defecto y aumentar su confianza mediante evidencia.

---

# Filosofía

Toda información envejece.

Todo conocimiento puede cambiar.

Toda afirmación debe poder ser revisada.

---

# Principios

## Freshness First

La información reciente tiene mayor valor.

---

## Nunca confiar en una sola fuente

Toda información importante debe intentar validarse con múltiples señales.

---

## El conocimiento es revisable

Nada es definitivo.

---

## La confianza evoluciona

Puede subir.

Puede bajar.

---

# Tipos de Validación

## Confirmación por usuarios

---

## Confirmación por curadores

---

## Confirmación automática

---

## Confirmación por múltiples fuentes

---

## Validación temporal

---

# Información crítica

Debe tener prioridad.

Ejemplos.

- horarios
- menú
- chef
- cierre temporal
- mudanza
- reservas

---

# Información subjetiva

Ejemplos.

- ambiente
- ruido
- atención
- calidad

Debe manejarse mediante consenso y contexto.

---

# Información obsoleta

El Brain debe detectar conocimiento viejo.

Y decidir.

- mantener;
- revisar;
- degradar confianza;
- eliminar.

---

# Conflictos

Si dos fuentes se contradicen.

El Brain no elige una.

Busca más evidencia.

---

# Reglas

- Nunca asumir.
- Toda afirmación importante necesita evidencia.
- Todo conocimiento envejece.

---

# Documentos Derivados

- trust-engine.md
- data-quality.md

---

# Estado

La calidad del conocimiento será uno de los activos más importantes del Brain.
