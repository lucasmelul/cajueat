/**
 * Incrementally pulls the plain-text value of one string field out of a JSON
 * document that is still being generated token by token (SPEC-002: replies
 * must appear progressively, never all-at-once). Works directly on the raw,
 * not-yet-complete JSON text so the UI can show `reply` growing in real time
 * while `restaurantIds`/`chips` are still being written — the full JSON is
 * still parsed and grounding-checked separately once complete.
 *
 * Position-agnostic (doesn't assume `fieldName` is the first property) and
 * handles `\"`, `\\`, `\n`, `\t`, `\r` escapes split across chunk boundaries.
 */
export function createStringFieldExtractor(fieldName: string) {
  const marker = `"${fieldName}":"`;
  let phase: 'seeking' | 'in-string' | 'done' = 'seeking';
  let searchBuffer = '';
  let pendingBackslash = false;

  function processInString(s: string): string {
    let out = '';
    for (let i = 0; i < s.length; i += 1) {
      const ch = s[i];
      if (pendingBackslash) {
        pendingBackslash = false;
        switch (ch) {
          case 'n':
            out += '\n';
            break;
          case 't':
            out += '\t';
            break;
          case 'r':
            out += '\r';
            break;
          default:
            out += ch;
        }
        continue;
      }
      if (ch === '\\') {
        pendingBackslash = true;
        continue;
      }
      if (ch === '"') {
        phase = 'done';
        return out;
      }
      out += ch;
    }
    return out;
  }

  function push(chunk: string): string {
    if (phase === 'done') return '';

    if (phase === 'seeking') {
      searchBuffer += chunk;
      const idx = searchBuffer.indexOf(marker);
      if (idx === -1) {
        // Keep only enough of the tail to still catch a marker split across the next chunk.
        const keep = Math.min(searchBuffer.length, marker.length - 1);
        searchBuffer = searchBuffer.slice(searchBuffer.length - keep);
        return '';
      }
      const rest = searchBuffer.slice(idx + marker.length);
      searchBuffer = '';
      phase = 'in-string';
      return processInString(rest);
    }

    return processInString(chunk);
  }

  return { push };
}
