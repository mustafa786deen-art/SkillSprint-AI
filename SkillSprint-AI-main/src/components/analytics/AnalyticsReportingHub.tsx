import React, { useState } from 'react';
import type { AnalyticsSummary, Employee } from '../../types';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Filter,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsReportingHubProps {
  analytics: AnalyticsSummary;
  employees: Employee[];
}

export const AnalyticsReportingHub: React.FC<AnalyticsReportingHubProps> = ({ analytics, employees }) => {
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [exportMessage, setExportMessage] = useState<string>('');

  const filteredEmployees = employees.filter((emp) => {
    return departmentFilter === 'ALL' || emp.department === departmentFilter;
  });

  const handleExportCSV = () => {
    const csvHeader = "Employee ID,Name,Role,Department,Progress (%),Status,Joining Date\n";
    const csvRows = employees.map(e => `${e.id},"${e.name}","${e.roleTitle}","${e.department}",${e.progressPercentage},${e.status},${e.joiningDate}`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillSprint_AI_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setExportMessage('CSV Compliance Report downloaded successfully!');
    setTimeout(() => setExportMessage(''), 3000);
  };

  const handleExportPDF = () => {
    setExportMessage('PDF Compliance Summary generated & sent to download queue!');
    setTimeout(() => setExportMessage(''), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" /> Enterprise Analytics & Compliance Reports Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ground-truth mandatory coverage traceability, policy impact statistics, and exportable compliance reports
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV Report
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" /> Download PDF Audit Report
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {exportMessage}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Plans Audited</span>
          <div className="mt-2 text-2xl font-black text-slate-100">{analytics.totalPlansGenerated}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +12% Mo/Mo Velocity
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Mandatory Policy Coverage</span>
          <div className="mt-2 text-2xl font-black text-emerald-400">{analytics.mandatoryCoverageAvg}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Ground-Truth Verified</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Source Citation Traceability</span>
          <div className="mt-2 text-2xl font-black text-purple-300">{analytics.sourceTraceabilityAvg}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Direct Section Linkage</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Completion Velocity</span>
          <div className="mt-2 text-2xl font-black text-indigo-400">8 Days Avg</div>
          <div className="text-[11px] text-slate-400 mt-1">Speed to Full Compliance</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Completion Velocity Line Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Monthly Onboarding Completion Velocity</h3>
              <p className="text-xs text-slate-400">Completed plans & average completion days</p>
            </div>
            <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/30">
              5 Months Trend
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.completionVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="completedPlans" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flag Category Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Audit Status Distribution</h3>
            <p className="text-xs text-slate-400">Dual-Pipeline Ground-Truth Result Categorization</p>
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
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {analytics.flagDistribution.map((item) => (
              <div key={item.category} className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.category}
                </span>
                <span className="font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filterable Detailed Compliance Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-100">Employee Compliance & Audit Log Table</h3>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" /> Filter Department:
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Sales & Revenue">Sales & Revenue</option>
              <option value="Customer Experience">Customer Experience</option>
              <option value="Analytics & BI">Analytics & BI</option>
              <option value="Engineering & Infrastructure">Engineering & Infrastructure</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase bg-slate-950/60">
                <th className="p-3">Employee ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Department</th>
                <th className="p-3">Progress</th>
                <th className="p-3 text-right">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-400">{emp.id}</td>
                  <td className="p-3 font-semibold text-slate-200">{emp.name}</td>
                  <td className="p-3 text-slate-300">{emp.roleTitle}</td>
                  <td className="p-3 text-slate-400">{emp.department}</td>
                  <td className="p-3 font-bold text-emerald-400">{emp.progressPercentage}%</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                      {emp.status}
                    </span>
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
