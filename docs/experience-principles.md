# Principios de Experiencia

Este documento define cómo debe **sentirse** CajuEat. Es el criterio contra el cual se evalúa cualquier propuesta de diseño, antes de entrar en detalle visual (ver [design-brief.md](design-brief.md)).

## El estándar

La PWA debe sentirse:

- moderna;
- premium;
- futurista;
- simple;
- viva;
- distinta a cualquier app gastronómica tradicional.

El usuario debería sentir:

> "Nunca usé algo que funcione así."

## Referencias de calidad (no de funcionalidad)

Estas referencias marcan un **nivel de calidad e interacción**, no funcionalidades a copiar:

- Apple Maps — cartografía viva, minimalista, con jerarquía clara de información.
- Arc Browser — modernidad, personalidad, atención al detalle.
- Linear — velocidad percibida, simplicidad, precisión.
- Raycast — todo accesible por comando/conversación.
- Perplexity — respuestas directas y confiables antes que listas largas.
- ChatGPT — conversación como interfaz principal.
- Airbnb — narrativa visual aplicada a decisiones de consumo.
- Spotify — recomendación personalizada que se siente curada, no automatizada.

**No copiar features de estas apps.** Usarlas solo como vara de calidad.

## Los tres principios de interacción

### Map First

La Home es el mapa. No es una pantalla secundaria: es el punto de entrada al producto.

> En menos de 10 segundos, el usuario debe descubrir algo interesante sin escribir nada.

El mapa no debe mostrar cientos de pines sin sentido. Debe mostrar señales relevantes y priorizar relevancia por sobre cantidad. Ver [PRD-001 — Home / Living Map](prds/PRD-001-home-living-map.md).

### Conversation First

La conversación es el lenguaje principal del producto. Todo debería poder hacerse hablando o escribiendo:

- buscar;
- comparar;
- guardar;
- corregir;
- aportar conocimiento;
- planificar.

El chat con el Brain no debe sentirse como un bot genérico. Debe sentirse como un amigo / concierge gastronómico experto: conoce la ciudad, entiende contexto, recuerda preferencias, explica decisiones y admite dudas. Respuestas cortas, accionables, con criterio — nunca texto largo tipo blog. Ver [PRD-002 — Conversational Brain](prds/PRD-002-conversational-brain.md).

### Trust First

La confianza vale más que el crecimiento. La IA nunca inventa: si no sabe, dice que no sabe. Ver [trust-engine.md](trust-engine.md).

## Aplicación a la ficha de restaurante

La ficha de un lugar no debe parecer una ficha técnica de directorio. Debe responder preguntas de decisión, no solo listar datos. Ver [PRD-003 — Restaurant Experience](prds/PRD-003-restaurant-experience.md) para el detalle funcional.

## Cómo usar este documento

Cuando una propuesta de diseño o de producto genere dudas ("¿esto encaja con CajuEat?"), la pregunta correcta es: ¿esto ayuda a decidir, en segundos, con confianza, conversando o mirando el mapa? Si la respuesta es no, probablemente no pertenece al producto — al menos no en el MVP (ver [mvp.md](mvp.md)).
