import * as React from 'react';

/**
 * Prompt Bar — the always-present conversational input.
 *
 * @startingPoint section="Brain" subtitle="Always-present conversational input bar" viewport="700x120"
 */
export interface PromptBarProps {
  value?: string;
  onChange?: (value: string) => void;
  /** Fired on Enter / send tap when there is text. */
  onSend?: (value: string) => void;
  /** Fired by the mic — entry to Knowledge Capture. */
  onVoice?: () => void;
  placeholder?: string;
  /** Show the leading Brain mark. */
  showMark?: boolean;
  className?: string;
}

export declare function PromptBar(props: PromptBarProps): React.JSX.Element;
