import * as React from 'react';

/**
 * One conversation turn. Brain answers on-canvas (editorial, no
 * bubble); user speaks in a compact ink bubble.
 */
export interface ChatBubbleProps {
  from?: 'brain' | 'user';
  /** Message content. Under a Brain turn, may include rich cards. */
  children?: React.ReactNode;
  /** Render the animated thinking indicator (Brain only). */
  thinking?: boolean;
  className?: string;
}

export declare function ChatBubble(props: ChatBubbleProps): React.JSX.Element;
