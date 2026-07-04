# CP-013 — Product Decisions

**Estado:** Draft
**Versión:** 1.0
**Owner:** Product
**Consumidores:** Product, Claude Code, Claude Design

---

# Objetivo

Este documento centraliza todas las decisiones de producto tomadas durante el diseño de CajuEat.

No explica la implementación.

No habla de ingeniería.

Simplemente documenta decisiones.

Cada decisión debe tener una razón.

---

# Filosofía

Las decisiones de producto son mucho más difíciles de cambiar que las decisiones técnicas.

Claude Code podrá decidir tecnologías.

Nosotros decidimos producto.

---

# Estado de las decisiones

Cada decisión puede estar en alguno de estos estados.

- ✅ Tomada
- 🟡 En discusión
- ❌ Descartada

---

# DEC-001

## El Brain es un producto independiente.

Estado

✅ Tomada

Descripción

El Brain no pertenece a la aplicación.

Puede ser utilizado por:

- PWA
- Chat
- Voz
- API
- Agentes

Nunca dependerá de una interfaz.

---

# DEC-002

## La aplicación será una PWA.

Estado

✅ Tomada

Motivos

- rapidez;
- menor costo;
- distribución inmediata;
- un solo código;
- ideal para MVP.

Las aplicaciones nativas podrán aparecer después.

---

# DEC-003

## El mapa es la Home.

Estado

✅ Tomada

La experiencia comienza siempre desde el mapa.

No existe una pantalla inicial diferente.

---

# DEC-004

## El Brain conversa.

Estado

✅ Tomada

La conversación será el principal mecanismo de interacción.

Siempre que una tarea pueda hacerse conversando.

Debe poder hacerse conversando.

---

# DEC-005

## No existen reviews tradicionales.

Estado

✅ Tomada

Queremos experiencias.

No opiniones largas.

El feedback ocurre mediante conversación.

---

# DEC-006

## El Brain aprende continuamente.

Estado

✅ Tomada

Cada interacción debe mejorar el conocimiento.

---

# DEC-007

## Alimentar el Brain debe ser extremadamente simple.

Estado

✅ Tomada

Se priorizan:

- voz;
- links;
- reels;
- imágenes;
- conversación.

Nunca formularios largos.

---

# DEC-008

## El CMS también será conversacional.

Estado

✅ Tomada

No construiremos un backoffice tradicional.

Todo deberá poder hacerse hablando con el Brain.

---

# DEC-009

## El Trust Engine es obligatorio.

Estado

✅ Tomada

Toda recomendación importante debe estar respaldada por evidencia.

---

# DEC-010

## Los influencers son fuentes de conocimiento.

Estado

✅ Tomada

No copiamos contenido.

Aprendemos criterios.

Cada curador tiene reputación propia.

---

# DEC-011

## La gamificación mejora el Brain.

Estado

✅ Tomada

Nunca existe para aumentar el tiempo de uso.

---

# DEC-012

## No construiremos una red social.

Estado

✅ Tomada

No queremos:

- seguidores;
- likes;
- publicaciones.

La comunidad existe para compartir conocimiento.

---

# DEC-013

## El Brain explica sus recomendaciones.

Estado

✅ Tomada

El usuario puede preguntar.

¿Por qué?

Y obtener una explicación.

---

# DEC-014

## La experiencia tiene prioridad sobre la cantidad de funcionalidades.

Estado

✅ Tomada

Siempre preferiremos un producto pequeño y excelente.

Antes que uno enorme y mediocre.

---

# DEC-015

## La tecnología no define el producto.

Estado

✅ Tomada

Claude Code decidirá:

- arquitectura;
- base de datos;
- APIs;
- infraestructura.

Nosotros únicamente definimos comportamiento.

---

# Decisiones Pendientes

## Login

Estado

🟡

Opciones

- teléfono;
- Google;
- Apple.

---

## Navegación

Estado

🟡

¿Existirá barra inferior?

¿Será completamente contextual?

---

## Monetización

Estado

🟡

Todavía sin definir.

---

## Branding

Estado

🟡

Nombre del Brain.

Identidad visual.

---

## Arquitectura

Estado

🟡

Será propuesta por Claude Code.

---

# Regla

Toda nueva decisión importante deberá agregarse aquí.

No debe quedar escondida dentro de un PRD.

---

# Documentos Derivados

- product-decisions.md
- roadmap.md
- architecture.md

---

# Estado

Este documento será uno de los más consultados del proyecto y deberá mantenerse actualizado durante toda la vida de CajuEat.
