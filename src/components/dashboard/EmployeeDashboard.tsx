import React from 'react';
import type { Employee, LearningModule, QuizQuestion } from '../../types';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Lock,
  FileText
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface EmployeeDashboardProps {
  employee: Employee;
  modules: LearningModule[];
  dailyQuiz: QuizQuestion;
  onNavigateToModule: (moduleId: string) => void;
  onNavigateToQuiz: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  employee,
  modules,
  dailyQuiz,
  onNavigateToModule,
  onNavigateToQuiz
}) => {
  const currentModule = modules.find((m) => !m.completed && !m.isLocked) || modules[0];

  const milestones = [
    { label: 'Day 1', stage: 'Day 1', status: 'Completed' },
    { label: 'Week 1', stage: 'Week 1', status: 'Completed' },
    { label: 'Week 2', stage: 'Week 2', status: 'In Progress' },
    { label: '30 Days', stage: '30 Days', status: 'Upcoming' },
    { label: '60 Days', stage: '60 Days', status: 'Upcoming' },
    { label: '90 Days', stage: '90 Days', status: 'Upcoming' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Learner Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#081729] via-[#062540] to-[#08334e] border border-teal-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/50 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  Dual-Pipeline Verified Onboarding
                </span>
                <span className="text-xs text-slate-400">{employee.joiningDate} Joined</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-100 mt-1">
                Welcome back, {employee.name}! 👋
              </h2>
              <p className="text-xs text-slate-400">
                {employee.roleTitle} • {employee.department} • {employee.experienceLevel} Level
              </p>
            </div>
          </div>

          <div className="w-full lg:w-72 bg-[#050f1d]/90 p-4 rounded-2xl border border-teal-900/40 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Overall Track Progress</span>
              <span className="font-bold text-emerald-400">{employee.progressPercentage}%</span>
            </div>
            <ProgressBar value={employee.progressPercentage} height="h-3" colorClass="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
            <p className="text-[11px] text-slate-400 text-center pt-0.5">
              Current Focus: <span className="text-teal-300 font-semibold">{employee.currentMilestone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Roadmap Timeline Bar */}
      <div className="p-5 rounded-2xl bg-[#081729]/90 border border-teal-900/30 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-teal-400" /> Multi-Stage Learning Roadmap
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center transition-all ${
                m.status === 'Completed'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : m.status === 'In Progress'
                  ? 'bg-teal-500/20 border-teal-500/50 text-teal-200 ring-1 ring-teal-500/40'
                  : 'bg-[#050f1d] border-teal-900/30 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {m.status === 'Completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : m.status === 'In Progress' ? (
                  <Clock className="w-4 h-4 text-teal-400 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div className="text-xs font-bold">{m.label}</div>
              <div className="text-[10px] opacity-80 mt-0.5">{m.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Current Active Module vs Daily Quiz & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Learning Module Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#081729]/90 border border-teal-900/30 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[11px] font-semibold">
                Current Assigned Module
              </span>
              <h3 className="text-lg font-bold text-slate-100 mt-2">{currentModule.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{currentModule.summary}</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#050f1d] border border-teal-900/40 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" /> {currentModule.durationMinutes} mins
            </div>
          </div>

          {/* Module Objectives */}
          <div className="p-4 rounded-xl bg-[#050f1d] border border-teal-900/40 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Module Objectives</h4>
            <div className="space-y-1.5">
              {currentModule.objectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckSquare className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ground-Truth Policy Citations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Grounded Policy Citations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentModule.sourceCitations.map((cit, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#050f1d] border border-teal-900/40 text-xs space-y-1">
                  <div className="flex justify-between items-center text-teal-300 font-semibold">
                    <span>{cit.docTitle}</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{cit.sectionId}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic line-clamp-2">"{cit.excerpt}"</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToModule(currentModule.id)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 hover:brightness-110 transition-all"
          >
            <BookOpen className="w-4 h-4" /> Continue Active Learning Module →
          </button>
        </div>

        {/* Right 1 Col: Daily Quiz Card & Tasks */}
        <div className="space-y-6">
          {/* Daily Quiz Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#072d42] via-[#081729] to-[#081729] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Daily Knowledge Check</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
                3 Mins
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              "{dailyQuiz.question}"
            </p>

            <button
              onClick={onNavigateToQuiz}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 hover:brightness-110"
            >
              Take Policy Quiz <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Upcoming Learner Tasks */}
          <div className="p-5 rounded-2xl bg-[#081729]/90 border border-teal-900/30 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Pending Tasks & Practical Scenarios
            </h3>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#050f1d] border border-teal-900/40 hover:border-teal-500/40 transition-colors flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">Customer PII Redaction Scenario</div>
                  <div className="text-[10px] text-slate-400">Due: Tomorrow • SOP-04 §2.1</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                  Practical Task
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#050f1d] border border-teal-900/40 hover:border-teal-500/40 transition-colors flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">CRM Opportunity Thresholds Quiz</div>
                  <div className="text-[10px] text-slate-400">Due: Friday • SOP-07 §1.1</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-medium">
                  Quiz
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
