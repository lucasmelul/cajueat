# Handoff → Claude Code · CajuEat PWA

## Overview
This bundle is the **CajuEat design system + an interactive PWA prototype** for CajuEat — an AI-native gastronomic discovery product for Buenos Aires. The product thesis: **"CajuEat no muestra listas. Ayuda a decidir."** The PWA is the first client of the **Brain** (a separate gastronomic intelligence service). Everything here implements the product defined in the source docs (`docs/` in the `lucasmelul/cajueat` repo — Context Packs, PRDs, SPECs).

Build target: a **mobile-first PWA** (installable, offline-capable, feels native, 60fps) whose Home is a full-screen **Living Map**.

## About the design files
The files in this bundle are **design references created in HTML/React** — prototypes that show the intended look and behavior. They are **not production code to ship as-is**. Your task is to **recreate these designs in the target codebase's environment** using its established patterns and libraries. If no codebase exists yet, choose the appropriate stack (see "Recommended stack") and implement there.

- The **design system** (`styles.css` + `tokens/` + `components/`) is the source of truth for tokens and component contracts. Port the CSS custom properties verbatim; re-implement the React components in your framework using those tokens.
- The **prototype** (`ui_kits/pwa/`) shows the assembled screens and interactions. Treat it as the visual/interaction spec, not the architecture.
- The **Brain is mocked** in the prototype (`ui_kits/pwa/data.js`, fake timeouts). In production the PWA calls the Brain API; all enriched data (recommendations, "why", trust, sources) arrives already computed from the Brain — the UI never queries multiple sources directly (see `docs/specs/SPEC-003`).

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, shadows, motion and copy are all defined. Recreate pixel-accurately using the exact token values below. Do **not** round values to a framework's default scale — use the literals.

## Screenshots
Reference renders of each screen (full device frame) are in `handoff_screenshots/`:

1. `1-living-map.png` — Living Map (Home)
2. `2-conversation.png` — Conversation with rich RestaurantCards
3. `3-restaurant.png` — Restaurant Experience (ficha)
4. `4-knowledge-capture.png` — Knowledge Capture sheet
5. `5-profile.png` — Profile / Memory
6. `6-feedback.png` — Post-visit Feedback

