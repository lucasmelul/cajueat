**IconButton** — circular, icon-only. Always pass `label` for accessibility. Use `float` for map controls (lifted paper over the map), `brand` for the caju send/primary action, `plain` inside toolbars.

```jsx
<IconButton icon={<LocateIcon/>} label="Usar mi ubicación" variant="float" />
```

Variants: `default | plain | float | brand`. Sizes `sm(36) | md(44) | lg(52)`.
