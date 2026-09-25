import React, { useState } from 'react';
import type { HitlReviewItem } from '../../types';
import { Badge } from '../common/Badge';
import { SideBySideReviewModal } from './SideBySideReviewModal';
import {
  UserCheck,
  ShieldAlert,
  Filter,
  CheckCircle2,
  ArrowRight,
  History
} from 'lucide-react';

interface HitlReviewCenterProps {
  queueItems: HitlReviewItem[];
  onApproveOverride: (itemId: string, note: string) => void;
  onRejectItem: (itemId: string, note: string) => void;
  onEditInline: (itemId: string, editedText: string, note: string) => void;
  onSelectiveRegenerate: (itemId: string) => void;
}

export const HitlReviewCenter: React.FC<HitlReviewCenterProps> = ({
  queueItems,
  onApproveOverride,
  onRejectItem,
  onEditInline,
  onSelectiveRegenerate
}) => {
  const [selectedItem, setSelectedItem] = useState<HitlReviewItem | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'audit'>('queue');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');

  const pendingItems = queueItems.filter((item) => item.status === 'Pending Review').filter((i) => {
    return urgencyFilter === 'ALL' || i.urgency === urgencyFilter;
  });

  const auditLogs = queueItems.filter((item) => item.status !== 'Pending Review');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" /> Human-in-the-Loop (HITL) Review Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review flagged hallucinations, unsupported claims, and policy contradictions before publishing to learners
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'queue'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Pending Queue ({pendingItems.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Historical Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              {pendingItems.length} Flagged Items Awaiting Human Supervisor Review
            </span>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Urgency:</span>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-700/80 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Urgencies</option>
                <option value="High">High Urgency</option>
                <option value="Medium">Medium Urgency</option>
                <option value="Low">Low Urgency</option>
              </select>
            </div>
          </div>

          {/* Queue Items Cards List */}
          <div className="space-y-3">
            {pendingItems.length > 0 ? (
              pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
                          {item.itemTitle}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            item.urgency === 'High'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {item.urgency} Urgency
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Employee: <strong className="text-indigo-300">{item.employeeName}</strong> ({item.roleTitle})
                      </p>
                    </div>

                    <Badge status={item.contradictionType} size="sm" />
                  </div>

                  {/* Summary Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400">Ground-Truth SOP Excerpt:</span>
                      <p className="text-slate-300 line-clamp-2">"{item.groundTruthExcerpt}"</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-rose-400">GenAI Flagged Claim:</span>
                      <p className="text-slate-300 line-clamp-2">"{item.genAiOutput}"</p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
                    >
                      Open Side-by-Side Review <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-200">HITL Queue Empty</h3>
                <p className="text-xs text-slate-400">All generated onboarding items match ground-truth policies cleanly!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Historical Audit Logs Tab */
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" /> Completed Reviewer Overrides & Audit Trail
          </h3>

          <div className="divide-y divide-slate-800 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-200">{log.itemTitle}</div>
                  <div className="text-slate-400 text-[11px]">
                    Reviewer: <strong className="text-slate-300">{log.reviewerName || 'Senior HR Auditor'}</strong> • Note: "{log.reviewerNotes}"
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-400">{log.updatedAt || 'Just now'}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Review Modal */}
      <SideBySideReviewModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onApproveOverride={onApproveOverride}
        onRejectItem={onRejectItem}
        onEditInline={onEditInline}
        onSelectiveRegenerate={onSelectiveRegenerate}
      />
    </div>
  );
};
