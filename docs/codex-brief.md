# Codex Brief

Este documento es el brief de entrada para ingeniería (Codex / Claude Code, o cualquier equipo de ingeniería que tome este trabajo).

## El reparto de responsabilidad

Producto no le entrega a ingeniería la solución técnica ya resuelta. Producto define:

- qué hace el producto;
- cómo se siente;
- qué entra en el MVP y con qué prioridad;
- los flujos;
- las decisiones de UX;
- las prioridades.

Ingeniería actúa como **CTO** de este producto:

- lee esta documentación completa;
- propone arquitectura;
- elige el stack;
- justifica sus decisiones técnicas;
- diseña datos, APIs, servicios y tests;
- implementa.

## Qué no debe imponer producto

Producto no debe imponerle a ingeniería, salvo que haya una razón de negocio fuerte y explícita:

- base de datos;
- estilo de API;
- infraestructura;
- frameworks.

Estas son decisiones de ingeniería. Este set de documentos deliberadamente **no** contiene arquitectura técnica ni elecciones de tecnología — eso es intencional, no un olvido.

## Lo que ingeniería sí debe tomar como restricción de producto

Aunque el "cómo" es de ingeniería, hay restricciones de producto que deben sobrevivir cualquier decisión técnica:

- **El Brain no conoce interfaces.** Cualquier arquitectura debe permitir que el Brain sea consumido por múltiples clientes (PWA, voz, API, agentes) sin acoplarse a uno. Ver [product.md](product.md) y [brain.md](brain.md).
- **Trust First.** El sistema debe poder explicar de dónde viene una recomendación y con qué nivel de confianza, y debe poder decir "no sé" en vez de alucinar. Ver [trust-engine.md](trust-engine.md).
- **Knowledge Compounds.** El diseño de datos debe soportar que cada interacción (conversación, feedback, captura) se traduzca en conocimiento reutilizable, no en logs que se descartan. Ver [knowledge.md](knowledge.md).
- **PWA, no app nativa**, al menos para el MVP. Ver [product.md](product.md).

## Documentación a leer antes de proponer arquitectura

1. [MASTERPLAN.md](MASTERPLAN.md)
2. [product.md](product.md)
3. [brain.md](brain.md)
4. [knowledge.md](knowledge.md)
5. [trust-engine.md](trust-engine.md)
6. [sources-and-curators.md](sources-and-curators.md)
7. [gamification.md](gamification.md)
8. [mvp.md](mvp.md)
9. Todos los PRDs en [prds/](prds)

## Qué se espera como entregable de ingeniería

- Una propuesta de arquitectura conceptual (no necesariamente código) que respete las restricciones de producto listadas arriba.
- Justificación de stack y decisiones clave, en particular donde haya trade-offs relevantes para el negocio (costo, velocidad de iteración, escalabilidad del Trust Engine y del Experience Graph).
- Un plan de implementación alineado a las fases de [roadmap.md](roadmap.md), priorizando el alcance de [mvp.md](mvp.md).

## Decisiones abiertas relevantes para ingeniería

Ver [product-decisions.md](product-decisions.md) para el registro completo. Las más relevantes para arquitectura temprana:

- Método de autenticación (ver [PRD-009 — Onboarding](prds/PRD-009-onboarding.md)): la intención de producto es login en menos de 30 segundos, posiblemente solo con teléfono/OTP, evitando usuario y contraseña. La decisión final de mecanismo es de ingeniería, pero debe respetar esa restricción de UX.
- Cómo se calcula y almacena el score de confianza del Trust Engine.
- Cómo se modela el Experience Graph (grafo, relacional, híbrido) — la elección es de ingeniería; el modelo conceptual de entidades y relaciones está en [knowledge.md](knowledge.md).
