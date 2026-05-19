// src/context/EscalationContext.jsx
// Rule-based escalation engine for AtomQuest Hackathon
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotifications } from './NotificationContext';

const EscalationContext = createContext(null);

// ─── Escalation Rule Definitions ─────────────────────────────────────────────
export const ESCALATION_RULES = [
  {
    id: 'low_progress_near_deadline',
    name: 'Low Progress Near Deadline',
    description: 'Goal progress < 30% with ≤ 14 days to deadline',
    severity: 'high',
    check: (goal) => {
      const progress = goal.progress || 0;
      const deadline = goal.deadline ? new Date(goal.deadline) : null;
      const daysLeft = deadline
        ? Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))
        : Infinity;
      return progress < 30 && daysLeft <= 14 && daysLeft > 0;
    },
    reason: (goal) =>
      `Progress at ${goal.progress || 0}% with ${Math.ceil(
        (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
      )} days remaining`,
  },
  {
    id: 'missing_checkin',
    name: 'Missing Quarterly Check-in',
    description: 'No check-in logged in the current active quarter window',
    severity: 'medium',
    check: (goal) => {
      if (!goal.lastCheckin) return true;
      const daysSince = Math.ceil(
        (new Date() - new Date(goal.lastCheckin)) / (1000 * 60 * 60 * 24)
      );
      return daysSince > 90; // More than 90 days without check-in
    },
    reason: (goal) =>
      goal.lastCheckin
        ? `Last check-in was ${Math.ceil(
            (new Date() - new Date(goal.lastCheckin)) / (1000 * 60 * 60 * 24)
          )} days ago`
        : 'No check-in ever logged',
  },
  {
    id: 'unapproved_goal_overdue',
    name: 'Goal Unapproved Past SLA',
    description: 'Goal submitted but not approved within 7 days',
    severity: 'medium',
    check: (goal) => {
      if (goal.status !== 'pending_approval') return false;
      const submitted = goal.submittedAt ? new Date(goal.submittedAt) : null;
      if (!submitted) return false;
      const daysWaiting = Math.ceil((new Date() - submitted) / (1000 * 60 * 60 * 24));
      return daysWaiting > 7;
    },
    reason: (goal) => {
      const days = Math.ceil(
        (new Date() - new Date(goal.submittedAt)) / (1000 * 60 * 60 * 24)
      );
      return `Goal awaiting manager approval for ${days} days`;
    },
  },
  {
    id: 'no_goals_submitted',
    name: 'No Goals Submitted',
    description: 'Employee has not submitted any goals 30+ days after cycle open',
    severity: 'high',
    check: (goal) => false, // Handled at user level, not goal level
    reason: () => 'No goals submitted within 30 days of cycle opening',
  },
  {
    id: 'stalled_progress',
    name: 'Stalled Progress',
    description: 'Progress has not changed in 30+ days for an active goal',
    severity: 'low',
    check: (goal) => {
      if (goal.status !== 'active' && goal.status !== 'on_track') return false;
      if (!goal.lastProgressUpdate) return true;
      const daysSince = Math.ceil(
        (new Date() - new Date(goal.lastProgressUpdate)) / (1000 * 60 * 60 * 24)
      );
      return daysSince > 30;
    },
    reason: (goal) =>
      goal.lastProgressUpdate
        ? `Progress unchanged for ${Math.ceil(
            (new Date() - new Date(goal.lastProgressUpdate)) / (1000 * 60 * 60 * 24)
          )} days`
        : 'Progress never updated',
  },
];

