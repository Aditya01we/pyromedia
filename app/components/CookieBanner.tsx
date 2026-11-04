'use client';

import { useState, useSyncExternalStore } from 'react';

const CONSENT_KEY = 'phyo_consent';

// "1" = accepted, "0" = declined. Nothing is tracked until the visitor accepts.
function readConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function saveConsent(value: '1' | '0') {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked (private mode etc.) — the choice just won't persist.
  }
}

const noopSubscribe = () => () => {};

export default function CookieBanner() {
  // On the server (and during hydration) treat the choice as made, so the
  // banner only appears on the client once we know it hasn't been answered.
  const storedChoice = useSyncExternalStore(noopSubscribe, readConsent, () => 'unknown');
  const [dismissed, setDismissed] = useState(false);

  const accept = () => {
    saveConsent('1');
    window.phyoTrack?.consent();
    setDismissed(true);
  };

  const decline = () => {
    saveConsent('0');
    setDismissed(true);
  };

  if (dismissed || storedChoice !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[1000] mx-auto flex max-w-[640px] flex-col gap-4 rounded-2xl border border-[#1CB354]/30 bg-[#03250E]/95 p-5 text-[#FFF7EA] shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur sm:flex-row sm:items-center"
    >
      <p className="flex-1 text-sm leading-relaxed text-[#FFF7EA]/85">
        We use cookies to understand how visitors use our site. Nothing is tracked unless you accept.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={decline}
          className="rounded-full border border-[#FFF7EA]/30 px-5 py-2 text-sm font-medium transition hover:border-[#FFF7EA]/60"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-[#1CB354] px-5 py-2 text-sm font-semibold text-[#051c0e] transition hover:bg-[#22c95f]"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
