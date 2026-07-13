/**
 * PRD-019 Voice Experience — "Salidas: Voz": the browser's native SpeechSynthesis, same
 * no-cost, no-backend approach as useSpeechRecognition's input side. Unlike SpeechRecognition,
 * SpeechSynthesis is standard and already typed by lib.dom — no custom typing needed here.
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Cancels whatever might already be speaking first — a reply never queues behind a previous one. */
export function speak(text: string): void {
  if (!isSpeechSynthesisSupported() || !text.trim()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-AR';
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel();
}
