import React from 'react';
import type { Document, TextChunk } from '../../types';
import { Drawer } from '../common/Drawer';
import { Database, Layers, BookOpen } from 'lucide-react';

interface ChunkInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  chunks: TextChunk[];
}

export const ChunkInspectorDrawer: React.FC<ChunkInspectorDrawerProps> = ({
  isOpen,
  onClose,
  document,
  chunks
}) => {
  if (!document) return null;

  const docChunks = chunks.filter((c) => c.docId === document.id || c.docTitle.includes(document.documentId));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Chunk & Traceability Inspector: ${document.documentId}`}
      subtitle={`Extracted text vectors for ${document.title} (${document.version})`}
      width="2xl"
    >
      <div className="space-y-6">
        {/* Header Metadata Summary Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Document ID</span>
            <span className="font-bold text-indigo-400">{document.documentId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category</span>
            <span className="font-semibold text-slate-200">{document.category}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Precedence Level</span>
            <span className="font-bold text-amber-400">Order #{document.precedenceOrder}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Chunks</span>
            <span className="font-bold text-emerald-400">{document.chunksCount} Extracted</span>
          </div>
        </div>

        {/* Chunks List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Vector Database Chunks ({docChunks.length > 0 ? docChunks.length : document.chunksCount} Items)
          </h4>

          {docChunks.length > 0 ? (
            docChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[11px] border border-indigo-500/30">
                      {chunk.chunkId}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{chunk.heading}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Section {chunk.sectionId}
                    </span>
                    {chunk.pageNumber && (
                      <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        PDF Page {chunk.pageNumber}
                      </span>
                    )}
                    {chunk.paragraphRef && (
                      <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        DOCX {chunk.paragraphRef}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800/60">
                  {chunk.content}
                </p>

                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-emerald-400" /> Embedding Status: <strong className="text-emerald-400">{chunk.vectorEmbeddingStatus}</strong>
                  </span>
                  <span>Precedence Weight: <strong className="text-amber-400">{chunk.precedenceScore}/100</strong></span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">Sample vector chunks generated dynamically during ingestion.</p>
              <div className="p-3 bg-slate-900 rounded-lg text-left text-xs text-slate-300 font-mono">
                [Chunk 1: SOP §1.1] All employee onboarding steps must conform to SOC2 Security Principles...
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
