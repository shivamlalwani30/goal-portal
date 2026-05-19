// src/pages/admin/EmailNotificationCenter.jsx
// Simulated email notification center for Admin/HR visibility
import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { format, formatDistanceToNow } from 'date-fns';

const TYPE_LABELS = {
  goal_submitted:   { label: 'Goal Submitted',    icon: '📋', color: 'blue'   },
  goal_approved:    { label: 'Goal Approved',      icon: '✅', color: 'green'  },
  goal_rejected:    { label: 'Goal Returned',      icon: '↩️', color: 'orange' },
  progress_update:  { label: 'Progress Update',    icon: '📊', color: 'yellow' },
  escalation:       { label: 'Escalation Alert',   icon: '⚠️', color: 'red'   },
  checkin_reminder: { label: 'Check-in Reminder',  icon: '⏰', color: 'orange' },
};

const COLOR_CLASSES = {
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  green:  'bg-green-50 text-green-700 border-green-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  red:    'bg-red-50 text-red-700 border-red-200',
};

export default function EmailNotificationCenter() {
  const { emailQueue, notifications, clearAll } = useNotifications();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = emailQueue.filter((e) =>
    filter === 'all' ? true : e.type === filter
  );

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Email Notification Center</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Simulated outbox — all automated emails sent by AtomQuest Portal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-900">{emailQueue.length}</p>
            <p className="text-xs text-zinc-500">Emails Sent</p>
          </div>
          <button
            onClick={clearAll}
            className="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit flex-shrink-0">
        {[
          { value: 'all', label: 'All' },
          { value: 'goal_submitted', label: 'Submissions' },
          { value: 'goal_approved', label: 'Approvals' },
          { value: 'escalation', label: 'Escalations' },
          { value: 'checkin_reminder', label: 'Reminders' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              filter === tab.value
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Email list */}
        <div className="w-80 flex-shrink-0 overflow-y-auto space-y-1 pr-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-zinc-500 text-sm font-medium">No emails yet</p>
              <p className="text-zinc-400 text-xs mt-1">Emails appear here when actions are taken</p>
            </div>
          ) : (
            filtered.map((email) => {
              const cfg = TYPE_LABELS[email.type] || { label: 'Notification', icon: '📩', color: 'blue' };
              const colorCls = COLOR_CLASSES[cfg.color];
              const isSelected = selected?.id === email.id;
              return (
                <button
                  key={email.id}
                  onClick={() => setSelected(email)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-700 text-white'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-semibold mb-0.5 ${isSelected ? 'text-zinc-400' : ''}`}>
                        <span className={`${!isSelected ? `px-1.5 py-0.5 rounded-md border text-[10px] ${colorCls}` : 'text-zinc-400'}`}>
                          {cfg.label}
                        </span>
                      </p>
                      <p className={`text-xs font-semibold truncate leading-snug ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                        {email.subject?.replace(/^\[AtomQuest\] /, '')}
                      </p>
                      <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        To: {email.to}
                      </p>
                      <p className={`text-[10px] mt-1 ${isSelected ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {formatDistanceToNow(new Date(email.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Email preview pane */}
        <div className="flex-1 bg-white rounded-2xl border border-zinc-200 overflow-hidden flex flex-col">
          {selected ? (
            <>
              {/* Email headers */}
              <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                <h3 className="text-base font-semibold text-zinc-900 mb-3">{selected.subject}</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex gap-2">
                    <span className="text-zinc-400 w-12 flex-shrink-0">To:</span>
                    <span className="text-zinc-700 font-medium">{selected.to}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-400 w-12 flex-shrink-0">From:</span>
                    <span className="text-zinc-700">notifications@atomquest.in</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-400 w-12 flex-shrink-0">Sent:</span>
                    <span className="text-zinc-700">
                      {format(new Date(selected.timestamp), "d MMM yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-400 w-12 flex-shrink-0">Status:</span>
                    <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      ✓ Delivered (Simulated)
                    </span>
                  </div>
                </div>
              </div>

              {/* Email body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200 font-mono text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                  {selected.body}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2">
                  <span className="text-blue-500 text-sm flex-shrink-0">ℹ️</span>
                  <p className="text-xs text-blue-700">
                    This is a simulated email. In production, this would be sent via SendGrid, AWS SES, or Microsoft Graph API (for Teams integration). The deep-link URL points to your portal's relevant page.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="text-5xl mb-4">📧</div>
              <p className="text-zinc-500 text-sm font-medium">Select an email to preview</p>
              <p className="text-zinc-400 text-xs mt-1 max-w-xs">
                All outbound notifications from AtomQuest Portal appear here for audit visibility
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Route to add ─────────────────────────────────────────────────────────────
// <Route path="/admin/notifications" element={<EmailNotificationCenter />} />