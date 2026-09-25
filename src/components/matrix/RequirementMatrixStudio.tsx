import React, { useState } from 'react';
import type { JobRole, MatrixRequirement, Document } from '../../types';
import {
  Grid,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal
} from 'lucide-react';

interface RequirementMatrixStudioProps {
  roles: JobRole[];
  requirements: MatrixRequirement[];
  documents: Document[];
  onAddRequirement: (req: MatrixRequirement) => void;
  onAutoGenerateMatrix: (roleId: string) => void;
}

export const RequirementMatrixStudio: React.FC<RequirementMatrixStudioProps> = ({
  roles,
  requirements,
  onAutoGenerateMatrix
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('ROLE-01');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterMandatory, setFilterMandatory] = useState<string>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const roleRequirements = requirements.filter((r) => r.roleId === selectedRoleId).filter((req) => {
    const matchesPriority = filterPriority === 'ALL' || req.priority === filterPriority;
    const matchesMandatory =
      filterMandatory === 'ALL' ||
      (filterMandatory === 'MANDATORY' && req.isMandatory) ||
      (filterMandatory === 'OPTIONAL' && !req.isMandatory);
    return matchesPriority && matchesMandatory;
  });

  const handleTriggerAutoGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onAutoGenerateMatrix(selectedRoleId);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-400" /> Role & Ground-Truth Requirement Matrix Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Define mandatory vs optional competencies and Ground-Truth policy mappings for 10 enterprise job roles
          </p>
        </div>

        <button
          onClick={handleTriggerAutoGenerate}
          disabled={isGenerating}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 shrink-0 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Analyzing Documents & Building Matrix...' : 'Auto-Generate Requirements from Docs'}
        </button>
      </div>

      {/* Role Switcher Grid / Cards */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Select Target Job Role (10 Pre-configured Roles):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRoleId === role.id
                  ? 'bg-gradient-to-br from-indigo-600/30 to-purple-600/20 border-indigo-500 text-indigo-200 shadow-md ring-1 ring-indigo-500/50'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-bold truncate">{role.title}</div>
              <div className="text-[10px] opacity-80 truncate">{role.department}</div>
              <div className="text-[9px] mt-1.5 font-semibold text-indigo-400">
                {role.mandatoryPolicyCount} Mandatory Policies
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Role Active Summary Banner */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100">{activeRole.title} Ground-Truth Matrix</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
              {activeRole.department}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{activeRole.description}</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Status:</span>
            <select
              value={filterMandatory}
              onChange={(e) => setFilterMandatory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="MANDATORY">Mandatory Only</option>
              <option value="OPTIONAL">Optional Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="p-3 rounded-l-xl">Requirement ID</th>
                <th className="p-3">Competency & Skill Objective</th>
                <th className="p-3">Policy / SOP Mapping</th>
                <th className="p-3">Source Section</th>
                <th className="p-3">Mandatory Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Target Stage</th>
                <th className="p-3 text-right rounded-r-xl">Mapping Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {roleRequirements.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-indigo-400">
                    <span className="bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded">
                      {req.requirementId}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-200 max-w-xs">{req.competencyName}</td>
                  <td className="p-3">
                    <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {req.policyMapping}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono">{req.sectionRef}</td>
                  <td className="p-3">
                    {req.isMandatory ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30 text-[10px]">
                        Mandatory
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                        Optional
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        req.priority === 'High'
                          ? 'text-rose-400'
                          : req.priority === 'Medium'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-indigo-300">{req.dueStage}</td>
                  <td className="p-3 text-right">
                    {req.status === 'Mapped' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mapped
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> Missing Document
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
