# DESIGN_SYSTEM.md

> Reglas del sistema visual de CajuEat. Los valores exactos viven en `tokens/*.css`; este documento explica el porqué y el cómo de uso.

---

## Design language

**Menos interfaz, más producto.** El sistema busca que el usuario sienta el producto, no la UI. Superficies de papel cálido flotando sobre un mapa vivo; un único acento; una voz. Reconocible sin logo.

Sensaciones objetivo: **premium, elegante, futurista, calma, inteligencia, precisión.**

## Grid & layout

- **Base 4px.** Toda medida es múltiplo de 4 (`tokens/spacing.css`).
- **Mobile-first / PWA-first.** Canvas de contenido hasta **440px**; gutter de pantalla **16px** (24 en superficies grandes).
- **Safe areas:** `env(safe-area-inset-*)` arriba y abajo (notch + home bar + tab bar).
- **Hit targets:** mínimo **44px** (SPEC-001, accesibilidad).
- **Jerarquía de la Home:** Mapa → Brain → Conversación → Restaurantes → Acciones.

## Color

`tokens/colors.css`. Regla de oro: **color contenido, la información manda.** ~95% de cada pantalla es neutral cálido.

- **Paper / ink:** off-white cálido `#FCFBF8` → near-black cálido `#191512`, con rampa de 7 pasos de ink. Grises entibiados (nunca clínicos).
- **Acento caju** (coral del cashew): `--caju-500 #EF5A22` primario, `-600` press, `-400` hover, `-100/-050` tints. Uso reservado: presencia del Brain, acción primaria, highlights.
- **Amber** (`--amber-500`): calidez secundaria (nuez del cashew), estados "nuevo".
- **Trust:** `leaf` (alta), `amber` (media), `clay` (conflicto/insuficiente). `clay` **no** significa "malo": significa honestidad.
- **Pines:** paleta contenida y tipada — recommended (caju), new (amber), saved (ink), visited (leaf), event (slate), collection (plum).
- **Semánticos:** usar siempre los alias (`--text-primary`, `--surface-card`, `--accent`, `--trust-high`…), no los crudos.

## Tipografía

`tokens/typography.css`. **Excelente legibilidad, pocas variantes.**

- **Geist** — UI + cuerpo. Pesos 400/500/600. Tracking negativo en tamaños grandes.
- **Newsreader** — voz editorial del Brain: resúmenes narrativos, preguntas grandes, prompts de feedback. Serif pensado para leer en pantalla. Solo a tamaños grandes, con moderación.
- **Geist Mono** — datos, coordenadas, Caju Points, lecturas de confianza, overlines (UPPERCASE + tracking).
- **Escala** (mobile-first): display 44 / editorial 30 / h1 28 / h2 22 / h3 18 / title 16 / body 16 / sm 14 / caption 12 / mono 13.
- **Casing:** sentence case en todo; UPPERCASE solo en overlines mono.

## Elevación

`tokens/elevation.css`. **Cálida, suave, baja.** Cada nivel = sombra ambiental difusa + anillo hairline (`--ring-hairline`). Las superficies se leen como *papel elevado*, no como drop-shadow duro.

- `sm` controles sutiles · `md` cards en reposo · `lg` brain card / chips / botones flotantes · `xl` bottom sheet / popovers.
- **Blur/translucidez** (`backdrop-filter`) solo para elementos que flotan sobre el mapa (prompt bar, brain card, chips, floating buttons): el mapa se sigue percibiendo detrás.

## Radios

`tokens/radius.css`. Controles inline **14**, cards **18**, superficies flotantes **24**, bottom sheet **32**, full para pines/avatares/pills. Cuanto más "flota" sobre el mapa, más redondeado.

## Motion & microinteracciones

`tokens/motion.css`. **Siempre funcional, nunca decorativo.**

- **Easing:** `ease-out` (entradas), `ease-in` (salidas), `ease-in-out` (reversibles), `ease-spring` (snap sutil de sheets / llegada del brain card).
- **Durations:** 90 / 160 / 240 / 360 / 520 ms.
- **Press:** `scale(.97)`, sin bounce. **Hover** (puntero): sube tint/borde, nunca invierte color. **Selección:** chips se rellenan de ink; pines **crecen** con anillo caju.
- **Bottom sheet:** transición de altura con `ease-spring` entre peek/half/full.
- **Brain "thinking":** el mark pulsa; en chat, 3 puntos animados.
- Todo respeta `prefers-reduced-motion`.

## Estados (obligatorios por componente)

- **Default / hover / press / focus / disabled** — focus ring caju 3px siempre.
- **Loading:** skeletons sobre mapa / hero / cards. **Nunca pantalla blanca** (SPEC-001/003). Spinner solo dentro de botones.
- **Empty:** el Brain lo explica en palabras (no inventa datos: trust-engine).
- **Error:** sin internet → modo offline (último mapa/lugares); sin ubicación → exploración libre de Buenos Aires; sin datos → el Brain lo dice.

## Bottom sheets

Tres snaps (SPEC-001): **peek** (resumen), **half** (info principal), **full** (→ Restaurant Experience). El mapa permanece visible detrás. Cierre por swipe-down, tap en el mapa o back. Grip visible arriba.

## Cards

Superficie blanca sobre papel, radio 18, elevación `md`, anillo hairline. La `RestaurantCard` lidera con el **"por qué"** del Brain (serif) + Trust Meter + 2-3 quick facts; **sin estrellas ni cantidad de reviews**. Variante `compact` (fila) para peek del mapa y chat.

## Iconografía

Lucide, línea ~1.8px, `currentColor`. Filled solo para activo/seleccionado. Caju reservado a acentos con sentido. Sin emoji, sin glifos unicode como iconos. Único glifo propio: el **BrainMark** (sparkle/seed), presencia del Brain — no es logo.

## Accesibilidad

Contraste AA en texto; targets 44px; texto escalable; gestos con alternativa siempre disponible; `aria-label` en todo control icon-only; focus visible.

## Marca

Sin logo provisto → **no se inventa**. Wordmark **cajueat** en Geist (caju "eat") + BrainMark como presencia. Reemplazar por assets reales cuando existan.
