import React, { useEffect, useRef, useState } from 'react';
import { useNotifications } from "../contexts/NotificationContext";
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// ─── Color config per notification type ──────────────────────────────────────
const TYPE_CONFIG = {
  goal_submitted:    { accent: '#3b82f6', bg: '#eff6ff', label: 'Goal Submitted',    deepLink: '/manager/approvals'   },
  goal_approved:     { accent: '#22c55e', bg: '#f0fdf4', label: 'Goal Approved',     deepLink: '/employee/dashboard'  },
  progress_update:   { accent: '#eab308', bg: '#fefce8', label: 'Progress Update',   deepLink: '/manager/checkins'    },
  escalation:        { accent: '#ef4444', bg: '#fef2f2', label: 'Escalation Alert',  deepLink: '/admin/escalations'   },
  checkin_reminder:  { accent: '#f97316', bg: '#fff7ed', label: 'Check-in Reminder', deepLink: '/employee/checkin'    },
  goal_rejected:     { accent: '#f97316', bg: '#fff7ed', label: 'Goal Returned',     deepLink: '/employee/goals'      },
};

export default function TeamsNotificationPanel({ isOpen, onClose }) {

  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    clearAll
  } = useNotifications();

  const navigate =
    useNavigate();

  const panelRef =
    useRef(null);

  const [filter, setFilter] =
    useState('all');

  // Close on outside click
  useEffect(() => {

    function handleClick(e) {

      if (
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        onClose();
      }

    }

    if (isOpen) {
      document.addEventListener(
        'mousedown',
        handleClick
      );
    }

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClick
      );

  }, [isOpen, onClose]);

  const filtered =
    notifications.filter((n) => {

      if (filter === 'unread')
        return !n.read;

      if (filter === 'escalation')
        return n.type === 'escalation';

      return true;

    });

  function handleDeepLink(notification) {

    markRead(notification.id);

    const cfg =
      TYPE_CONFIG[notification.type];

    if (cfg?.deepLink) {
      navigate(cfg.deepLink);
    }

    onClose();

  }

  if (!isOpen) return null;

  return (

    <div
      ref={panelRef}
      className="fixed left-72 top-24 w-[420px] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-zinc-200 z-[9999] flex flex-col"
    >

      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <TeamsIcon />

          <h3 className="font-semibold text-zinc-900 text-sm">

            Notifications

          </h3>

          {unreadCount > 0 && (

            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">

              {unreadCount}

            </span>

          )}

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={markAllRead}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all read
          </button>

          <button
            onClick={clearAll}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            Clear
          </button>

        </div>

      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-zinc-100 px-5">

        {['all', 'unread', 'escalation'].map((f) => (

          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`py-2.5 mr-4 text-xs font-medium capitalize border-b-2 transition-colors ${
              filter === f
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >

            {f}

          </button>

        ))}

      </div>

      {/* Notification list */}
      <div className="overflow-y-auto flex-1">

        {filtered.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-16 text-center">

            <div className="text-4xl mb-3">
              🔔
            </div>

            <p className="text-zinc-500 text-sm font-medium">

              No notifications

            </p>

            <p className="text-zinc-400 text-xs mt-1">

              You're all caught up!

            </p>

          </div>

        ) : (

          <div className="divide-y divide-zinc-50">

            {filtered.map((notification) => (

              <AdaptiveCard
                key={notification.id}
                notification={notification}
                onDeepLink={handleDeepLink}
                onMarkRead={markRead}
              />

            ))}

          </div>

        )}

      </div>

      {/* Footer */}
      <div className="border-t border-zinc-100 px-5 py-3 bg-zinc-50">

        <p className="text-[11px] text-zinc-400 text-center">

          Powered by AtomQuest · Microsoft Teams-style notifications

        </p>

      </div>

    </div>

  );

}

// ─── Adaptive Card Component ──────────────────────────────────────────────────
function AdaptiveCard({
  notification,
  onDeepLink,
  onMarkRead
}) {

  const cfg =
    TYPE_CONFIG[notification.type] ||
    TYPE_CONFIG.goal_submitted;

  const isUnread =
    !notification.read;

  return (

    <div
      className={`px-5 py-4 hover:bg-zinc-50 transition-colors relative ${
        isUnread ? 'bg-blue-50/30' : ''
      }`}
    >

      {/* Unread indicator */}
      {isUnread && (

        <div
          className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full"
          style={{
            backgroundColor:
              cfg.accent
          }}
        />

      )}

      {/* Card header */}
      <div className="flex items-start gap-3">

        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-0.5"
          style={{
            backgroundColor:
              cfg.bg
          }}
        >

          {notification.icon}

        </div>

        <div className="flex-1 min-w-0">

          <div className="flex items-center gap-2 mb-0.5">

            <span
              className="text-[10px] font-semibold uppercase tracking-wide"
              style={{
                color:
                  cfg.accent
              }}
            >

              {cfg.label}

            </span>

            <span className="text-[10px] text-zinc-400">

              {formatDistanceToNow(
                new Date(notification.timestamp),
                {
                  addSuffix: true
                }
              )}

            </span>

          </div>

          <p className="text-xs font-semibold text-zinc-900 leading-snug truncate pr-2">

            {notification.subject.replace(
              /^\[AtomQuest\] /,
              ''
            )}

          </p>

          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">

            {notification.to}

          </p>

        </div>

        {isUnread && (

          <button
            onClick={() =>
              onMarkRead(notification.id)
            }
            className="text-zinc-300 hover:text-zinc-500 flex-shrink-0 mt-1"
            title="Mark as read"
          >

            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >

              <circle
                cx="7"
                cy="7"
                r="7"
                fill="currentColor"
              />

            </svg>

          </button>

        )}

      </div>

      {/* Adaptive card body */}
      <div
        className="mt-3 p-3 rounded-xl text-[11px] text-zinc-600 leading-relaxed"
        style={{
          backgroundColor:
            cfg.bg
        }}
      >

        {notification.body
          .split('\n')
          .slice(0, 3)
          .join(' · ')
          .substring(0, 120)}…

      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-3">

        <button
          onClick={() =>
            onDeepLink(notification)
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor:
              cfg.accent
          }}
        >

          Open in Portal

        </button>

        <button
          onClick={() =>
            onMarkRead(notification.id)
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-all"
        >

          Dismiss

        </button>

      </div>

    </div>

  );

}

// ─── Bell Icon ────────────────────────────────────────────────────────────────
export function NotificationBell({
  onClick
}) {

  const {
    unreadCount
  } = useNotifications();

  return (

    <button
      onClick={onClick}
      className="relative p-2 rounded-xl hover:bg-zinc-800 transition-colors"
    >

      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-zinc-300"
      >

        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />

        <path d="M13.73 21a2 2 0 0 1-3.46 0" />

      </svg>

      {unreadCount > 0 && (

        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 leading-none">

          {unreadCount > 9
            ? '9+'
            : unreadCount}

        </span>

      )}

    </button>

  );

}

function TeamsIcon() {

  return (

    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >

      <rect
        width="16"
        height="16"
        rx="3"
        fill="#464EB8"
      />

      <text
        x="3"
        y="12"
        fontSize="10"
        fill="white"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        T
      </text>

    </svg>

  );

}