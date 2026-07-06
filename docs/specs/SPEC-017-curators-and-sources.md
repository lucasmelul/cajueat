# SPEC-017 — Curators & Sources

**Status:** Draft
**Priority:** P1
**Owner:** Product + Claude Code
**Consumers:** Claude Code

Depends On

- PRD-016 Curators & Sources
- sources-and-curators.md
- SPEC-007 Trust Engine
- PRD-009 Admin CMS (entry point — ver "Fuera de alcance")

---

# Objetivo

Definir cómo un curador real (@buenospaladaires_, @salt_argentina, o cualquier otro) deja de ser un string hardcodeado dentro de `sources[]` y pasa a ser una entidad que el Brain evalúa y cuya reputación evoluciona con el tiempo.

Hoy `kind: 'curator'` ya existe en el Trust Engine (`brain/src/types.ts`), pero el "curador" no es más que un nombre de texto plano dentro de un `Source` — no tiene reputación propia, no se reusa entre restaurantes, y su `weight` se asigna a mano en el momento de cargar cada restaurante. Este documento define el paso siguiente: que el curador sea una entidad real.

---

# Filosofía

No copiar rankings. Aprender de ellos.

El objetivo no es replicar la lista de un influencer dentro de CajuEat — es que el Brain aprenda en quién confiar, para qué dominio, para qué usuario y en qué contexto.

Un curador nunca es una autoridad absoluta. Es una fuente de señal, con su propio historial de acierto y su propio sesgo.

---

# Source Entity

Cada curador se modela como una entidad propia, no como un string repetido en cada restaurante que menciona:

- nombre / handle;
- dominios donde es fuerte (ej. parrillas, cocina asiática, brunch) — no es fuerte en todo por igual;
- barrios que cubre;
- estilo (curatorial, popular, técnico);
- consistencia histórica — ¿sus recomendaciones se sostuvieron en el tiempo, o el Brain después encontró evidencia contraria?;
- coincidencia con la comunidad de CajuEat — ¿sus recomendaciones tienden a coincidir con lo que la comunidad de usuarios valida de forma independiente, o diverge?

La reputación **no es un número fijo que se carga una vez**. Se recalcula con cada nueva evidencia — si el Brain después encuentra 5 restaurantes recomendados por un curador que resultaron con contradicciones (ver SPEC-007), la reputación de ese curador para ese dominio baja. Si se sostienen, sube.

---

# Relación con el Trust Engine

Hoy `computeTrust(sources)` pondera `weight` (strong/medium/weak) como un valor fijo por fuente. Con Source Entities reales, el `weight` efectivo de una recomendación de un curador deja de ser fijo: se deriva de su reputación acumulada **para ese dominio específico**. Un curador fuerte en parrillas pero sin historial en café de especialidad no debería pesar igual en ambos dominios.

Esto no reemplaza `computeTrust` — lo alimenta con un mejor insumo. El cálculo de contradicciones/consenso ya construido (SPEC-013 de esta sesión, `trustEngine.ts`) sigue funcionando igual; lo que cambia es de dónde sale el `weight` de una fuente tipo `curator`.

---

# Convergencia de señales

Si un restaurante aparece recomendado por dos curadores de perfiles distintos y varios usuarios de forma independiente, la confianza sube — no porque "muchas fuentes dicen lo mismo" en abstracto, sino porque son fuentes de naturaleza distinta convergiendo en la misma señal (esto ya es, en esencia, lo que hoy hace `distinctKinds` en `computeTrust`; este spec lo extiende a distinguir entre curadores individuales, no solo entre el `kind` genérico "curador").

---

# Fuera de alcance: cómo entra el contenido de un curador

Este documento define el modelo de datos y cómo se integra con el Trust Engine — no cómo un operador humano consigue y carga el contenido real de un curador.

Eso depende de PRD-009 (Admin CMS), que hoy no tiene spec técnica ni implementación: la vía prevista es conversacional ("Analizá @buenospaladaires_" dentro de un CMS que es, en sí mismo, otro cliente del Brain — nunca lógica paralela). Automatizar la lectura de contenido de Instagram/TikTok tiene el mismo problema legal/de ToS que ya se identificó en SPEC-015 para Reel/TikTok — no se resuelve acá.

**Este spec asume que el contenido de un curador (qué restaurantes recomienda, con qué texto) ya llegó al Brain por algún medio** — manualmente, vía Admin CMS, o cargado a mano en el catálogo como se hace hoy. Lo que define es qué pasa una vez que llegó.

---

# Acceptance Criteria

✓ Un curador existe como entidad propia, no como texto repetido dentro de cada `Source`.

✓ La reputación de un curador es específica por dominio (cocina/zona), no un score único global.

✓ La reputación se recalcula con evidencia nueva — nunca se fija una vez y queda estática.

✓ El Trust Engine sigue siendo la única autoridad de confianza — Curators & Sources lo alimenta, no lo duplica.

✓ Ninguna recomendación cita a un curador sin que ese curador tenga contenido real cargado — nunca se inventa que "un curador recomienda esto".

---

# Open Questions

- Umbral exacto de cuántas recomendaciones sostenidas/contradichas mueven la reputación de un curador, y en cuánto.
- Si la reputación de un curador es visible para el usuario (ej. "según @buenospaladaires_, que acierta 8 de cada 10 veces en parrillas") o se mantiene interna al Trust Engine.
- Qué pasa si dos curadores con reputación alta se contradicen entre sí en el mismo restaurante — mismo principio de SPEC-007 (nunca elegir arbitrariamente), pero el caso específico "curador vs. curador" no está resuelto acá.

---

# Notas para Claude Code

No implementar antes de tener claridad sobre PRD-009 (Admin CMS) — sin una vía real de ingesta, este spec solo tiene sentido como modelo de datos, sin nada que lo ejercite con contenido real más allá de lo que ya está hand-authored en `brain/src/data/restaurants.ts`.

El campo `claim` agregado a `Source` en esta sesión (para detección de contradicciones, ver `trustEngine.ts`) es el mismo tipo de pieza que va a necesitar una Source Entity de curador — revisar que ambos evolucionen juntos, no como dos modelos paralelos.

No implementar todavía — este documento es la especificación a validar con Producto antes de tocar código.
