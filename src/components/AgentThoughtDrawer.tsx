'use client';

import React from 'react';
import { X, Cpu, Clock, CheckCircle, Ban, AlertCircle } from 'lucide-react';
import { QueueItem, AgentThought } from '@/types/moderation';

interface AgentThoughtDrawerProps {
  item: QueueItem | null;
  onClose: () => void;
  onOverride: (id: string, action: 'APPROVED' | 'BLOCKED' | 'ESCALATED') => void;
}

export const AgentThoughtDrawer: React.FC<AgentThoughtDrawerProps> = ({ item, onClose, onOverride }) => {
  if (!item) return null;

  const activeStatus = item.overrideStatus || item.verdict;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop overlay trigger close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-gray-950 border-l border-gray-800 h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl z-10">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Agent Forensic Trace
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Trace ID: {item.id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 border border-gray-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Post Card */}
          <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
                  {item.authorName.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-200 block">{item.authorName}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{item.authorHandle} • {item.platform}</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> {item.createdAt}
              </span>
            </div>
            <p className="text-xs text-gray-200 bg-gray-950/80 p-3 rounded-lg border border-gray-800/80 font-sans leading-relaxed">
              &quot;{item.content}&quot;
            </p>
          </div>

          {/* Verdict Summary Box */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
              <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Final Status</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                  activeStatus === 'APPROVED' || activeStatus === 'PUBLISH'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                    : activeStatus === 'BLOCKED' || activeStatus === 'AUTO_BLOCK'
                    ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                    : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                }`}>
                  {activeStatus}
                </span>
                {item.overrideStatus && (
                  <span className="text-[9px] text-cyan-300 bg-cyan-950 border border-cyan-700/60 px-1.5 py-0.2 rounded font-mono">
                    Human Override
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
              <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Risk Score</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-lg font-mono font-bold ${
                  item.riskScore > 70 ? 'text-rose-400' : item.riskScore > 35 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {item.riskScore}
                </span>
                <span className="text-xs text-gray-500 font-mono">/ 100 ({Math.round(item.confidence * 100)}% conf)</span>
              </div>
            </div>
          </div>

          {/* Agent Thoughts Breakdown */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Complete Agent Thought Chain
            </h4>

            {item.agentThoughts.map((thought, idx) => {
              const isObj = typeof thought === 'object' && thought !== null;
              const stageText = isObj ? (thought as AgentThought).stage : `Step ${idx + 1}`;
              const detailText = isObj ? (thought as AgentThought).detail : String(thought);
              const scoreVal = isObj ? (thought as AgentThought).score : undefined;

              return (
                <div key={idx} className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {stageText}
                    </span>
                    {scoreVal !== undefined && (
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-800">
                        Score: {scoreVal}/100
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans pl-4 border-l border-emerald-500/30">
                    {detailText}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Recommendation & Explanation */}
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-xs space-y-2 mb-6">
            <div>
              <span className="font-bold text-gray-300">Action Recommendation: </span>
              <span className="text-gray-400">{item.recommendation}</span>
            </div>
            <div>
              <span className="font-bold text-gray-300">Explanation: </span>
              <span className="text-gray-400">{item.conversationalAssessment || item.explanation}</span>
            </div>
          </div>
        </div>

        {/* Bottom Human Override Bar */}
        <div className="pt-4 border-t border-gray-800">
          <label className="text-[11px] font-mono text-gray-400 uppercase block mb-2">
            Human-in-the-Loop Override Decision:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { onOverride(item.id, 'APPROVED'); onClose(); }}
              className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => { onOverride(item.id, 'BLOCKED'); onClose(); }}
              className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Confirm Block</span>
            </button>
            <button
              onClick={() => { onOverride(item.id, 'ESCALATED'); onClose(); }}
              className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Escalate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
