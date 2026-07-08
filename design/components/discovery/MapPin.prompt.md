**MapPin** — a typed marker on the Living Map. The Brain's main pick carries a label; secondary and discovery pins are dot-only to keep the map calm (never hundreds of equal pins). Selecting a pin grows it with a caju ring.

```jsx
<MapPin type="recommended" label="Osaka" selected />
<MapPin type="visited" dotOnly />
<MapPin type="event" label="Feria · sáb" />
```

Types: `recommended | new | saved | visited | event | collection`. Add `novelty` for an amber content ring (new Instagram activity, SPEC-024).
