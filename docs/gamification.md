# Gamificación

## Principio rector

La gamificación en CajuEat existe **para mejorar el Brain**, no para generar adicción. Cualquier mecánica de puntos, quiz o recompensa se evalúa contra esta pregunta: ¿esto le da al Brain conocimiento útil, o solo mantiene al usuario abierto en la app?

Si la respuesta es lo segundo, no pertenece al producto.

## Caju Points

Los usuarios ganan Caju Points por **aportar conocimiento**, no por consumir contenido pasivamente.

Acciones que otorgan puntos:

- dejar feedback post-visita;
- confirmar horarios de un lugar;
- subir fotos útiles;
- compartir menús;
- validar datos existentes;
- responder micro-quizzes;
- descubrir lugares nuevos para el Brain;
- corregir información incorrecta.

Acciones que **no** otorgan puntos:

- abrir la app;
- hacer scroll;
- mirar contenido sin interactuar.

> Los puntos representan valor aportado al conocimiento del Brain, no atención capturada.

Ver [PRD-006 — Caju Points](prds/PRD-006-caju-points.md) para la especificación funcional.

## Micro-quizzes

El Brain puede generar micro-quizzes cuando necesita aprender algo puntual que no puede inferir solo. No son formularios: son micro-juegos de 5 a 20 segundos, conversacionales, con una única pregunta clara.

Ejemplos:

- ¿Qué tan ruidoso es este lugar?
- ¿Irías con chicos?
- ¿Cuál de estos platos representa mejor al restaurante?
- ¿Cuánto esperarías por mesa?
- ¿Es buena primera cita?

Cada quiz respondido es una pieza de conocimiento estructurado que entra al Experience Graph (ver [knowledge.md](knowledge.md)), ponderada por el [Trust Engine](trust-engine.md) según cuántos usuarios coinciden y cuán consistentes son sus respuestas.

## Qué evitar

- Puntos por vanity metrics (seguidores, likes, rachas de apertura diaria sin aporte real).
- Leaderboards competitivos que premien cantidad por sobre calidad de aporte.
- Mecánicas de urgencia o pérdida (streaks que castigan, notificaciones de FOMO) — no encajan con Trust First ni con el tono de concierge del producto.

Estas exclusiones están reflejadas también en [mvp.md](mvp.md) (ranking avanzado postergado).

## Decisiones abiertas

- Tabla exacta de puntos por acción, y si existen niveles o recompensas canjeables, es una decisión de producto pendiente. Ver [product-decisions.md](product-decisions.md) y [PRD-006](prds/PRD-006-caju-points.md).
