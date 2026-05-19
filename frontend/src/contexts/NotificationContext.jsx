// src/context/NotificationContext.jsx
// In-memory email + in-app notification system. No real SMTP needed.
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext(null);

// ─── Event Templates ──────────────────────────────────────────────────────────
const EMAIL_TEMPLATES = {
  goal_submitted: ({ goalTitle, employeeName, managerName }) => ({
    subject: `[AtomQuest] Goal Submitted for Approval — ${goalTitle}`,
    to: `${managerName} <manager@atomquest.in>`,
    body: `Hi ${managerName},\n\n${employeeName} has submitted a goal for your review:\n\n📌 Goal: ${goalTitle}\n\nPlease log in to AtomQuest Portal to review and approve.\n\n→ Review Goal: https://atomquest.in/manager/approvals\n\nThis is an automated notification from AtomQuest Goal Portal.`,
    type: 'goal_submitted',
    icon: '📋',
    color: 'blue',
  }),

  goal_approved: ({ goalTitle, employeeName }) => ({
    subject: `[AtomQuest] ✅ Your Goal Has Been Approved — ${goalTitle}`,
    to: `${employeeName} <employee@atomquest.in>`,
    body: `Hi ${employeeName},\n\nGreat news! Your goal has been approved by your manager.\n\n📌 Goal: ${goalTitle}\n📅 Status: Locked & Active\n\nYou can now track your progress from your dashboard.\n\n→ View Dashboard: https://atomquest.in/employee/dashboard`,
    type: 'goal_approved',
    icon: '✅',
    color: 'green',
  }),

  progress_update: ({ goalTitle, employeeName, progress }) => ({
    subject: `[AtomQuest] Progress Update — ${goalTitle} at ${progress}%`,
    to: `Manager <manager@atomquest.in>`,
    body: `Hi,\n\n${employeeName} has logged a progress update:\n\n📌 Goal: ${goalTitle}\n📊 Current Progress: ${progress}%\n\n→ View Check-in: https://atomquest.in/manager/checkins`,
    type: 'progress_update',
    icon: '📊',
    color: 'yellow',
  }),

  escalation: ({ goalTitle, employeeName, reason, level }) => ({
    subject: `[AtomQuest] ⚠️ Escalation Alert — ${employeeName} · ${goalTitle}`,
    to: `HR/Admin <hr@atomquest.in>`,
    body: `ESCALATION TRIGGERED\n\nEmployee: ${employeeName}\nGoal: ${goalTitle}\nReason: ${reason}\nEscalation Level: ${level}\nTime: ${new Date().toLocaleString()}\n\n→ View Escalation Log: https://atomquest.in/admin/escalations`,
    type: 'escalation',
    icon: '⚠️',
    color: 'red',
  }),

  checkin_reminder: ({ employeeName, deadline }) => ({
    subject: `[AtomQuest] ⏰ Reminder: Q2 Check-in Due ${deadline}`,
    to: `${employeeName} <employee@atomquest.in>`,
    body: `Hi ${employeeName},\n\nThis is a reminder that your quarterly check-in is due by ${deadline}.\n\nPlease update your goal progress to avoid escalation.\n\n→ Update Progress: https://atomquest.in/employee/checkin`,
    type: 'checkin_reminder',
    icon: '⏰',
    color: 'orange',
  }),

  goal_rejected: ({ goalTitle, employeeName, reason }) => ({
    subject: `[AtomQuest] Goal Returned for Revision — ${goalTitle}`,
    to: `${employeeName} <employee@atomquest.in>`,
    body: `Hi ${employeeName},\n\nYour goal has been returned for revision by your manager.\n\n📌 Goal: ${goalTitle}\n💬 Manager Feedback: ${reason}\n\nPlease update your goal and resubmit.\n\n→ Edit Goal: https://atomquest.in/employee/goals`,
    type: 'goal_rejected',
    icon: '↩️',
    color: 'orange',
  }),
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [emailQueue, setEmailQueue] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const idCounter = useRef(1);

  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const sendNotification = useCallback((type, data) => {
    const templateFn = EMAIL_TEMPLATES[type];
    if (!templateFn) return;

    const email = templateFn(data);
    const id = idCounter.current++;
    const timestamp = new Date().toISOString();

    const notification = {
      id,
      ...email,
      timestamp,
      read: false,
      data,
    };

    // Add to in-app notification panel
    setNotifications((prev) => [notification, ...prev]);

    // Add to email queue (simulated send)
    setEmailQueue((prev) => [{ ...notification, status: 'sent', sentAt: timestamp }, ...prev]);

    // Show toast
    const toastIcon = email.icon;
    toast(
      (t) => (
        <div className="flex items-start gap-3 max-w-xs">
          <span className="text-lg flex-shrink-0 mt-0.5">{toastIcon}</span>
          <div>
            <p className="text-sm font-semibold text-zinc-900 leading-tight">{email.subject}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Email sent to {email.to}</p>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: { padding: '12px 16px', borderRadius: '12px' },
      }
    );

    return id;
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        emailQueue,
        unreadCount,
        sendNotification,
        markRead,
        markAllRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);