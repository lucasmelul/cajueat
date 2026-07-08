# CajuEat PWA — UI Kit

Interactive, click-through recreation of the CajuEat mobile PWA, built entirely from the design-system components. It is a *recreation of the intended product* (grounded in `/docs` SPECs), not a new design.

Open **`index.html`** for the full prototype: an iPhone frame you can actually use.

## Screens

| File | Screen | Source spec |
|---|---|---|
| `LivingMap.jsx` | **Living Map** (Home) — map-first, one Brain card, context chips, typed pins, always-present Prompt Bar | SPEC-001 |
| `Conversation.jsx` | **Conversation** — chat as navigation; Brain replies with text + rich RestaurantCards + follow-up chips | SPEC-002 |
| `Restaurant.jsx` | **Restaurant Experience** — editorial ficha: hero, Brain summary, quick facts, qué pedir, Brain tips, sources, ideal/no-ideal | SPEC-003 |
| `KnowledgeCapture.jsx` | **Knowledge Capture** — voz/foto/reel/nota → Brain analiza → aprende → Caju Points | SPEC-004 |
| `Feedback.jsx` | **Post-visit Feedback** — 3-4 question conversation, not a review; earns Caju Points | CP-009 |
| `Profile.jsx` | **Profile / Memory** — gastronomic DNA, points, saved, contributions, passport card | SPEC-010 |
| `CheckIn.jsx` | **QR Check-in** — in-app camera, 3-signal validation, success/error; also **points redemption** (mode `redeem`) | SPEC-020 / SPEC-023 |
| `Passport.jsx` | **Mi Pasaporte de Cafés** — visited stamps + por-visitar by barrio, real-catalog progress, no streaks | SPEC-021 |

Supporting: `Shell.jsx` (phone frame + tab bar + navigation + overlays), `MapCanvas.jsx` (stylized calm map backdrop), `kit.jsx` (Icon + StatusBar helpers), `data.js` (fictional Buenos Aires sample data), `CheckIn.jsx` (QR check-in SPEC-020 + points redemption SPEC-023), `Passport.jsx` (Coffee Passport SPEC-021).

## What you can do in the prototype
- Tap map pins → peek card → open the full restaurant ficha.
- Type in the Prompt Bar or tap **Explorar** → conversation with the Brain.
- Tap **+** (or the mic) → Knowledge Capture flow.
- **Perfil** → gastronomic DNA, saved places, and the post-visit Feedback flow.
- Save/unsave places; state persists across screens within the session.

## Notes
- The map is intentionally abstract UI scaffolding — the real PWA renders a live map library. It is never a dump of streets.
- Icons are **Lucide** (CDN) — see the root `README.md` (Iconography) for the substitution rationale.
- Images are warm caju placeholders; drop in real photography for production.
