'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, Zap } from 'lucide-react';
import { QueueItem } from '@/types/moderation';

interface StatsOverviewProps {
  items: QueueItem[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ items }) => {
  const totalScanned = items.length;
  const autoBlocked = items.filter(i => (i.overrideStatus === 'BLOCKED' || (!i.overrideStatus && i.verdict === 'AUTO_BLOCK'))).length;
  const escalated = items.filter(i => (i.overrideStatus === 'ESCALATED' || (!i.overrideStatus && i.verdict === 'ESCALATE_HUMAN'))).length;
  const safePublished = items.filter(i => (i.overrideStatus === 'APPROVED' || (!i.overrideStatus && i.verdict === 'PUBLISH'))).length;

  const blockPct = totalScanned > 0 ? Math.round((autoBlocked / totalScanned) * 100) : 0;
  const escalatePct = totalScanned > 0 ? Math.round((escalated / totalScanned) * 100) : 0;
  const safePct = totalScanned > 0 ? Math.round((safePublished / totalScanned) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Card 1: Total Scanned */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800/80 glass-panel-hover flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">Total Analyzed</span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            {totalScanned}
          </div>
          <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Real-time active queue
          </p>
        </div>
      </div>

      {/* Card 2: Auto-Blocked */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-rose-900/30 glass-panel-hover flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2 relative z-10">
          <span className="text-xs font-medium text-rose-300">Auto-Blocked</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 glow-crimson">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-400 font-mono">
              {autoBlocked}
            </span>
            <span className="text-xs font-semibold text-rose-400/80 font-mono">
              ({blockPct}%)
            </span>
          </div>
          <p className="text-[11px] text-rose-400/60 mt-1">Direct safety violations</p>
        </div>
      </div>

      {/* Card 3: Escalated / Human Review */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-amber-900/30 glass-panel-hover flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2 relative z-10">
          <span className="text-xs font-medium text-amber-300">Escalated</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 glow-amber">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-400 font-mono">
              {escalated}
            </span>
            <span className="text-xs font-semibold text-amber-400/80 font-mono">
              ({escalatePct}%)
            </span>
          </div>
          <p className="text-[11px] text-amber-400/60 mt-1">Human-in-the-loop review</p>
        </div>
      </div>

      {/* Card 4: Safe / Published */}
      <div className="p-4 rounded-2xl bg-gray-900/80 border border-emerald-900/30 glass-panel-hover flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
        <div className="flex items-center justify-between mb-2 relative z-10">
          <span className="text-xs font-medium text-emerald-300">Safe Published</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 glow-emerald">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 font-mono">
              {safePublished}
            </span>
            <span className="text-xs font-semibold text-emerald-400/80 font-mono">
              ({safePct}%)
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/60 mt-1">Cleared by agent engine</p>
        </div>
      </div>
    </div>
  );
};
