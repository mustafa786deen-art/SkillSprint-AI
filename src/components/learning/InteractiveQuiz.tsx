import React, { useState } from 'react';
import type { QuizQuestion } from '../../types';
import { Sparkles, CheckCircle2, XCircle, FileText } from 'lucide-react';

interface InteractiveQuizProps {
  quiz: QuizQuestion;
  onCompleteQuiz: (passed: boolean) => void;
  onOpenSourceDoc: (docId: string, section: string) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  quiz,
  onCompleteQuiz,
  onOpenSourceDoc
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selectedIndex === quiz.correctAnswerIndex;

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setIsSubmitted(true);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100">Interactive Policy-Grounded Knowledge Check</h3>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
          SOC2 Grounded Quiz
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-200 leading-relaxed">
        {quiz.question}
      </p>

      {/* Quiz Option Cards */}
      <div className="space-y-2.5">
        {quiz.options.map((opt, idx) => {
          let stateStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300';
          if (selectedIndex === idx) {
            stateStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold ring-1 ring-indigo-500/40';
          }
          if (isSubmitted) {
            if (idx === quiz.correctAnswerIndex) {
              stateStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500/50';
            } else if (selectedIndex === idx) {
              stateStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-semibold';
            }
          }

          return (
            <button
              key={idx}
              disabled={isSubmitted}
              onClick={() => setSelectedIndex(idx)}
              className={`w-full p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${stateStyle}`}
            >
              <span>{opt}</span>
              {isSubmitted && idx === quiz.correctAnswerIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {isSubmitted && selectedIndex === idx && idx !== quiz.correctAnswerIndex && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedIndex === null}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-40"
        >
          Submit Answer
        </button>
      ) : (
        /* Instant Feedback Panel */
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Correct Answer!
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Incorrect Answer
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">{quiz.explanation}</p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <button
              onClick={() => onOpenSourceDoc(quiz.sourceDocId, quiz.sourceSection)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 text-[11px]"
            >
              <FileText className="w-3.5 h-3.5" /> Direct Link: {quiz.sourceDocId} {quiz.sourceSection} →
            </button>

            <button
              onClick={() => onCompleteQuiz(isCorrect)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              Continue Module →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
