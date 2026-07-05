**Button** — the primary tap target. Use one caju `primary` per view for the single most important action; everything else is `secondary`, `ghost`, or `brandGhost`.

```jsx
<Button variant="primary" size="lg" block iconLeft={<PlusIcon/>}>
  Cómo llegar
</Button>
```

Variants: `primary` (caju fill), `secondary` (surface + hairline), `ghost` (bare), `brandGhost` (caju wash). Sizes `sm | md | lg` — md is 44px (min tap target). Props: `block`, `loading`, `disabled`, `iconLeft`, `iconRight`.
