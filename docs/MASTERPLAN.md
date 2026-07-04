# Masterplan

> Documento raíz de producto. Si solo vas a leer un archivo antes de trabajar en CajuEat, es este.

## Qué es CajuEat

CajuEat es una plataforma gastronómica AI-native para ayudar a las personas a **descubrir, decidir y vivir** mejores experiencias gastronómicas.

CajuEat **no es**:

- una app de listados de restaurantes;
- Google Maps;
- TripAdvisor;
- una red social gastronómica.

La tesis central del producto:

> **CajuEat no muestra listas. CajuEat ayuda a decidir.**

## La separación fundamental

CajuEat se compone de tres productos, cada uno con una responsabilidad distinta. Ver [product.md](product.md) para el detalle.

| Producto | Rol |
|---|---|
| **Brain** | El activo central. Entiende, recuerda, aprende, recomienda y explica. No conoce interfaces. |
| **Platform** | Conecta todo: auth, usuarios, notificaciones, analytics, gamificación, CMS, operación del Brain. |
| **PWA** | El primer cliente del Brain. No el único, no el definitivo. |

El Brain es el activo que compone valor con el tiempo. La PWA es reemplazable; el Brain no.

## Los cinco principios rectores

Todo el producto se diseña y se prioriza contra estos cinco principios. Están desarrollados en [experience-principles.md](experience-principles.md) y [brain.md](brain.md).

1. **Brain First** — la inteligencia vive en el Brain, no en la interfaz.
2. **Map First** — la Home es el mapa; es el punto de entrada al producto, no una pantalla secundaria.
3. **Conversation First** — la conversación es el lenguaje principal: buscar, comparar, guardar, corregir, aportar conocimiento y planificar deben poder hacerse hablando o escribiendo.
4. **Trust First** — la confianza vale más que el crecimiento. La IA nunca inventa; si no sabe, lo dice.
5. **Knowledge Compounds** — cada interacción debe mejorar el Brain.

## Cómo se conecta todo

```
Usuario
  ↓
Conversación / Mapa (PWA)
  ↓
Platform (identidad, gamificación, operación)
  ↓
Brain (entendimiento, memoria, conocimiento, confianza)
```

El Brain se nutre de tres tipos de entrada:

- **el usuario** (conversación, feedback, visitas, capturas de conocimiento);
- **fuentes externas** (foodies, curadores, medios — ver [sources-and-curators.md](sources-and-curators.md));
- **su propio conocimiento acumulado** (el Experience Graph — ver [knowledge.md](knowledge.md)).

Todo dato que entra al Brain pasa por el [Trust Engine](trust-engine.md), que decide cuánto pesa cada señal antes de convertirla en una recomendación.

## Mapa de la documentación

| Documento | Para qué sirve |
|---|---|
| [vision.md](vision.md) | Misión, visión y tesis del producto |
| [product.md](product.md) | La separación Brain / Platform / PWA |
| [brain.md](brain.md) | Qué es y qué hace el Brain |
| [experience-principles.md](experience-principles.md) | Filosofía de experiencia y estándar de calidad |
| [knowledge.md](knowledge.md) | Modelo de conocimiento y cómo se captura |
| [trust-engine.md](trust-engine.md) | Cómo el Brain decide en quién confiar |
| [sources-and-curators.md](sources-and-curators.md) | Foodies, influencers y listas curadas como señal |
| [gamification.md](gamification.md) | Caju Points y micro-quizzes |
| [mvp.md](mvp.md) | Qué entra y qué no entra en el MVP |
| [roadmap.md](roadmap.md) | Fases del producto |
| [product-decisions.md](product-decisions.md) | Registro de decisiones abiertas y tomadas |
| [design-brief.md](design-brief.md) | Brief para diseño de experiencia |
| [codex-brief.md](codex-brief.md) | Brief para ingeniería (Codex / Claude Code) |
| [prds/](prds) | Especificación funcional feature por feature |

## Estado actual del proyecto

El proyecto está en transición de **idea/documentación** a **construcción**.

Próximos pasos, en orden:

1. Consolidar esta documentación como fuente de verdad (este proceso).
2. Revisar y aprobar el contenido (diff + commit).
3. Pasar a diseño de experiencia, usando [design-brief.md](design-brief.md).
4. Pasar a arquitectura técnica, usando [codex-brief.md](codex-brief.md).
5. Construir el MVP definido en [mvp.md](mvp.md).

Ninguna decisión de tecnología, arquitectura o stack está tomada todavía. Ese trabajo es responsabilidad de ingeniería (Codex / Claude Code), no de este set de documentos.
