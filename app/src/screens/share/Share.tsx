import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BrainMark } from '../../components/brain';
import { useAppStore } from '../../lib/store/useAppStore';

/**
 * SPEC-004 "Share Sheet (Principal)": the OS lands here (GET /share?title=&text=&url=) when the
 * user shares from Instagram/another app. This screen has no UI of its own — it just hands the
 * shared content to Knowledge Capture's link input (pre-filled, never auto-submitted, so the
 * user still confirms before it reaches the Brain) and redirects home.
 */
export function Share() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setPendingShare = useAppStore((s) => s.setPendingShare);
  const openOverlay = useAppStore((s) => s.openOverlay);

  useEffect(() => {
    const url = params.get('url') ?? '';
    const text = params.get('text') ?? '';
    const title = params.get('title') ?? '';
    setPendingShare({ url, text: [title, text].filter(Boolean).join(' — ') });
    openOverlay('capture');
    navigate('/', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cj-screen" style={{ display: 'grid', placeItems: 'center' }}>
      <BrainMark size={44} radius={14} thinking />
    </div>
  );
}
