**Chip (Context Chip)** — a selectable pill. The row of chips above the map switches the Brain's context ("Cerca", "Abierto ahora", "Para una cita"). Frosted white by default; ink-filled when `selected`.

```jsx
<Chip selected icon={<ClockIcon/>}>Abierto ahora</Chip>
<Chip>Para una cita</Chip>
```

Props: `selected`, `brand` (caju fill when selected), `icon`, `as="span"` for a static tag.
