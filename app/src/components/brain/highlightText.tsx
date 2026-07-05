import type { ReactNode } from 'react';

/**
 * Turns `**phrase**` markers from Brain copy into `<b>` spans (BrainCard.d.ts:
 * "Wrap key phrases in <b> for a caju highlight"). Small and dumb on purpose —
 * the mock Brain only ever emits this one marker shape.
 */
export function highlightText(text: string): ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : part));
}
