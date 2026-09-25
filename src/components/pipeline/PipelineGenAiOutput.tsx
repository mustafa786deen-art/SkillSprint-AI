import React, { useState } from 'react';
import type { DualPipelineResult } from '../../types';
import { Sparkles, Code, Layout, Layers, ShieldCheck, Tag, Terminal } from 'lucide-react';

interface PipelineGenAiOutputProps {
  result: DualPipelineResult;
  isStreaming: boolean;
}

export const PipelineGenAiOutput: React.FC<PipelineGenAiOutputProps> = ({ result, isStreaming }) => {
  const [viewMode, setViewMode] = useState<'structured' | 'json'>('structured');

  return (
    <div className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl flex flex-col h-full ${
      isStreaming ? 'streaming-border border-indigo-500' : ''
    }`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className={`w-4 h-4 ${isStreaming ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">Pipeline 1: GenAI Output Stream</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                GPT-4o Stream
              </span>
            </div>
            <p className="text-xs text-slate-400">Generated Onboarding Plan & Learning Objectives</p>
          </div>
        </div>

        {/* JSON vs Structured Tab Toggle */}
        <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('structured')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'structured'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" /> Structured Plan
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
              viewMode === 'json'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Raw JSON
          </button>
        </div>
      </div>

      {/* Streaming Status Bar */}
      {isStreaming && (
        <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2 animate-pulse">
          <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Parsing LLM JSON stream in real-time... Extracting Requirement IDs & Source Tags...</span>
        </div>
      )}

      {/* Content View */}
      <div className="flex-1 overflow-y-auto space-y-4 max-h-[600px] pr-1">
        {viewMode === 'structured' ? (
          <div className="space-y-4">
            {/* Generated Plan Header */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Generated Plan Title</span>
              <h4 className="text-sm font-bold text-slate-200">
                {result.generatedPlanJson.planTitle || 'Sales Executive Onboarding Plan'}
              </h4>
              <p className="text-xs text-slate-400">Target Employee: <span className="text-indigo-300 font-semibold">{result.roleTitle}</span></p>
            </div>

            {/* Generated Modules & Items with Tags */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" /> Generated Modules & Metadata Tags
              </h4>

              {result.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-200">{idx + 1}. {item.fieldName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      Req ID: {item.reqId}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    "{item.genAiOutput}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1 text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      <Tag className="w-3 h-3" /> Doc: {item.sourceDocId} {item.sourceSection}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Grounding Tagged
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* JSON Viewer */
          <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800 leading-relaxed">
            <pre>{JSON.stringify(result.generatedPlanJson, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
