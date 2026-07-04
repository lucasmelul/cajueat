# Trust Engine

El Trust Engine es el mecanismo por el cual el Brain decide **en qué confiar, cuánto y para quién**, antes de convertir cualquier dato en una recomendación. Encarna el principio **Trust First** (ver [vision.md](vision.md)): la confianza vale más que el crecimiento, y la IA nunca inventa — si no sabe, lo dice.

## El Brain no decide por una única fuente

Ninguna recomendación se basa en un solo dato o una sola fuente. El Brain combina señales de distinta fuerza y las pondera.

## Tipos de señales

### Fuertes

- el usuario realmente fue al lugar;
- foto geolocalizada;
- ticket de compra;
- reserva confirmada;
- menú actualizado recientemente;
- feedback reciente post-visita.

### Medias

- un Reel o video;
- una review;
- una lista de un foodie o curador (ver [sources-and-curators.md](sources-and-curators.md));
- un artículo.

### Débiles

- likes;
- comentarios;
- popularidad genérica;
- tendencias sin contexto.

## Qué hace el Trust Engine con estas señales

El Brain calcula un nivel de confianza a distintos niveles:

- por dato individual (ej: "este horario está actualizado");
- por restaurante;
- por plato;
- por fuente;
- por recomendación final entregada al usuario.

## Detección de contradicciones

El Trust Engine no solo suma señales: también detecta cuando señales distintas se contradicen entre sí, y debe reflejar esa tensión en vez de promediarla silenciosamente.

**Ejemplo:** Google Maps muestra 4.8 de rating, pero usuarios recientes de Caju y foodies de confianza reportan que la calidad bajó. El Brain debe detectar la tendencia negativa reciente y priorizarla sobre un rating agregado y desactualizado, en vez de mostrar un promedio que oculta el cambio.

## Principio de honestidad

Si el Brain no tiene suficiente señal para responder con confianza, debe decirlo explícitamente en vez de inventar una respuesta plausible. Una respuesta incierta declarada como tal es preferible a una respuesta segura pero potencialmente falsa.

## Relación con otros documentos

- [knowledge.md](knowledge.md) — qué conocimiento entra al Brain y cómo se captura.
- [sources-and-curators.md](sources-and-curators.md) — cómo se modelan las fuentes externas que alimentan al Trust Engine.
- [PRD-008 — Trust Engine](prds/PRD-008-trust-engine.md) — especificación funcional de la versión MVP.

## Decisiones abiertas

- El cálculo exacto de cómo se pondera cada tipo de señal (pesos, fórmulas, umbrales) es una decisión de ingeniería/data, no de este documento. Ver [product-decisions.md](product-decisions.md) y [codex-brief.md](codex-brief.md).
- Cómo se comunica visualmente el nivel de confianza al usuario (¿un score?, ¿una explicación textual?, ¿ambos?) queda definido por diseño a partir de este documento. Ver [design-brief.md](design-brief.md).
