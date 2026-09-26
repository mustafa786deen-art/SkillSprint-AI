import React from 'react';
import type { ValidationStatus, SecurityStatus } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert, ShieldCheck, HelpCircle, Clock } from 'lucide-react';

interface BadgeProps {
  status: ValidationStatus | SecurityStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size];

  const getStatusConfig = () => {
    switch (status) {
      case 'Verified':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2,
          label: 'Verified'
        };
      case 'Verified with Warning':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: AlertTriangle,
          label: 'Verified w/ Warning'
        };
      case 'Source Support Missing':
        return {
          bg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
          icon: HelpCircle,
          label: 'Source Support Missing'
        };
      case 'Requirement Missing':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: XCircle,
          label: 'Requirement Missing'
        };
      case 'Unsupported Requirement':
        return {
          bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          icon: ShieldAlert,
          label: 'Unsupported Claim'
        };
      case 'Outdated Source':
        return {
          bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
          icon: Clock,
          label: 'Outdated Source'
        };
      case 'Contradiction Detected':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/40 ring-1 ring-red-500/50 animate-pulse',
          icon: ShieldAlert,
          label: 'Contradiction Detected'
        };
      case 'Manual Review Required':
        return {
          bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          icon: AlertTriangle,
          label: 'Manual Review Required'
        };
      case 'Clean':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: ShieldCheck,
          label: 'Clean - Passed Security'
        };
      case 'Potential Prompt Injection Detected':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
          icon: ShieldAlert,
          label: '⚠️ Prompt Injection Detected'
        };
      case 'Instruction Override Flagged':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: AlertTriangle,
          label: 'Instruction Override Flagged'
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: HelpCircle,
          label: status
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} transition-all`}>
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
