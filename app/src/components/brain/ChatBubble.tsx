import type { HTMLAttributes, ReactNode } from 'react';
import { BrainMark } from './BrainMark';
import './ChatBubble.css';

export interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  from?: 'brain' | 'user';
  children?: ReactNode;
  thinking?: boolean;
}

/**
 * One conversation turn. The Brain answers on the canvas (no bubble,
 * editorial); the user speaks in a compact ink bubble (SPEC-002).
 */
export function ChatBubble({ from = 'brain', children, thinking = false, className = '', ...rest }: ChatBubbleProps) {
  if (from === 'brain') {
    return (
      <div className={`caju-msg caju-msg--brain ${className}`} {...rest}>
        <div className="caju-msg__mark">
          <BrainMark size={30} radius={10} thinking={thinking} />
        </div>
        <div className="caju-msg__content">
          {thinking ? (
            <span className="caju-msg__dots">
              <span />
              <span />
              <span />
            </span>
          ) : (
            children
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={`caju-msg caju-msg--user ${className}`} {...rest}>
      <div className="caju-msg__content">{children}</div>
    </div>
  );
}
