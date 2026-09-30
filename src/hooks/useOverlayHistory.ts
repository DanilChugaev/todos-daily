import { useCallback, useEffect, useId, useRef } from 'react';

interface OverlayHistoryOptions {
  isOpen: boolean;
  onBack: () => boolean;
}

const OVERLAY_STATE_KEY = 'todosDailyOverlay';

export function useOverlayHistory({ isOpen, onBack }: OverlayHistoryOptions) {
  const overlayId = useId();
  const hasEntryRef = useRef(false);

  const pushEntry = useCallback(() => {
    window.history.pushState({ ...window.history.state, [OVERLAY_STATE_KEY]: overlayId }, '');
    hasEntryRef.current = true;
  }, [overlayId]);

  useEffect(() => {
    if (!isOpen) {
      hasEntryRef.current = false;
      return undefined;
    }

    if (!hasEntryRef.current) pushEntry();
    const handlePopState = (event: PopStateEvent) => {
      if (!hasEntryRef.current || event.state?.[OVERLAY_STATE_KEY] === overlayId) return;

      hasEntryRef.current = false;
      const shouldRemainOpen = onBack();
      if (shouldRemainOpen) pushEntry();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, onBack, overlayId, pushEntry]);

  return { pushEntry };
}
