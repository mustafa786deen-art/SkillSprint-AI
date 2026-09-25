import React, { useState } from 'react';
import type { Employee, UserRoleMode } from '../../types';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, User, Layers } from 'lucide-react';

interface LoginPageProps {
  onLogin: (roleMode: UserRoleMode, employee?: Employee) => void;
  allEmployees: Employee[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, allEmployees }) => {
  const [email, setEmail] = useState('admin@skillsprint.com');
  const [password, setPassword] = useState('••••••••••••');
  const [activeTab, setActiveTab] = useState<'admin' | 'employee'>('admin');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(allEmployees[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'admin') {
      onLogin('admin');
    } else {
      const emp = allEmployees.find((e) => e.id === selectedEmpId) || allEmployees[0];
      onLogin('employee', emp);
    }
  };

  return (
    <div className="min-h-screen bg-[#061325] text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-teal-500 selection:text-white">
      {/* Container */}
      <div className="w-full max-w-4xl bg-[#081729] border border-teal-900/40 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Branding Panel */}
        <div className="p-8 lg:p-10 bg-[#050f1d]/90 border-r border-teal-900/30 flex flex-col justify-between space-y-8">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/20">
                <Layers className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">SkillSprint Enterprise</h1>
                <p className="text-[11px] text-teal-400 font-medium">Policy Audit & Employee Training</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-100 leading-snug">
              Automated Compliance Verification & Role Onboarding
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Verify employee competency against corporate policy guidelines, generate ground-truth training modules, and track onboarding milestones.
            </p>
          </div>

          {/* Key Platform Highlights */}
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#081729] border border-teal-900/40">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ground-Truth Verification Engine</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#081729] border border-teal-900/40">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Supervisor Override & Audit Review Queue</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#081729] border border-teal-900/40">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Personalized Role Training Modules</span>
            </div>
          </div>

          {/* Security Footer */}
          <div className="pt-4 border-t border-teal-900/30 flex items-center justify-between text-[11px] text-slate-500">
            <span>System Status: <strong className="text-emerald-400">Operational</strong></span>
            <span className="text-teal-400/80">v2.4 Enterprise</span>
          </div>
        </div>

        {/* Right Form & Auth Options Panel */}
        <div className="p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#081729]">
          <div>
            <h3 className="text-base font-bold text-slate-100">Sign in to Enterprise Workspace</h3>
            <p className="text-xs text-slate-400 mt-1">Select your login persona or proceed with credentials</p>

            {/* Login Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-1.5 mt-5 p-1 bg-[#050f1d] border border-teal-900/40 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Admin / HR
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('employee')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'employee'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Learner Portal
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'admin' ? (
              <>
                <div className="space-y-1 text-xs">
                  <label className="block text-slate-300 font-medium">Enterprise Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050f1d] border border-teal-900/40 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400 font-sans text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="block text-slate-300 font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#050f1d] border border-teal-900/40 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400 font-sans text-xs"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1 text-xs">
                <label className="block text-slate-300 font-medium">Select Employee Persona</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#050f1d] border border-teal-900/40 rounded-xl text-slate-200 focus:outline-none focus:border-teal-400 text-xs"
                >
                  {allEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.roleTitle}) - {emp.department}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 hover:brightness-110 transition-all"
            >
              Sign In to Workspace <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Sign In */}
          <div className="pt-4 border-t border-teal-900/30 space-y-2">
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Demo Access:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onLogin('admin')}
                className="p-2.5 rounded-xl bg-[#050f1d] hover:bg-slate-800/80 border border-teal-900/40 text-left text-xs transition-all group"
              >
                <div className="font-semibold text-teal-400 group-hover:text-teal-300">Admin Lead</div>
                <div className="text-[10px] text-slate-400">Full Dashboard Access</div>
              </button>
              <button
                type="button"
                onClick={() => onLogin('employee', allEmployees[0])}
                className="p-2.5 rounded-xl bg-[#050f1d] hover:bg-slate-800/80 border border-teal-900/40 text-left text-xs transition-all group"
              >
                <div className="font-semibold text-emerald-400 group-hover:text-emerald-300">Alex Morgan</div>
                <div className="text-[10px] text-slate-400">Sales Executive Learner</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

