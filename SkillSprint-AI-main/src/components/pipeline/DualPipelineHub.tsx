import React, { useState } from 'react';
import type { Employee, DualPipelineResult } from '../../types';
import { PipelineGenAiOutput } from './PipelineGenAiOutput';
import { PipelineGroundTruthVerifier } from './PipelineGroundTruthVerifier';
import { GitCompare, Play, User, CheckCircle2 } from 'lucide-react';

interface DualPipelineHubProps {
  employees: Employee[];
  activeEmployee: Employee;
  onSelectEmployee: (emp: Employee) => void;
  pipelineResult: DualPipelineResult;
  onNavigateToHitl: () => void;
  onPublishPlan: () => void;
}

export const DualPipelineHub: React.FC<DualPipelineHubProps> = ({
  employees,
  activeEmployee,
  onSelectEmployee,
  pipelineResult,
  onNavigateToHitl,
  onPublishPlan
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResult, setCurrentResult] = useState<DualPipelineResult>(pipelineResult);

  const handleRunPipeline = () => {
    setIsStreaming(true);
    setTimeout(() => {
      setIsStreaming(false);
      setCurrentResult({
        ...pipelineResult,
        executionTimeMs: Math.floor(1200 + Math.random() * 400),
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              Dual-Pipeline Generation & Ground-Truth Verification Hub
            </h2>
            <p className="text-xs text-slate-400">
              Pipeline 1 (GenAI Stream) + Pipeline 2 (Python Ground-Truth Engine Audit)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Employee Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={activeEmployee.id}
              onChange={(e) => {
                const found = employees.find((emp) => emp.id === e.target.value);
                if (found) onSelectEmployee(found);
              }}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-slate-900 text-slate-200">
                  {emp.name} ({emp.roleTitle})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunPipeline}
            disabled={isStreaming}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
            {isStreaming ? 'Executing Dual Pipeline...' : 'Run Dual Pipeline Verification'}
          </button>

          <button
            onClick={onPublishPlan}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve & Publish Plan
          </button>
        </div>
      </div>

      {/* Split-Screen / Dual Panel View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[680px]">
        {/* Left Panel: Pipeline 1 (GenAI Stream) */}
        <PipelineGenAiOutput result={currentResult} isStreaming={isStreaming} />

        {/* Right Panel: Pipeline 2 (Python Ground-Truth Verifier) */}
        <PipelineGroundTruthVerifier result={currentResult} onSendToHitl={onNavigateToHitl} />
      </div>
    </div>
  );
};
