**BrainCard** — the one floating card on the Living Map. Speaks in the Brain's serif voice; only ever one visible at a time. `BrainMark` is the sparkle/seed identity motif (use it anywhere the Brain is "present").

```jsx
<BrainCard
  eyebrow="CAJU · RECOMENDACIÓN"
  message={<>A dos cuadras hay una <b>barra de sushi</b> que encaja con lo que te gustó anoche.</>}
  sub="Basado en tu última visita a Osaka."
  actions={<><Button size="sm" variant="primary">Ver</Button><Button size="sm" variant="ghost">No ahora</Button></>}
/>
```

Highlight key phrases with `<b>` inside `message`. Set `thinking` to pulse the mark while the Brain reasons.
