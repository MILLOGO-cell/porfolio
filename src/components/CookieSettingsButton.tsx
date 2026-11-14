"use client";

/** Rouvre la bannière de consentement (événement écouté par CookieConsent). */
export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("cookie-consent-open"))}
      className={className}
    >
      Gérer les cookies
    </button>
  );
}
