import React, { useState } from 'react';
import type { Employee, LearningModule, QuizQuestion, ScenarioTask } from '../../types';
import { InteractiveQuiz } from './InteractiveQuiz';
import { ScenarioSimulator } from './ScenarioSimulator';
import {
  GraduationCap,
  Clock,
  Lock,
  CheckCircle2,
  BookOpen,
  FileText,
  ShieldCheck,
  Sparkles,
  Award
} from 'lucide-react';

interface EmployeeLearningPortalProps {
  employee: Employee;
  modules: LearningModule[];
  quizzes: QuizQuestion[];
  scenarioTask: ScenarioTask;
  onOpenSourceDoc: (docId: string, section: string) => void;
}

export const EmployeeLearningPortal: React.FC<EmployeeLearningPortalProps> = ({
  employee,
  modules: initialModules,
  quizzes,
  scenarioTask,
  onOpenSourceDoc
}) => {
  const [modules, setModules] = useState<LearningModule[]>(initialModules);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(initialModules[0].id);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'scenario'>('content');

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
  const activeQuiz = quizzes.find((q) => q.moduleId === selectedModule.id) || quizzes[0];

  const handleCompleteModule = (modId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === modId) return { ...m, completed: true };
        if (m.prerequisiteModuleId === modId) return { ...m, isLocked: false };
        return m;
      })
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Learner Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                Dual-Pipeline Ground-Truth Verified
              </span>
              <span className="text-xs text-slate-400">{employee.department}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 mt-1">
              Personalized Learning Portal: {employee.name}
            </h2>
            <p className="text-xs text-slate-400">
              Role: <strong className="text-indigo-300">{employee.roleTitle}</strong> • Onboarding Milestone Roadmap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Completed Modules: <strong className="text-emerald-400 font-bold">{modules.filter((m) => m.completed).length}/{modules.length}</strong></span>
        </div>
      </div>

      {/* Milestone Roadmap Tabs & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 1 Col: Module Sidebar Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-400" /> Assigned Onboarding Modules
          </h3>

          <div className="space-y-2">
            {modules.map((mod) => {
              const isSelected = mod.id === selectedModuleId;
              return (
                <button
                  key={mod.id}
                  disabled={mod.isLocked}
                  onClick={() => {
                    setSelectedModuleId(mod.id);
                    setActiveTab('content');
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 border-indigo-500 text-indigo-200 shadow-md ring-1 ring-indigo-500/40'
                      : mod.isLocked
                      ? 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60 cursor-not-allowed'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-indigo-400 border border-slate-800">
                      {mod.stage}
                    </span>
                    {mod.completed ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    ) : mod.isLocked ? (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-indigo-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" /> {mod.durationMinutes}m
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold truncate">{mod.title}</div>
                  {mod.isLocked && mod.prerequisiteTitle && (
                    <div className="text-[9px] text-amber-400/80 mt-1 truncate">
                      Prereq: {mod.prerequisiteTitle}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Cols: Active Module Content Viewer */}
        <div className="lg:col-span-3 space-y-5">
          {/* Internal Tab Bar (Content vs Quiz vs Scenario) */}
          <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs w-fit">
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'content'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Learning Objectives & Citations
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Grounded Policy Quiz
            </button>
            <button
              onClick={() => setActiveTab('scenario')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'scenario'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Practical Scenario Task
            </button>
          </div>

          {activeTab === 'content' && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold text-xs">
                    {selectedModule.stage}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Estimated Time: {selectedModule.durationMinutes} Mins
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-2">{selectedModule.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedModule.summary}</p>
              </div>

              {/* Objectives List */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Learning Objectives</h4>
                <div className="space-y-1.5">
                  {selectedModule.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Policy Citations with Expandable Excerpts */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Policy Source Citations (Traceable Ground Truth)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedModule.sourceCitations.map((cit, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-indigo-400">{cit.docTitle}</span>
                        <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {cit.sectionId}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                        "{cit.excerpt}"
                      </p>

                      <button
                        onClick={() => onOpenSourceDoc(cit.docId, cit.sectionId)}
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-1"
                      >
                        Inspect Document Chunk →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCompleteModule(selectedModule.id)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark Module Completed & Unlock Next Stage
              </button>
            </div>
          )}

          {activeTab === 'quiz' && (
            <InteractiveQuiz
              quiz={activeQuiz}
              onCompleteQuiz={() => handleCompleteModule(selectedModule.id)}
              onOpenSourceDoc={onOpenSourceDoc}
            />
          )}

          {activeTab === 'scenario' && (
            <ScenarioSimulator
              task={scenarioTask}
              onCompleteTask={() => handleCompleteModule(selectedModule.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
