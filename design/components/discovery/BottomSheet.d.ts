import * as React from 'react';

export type SheetState = 'peek' | 'half' | 'full';

/**
 * Bottom Sheet — on-demand map surface with peek/half/full snaps.
 * Must be placed inside a `position: relative` map container.
 */
export interface BottomSheetProps {
  state?: SheetState;
  /** Tap/drag on the grip. */
  onGrip?: () => void;
  /** Explicit height override (CSS value). */
  height?: string | null;
  children?: React.ReactNode;
  className?: string;
}

export declare function BottomSheet(props: BottomSheetProps): React.JSX.Element;
