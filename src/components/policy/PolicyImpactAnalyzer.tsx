import React, { useState } from 'react';
import type { ImpactAnalysisResult, Document } from '../../types';
import { RefreshCw, AlertOctagon, CheckCircle2, ShieldAlert, Play } from 'lucide-react';

interface PolicyImpactAnalyzerProps {
  impactResult: ImpactAnalysisResult;
  documents: Document[];
  onTriggerSelectiveRegen: () => void;
}

export const PolicyImpactAnalyzer: React.FC<PolicyImpactAnalyzerProps> = ({
  impactResult,
  onTriggerSelectiveRegen
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setIsCompleted(true);
      onTriggerSelectiveRegen();
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" /> Policy Update & "What-If" Impact Analyzer Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detect policy version upgrades (e.g., v1.2 → v2.0) and run selective micro-regeneration without touching unrelated completed modules
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating || isCompleted}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 transition-all disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating
            ? 'Regenerating 2 Affected Modules...'
            : isCompleted
            ? 'Selective Regeneration Complete ✓'
            : 'Execute Selective Regeneration'}
        </button>
      </div>

      {/* Impact Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Target Document</span>
          <div className="mt-2 text-sm font-bold text-indigo-400">{impactResult.docTitle}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Version Change: <span className="text-amber-400 font-bold">{impactResult.oldVersion} → {impactResult.newVersion}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Impacted Onboarding Plans</span>
          <div className="mt-2 text-2xl font-black text-amber-400">{impactResult.affectedPlanCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active Employees Affected</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Outdated Modules Identified</span>
          <div className="mt-2 text-2xl font-black text-rose-400">{impactResult.outdatedModuleIds.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Require Re-generation</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Preserved Unaffected Modules</span>
          <div className="mt-2 text-2xl font-black text-emerald-400">{impactResult.preservedModuleCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Intact (No Re-work Needed)</div>
        </div>
      </div>

      {/* Policy Change Text Diff Panel */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400" /> Clause Modification Diff Analysis
        </h3>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">
            Change Summary: <span className="text-amber-300">{impactResult.changeSummary}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {/* Old Version Clause */}
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-200 space-y-1">
              <span className="text-[10px] font-bold text-rose-400 block uppercase">Old Clause ({impactResult.oldVersion})</span>
              <p>- Breach Escalation SLA: Notify SOC within 30 minutes of suspicious event detection.</p>
            </div>

            {/* New Version Clause */}
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 block uppercase">New Clause ({impactResult.newVersion})</span>
              <p>+ Breach Escalation SLA: Notify SOC within 15 minutes of suspicious event detection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Outdated vs Preserved Modules Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Micro-Regeneration Scope Analysis</h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-slate-200 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Module: Information Security & PII Protection Standards</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
              Requires Selective Regeneration
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-slate-200 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Quiz: Security Breach Incident SLA Refresher</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
              Requires Quiz Re-grounding
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Module: Customer Escalation & PII Redaction Workflow (12 Completed)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              Preserved Intact
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
