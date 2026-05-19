// src/components/auth/MicrosoftLoginButton.jsx
// Drop this anywhere on your existing Login page. No other changes needed.
import React from 'react';
import { useMicrosoftAuth } from "../contexts/MicrosoftAuthContext";

export default function MicrosoftLoginButton({ className = '' }) {
  const { initiateSSO, ssoState } = useMicrosoftAuth();

  return (
    <button
      onClick={initiateSSO}
      disabled={ssoState.loading}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3
        bg-white border border-zinc-300 rounded-xl
        hover:bg-zinc-50 hover:border-zinc-400
        active:scale-[0.98]
        transition-all duration-150
        text-zinc-800 text-sm font-medium
        shadow-sm hover:shadow
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <MicrosoftGridIcon />
      <span>Continue with Microsoft</span>
    </button>
  );
}

function MicrosoftGridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="8.5" height="8.5" fill="#F25022" />
      <rect x="9.5" width="8.5" height="8.5" fill="#7FBA00" />
      <rect y="9.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" />
    </svg>
  );
}

// ─── Usage in your existing Login page ───────────────────────────────────────
// import MicrosoftLoginButton from '../components/auth/MicrosoftLoginButton';
// import { MicrosoftAuthProvider } from '../contexts/MicrosoftAuthContext';
//
// 1. Wrap your <App> or <Router> with <MicrosoftAuthProvider>
// 2. Add inside your login form, above or below the submit button:
//
//   <div className="relative my-4">
//     <div className="absolute inset-0 flex items-center">
//       <div className="w-full border-t border-zinc-700" />
//     </div>
//     <div className="relative flex justify-center text-xs">
//       <span className="px-3 bg-zinc-900 text-zinc-400">or</span>
//     </div>
//   </div>
//   <MicrosoftLoginButton />