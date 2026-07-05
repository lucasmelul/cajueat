# CajuEat — Design System

> **Menos interfaz. Más producto.** — SPEC-012
>
> The design language for CajuEat, an AI-native gastronomic discovery product for Buenos Aires. This system is the visual and interaction proposal for the product defined in the CajuEat docs — premium, calm, futuristic, map-first, conversation-first, trust-first.

This is a **from-scratch visual system**. The source repository defines the product exhaustively but deliberately left the visual language to design (SPEC-012: *"Sistema de diseño, tipografía y lenguaje visual definitivo — no está definido… es responsabilidad de diseño proponerlo"*). Everything here is a proposal grounded in that brief, not a recreation of an existing UI.

---

## Sources

- **GitHub — `lucasmelul/cajueat`** (https://github.com/lucasmelul/cajueat) — a documentation-only product repo: `docs/` holds the Context Pack, Context Packs (CP-001+), PRDs (PRD-001+) and functional Specs (SPEC-001+). No code, colors, fonts, or logo exist in the repo. Explore it further to build more faithful CajuEat designs; the key docs are `docs/CAJUEAT_CONTEXT_PACK.md`, `docs/design-brief.md`, `docs/experience-principles.md`, `docs/specs/SPEC-001-living-map.md`, `docs/specs/SPEC-003-restaurant-experience.md`, `docs/specs/SPEC-012-design-system-foundations.md`, and `docs/trust-engine.md`.

The product is documented in **Spanish (rioplatense)**; all product-facing copy in this system follows suit.

---

## The product in one screen

CajuEat is **three products**: the **Brain** (the gastronomic intelligence — the real protagonist), the **Platform** (auth, points, CMS…), and the **PWA** (the first, mobile-first client). The thesis: **"CajuEat no muestra listas. CajuEat ayuda a decidir."** Not Google Maps, not TripAdvisor, not a food social network.

Five principles drive every screen: **Brain First · Map First · Conversation First · Trust First · Knowledge Compounds.**

---

## Content fundamentals

**Language.** Spanish, rioplatense (voseo: *"pedí", "andá", "reservá"*). Product-facing copy is in Spanish; code, tokens and docs are in English/Spanish as here.

**Voice — the Brain.** Writes like an expert concierge friend, not a bot. First person, addresses the user as *vos*. Short, actionable, with *criterio* (a point of view). Admits doubt honestly (Trust First). Never markety, never a wall of text.

- ✓ *"A dos cuadras hay una barra de sushi que te va a gustar. Reservá."*
- ✓ *"No estoy seguro de los horarios hoy. ¿Confirmamos?"*
- ✗ *"¡¡Descubrí los 20 MEJORES restaurantes!! 🍣🔥"*
- ✗ *"Este lugar tiene 4.8 estrellas y 1.240 reseñas."* (we de-emphasize stars/reviews)
- ✗ *"Como modelo de lenguaje…"* (never breaks the concierge character)

**Casing.** Sentence case everywhere in UI. Mono UPPERCASE only for small overlines/eyebrows (`QUÉ PEDIR`, `BRAIN TIPS`). Never all-caps headlines.

**Numbers & data.** Understated. Price as `$`/`$$`/`$$$`, time as *"40 min promedio"*, points as `+30`. Stars and review counts are intentionally absent — the Trust Meter and the Brain's "why" replace them.

**Emoji.** Not used in the product UI. The brand expresses warmth through color and the serif voice, not emoji.

**Vibe.** Calm, confident, curated. Every sentence should help the user *decide*, fast.

---

## Visual foundations

**Character.** Premium, futuristic, calm — the quality bar is Apple Maps / Arc / Linear / Raycast, applied to food. "Recognizable without a logo" (SPEC-012): the warm paper, the single caju accent, the serif Brain voice and the sparkle mark do the identifying.

**Color.** *Muy contenido* — information has priority, not color.
- **Warm neutrals** carry ~95% of every screen: a warm off-white **paper** (`#FCFBF8`) and a warm near-black **ink** (`#191512`) with a 7-step ramp. Greys are hue-tinted warm so nothing reads clinical.
- **One brand accent — caju** (cashew coral, `#EF5A22` primary), used sparingly for the Brain's presence, the primary action, and highlights. A secondary **amber** (`#E9A23B`, the cashew nut) adds warmth.
- **Trust palette:** **leaf** green = high confidence, **amber** = partial, **clay** terracotta = conflicting/insufficient signals (honesty, not "bad").
- **Pin palette:** a small, deliberate set to type map markers (recommended/new/saved/visited/event/collection) — never a rainbow.

**Typography.** Excellent legibility, few variants.
- **Bricolage Grotesque** — the brand display face: the **CajuEat wordmark** and large brand moments. Distinctive, warm, modern — it carries the identity in lieu of a logo.
- **Geist** — all UI and body (geometric-humanist grotesque; Linear/Vercel-grade neutrality).
- **Newsreader** — the Brain's editorial voice: narrative restaurant summaries, big questions, feedback prompts. Made for on-screen reading. Used sparingly, at large sizes.
- **Geist Mono** — data, coordinates, Caju Points, trust readouts, overlines.
- Weights: 400/500/600 (Geist), 400 (serif). Tight tracking on large sizes.

**Backgrounds.** Solid warm paper. The Living Map is the one full-bleed surface (a calm, muted, abstract cartography — never a dump of streets). No decorative gradients, no textures, no photographic hero washes except real restaurant imagery. Restaurant hero images get a bottom ink gradient for legible overlaid type.

**Cards & surfaces.** White surfaces on warm paper. Radii: inline controls `14px`, cards `18px`, floating map surfaces `24px`, bottom sheets `32px`. Elevation is **warm-tinted, soft, low** — each level pairs a diffuse ambient shadow with a hairline ring, so floating elements read as *lifted paper* over the map, never a hard drop shadow. Frosted/translucent surfaces (backdrop blur) are used specifically for elements that float over the live map (prompt bar, brain card, chips, floating buttons) so the map stays sensed behind them.

**Motion.** *Siempre funcional, nunca decorativo.* Apple-grade: subtle, quick, spatially honest. Entrances decelerate (`ease-out`), bottom sheets snap with a gentle spring, exits accelerate. Press feedback = a small `scale(.97)`, never a bounce. Durations 90–520ms. All motion respects `prefers-reduced-motion`.

**States.**
- *Hover* (pointer devices): a step-up in surface tint or border, never a color flip.
- *Press:* shrink to 97% + slightly darker caju.
- *Selected:* ink-filled chips; map pins **grow** with a caju focus ring.
- *Focus:* a 3px caju focus ring (`--focus-ring`), always visible on paper.
- *Disabled:* 45% opacity.
- *Loading:* skeletons over the map/hero/cards — never a blank screen (SPEC-001/003). Spinners only inside buttons.
- *Empty:* the Brain explains in words rather than showing a void.

**Layout.** Mobile-first, PWA-first. 4px spacing grid; generous whitespace (*respirar*). 16px screen gutter. Minimum 44px hit targets. Content canvas caps at 440px. Safe-area insets respected top and bottom.

---

## Iconography

**Set — Lucide** (thin 1.8–2px line icons), loaded from CDN (`unpkg.com/lucide`). **Substitution flag:** the source repo defines no icon system, so Lucide was chosen to match the brief's clean, futuristic, Linear/Arc character. Swap for a bespoke set later if desired.

- **Line, not filled**, ~1.8px stroke, to stay calm and premium. Filled variants only for active/selected affordances (e.g. a saved bookmark).
- Icons are always paired with tokens/`currentColor`; caju is reserved for meaningful accents (the mic/send, quick-fact glyphs), ink for neutral controls.
- **The sparkle/seed mark** (`BrainMark`) is the one bespoke glyph — the Brain's presence motif, drawn in caju. It is *not* a company logo (see Brand → "No logo" below).
- **No emoji** as icons. **No unicode-glyph icons.** **No hand-rolled decorative SVG** beyond the brand mark.

**No logo.** The source provided none. Per policy we did **not** invent one: the brand identity is the **`CajuEat` wordmark** set in Bricolage Grotesque ("Caju" ink, "Eat" caju, with a caju seed accent — see the `Wordmark` component), and the sparkle `BrainMark` stands in for the Brain's presence. Both are placeholders — replace with real brand assets when available.

---

## Components

Reusable React primitives (namespace `window.CajuEatDesignSystem_dbeea0`). Grouped by concern:

**Core** (`components/core/`)
- **Button** — primary action; caju `primary` / `secondary` / `ghost` / `brandGhost`; sizes sm/md/lg.
- **IconButton** — circular icon-only; `float` (map controls), `brand`, `plain`.
- **Chip** — selectable Context Chip (map/query context) or static tag.
- **Badge** — status label / mono overline; tones follow the trust palette.

**Brand** (`components/brand/`)
- **Wordmark** — the CajuEat typographic identity lockup (Bricolage Grotesque, no logo mark).

**Brain** (`components/brain/`)
- **BrainCard** — the single floating card over the map; serif voice.
- **BrainMark** — the sparkle/seed identity motif for the Brain's presence.
- **ChatBubble** — a conversation turn (Brain on-canvas, user in an ink bubble).
- **PromptBar** — the always-present conversational input.
- **TrustMeter** — visual language of the Trust Engine (high/mid/low).
- **SourceChip** — one weighted signal behind a recommendation.

**Discovery** (`components/discovery/`)
- **RestaurantCard** — a restaurant as a decision (leads with the "why", not stars).
- **MapPin** — typed map marker.
- **CajuPoints** — knowledge contributed to the Brain.
- **BottomSheet** — the map's peek/half/full on-demand surface.

Each component ships a `.jsx`, a `.d.ts` (props contract), a `.prompt.md` (usage), and a group card HTML.

---

## Index — what's in this project

- **`styles.css`** — the single entry point consumers link. Imports everything below.
- **`tokens/`** — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `fonts.css`, `base.css`.
- **`components/`** — `core/`, `brain/`, `discovery/` (see Components above).
- **`guidelines/`** — foundation specimen cards (Colors, Type, Spacing, Elevation, Motion, Brand) shown in the Design System tab.
- **`ui_kits/pwa/`** — the interactive PWA prototype (Living Map, Conversation, Restaurant, Knowledge Capture, Feedback, Profile). Open `ui_kits/pwa/index.html`.
- **Design docs** (for the product team, per the design brief):
  - `DESIGN_ANALYSIS.md` — audit of the docs, principles, components detected, questions & decisions.
  - `DESIGN_SYSTEM.md` — the full visual-system rulebook.
  - `INFORMATION_ARCHITECTURE.md` — navigation model.
  - `USER_FLOWS.md` — key end-to-end flows.
  - `COMPONENT_LIBRARY.md` — component-by-component spec.
- **`SKILL.md`** — makes this system usable as a downloadable Agent Skill.

---

## Caveats

- **No logo / brand mark** was provided; the wordmark + sparkle motif are placeholders.
- **Fonts** (Bricolage Grotesque, Geist, Newsreader, Geist Mono) were chosen by design — none were specified in the source — and load from Google Fonts. See `tokens/fonts.css`.
- **Icons** are Lucide (substitution — no set defined in source).
- The map surface is **abstract UI scaffolding**; production renders a live map library.
- All sample restaurants, copy and data are **fictional**.
