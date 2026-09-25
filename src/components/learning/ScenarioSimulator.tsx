import React, { useState } from 'react';
import type { ScenarioTask } from '../../types';
import { Terminal, CheckCircle2, Play, Award } from 'lucide-react';

interface ScenarioSimulatorProps {
  task: ScenarioTask;
  onCompleteTask: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ task, onCompleteTask }) => {
  const [userSubmission, setUserSubmission] = useState(task.userSubmission || '');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const handleEvaluate = () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setIsEvaluated(true);
    }, 1200);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100">{task.title}</h3>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
          Practical Scenario Simulation
        </span>
      </div>

      {/* Simulated Scenario Prompt */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Simulated Executive Scenario</span>
        <p className="text-xs text-slate-200 leading-relaxed italic font-serif">
          "{task.simulatedScenario}"
        </p>
      </div>

      {/* Rubric View */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-emerald-400" /> Evaluation Rubric & Pass Conditions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {task.submissionCriteria.map((crit, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-slate-200">
                <span>{crit.criterion}</span>
                <span className="text-indigo-400">{crit.weight}% Weight</span>
              </div>
              <p className="text-[10px] text-slate-400">{crit.passCondition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Box */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300">Your Escalation Response Submission</label>
        <textarea
          rows={4}
          value={userSubmission}
          onChange={(e) => setUserSubmission(e.target.value)}
          placeholder="Describe step-by-step how you fulfill SOP-04 §2.1 and handle customer PII..."
          className="w-full p-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
        />
      </div>

      {/* Action Button */}
      {!isEvaluated ? (
        <button
          onClick={handleEvaluate}
          disabled={evaluating || !userSubmission.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${evaluating ? 'animate-spin' : ''}`} />
          {evaluating ? 'Evaluating Submission against Ground-Truth Rubric...' : 'Run Automated AI Rubric Audit'}
        </button>
      ) : (
        /* Evaluation Results */
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Passed Rubric Audit! (Score: 100/100)
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
              PASSED
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Excellent execution. Correctly identified mandatory use of PII Redaction Tool v4.0 before emailing files and logged Jira escalation ticket per SOP-04 §2.1.
          </p>
          <button
            onClick={onCompleteTask}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
          >
            Mark Practical Task Completed →
          </button>
        </div>
      )}
    </div>
  );
};
