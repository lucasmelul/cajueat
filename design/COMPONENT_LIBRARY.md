# COMPONENT_LIBRARY.md

> Especificación componente por componente. Implementación en `components/`; API en cada `.d.ts`; uso en cada `.prompt.md`. Namespace runtime: `window.CajuEatDesignSystem_dbeea0`.

Cada componente referencia solo tokens (`styles.css`), sin librerías de estilo. Todos exponen estados default/hover/press/focus/disabled y respetan `prefers-reduced-motion`.

---

## Core — `components/core/`

### Button
Acción primaria. **Un solo `primary` por vista** (SPEC-003).
- Variantes: `primary` (relleno caju), `secondary` (surface + hairline), `ghost`, `brandGhost` (wash caju).
- Tamaños: `sm 36` / `md 44` / `lg 52`. Props: `block`, `loading`, `disabled`, `iconLeft/Right`.
- Press: `scale(.97)`. Focus ring caju.

### IconButton
Circular, icon-only. `label` obligatorio (a11y).
- Variantes: `default`, `plain`, `float` (control del mapa: papel elevado translúcido), `brand` (caju).
- Tamaños 36/44/52.

### Chip (Context Chip)
Pill seleccionable. Fila de chips sobre el mapa recontextualiza la query del Brain.
- `selected` (relleno ink), `brand` (relleno caju al seleccionar), `icon`, `as="span"` (tag estático).
- Frosted por defecto (flota sobre el mapa).

### Badge
Etiqueta de estado / overline.
- Tonos: `neutral`, `brand`, `new`, `success`, `danger`, `over` (overline mono UPPERCASE). `dot` opcional.

---

## Brain — `components/brain/`

### BrainCard
La **única** card flotante sobre el mapa (SPEC-001). Voz serif del Brain.
- `eyebrow` (mono), `message` (serif; `<b>` = highlight caju), `sub`, `actions`, `thinking` (pulso del mark).
- Tipos conceptuales: recomendación / oportunidad / descubrimiento / pregunta / recordatorio.

### BrainMark
Motivo de identidad (sparkle/seed) — presencia del Brain. `size`, `radius`, `thinking`. **No es logo.**

### ChatBubble
Un turno de conversación. `from="brain"` responde en el canvas (serif/sans, sin globo); `from="user"` en globo ink a la derecha. `thinking` → 3 puntos. Cards ricas van como `children` de un turno del Brain.

### PromptBar
Input conversacional siempre presente (nunca desaparece). Mark del Brain a la izquierda; mic (→ Knowledge Capture) que se vuelve **send** al escribir. `value/onChange/onSend/onVoice`.

### TrustMeter
Lenguaje visual del Trust Engine. 3 barras + etiqueta en lenguaje natural. `level`: `high` (leaf) / `mid` (amber) / `low` (clay = señales en conflicto, honestidad). `pill` opcional.

### SourceChip
Una señal detrás de una recomendación. Avatar + nombre + tipo (`curator/community/visit/press/menu`) + punto de **peso** (`strong/medium/weak`, Trust Engine).

---

## Discovery — `components/discovery/`

### RestaurantCard
Un restaurante como **decisión**, no fila de directorio. Lidera con el "por qué" del Brain (serif) + Trust Meter + 2-3 quick facts. **Sin estrellas ni cantidad de reviews.**
- `compact` (fila) para peek del mapa y chat. `badge`, `saved/onSave`, `tags`, `trust`, `image` (fallback placeholder caju).

### MapPin
Marcador tipado. La recomendación principal lleva **etiqueta**; secundarios/descubrimientos son **solo punto** (relevancia sobre cantidad). `selected` → crece + anillo caju. `novelty` → anillo ámbar (nueva actividad de Instagram, SPEC-024).
- Tipos: `recommended/new/saved/visited/event/collection` (paleta contenida).

### CajuPoints
Puntos = conocimiento aportado al Brain (nunca vanity). `value`, `delta` (`+N` tras aportar), `size sm/md/lg`, `chip`.

### BottomSheet
Superficie on-demand del mapa. Snaps `peek/half/full` (SPEC-001). Grip visible; el mapa permanece visible detrás. Shell presentacional; conectar el drag/snap propio.

---

## UI Kit — `ui_kits/pwa/`

Recreación interactiva que **compone** estas primitivas (no las reimplementa): Living Map, Conversation, Restaurant Experience, Knowledge Capture, Feedback, Profile, **QR Check-in (SPEC-020)**, **Mi Pasaporte (SPEC-021)** y **canje de puntos (SPEC-023)**. La ficha suma sección de Instagram y el mapa el anillo de novedad (SPEC-024). Abrir `ui_kits/pwa/index.html`.

## Adiciones intencionales

- **BrainMark** — glifo propio para la presencia del Brain (el brief pide "reconocible sin logo"). Es un motivo de UI, no una marca de empresa.
- **SourceChip / TrustMeter** — no nombrados como "componentes" en los docs, pero requeridos para dar expresión visual al Trust Engine (design-brief lo delega a diseño).
