import { Mic, Send } from 'lucide-react';
import { BrainMark } from './BrainMark';
import './PromptBar.css';

export interface PromptBarProps {
  value: string;
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  onVoice?: () => void;
  placeholder?: string;
  showMark?: boolean;
  className?: string;
}

/** Prompt Bar — the always-present conversational input (SPEC-001: "nunca desaparece"). */
export function PromptBar({
  value,
  onChange,
  onSend,
  onVoice,
  placeholder = 'Preguntá dónde comer…',
  showMark = true,
  className = '',
}: PromptBarProps) {
  const hasText = value.trim().length > 0;
  const submit = () => {
    if (hasText && onSend) onSend(value);
  };
  return (
    <div className={`caju-prompt ${className}`}>
      {showMark && <BrainMark size={36} radius={11} />}
      <input
        className="caju-prompt__input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        placeholder={placeholder}
        aria-label="Hablar con el Brain"
      />
      {!hasText && (
        <button className="caju-prompt__btn" onClick={onVoice} aria-label="Aportar por voz" type="button">
          <Mic />
        </button>
      )}
      <button className="caju-prompt__btn caju-prompt__send" onClick={submit} disabled={!hasText} aria-label="Enviar" type="button">
        <Send />
      </button>
    </div>
  );
}
