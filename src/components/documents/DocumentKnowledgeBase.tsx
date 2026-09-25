import React, { useState } from 'react';
import type { Document, TextChunk } from '../../types';
import { Badge } from '../common/Badge';
import { ChunkInspectorDrawer } from './ChunkInspectorDrawer';
import { DocumentUploadModal } from './DocumentUploadModal';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye
} from 'lucide-react';

interface DocumentKnowledgeBaseProps {
  documents: Document[];
  chunks: TextChunk[];
  onAddDocument: (doc: Document) => void;
  onDeprecateDocument: (docId: string) => void;
}

export const DocumentKnowledgeBase: React.FC<DocumentKnowledgeBaseProps> = ({
  documents,
  chunks,
  onAddDocument,
  onDeprecateDocument
}) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isChunkDrawerOpen, setIsChunkDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenChunks = (doc: Document) => {
    setSelectedDoc(doc);
    setIsChunkDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Policy Document Knowledge Base & Pipeline Ingestion
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise policy repository with precedence indexing, chunk extraction, and prompt injection defense gates
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Upload & Ingest Policy Document
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by title, ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4" />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="SOP">SOP</option>
            <option value="HR Policy">HR Policy</option>
            <option value="Compliance">Compliance</option>
            <option value="Security Policy">Security Policy</option>
            <option value="Technical Spec">Technical Spec</option>
            <option value="FAQ">FAQ</option>
          </select>
        </div>
      </div>

      {/* Document Knowledge Base Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="p-3 rounded-l-xl">Doc ID & Code</th>
                <th className="p-3">Document Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Version</th>
                <th className="p-3">Precedence</th>
                <th className="p-3">Chunks Extracted</th>
                <th className="p-3">Security Scan Gate</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="p-3 font-bold text-indigo-400">
                    <span className="bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded">
                      {doc.documentId}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="font-semibold text-slate-200 truncate">{doc.title}</div>
                    <div className="text-[10px] text-slate-400">{doc.department}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px]">
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-semibold text-slate-300">{doc.version}</td>
                  <td className="p-3">
                    <span className="text-amber-400 font-bold">#{doc.precedenceOrder}</span>
                  </td>
                  <td className="p-3 font-bold text-emerald-400">{doc.chunksCount} Chunks</td>
                  <td className="p-3">
                    <Badge status={doc.securityStatus} size="sm" />
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        doc.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenChunks(doc)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      title="Inspect extracted chunks"
                    >
                      <Eye className="w-3.5 h-3.5" /> Chunks
                    </button>
                    {doc.status === 'Active' && (
                      <button
                        onClick={() => onDeprecateDocument(doc.id)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 text-xs font-semibold inline-flex items-center transition-colors"
                        title="Mark as obsolete"
                      >
                        Deprecate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Drawers */}
      <ChunkInspectorDrawer
        isOpen={isChunkDrawerOpen}
        onClose={() => setIsChunkDrawerOpen(false)}
        document={selectedDoc}
        chunks={chunks}
      />

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadDocument={onAddDocument}
      />
    </div>
  );
};
