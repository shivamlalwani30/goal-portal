// src/pages/admin/EscalationDashboard.jsx
// Admin/HR escalation log dashboard
import React, { useState, useMemo } from 'react';
import { useEscalation, SEVERITY_LEVELS } from '../contexts/EscalationContext';
import { formatDistanceToNow, format } from 'date-fns';

export default function EscalationDashboard() {
  const { escalationLogs, acknowledgeEscalation, resolveEscalation, getStats, runEscalationEngine } =
    useEscalation();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [search, setSearch] = useState('');
  const [simulateLoading, setSimulateLoading] = useState(false);
  const stats = getStats();

  // Filter logic
  const filtered = useMemo(() => {
    return escalationLogs.filter((e) => {
      if (filterStatus !== 'all' && e.status !== filterStatus) return false;
      if (filterSeverity !== 'all' && e.severity !== filterSeverity) return false;
      if (search && !e.employeeName.toLowerCase().includes(search.toLowerCase()) &&
          !e.goalTitle.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [escalationLogs, filterStatus, filterSeverity, search]);

  // Simulate running the engine on demo goals
  function handleSimulateRun() {
    setSimulateLoading(true);
    const demoGoals = [
      { id: 'g-sim-1', title: 'Improve NPS Score', progress: 12, deadline: new Date(Date.now() + 7 * 86400000).toISOString(), status: 'active', employeeId: 'emp-sim-1', employeeName: 'Demo Employee', lastCheckin: null, lastProgressUpdate: null },
    ];
    const demoUsers = [{ id: 'emp-sim-1', displayName: 'Demo Employee' }];
    setTimeout(() => {
      const count = runEscalationEngine(demoGoals, demoUsers);
      setSimulateLoading(false);
    }, 1000);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Escalation Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Monitor and resolve rule-triggered escalations across the organization</p>
        </div>
        <button
          onClick={handleSimulateRun}
          disabled={simulateLoading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          {simulateLoading ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10" /></svg>
          )}
          Run Engine
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total', value: stats.total, cls: 'bg-zinc-900 text-white' },
          { label: 'Open', value: stats.open, cls: 'bg-red-50 text-red-700 border border-red-200' },
          { label: 'Acknowledged', value: stats.acknowledged, cls: 'bg-orange-50 text-orange-700 border border-orange-200' },
          { label: 'Resolved', value: stats.resolved, cls: 'bg-green-50 text-green-700 border border-green-200' },
          { label: 'High', value: stats.high, cls: 'bg-red-100 text-red-800' },
          { label: 'Medium', value: stats.medium, cls: 'bg-orange-100 text-orange-800' },
          { label: 'Low', value: stats.low, cls: 'bg-yellow-100 text-yellow-800' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.cls}`}>
            <p className="text-2xl font-bold leading-none">{s.value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Rules Reference */}
      <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5">
        <h3 className="text-sm font-semibold text-zinc-700 mb-3 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          Active Escalation Rules
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            { name: 'Low Progress Near Deadline', desc: 'Progress < 30% with ≤ 14 days left', severity: 'high' },
            { name: 'Missing Quarterly Check-in', desc: 'No check-in logged in 90+ days', severity: 'medium' },
            { name: 'Unapproved Goal Past SLA', desc: 'Pending approval for 7+ days', severity: 'medium' },
            { name: 'No Goals Submitted', desc: '30+ days after cycle open', severity: 'high' },
            { name: 'Stalled Progress', desc: 'Progress unchanged for 30+ days', severity: 'low' },
          ].map((rule) => {
            const sev = SEVERITY_LEVELS[rule.severity];
            return (
              <div key={rule.name} className="flex items-start gap-2.5 bg-white rounded-xl p-3 border border-zinc-200">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${sev.dot}`} />
                <div>
                  <p className="text-xs font-semibold text-zinc-800">{rule.name}</p>
                  <p className="text-[11px] text-zinc-500">{rule.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by employee or goal…"
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 focus:outline-none focus:border-zinc-400 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 focus:outline-none focus:border-zinc-400 cursor-pointer"
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Escalation Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {['Severity', 'Employee', 'Goal', 'Rule Triggered', 'Reason', 'Level', 'Escalated', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-zinc-400 text-sm">
                    No escalations found
                  </td>
                </tr>
              ) : (
                filtered.map((e) => {
                  const sev = SEVERITY_LEVELS[e.severity];
                  return (
                    <tr key={e.id} className="hover:bg-zinc-50/60 transition-colors">
                      {/* Severity */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${sev.bg} ${sev.color} border ${sev.border}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                          {sev.label}
                        </span>
                      </td>
                      {/* Employee */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-zinc-900 whitespace-nowrap">{e.employeeName}</p>
                      </td>
                      {/* Goal */}
                      <td className="px-4 py-3">
                        <p className="text-sm text-zinc-700 max-w-[180px] truncate" title={e.goalTitle}>{e.goalTitle}</p>
                      </td>
                      {/* Rule */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-zinc-600 whitespace-nowrap">{e.ruleName}</p>
                      </td>
                      {/* Reason */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-zinc-500 max-w-[180px]">{e.reason}</p>
                      </td>
                      {/* Level */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          e.level === 'HR' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {e.level}
                        </span>
                      </td>
                      {/* Escalated */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-zinc-500 whitespace-nowrap">
                          {formatDistanceToNow(new Date(e.escalatedAt), { addSuffix: true })}
                        </p>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={e.status} />
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {e.status === 'open' && (
                            <button
                              onClick={() => acknowledgeEscalation(e.id)}
                              className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 font-medium whitespace-nowrap"
                            >
                              Acknowledge
                            </button>
                          )}
                          {(e.status === 'open' || e.status === 'acknowledged') && (
                            <button
                              onClick={() => resolveEscalation(e.id)}
                              className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium"
                            >
                              Resolve
                            </button>
                          )}
                          {e.status === 'resolved' && (
                            <span className="text-xs text-zinc-400 px-2">
                              {e.resolvedAt ? format(new Date(e.resolvedAt), 'MMM d') : 'Resolved'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    open: 'bg-red-100 text-red-700',
    acknowledged: 'bg-orange-100 text-orange-700',
    resolved: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${map[status] || 'bg-zinc-100 text-zinc-600'}`}>
      {status}
    </span>
  );
}