## Recommended stack
- **React + Vite + TypeScript**, configured as an installable **PWA** (`vite-plugin-pwa`), mobile-first.
- **Map:** MapLibre GL JS (or Mapbox GL) for the Living Map — styled muted/calm, showing only relevant typed pins (never a full dump). The prototype's `MapCanvas` is an abstract stand-in; replace with the real map.
- **State:** a light store (Zustand/Context) for `saved`, current route, selected restaurant, conversation turns.
- **Icons:** [Lucide](https://lucide.dev) (`lucide-react`) — already the icon set used here.
- **Fonts:** Bricolage Grotesque, Geist, Newsreader, Geist Mono (Google Fonts; self-host for production).
- **Brain:** consume its API; stub with the shapes in `ui_kits/pwa/data.js` until it's live.

---

## Design tokens
Full source: `styles.css` → `tokens/*.css`. Port these custom properties exactly.

**Color — warm neutrals (carry ~95% of the UI)**
`--paper #FCFBF8` · `--paper-sunk #F5F2EC` · `--surface #FFFFFF`
`--ink-900 #191512` · `--ink-700 #453D35` · `--ink-600 #5E554B` · `--ink-500 #7C7267` · `--ink-400 #9E948A` · `--ink-300 #C2B9AE`
`--line #E7E1D6` · `--line-soft #F0ECE3` · `--line-strong #D8D0C3`

**Color — brand & semantic (contained)**
Caju (accent): `--caju-700 #C0350E` · `--caju-600 #DB431A` · `--caju-500 #EF5A22` (primary) · `--caju-400 #F87A45` · `--caju-100 #FCE3D7` · `--caju-050 #FDF3EC`
Amber: `--amber-500 #E9A23B` · `--amber-100 #FBEBCE`
Trust: leaf `--leaf-600 #1B8455` (alta) · amber (media) · clay `--clay-500 #CB5341` (conflicto/insuficiente — honestidad, no "malo")
Pins: recommended=caju · new=amber · saved=`#2C2621` · visited=leaf · event=`#4E7A93` · collection=`#8A6BA6`
Focus ring: `--focus-ring rgba(239,90,34,.38)`

**Typography**
Families: `--font-display 'Bricolage Grotesque'` (wordmark) · `--font-sans 'Geist'` (UI/body) · `--font-serif 'Newsreader'` (Brain editorial voice) · `--font-mono 'Geist Mono'` (data/overlines).
Scale (px): display 44 · editorial 30 · h1 28 · h2 22 · h3 18 · title 16 · body 16 · sm 14 · caption 12 · mono 13.
Weights: Geist 400/500/600; Newsreader 400/500; Bricolage 700. Sentence case everywhere; mono UPPERCASE + `.08em` tracking only for overlines.

**Spacing** — 4px base: 4/8/12/16/20/24/32/40/48/64. Gutter 16. Min tap target **44px**. App canvas max-width 440. Respect `env(safe-area-inset-*)`.

**Radius** — controls 14 · cards 18 · floating map surfaces 24 · bottom sheet 32 · full for pins/avatars/pills.

**Elevation** (warm-tinted, soft, low; each = ambient shadow + hairline ring) — `--shadow-sm/md/lg/xl` in `tokens/elevation.css`. Floating-over-map surfaces (prompt bar, brain card, chips, FABs) use `backdrop-filter: blur()` so the map stays sensed behind.

**Motion** — durations 90/160/240/360/520ms. Easing: `ease-out` (entradas), `ease-in` (salidas), `ease-in-out` (reversibles), `ease-spring cubic-bezier(.34,1.28,.5,1)` (sheet snap / brain card). Press = `scale(.97)`, never bounce. Honor `prefers-reduced-motion`.

---

## Screens / Views
Detailed layout & component specs live in `COMPONENT_LIBRARY.md`, `INFORMATION_ARCHITECTURE.md` and `docs/specs/`. Summary:

1. **Living Map (Home)** — `ui_kits/pwa/LivingMap.jsx` · SPEC-001. Full-screen map; top: CajuEat wordmark + Caju Points + avatar; location pill + horizontally-scrolling context chips; typed pins (only the Brain's main pick is labelled, the rest are dots; recommended pin has a live pulse); floating layer/locate buttons; bottom: one Brain Card (or a peek RestaurantCard when a pin is selected) above the always-present Prompt Bar; tab bar. **The map is never empty and always shows a recommendation.**
2. **Conversation** — `Conversation.jsx` · SPEC-002. Chat as navigation. Header = Brain identity ("Caju · Concierge gastronómico"). Empty-state greeting (serif) + starter chips. Brain replies **on-canvas** (no bubble) with text + rich RestaurantCards + follow-up chips; user speaks in a compact ink bubble; animated thinking indicator. Short, actionable, with criterio — never blog-length.
3. **Restaurant Experience** — `Restaurant.jsx` · SPEC-003. Editorial ficha (not a directory). Order: hero (½ screen: image, name in serif, cuisine, TrustMeter, price) → Brain Summary (serif, ≤3 párrafos) → single primary CTA (Cómo llegar) → Quick Facts (≤6) → Qué pedir (por perfil) → Personality → Brain Tips → ¿Por qué? (weighted SourceChips) → Ideal / No ideal → Cerca de acá (nearby) → Ask Caju. Sticky CTA bar. **All decisive info before the first scroll. No stars/review counts.**
4. **Knowledge Capture** — `KnowledgeCapture.jsx` · PRD-004. Overlay sheet: voz/foto/reel-link/nota → Brain analyzes step-by-step → shows what it learned (serif) + Caju Points. < 30s, no forms.
5. **Post-visit Feedback** — `Feedback.jsx` · CP-009. Overlay: 3–4 chip-answer questions with progress + per-answer confirmation → what the Brain learned about you + Caju Points. Not a review.
6. **Profile / Memory** — `Profile.jsx` · SPEC-010. Avatar + name + Caju Points; pending-feedback nudge; **editable** ADN gastronómico (chips, edit mode with remove/add); Guardados; aportes timeline; aportar CTA.

## Interactions & behavior
Full flows in `USER_FLOWS.md`. Key rules:
- Prompt Bar **never disappears** (may collapse). Only **one** Brain Card and **one** selected restaurant at a time.
- Tap pin → pin grows + caju ring → bottom sheet **peek → half → full** (map stays visible). Swipe-down / tap-map / back closes.
- "Cómo llegar" opens Google/Apple Maps (no in-app navigation).
- Zoom changes context (far → barrios, near → restaurantes), doesn't just scale.
- Entrances decelerate; sheets spring-snap; press shrinks to .97.

## State management
- `route` (map | convo | restaurant:id | profile), `overlay` (capture | feedback | null), `selectedPin`, `saved: Record<id,bool>`, `conversation.turns`, `query`, editable `dna`.
- Data fetching: all restaurant/recommendation/trust/source data comes **enriched from the Brain API**; the UI does not compose it. Loading → skeletons over map/hero/cards (never blank). Empty/uncertain → the Brain says so (Trust First), never invents.

## Assets
- **No logo** — the brand is the typographic **Wordmark** (`components/brand/Wordmark.jsx`) + the sparkle **BrainMark**. Do not invent a logo.
- **Icons:** Lucide (line, ~1.8px). **Images:** warm caju placeholders in the prototype — swap for real restaurant photography (hero gets a bottom ink gradient for legible overlay text).
- **Fonts:** Google Fonts (self-host for production).

## Files
- `styles.css`, `tokens/` — design tokens & fonts (port verbatim).
- `components/` — component contracts: `<Name>.jsx` (reference impl), `<Name>.d.ts` (props), `<Name>.prompt.md` (usage). Groups: `core/`, `brand/`, `brain/`, `discovery/`.
- `ui_kits/pwa/` — the assembled prototype (`index.html` runs it; screen `.jsx` files as above).
- `readme.md`, `DESIGN_SYSTEM.md`, `DESIGN_ANALYSIS.md`, `INFORMATION_ARCHITECTURE.md`, `USER_FLOWS.md`, `COMPONENT_LIBRARY.md` — full design guide.
- `guidelines/` — foundation specimen cards.

> Run the prototype: open `ui_kits/pwa/index.html` inside this project (it loads the compiled `_ds_bundle.js` at the project root). Read the source screen `.jsx` files for exact structure and copy.
