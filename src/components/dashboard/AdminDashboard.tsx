import React from 'react';
import type { ActiveTab, AnalyticsSummary, Employee } from '../../types';
import {
  FileText,
  GitCompare,
  ShieldAlert,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  Upload,
  RefreshCw,
  Play
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  analytics: AnalyticsSummary;
  allEmployees: Employee[];
  pendingHitlCount: number;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectEmployee: (emp: Employee) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  analytics,
  allEmployees,
  pendingHitlCount,
  onNavigateTab,
  onSelectEmployee
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alert Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">
                Policy Document SOP-07 (Data Security v2.1) Updated
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                14 Plans Affected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              SLA incident reporting window updated to 15 mins. Run impact analysis to verify affected training modules.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('policy')}
          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Impact Analysis
        </button>
      </div>

      {/* KPI Stat Cards (5 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Plans */}
        <div className="p-4 rounded-xl bg-[#081729] border border-teal-900/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Total Plans</span>
            <div className="p-2 rounded-lg bg-[#050f1d] text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-100">{analytics.totalPlansGenerated}</span>
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 10 Enterprise Roles</p>
        </div>

        {/* Card 2: Mandatory Policy Coverage */}
        <div className="p-4 rounded-xl bg-[#081729] border border-teal-900/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Policy Coverage Avg</span>
            <div className="p-2 rounded-lg bg-[#050f1d] text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">{analytics.mandatoryCoverageAvg}%</span>
            <span className="text-[11px] font-medium text-slate-400">Target 100%</span>
          </div>
          <div className="mt-2 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full" style={{ width: `${analytics.mandatoryCoverageAvg}%` }} />
          </div>
        </div>

        {/* Card 3: Source Traceability Score */}
        <div className="p-4 rounded-xl bg-[#081729] border border-teal-900/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Source Traceability</span>
            <div className="p-2 rounded-lg bg-[#050f1d] text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-cyan-300">{analytics.sourceTraceabilityAvg}%</span>
            <span className="text-[11px] font-medium text-emerald-400">High Support</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Direct SOP Clause Mapping</p>
        </div>

        {/* Card 4: Flagged Audit Reviews */}
        <div className="p-4 rounded-xl bg-[#081729] border border-teal-900/30 transition-colors cursor-pointer hover:border-teal-500/50" onClick={() => onNavigateTab('hitl')}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Pending Reviews</span>
            <div className="p-2 rounded-lg bg-[#050f1d] text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-400">{pendingHitlCount}</span>
            <span className="text-[10px] font-medium text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
              Needs Review
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 hover:underline flex items-center gap-1">
            Open Review Queue <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 5: Active Employees */}
        <div className="p-4 rounded-xl bg-[#081729] border border-teal-900/30 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Active Learners</span>
            <div className="p-2 rounded-lg bg-[#050f1d] text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-100">{analytics.activeEmployeesCount}</span>
            <span className="text-[11px] font-medium text-slate-400">Active Cohort</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">4 Department Teams</p>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="p-4 rounded-xl bg-[#081729] border border-teal-900/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Quick Administrator Actions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('documents')}
            className="px-3 py-1.5 rounded-lg bg-[#050f1d] hover:bg-slate-800/80 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors border border-teal-900/40"
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" /> Upload Policy Document
          </button>
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-500/20 hover:brightness-110 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" /> Run Verification Engine
          </button>
          <button
            onClick={() => onNavigateTab('matrix')}
            className="px-3 py-1.5 rounded-lg bg-[#050f1d] hover:bg-slate-800/80 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors border border-teal-900/40"
          >
            <GitCompare className="w-3.5 h-3.5 text-emerald-400" /> Requirement Matrix
          </button>
        </div>
      </div>

      {/* Charts & Department Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Policy Coverage Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#081729]/90 border border-teal-900/30 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Mandatory Policy Coverage by Department</h3>
              <p className="text-xs text-slate-400">Ground-truth validation verification score across enterprise teams</p>
            </div>
            <span className="text-xs font-semibold text-teal-300 bg-teal-500/15 border border-teal-500/30 px-2.5 py-1 rounded-full">
              Avg 98.4%
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.departmentCoverage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="department" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[80, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050f1d', borderColor: '#14b8a6', borderRadius: '12px', fontSize: '12px', color: '#e2e8f0' }}
                  itemStyle={{ color: '#2dd4bf' }}
                />
                <Bar dataKey="coveragePercent" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dual Pipeline Flag Distribution Pie Chart */}
        <div className="p-5 rounded-2xl bg-[#081729]/90 border border-teal-900/30 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Validation Status Breakdown</h3>
            <p className="text-xs text-slate-400">Pipeline 2 Python Engine Audit Results</p>
          </div>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.flagDistribution}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {analytics.flagDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#050f1d', borderColor: '#14b8a6', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-teal-900/30 text-xs">
            {analytics.flagDistribution.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.category}</span>
                </div>
                <span className="font-semibold text-slate-200">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Employees Summary List */}
      <div className="p-5 rounded-2xl bg-[#081729]/90 border border-teal-900/30 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Recent Employee Onboarding Cohorts</h3>
            <p className="text-xs text-slate-400">Click any employee to switch context to their personalized learner view</p>
          </div>
          <button onClick={() => onNavigateTab('learning')} className="text-xs text-teal-400 hover:text-teal-300 font-semibold">
            View Learner Portal →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp)}
              className="p-4 rounded-xl bg-[#050f1d] border border-teal-900/30 hover:border-teal-500/50 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/40" />
                <div>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-teal-300 transition-colors">
                    {emp.name}
                  </h4>
                  <p className="text-xs text-slate-400">{emp.roleTitle}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Milestone Progress</span>
                  <span className="font-bold text-teal-400">{emp.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full" style={{ width: `${emp.progressPercentage}%` }} />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 truncate flex items-center justify-between border-t border-teal-900/30 pt-2">
                <span>{emp.currentMilestone}</span>
                <span className={`px-1.5 py-0.5 rounded font-semibold ${
                  emp.status === 'On Track' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {emp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
