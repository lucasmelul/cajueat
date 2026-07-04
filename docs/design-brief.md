# Design Brief

Este documento es el brief de entrada para diseño de experiencia (ej. Claude Design o cualquier equipo/proceso de diseño).

## Qué recibe diseño

- [vision.md](vision.md) — la tesis y los cinco principios.
- [experience-principles.md](experience-principles.md) — el estándar de calidad y las referencias.
- [mvp.md](mvp.md) — el alcance a diseñar.
- Los PRDs relevantes en [prds/](prds).
- Este brief.

## Qué NO debe hacer diseño

Diseño **no debe inventar funcionalidad central**. Puede y debe proponer la mejor forma de expresar visual e interactivamente lo que ya está definido en los PRDs, pero las decisiones de qué existe en el producto son de producto, no de diseño.

## El estándar de calidad

Moderno, premium, futurista, simple, vivo. Distinto a cualquier app gastronómica tradicional.

Referencias de nivel de calidad (no de funcionalidad a copiar): Apple Maps, Arc Browser, Linear, Raycast, Perplexity, ChatGPT, Airbnb, Spotify. Ver el detalle de por qué cada una en [experience-principles.md](experience-principles.md).

El usuario debería sentir: *"Nunca usé algo que funcione así."*

## Home / Living Map

La Home es un mapa vivo, casi full screen, no una lista.

Objetivo: en menos de 10 segundos, el usuario descubre algo interesante sin escribir nada.

Elementos principales a diseñar:

- mapa casi full screen;
- Brain Card flotante;
- Prompt Bar conversacional;
- Context Chips;
- Restaurant Cards;
- señales de recomendaciones vivas sobre el mapa.

El mapa debe priorizar **relevancia sobre cantidad** de pines: lugares recomendados, nuevos, guardados, visitados, eventos gastronómicos, colecciones y zonas interesantes — no un volcado de todos los restaurantes de la ciudad.

Ver [PRD-001 — Home / Living Map](prds/PRD-001-home-living-map.md).

## Conversational Brain

El chat es el corazón del producto, no una feature secundaria de soporte.

Debe sentirse como un concierge gastronómico experto, no como un bot genérico. Respuestas cortas, accionables, con criterio.

El chat debe poder responder con: texto, cards de restaurante, comparaciones, mapas, planes y acciones — no solo texto plano.

Ver [PRD-002 — Conversational Brain](prds/PRD-002-conversational-brain.md).

## Ficha de restaurante

No debe leerse como una ficha técnica de directorio. Debe responder, en este orden de relevancia: por qué vale la pena, qué pedir, cuándo ir, para quién es, qué tener en cuenta, qué lo hace especial, qué fuentes lo respaldan.

Secciones deseadas: hero visual, descripción narrativa generada por el Brain, información crítica, qué pedir, Brain Tips, ambiente, precio, mapa, lugares cercanos, timeline de cambios, fuentes/confianza, y acciones (guardar, compartir, cómo llegar, agregar a plan).

Evitar dar protagonismo excesivo a estrellas y reviews tradicionales — no es ese tipo de producto.

Ver [PRD-003 — Restaurant Experience](prds/PRD-003-restaurant-experience.md).

## Captura de conocimiento

El flujo de aportar conocimiento (voz, foto, link) debe sentirse instantáneo y sin fricción — nunca como llenar un formulario. Ver [PRD-004 — Knowledge Capture](prds/PRD-004-knowledge-capture.md).

## Onboarding

Mínimo. Sin tutoriales largos. La app abre directamente en el mapa; el Brain se presenta con un saludo breve. Ver [PRD-009 — Onboarding](prds/PRD-009-onboarding.md).

## Confianza, visualmente

El Trust Engine (ver [trust-engine.md](trust-engine.md)) necesita una expresión visual: el usuario debe poder percibir cuándo el Brain está seguro, cuándo tiene dudas y en qué se basa una recomendación — sin que esto se sienta como un dashboard técnico.

## Decisiones abiertas para diseño

- Cómo se visualiza el nivel de confianza de una recomendación (score, lenguaje natural, iconografía).
- Cómo se diferencian visualmente pines de distinto tipo en el mapa (recomendado, guardado, visitado, evento) sin saturar la interfaz.
- Sistema de diseño, tipografía y lenguaje visual definitivo — no está definido en este set de documentos, es responsabilidad de diseño proponerlo dentro del estándar de calidad descrito arriba.
