import React, { useState } from 'react';
import type { HitlReviewItem } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ShieldAlert, CheckCircle2, XCircle, Edit3, RefreshCw, FileText, AlertTriangle, UserCheck } from 'lucide-react';

interface SideBySideReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HitlReviewItem | null;
  onApproveOverride: (itemId: string, note: string) => void;
  onRejectItem: (itemId: string, note: string) => void;
  onEditInline: (itemId: string, editedText: string, note: string) => void;
  onSelectiveRegenerate: (itemId: string) => void;
}

export const SideBySideReviewModal: React.FC<SideBySideReviewModalProps> = ({
  isOpen,
  onClose,
  item,
  onApproveOverride,
  onRejectItem,
  onEditInline,
  onSelectiveRegenerate
}) => {
  if (!item) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.genAiOutput);
  const [reviewerNote, setReviewerNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateNote = () => {
    if (!reviewerNote.trim()) {
      setErrorMessage('Mandatory audit comment required for reviewer traceability.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleApprove = () => {
    if (!validateNote()) return;
    onApproveOverride(item.id, reviewerNote);
    onClose();
  };

  const handleReject = () => {
    if (!validateNote()) return;
    onRejectItem(item.id, reviewerNote);
    onClose();
  };

  const handleSaveEdit = () => {
    if (!validateNote()) return;
    onEditInline(item.id, editedText, reviewerNote);
    setIsEditing(false);
    onClose();
  };

  const handleRegenerate = () => {
    onSelectiveRegenerate(item.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Human-in-the-Loop Review: ${item.itemTitle}`}
      subtitle={`Flagged Item for ${item.employeeName} (${item.roleTitle})`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Flag Reason Banner */}
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Contradiction Type: <strong className="font-bold">{item.contradictionType}</strong></span>
          </div>
          <Badge status={item.contradictionType} size="sm" />
        </div>

        {/* Side-by-Side Comparison Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Panel: Ground-Truth Policy Excerpt */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Original Policy Ground-Truth Excerpt
              </span>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {item.sourceDocId} {item.sourceSection}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              "{item.groundTruthExcerpt}"
            </p>

            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Location: {item.sourcePageRef}</span>
              <span className="text-emerald-400 font-semibold">100% Policy Grounded</span>
            </div>
          </div>

          {/* Right Panel: GenAI Generated Item (Editable) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5" /> GenAI Generated Task / Claim
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" /> {isEditing ? 'Cancel Edit' : 'Edit Inline'}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full h-28 p-3 text-xs bg-slate-900 border border-indigo-500 rounded-lg text-slate-100 font-sans focus:outline-none"
              />
            ) : (
              <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                "{item.genAiOutput}"
              </p>
            )}

            <div className="text-[10px] text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Flagged: Discrepancy with Ground-Truth SOP
            </div>
          </div>
        </div>

        {/* Mandatory Reviewer Comment Box */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Mandatory Reviewer Audit Reason / Note *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Approved override due to special regional VP waiver signed on 2026-09-20..."
            value={reviewerNote}
            onChange={(e) => {
              setReviewerNote(e.target.value);
              setErrorMessage('');
            }}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {errorMessage && <p className="text-[11px] text-rose-400 font-semibold">{errorMessage}</p>}
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleRegenerate}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Request Selective Regeneration
          </button>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Save Inline Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject Item
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Override
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

function SparklesIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>;
}
