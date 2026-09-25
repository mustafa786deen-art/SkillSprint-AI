import React from 'react';
import { Drawer } from '../common/Drawer';
import { ShieldAlert, RefreshCw, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToHitl: () => void;
  onNavigateToPolicy: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateToHitl,
  onNavigateToPolicy
}) => {
  const notifications = [
    {
      id: 'NOTIF-01',
      title: 'Policy Version SOP-07 Updated to v2.1',
      description: 'Data Security & GDPR Protocol updated. 14 employee onboarding plans affected by SLA clause change.',
      time: '12 mins ago',
      type: 'policy',
      actionLabel: 'Run Impact Analysis',
      onClick: () => {
        onClose();
        onNavigateToPolicy();
      }
    },
    {
      id: 'NOTIF-02',
      title: 'High-Severity Contradiction Flagged',
      description: 'GenAI output for Alex Morgan (Sales Executive) claims 40% discount self-approval, conflicting with SOP-07 §1.1 15% limit.',
      time: '25 mins ago',
      type: 'hitl',
      actionLabel: 'Open HITL Review',
      onClick: () => {
        onClose();
        onNavigateToHitl();
      }
    },
    {
      id: 'NOTIF-03',
      title: 'Dual-Pipeline Verification Completed',
      description: 'Ground-Truth Verification Engine scored Sarah Chen\'s Data Analyst plan: 99.0% Coverage, 0 Contradictions.',
      time: '1 hour ago',
      type: 'success',
      actionLabel: 'View Audit Report'
    },
    {
      id: 'NOTIF-04',
      title: 'Security Scan Alert: Potential Prompt Injection',
      description: 'Document RAW-ADV-01 contained unverified text instructing LLM to bypass MFA auth.',
      time: '2 hours ago',
      type: 'security',
      actionLabel: 'Inspect Knowledge Base'
    }
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Notification & Audit Feed"
      subtitle="Real-time alerts from Dual-Pipeline Validation & Security Gates"
      width="md"
    >
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 rounded-xl bg-[#050f1d] border border-teal-900/40 hover:border-teal-500/40 transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {n.type === 'hitl' && <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />}
                {n.type === 'policy' && <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />}
                {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {n.type === 'security' && <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0" />}
                <span className="text-xs font-bold text-slate-200">{n.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" /> {n.time}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{n.description}</p>
            {n.actionLabel && (
              <button
                onClick={n.onClick}
                className="mt-2 text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
              >
                {n.actionLabel} →
              </button>
            )}
          </div>
        ))}
      </div>
    </Drawer>
  );
};