const SEVERITY_LEVELS = {
  low: { label: 'Low', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-400' },
  medium: { label: 'Medium', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-400' },
  high: { label: 'High', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
};

export { SEVERITY_LEVELS };

export function EscalationProvider({ children }) {
  const [escalationLogs, setEscalationLogs] = useState(() => {
    // Seed with realistic demo data
    const now = new Date();
    const daysAgo = (d) => new Date(now - d * 86400000).toISOString();
    return [
      {
        id: 'esc-001',
        goalId: 'goal-101',
        goalTitle: 'Increase Customer Retention by 15%',
        employeeName: 'Arjun Sharma',
        employeeId: 'emp-001',
        ruleId: 'low_progress_near_deadline',
        ruleName: 'Low Progress Near Deadline',
        reason: 'Progress at 18% with 9 days remaining',
        severity: 'high',
        status: 'open',
        level: 'Manager',
        escalatedAt: daysAgo(2),
        acknowledgedAt: null,
        resolvedAt: null,
        notifiedTo: ['Priya Mehta (Manager)'],
      },
      {
        id: 'esc-002',
        goalId: 'goal-102',
        goalTitle: 'Complete AWS Certification',
        employeeName: 'Sneha Patel',
        employeeId: 'emp-004',
        ruleId: 'missing_checkin',
        ruleName: 'Missing Quarterly Check-in',
        reason: 'No check-in logged for 95 days',
        severity: 'medium',
        status: 'acknowledged',
        level: 'HR',
        escalatedAt: daysAgo(5),
        acknowledgedAt: daysAgo(1),
        resolvedAt: null,
        notifiedTo: ['Priya Mehta (Manager)', 'Rajesh Kumar (HR)'],
      },
      {
        id: 'esc-003',
        goalId: 'goal-103',
        goalTitle: 'Reduce Bug Backlog by 50%',
        employeeName: 'Arjun Sharma',
        employeeId: 'emp-001',
        ruleId: 'unapproved_goal_overdue',
        ruleName: 'Goal Unapproved Past SLA',
        reason: 'Goal awaiting manager approval for 10 days',
        severity: 'medium',
        status: 'resolved',
        level: 'Manager',
        escalatedAt: daysAgo(10),
        acknowledgedAt: daysAgo(8),
        resolvedAt: daysAgo(3),
        notifiedTo: ['Priya Mehta (Manager)'],
      },
    ];
  });

  const { sendNotification } = useNotifications();

  // Run escalation engine against a list of goals
  const runEscalationEngine = useCallback(
    (goals = [], users = []) => {
      const newEscalations = [];

      goals.forEach((goal) => {
        ESCALATION_RULES.forEach((rule) => {
          if (rule.id === 'no_goals_submitted') return; // skip goal-level check

          if (rule.check(goal)) {
            const existing = escalationLogs.find(
              (e) => e.goalId === goal.id && e.ruleId === rule.id && e.status !== 'resolved'
            );
            if (existing) return; // Already escalated

            const employee = users.find((u) => u.id === goal.employeeId) || {
              displayName: goal.employeeName || 'Unknown',
            };
            const manager = users.find((u) => u.id === goal.managerId) || {
              displayName: 'Manager',
            };

            const escalation = {
              id: `esc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              goalId: goal.id,
              goalTitle: goal.title,
              employeeName: employee.displayName,
              employeeId: goal.employeeId,
              ruleId: rule.id,
              ruleName: rule.name,
              reason: rule.reason(goal),
              severity: rule.severity,
              status: 'open',
              level: rule.severity === 'high' ? 'HR' : 'Manager',
              escalatedAt: new Date().toISOString(),
              acknowledgedAt: null,
              resolvedAt: null,
              notifiedTo: [manager.displayName + ' (Manager)'],
            };

            newEscalations.push(escalation);

            // Fire notification
            sendNotification('escalation', {
              goalTitle: goal.title,
              employeeName: employee.displayName,
              reason: rule.reason(goal),
              level: escalation.level,
            });
          }
        });
      });

      if (newEscalations.length > 0) {
        setEscalationLogs((prev) => [...newEscalations, ...prev]);
      }

      return newEscalations.length;
    },
    [escalationLogs, sendNotification]
  );

  const acknowledgeEscalation = useCallback((id) => {
    setEscalationLogs((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: 'acknowledged', acknowledgedAt: new Date().toISOString() }
          : e
      )
    );
  }, []);

  const resolveEscalation = useCallback((id) => {
    setEscalationLogs((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: 'resolved', resolvedAt: new Date().toISOString() }
          : e
      )
    );
  }, []);

  const getStats = useCallback(() => {
    return {
      total: escalationLogs.length,
      open: escalationLogs.filter((e) => e.status === 'open').length,
      acknowledged: escalationLogs.filter((e) => e.status === 'acknowledged').length,
      resolved: escalationLogs.filter((e) => e.status === 'resolved').length,
      high: escalationLogs.filter((e) => e.severity === 'high').length,
      medium: escalationLogs.filter((e) => e.severity === 'medium').length,
      low: escalationLogs.filter((e) => e.severity === 'low').length,
    };
  }, [escalationLogs]);

  return (
    <EscalationContext.Provider
      value={{
        escalationLogs,
        runEscalationEngine,
        acknowledgeEscalation,
        resolveEscalation,
        getStats,
        ESCALATION_RULES,
        SEVERITY_LEVELS,
      }}
    >
      {children}
    </EscalationContext.Provider>
  );
}

export const useEscalation = () => useContext(EscalationContext);