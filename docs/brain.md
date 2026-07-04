# Brain

El Brain es el activo principal de CajuEat (ver [product.md](product.md)). Este documento describe qué hace, con qué trabaja y qué produce — no cómo está construido técnicamente.

## Capacidades

El Brain debe poder:

- entender intención (qué quiere el usuario, aunque no lo diga con precisión);
- entender contexto (dónde está, con quién, qué momento del día, qué ocasión);
- recordar usuarios (preferencias, gustos, historial de experiencias);
- aprender de experiencias (propias del usuario y del conjunto de usuarios);
- recomendar;
- explicar sus recomendaciones (nunca una caja negra);
- comparar opciones;
- planificar (una salida, una noche, un recorrido);
- nutrirse de fuentes externas (foodies, curadores, medios — ver [sources-and-curators.md](sources-and-curators.md));
- construir conocimiento gastronómico propio con el tiempo.

## El Brain no conoce interfaces

Esta es una restricción de diseño deliberada. El Brain debe poder ser consumido por:

- la PWA;
- un chat;
- una interfaz de voz;
- una API;
- agentes automatizados;
- cualquier interfaz futura no contemplada hoy.

Ninguna capacidad del Brain debería depender de que exista una pantalla específica.

## Entradas

El Brain recibe:

- texto (conversación);
- voz;
- imágenes (fotos de platos, menús, lugares);
- links (Reels, TikToks, posts de Instagram, videos de YouTube, artículos);
- ubicación;
- feedback (post-visita, correcciones, confirmaciones);
- señales de fuentes externas (listas curadas, reviews, menciones).

## Salidas

El Brain produce:

- recomendaciones;
- comparaciones;
- planes;
- respuestas conversacionales;
- explicaciones ("por qué te recomiendo esto");
- aprendizaje incorporado al conocimiento propio (Experience Graph).

## El Brain como conocimiento, no solo como modelo

El Brain no es únicamente "un modelo que responde". Es un sistema que **acumula conocimiento propio** sobre restaurantes, platos, personas y experiencias a lo largo del tiempo. Ese conocimiento vive en un grafo de entidades y relaciones (el Experience Graph) y se enriquece con cada interacción.

Ver:

- [knowledge.md](knowledge.md) — el modelo de conocimiento y cómo se captura.
- [trust-engine.md](trust-engine.md) — cómo el Brain pondera señales contradictorias y decide en qué confiar.
- [sources-and-curators.md](sources-and-curators.md) — cómo el Brain usa fuentes externas como foodies e influencers.

## Memoria del usuario

El Brain no guarda conversaciones crudas; guarda **aprendizajes útiles**.

Ejemplo:

- ❌ No guardar: "Lucas habló de sushi."
- ✅ Guardar: "Lucas prefiere sushi tradicional antes que rolls con mucho queso crema."

Ver [PRD-010 — User Profile](prds/PRD-010-user-profile.md) para el detalle de cómo se expone esta memoria al usuario.

## Principio rector

> **Knowledge Compounds** — cada interacción con el Brain (una conversación, una visita, una corrección, una captura de conocimiento) debe dejarlo más inteligente que antes. Si una interacción no aporta ni se usa para aprender, hay que preguntarse si vale la pena que exista.
