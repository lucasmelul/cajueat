**BottomSheet** — the map's on-demand surface. Three snap states: `peek` (summary), `half` (main info), `full` (deep dive → Restaurant Experience). Place it inside a `position: relative` map container; the map stays visible behind it.

```jsx
<BottomSheet state={sheet} onGrip={cycleState}>
  <RestaurantCard compact .../>
  ...
</BottomSheet>
```
