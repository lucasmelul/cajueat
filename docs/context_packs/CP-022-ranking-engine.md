# CP-022 — Ranking Engine

**Estado:** Draft
**Versión:** 1.0
**Owner:** Product
**Consumidores:** Claude Code, Product

---

# Objetivo

Definir cómo el Brain ordena alternativas.

Encontrar buenos restaurantes es fácil.

Elegir el orden correcto es difícil.

---

# Filosofía

El Ranking Engine no genera candidatos.

Los ordena.

Es responsable de decidir cuál aparece primero.

---

# Principios

- relevancia;
- confianza;
- contexto;
- personalización;
- diversidad.

Nunca popularidad solamente.

---

# Factores

Ejemplos.

- afinidad;
- contexto;
- calidad;
- experiencias previas;
- novedad;
- distancia;
- tiempo de espera;
- horario;
- confianza.

---

# Diversificación

Las primeras posiciones no deberían parecer clones.

Debe existir variedad.

---

# Explicabilidad

El Brain conoce exactamente por qué un lugar quedó primero.

---

# Aprendizaje

El ranking mejora constantemente mediante feedback.

---

# Reglas

- Nunca ordenar únicamente por rating.
- Nunca ordenar únicamente por cercanía.

---

# Documentos Derivados

- ranking.md
- recommendation-engine.md

---

# Estado

El Ranking Engine convierte múltiples opciones válidas en una decisión priorizada.
