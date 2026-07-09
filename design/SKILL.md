---
name: lugarcito-design
description: Use this skill to generate well-branded interfaces and assets for Lugarcito, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Where things are

- `readme.md` — the design guide: product context, content & visual foundations, iconography, component index. **Start here.**
- `styles.css` — the single stylesheet to link; imports every token file (`tokens/`). Provides all CSS custom properties and the `@font-face`/webfont setup.
- `tokens/` — colors, typography, spacing, radius, elevation, motion.
- `components/` — reusable React primitives (`core/`, `brain/`, `discovery/`). Each has a `.jsx`, `.d.ts` (props), and `.prompt.md` (usage). Runtime namespace: `window.CajuEatDesignSystem_dbeea0`.
- `guidelines/` — foundation specimen cards (colors, type, spacing, elevation, motion, brand).
- `ui_kits/pwa/` — the interactive PWA prototype (Living Map, Conversation, Restaurant, Knowledge Capture, Feedback, Profile). Great reference for composing screens.
- `DESIGN_ANALYSIS.md`, `DESIGN_SYSTEM.md`, `INFORMATION_ARCHITECTURE.md`, `USER_FLOWS.md`, `COMPONENT_LIBRARY.md` — the product-team design docs.

## Non-negotiables when designing for Lugarcito

- **Menos interfaz, más producto.** Respirar: mucho espacio, poca densidad, jerarquía clara.
- **Color contenido:** warm neutrals + the single caju accent. Never a rainbow; the information leads, not the color.
- **Type:** Geist (UI), Newsreader (the Brain's voice), Geist Mono (data), Bricolage Grotesque (wordmark). Sentence case; mono UPPERCASE only for overlines.
- **Voice:** the Brain is a concierge, not a bot — Spanish (voseo), short, with criterio, admits doubt. No emoji. De-emphasize stars/reviews; use the Trust Meter and the "why".
- **Map-first, conversation-first, trust-first.** Motion is functional, subtle, Apple-grade.
- **No invented logo** — use the wordmark + BrainMark. Icons are Lucide (line).
