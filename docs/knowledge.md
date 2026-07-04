# Conocimiento

Este documento describe cómo CajuEat modela y construye conocimiento gastronómico. Es la base conceptual detrás del principio **Knowledge Compounds** (ver [vision.md](vision.md)).

## El Brain no guarda solo restaurantes

Guarda entidades, relaciones, eventos y experiencias. A este modelo lo llamamos el **Experience Graph**.

### Entidades

- Restaurant
- Dish
- Chef
- Menu
- Ingredient
- Wine
- Coffee
- Dessert
- Neighborhood
- City
- User
- Visit
- Experience
- Source
- Influencer
- Curated List
- Memory
- Event

### Relaciones (ejemplos)

- Restaurant sirve Dish
- Dish usa Ingredient
- Chef trabaja en Restaurant
- User visitó Restaurant
- User disfrutó Dish
- Source recomendó Restaurant
- Curated List incluye Restaurant
- Experience ocurrió en Restaurant

### Por qué el Experience Graph es central

No alcanza con saber que un restaurante existe o que tiene buena reputación general. El valor está en aprender **en qué contexto una experiencia fue buena**: para quién, con quién, en qué momento, para qué ocasión. Ese es el conocimiento que ninguna plataforma de reviews genérica tiene hoy.

## Cómo se captura conocimiento

Agregar conocimiento al Brain debe ser muy simple. Nada de formularios largos.

### Entradas soportadas

- voz;
- foto;
- link (Reel, TikTok, Instagram, YouTube);
- menú;
- nota libre;
- PDF (a futuro).

### Flujo de captura

1. El usuario comparte o captura algo (una foto, un link, una nota de voz).
2. El Brain analiza el contenido.
3. Extrae restaurantes, platos, señales y contexto relevante.
4. Pregunta solo si necesita confirmar algo ambiguo.
5. Aprende — el contenido pasa a formar parte del Experience Graph, ponderado por el [Trust Engine](trust-engine.md).

Objetivo de producto:

> Menos de 30 segundos para aportar conocimiento útil.

Ver [PRD-004 — Knowledge Capture](prds/PRD-004-knowledge-capture.md) para el detalle funcional.

## Feedback post-visita como fuente de conocimiento

Después de una experiencia, el usuario no deja una review tradicional: tiene una conversación corta y guiada (máximo 3-4 preguntas), y esa conversación se convierte en conocimiento estructurado para el Brain. El usuario debe sentir que ayudó al Brain, no que completó una encuesta. Ver [PRD-005 — Post Visit Feedback](prds/PRD-005-post-visit-feedback.md).

## Micro-quizzes como fuente de conocimiento dirigida

El Brain también puede generar micro-quizzes cuando necesita aprender algo específico que no tiene forma de inferir solo. No son formularios: son micro-juegos de 5 a 20 segundos.

Ejemplos:

- ¿Qué tan ruidoso es este lugar?
- ¿Irías con chicos?
- ¿Cuál de estos platos representa mejor al restaurante?
- ¿Cuánto esperarías por mesa?
- ¿Es buena primera cita?

El Brain pregunta porque necesita aprender algo puntual, no porque sí. Ver [gamification.md](gamification.md) para cómo se recompensa esta participación.

## Relación con la confianza

Ningún dato entra al conocimiento del Brain "tal cual". Todo pasa por el [Trust Engine](trust-engine.md), que determina cuánto pesa cada nueva pieza de información según su fuente, su recencia y su consistencia con lo que el Brain ya sabe.
