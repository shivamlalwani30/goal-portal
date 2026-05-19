// src/utils/toastHelpers.js
// Drop-in replacements for window.alert() and window.confirm()
// Uses react-hot-toast (already in your project)
import toast from 'react-hot-toast';
import React from 'react';

// ─── Themed toast presets ─────────────────────────────────────────────────────
const BASE_STYLE = {
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 500,
  maxWidth: '380px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
};

export const notify = {
  success: (message, opts = {}) =>
    toast.success(message, {
      duration: 4000,
      style: { ...BASE_STYLE, background: '#f0fdf4', color: '#166534' },
      iconTheme: { primary: '#22c55e', secondary: '#f0fdf4' },
      ...opts,
    }),

  error: (message, opts = {}) =>
    toast.error(message, {
      duration: 5000,
      style: { ...BASE_STYLE, background: '#fef2f2', color: '#991b1b' },
      iconTheme: { primary: '#ef4444', secondary: '#fef2f2' },
      ...opts,
    }),

  warning: (message, opts = {}) =>
    toast(message, {
      icon: '⚠️',
      duration: 5000,
      style: { ...BASE_STYLE, background: '#fffbeb', color: '#92400e' },
      ...opts,
    }),

  info: (message, opts = {}) =>
    toast(message, {
      icon: 'ℹ️',
      duration: 4000,
      style: { ...BASE_STYLE, background: '#eff6ff', color: '#1e40af' },
      ...opts,
    }),

  loading: (message) =>
    toast.loading(message, {
      style: { ...BASE_STYLE, background: '#1e1e1e', color: '#f4f4f4' },
    }),

  dismiss: (id) => toast.dismiss(id),

  promise: (promise, messages = {}) =>
    toast.promise(promise, {
      loading: messages.loading || 'Processing…',
      success: messages.success || 'Done!',
      error: messages.error || 'Something went wrong',
    }),
};

// ─── Confirm dialog (replaces window.confirm) ─────────────────────────────────
/**
 * showConfirm({ title, message, confirmLabel, cancelLabel, variant })
 * Returns a Promise<boolean> — true = confirmed, false = cancelled
 *
 * variant: 'danger' | 'warning' | 'info'
 */
export function showConfirm({
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
} = {}) {
  return new Promise((resolve) => {
    const variantConfig = {
      danger: {
        btn: 'bg-red-600 hover:bg-red-700 text-white',
        icon: '🗑️',
      },
      warning: {
        btn: 'bg-orange-500 hover:bg-orange-600 text-white',
        icon: '⚠️',
      },
      info: {
        btn: 'bg-blue-600 hover:bg-blue-700 text-white',
        icon: 'ℹ️',
      },
    };
    const cfg = variantConfig[variant] || variantConfig.danger;

    const id = toast(
      (t) => (
        <div className="w-full">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl flex-shrink-0">{cfg.icon}</span>
            <div>
              <p className="font-semibold text-zinc-900 text-sm">{title}</p>
              {message && <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{message}</p>}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { toast.dismiss(id); resolve(false); }}
              className="px-3 py-1.5 text-xs font-medium bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => { toast.dismiss(id); resolve(true); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${cfg.btn}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: { ...BASE_STYLE, padding: '16px', width: '320px', maxWidth: '320px' },
      }
    );
  });
}

// ─── Goal-specific helpers ────────────────────────────────────────────────────
export const goalToasts = {
  submitted: (title) => notify.success(`Goal "${title}" submitted for approval`),
  approved: (title) => notify.success(`✅ Goal "${title}" approved and locked`),
  rejected: (title) => notify.warning(`↩️ Goal "${title}" returned for revision`),
  updated: (title) => notify.success(`Goal "${title}" updated`),
  deleted: (title) => notify.error(`Goal "${title}" deleted`),
  progressSaved: (pct) => notify.success(`Progress updated to ${pct}%`),
  weightageError: () => notify.error('Total weightage must equal 100%'),
  maxGoalsError: () => notify.error('Maximum of 8 goals per employee allowed'),
  minWeightageError: () => notify.warning('Each goal must have at least 10% weightage'),
  locked: () => notify.info('This goal is locked after approval. Contact Admin to unlock.'),
  checkinSaved: () => notify.success('Check-in submitted successfully'),
};

// ─── Usage guide ──────────────────────────────────────────────────────────────
// Replace all: alert('Goal submitted') → goalToasts.submitted('Revenue Growth')
// Replace all: alert('Error') → notify.error('Something went wrong')
// Replace all: window.confirm('Delete?') → await showConfirm({ title: 'Delete Goal?', confirmLabel: 'Delete' })
//
// IMPORTANT: Make sure <Toaster /> is in your App.jsx root:
//   import { Toaster } from 'react-hot-toast';
//   <Toaster position="top-right" />