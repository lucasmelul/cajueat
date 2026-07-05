**RestaurantCard** — a restaurant as a *decision*. Leads with the Brain's one-line "why" (serif), a trust meter, and 2–3 quick facts — never stars or review counts. Use `compact` for the map peek and inside chat.

```jsx
<RestaurantCard
  name="Osaka" cuisine="Nikkei" neighborhood="Palermo" price="$$$"
  why="Barra japonesa clásica, foco total en el producto."
  tags={['Ideal en pareja', 'Reserva', '40 min']}
  trust="high" badge={<Badge tone="brand">Recomendado</Badge>}
  saved={saved} onSave={setSaved} onClick={open}
/>
```
