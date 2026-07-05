**ChatBubble** — a conversation turn. The Brain replies on the canvas in sans (no bubble, concierge voice); the user's words sit in a compact ink bubble on the right. Rich replies (RestaurantCards, comparisons) go as `children` of a Brain turn.

```jsx
<ChatBubble from="user">algo tranquilo para hablar</ChatBubble>
<ChatBubble from="brain">
  Tres opciones con <b>buena acústica</b> cerca tuyo:
  <RestaurantCard .../>
</ChatBubble>
<ChatBubble from="brain" thinking />
```
