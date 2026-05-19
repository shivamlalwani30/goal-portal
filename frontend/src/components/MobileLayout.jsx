// src/components/layout/MobileLayout.jsx
// Responsive layout wrappers + mobile-first improvements
import React, { useState, useEffect } from 'react';

// ─── Hook: detect mobile ──────────────────────────────────────────────────────
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

// ─── Mobile-aware sidebar wrapper ────────────────────────────────────────────
/**
 * Wrap your existing sidebar + content with this to add mobile drawer behavior.
 *
 * <ResponsiveLayout sidebar={<YourSidebar />}>
 *   <YourPageContent />
 * </ResponsiveLayout>
 */
export function ResponsiveLayout({ sidebar, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Desktop sidebar — always visible */}
      {!isMobile && (
        <aside className="w-64 flex-shrink-0 h-screen overflow-y-auto">
          {sidebar}
        </aside>
      )}

      {/* Mobile drawer */}
      {isMobile && drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 z-50 overflow-y-auto shadow-2xl animate-slide-in">
            <div className="relative">
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              {sidebar}
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {/* Mobile top bar */}
        {isMobile && (
          <div className="sticky top-0 z-30 bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="text-white font-semibold text-sm">AtomQuest</span>
          </div>
        )}
        <div className="flex-1">{children}</div>
      </main>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.22s ease-out forwards; }
      `}</style>
    </div>
  );
}

// ─── Responsive data table → card list on mobile ─────────────────────────────
/**
 * On desktop renders a <table>, on mobile renders cards.
 *
 * columns: [{ key, label, render? }]
 * rows: array of objects
 * actions: (row) => JSX
 */
export function ResponsiveTable({ columns, rows, actions, emptyMessage = 'No data found' }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {rows.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-sm">{emptyMessage}</div>
        )}
        {rows.map((row, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-start gap-2">
                <span className="text-xs text-zinc-500 flex-shrink-0">{col.label}</span>
                <span className="text-xs text-zinc-200 text-right">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '—')}
                </span>
              </div>
            ))}
            {actions && (
              <div className="pt-2 border-t border-zinc-800 flex gap-2 flex-wrap">
                {actions(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-900 border-b border-zinc-800">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {rows.length === 0 && (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-10 text-zinc-500 text-sm">{emptyMessage}</td></tr>
          )}
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-zinc-900/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-zinc-300">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '—')}
                </td>
              ))}
              {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Responsive modal ─────────────────────────────────────────────────────────
/**
 * Full-screen on mobile, centered dialog on desktop.
 * Replaces your existing Modal with a responsive version.
 */
export function ResponsiveModal({ isOpen, onClose, title, children, size = 'md' }) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size] || 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div
        className={`
          w-full ${sizeClass} bg-zinc-900 border border-zinc-700
          ${isMobile ? 'rounded-t-3xl rounded-b-none max-h-[90vh]' : 'rounded-2xl'}
          flex flex-col overflow-hidden shadow-2xl
          ${isMobile ? 'animate-slide-up' : 'animate-fade-scale'}
        `}
      >
        {/* Handle bar on mobile */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-zinc-700 rounded-full" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
          <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up { animation: slide-up 0.25s ease-out forwards; }
        .animate-fade-scale { animation: fade-scale 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}