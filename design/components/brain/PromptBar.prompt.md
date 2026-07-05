**PromptBar** — the always-present conversational input, docked at the bottom of the map. It never disappears (SPEC-001). Mic becomes send once there's text; the mic is also the entry point to voice Knowledge Capture.

```jsx
const [q, setQ] = React.useState('');
<PromptBar value={q} onChange={setQ} onSend={ask} onVoice={openCapture} />
```
