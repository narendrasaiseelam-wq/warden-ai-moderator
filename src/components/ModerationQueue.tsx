'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Search, Filter, CheckCircle2, Ban, Eye, Cpu, Clock, Check, X } from 'lucide-react';
import { QueueItem } from '@/types/moderation';

interface ModerationQueueProps {
  items: QueueItem[];
  onOverride: (id: string, action: 'APPROVED' | 'BLOCKED' | 'ESCALATED') => void;
  onSelectItem: (item: QueueItem) => void;
}

export const ModerationQueue: React.FC<ModerationQueueProps> = ({ items, onOverride, onSelectItem }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'TOXIC' | 'ESCALATED' | 'SAFE'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredItems = items.filter(item => {
    const effectiveStatus = item.overrideStatus || item.verdict;

    // Filter by tab
    if (activeTab === 'TOXIC' && !(effectiveStatus === 'AUTO_BLOCK' || effectiveStatus === 'BLOCKED')) return false;
    if (activeTab === 'ESCALATED' && !(effectiveStatus === 'ESCALATE_HUMAN' || effectiveStatus === 'ESCALATED')) return false;
    if (activeTab === 'SAFE' && !(effectiveStatus === 'PUBLISH' || effectiveStatus === 'APPROVED')) return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = item.content.toLowerCase().includes(q);
      const matchAuthor = item.authorName.toLowerCase().includes(q) || item.authorHandle.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchContent && !matchAuthor && !matchCategory) return false;
    }

    // Filter by category dropdown
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div className="rounded-2xl glass-panel border border-gray-800/90 p-5 sm:p-6">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800/80">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Live Moderation Stream</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[11px] font-mono font-normal">
              {filteredItems.length} items
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time feed of community posts with Human-in-the-Loop decision override controls.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-950 border border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'ALL'
                ? 'bg-gray-800 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All Feed ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('TOXIC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'TOXIC'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-gray-400 hover:text-rose-400'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Flagged / Toxic</span>
          </button>
          <button
            onClick={() => setActiveTab('ESCALATED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ESCALATED'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-gray-400 hover:text-amber-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Escalated</span>
          </button>
          <button
            onClick={() => setActiveTab('SAFE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'SAFE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-gray-400 hover:text-emerald-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Safe</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feed by text, handle, or URL..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Crypto & Financial Scam">Crypto & Financial Scam</option>
            <option value="Phishing & Malicious Links">Phishing & Malicious Links</option>
            <option value="Hate Speech & Abuse">Hate Speech & Abuse</option>
            <option value="Constructive & Safe">Constructive & Safe</option>
            <option value="Uncategorized Risk">Uncategorized Risk</option>
          </select>
        </div>
      </div>

      {/* Queue Stream Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-gray-950/60 border border-gray-800 text-gray-500">
          <Cpu className="w-8 h-8 mx-auto mb-2 text-gray-600 animate-bounce" />
          <p className="text-sm font-medium">No items match the active filters.</p>
          <p className="text-xs text-gray-600 mt-1">Try selecting another tab or clearing search queries.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const activeVerdict = item.overrideStatus || item.verdict;
            const isApproved = activeVerdict === 'APPROVED' || activeVerdict === 'PUBLISH';
            const isBlocked = activeVerdict === 'BLOCKED' || activeVerdict === 'AUTO_BLOCK';
            const isEscalated = activeVerdict === 'ESCALATED' || activeVerdict === 'ESCALATE_HUMAN';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl transition-all duration-200 border flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel-hover ${
                  isBlocked
                    ? 'bg-gray-950/80 border-rose-900/40 hover:border-rose-700/60'
                    : isEscalated
                    ? 'bg-gray-950/80 border-amber-900/40 hover:border-amber-700/60'
                    : 'bg-gray-950/80 border-gray-800 hover:border-emerald-900/40'
                }`}
              >
                {/* Content Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-200">
                        {item.authorName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-gray-200">{item.authorName}</span>
                      <span className="text-[11px] text-gray-500 font-mono">{item.authorHandle}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800 font-mono">
                        {item.platform}
                      </span>
                    </div>

                    <span suppressHydrationWarning className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.createdAt}
                    </span>
                  </div>

                  <p className="text-xs text-gray-200 leading-relaxed font-sans bg-gray-900/50 p-2.5 rounded-lg border border-gray-800/60">
                    &quot;{item.content}&quot;
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                    <span className={`px-2 py-0.5 rounded font-extrabold ${
                      isApproved
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : isBlocked
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}>
                      {activeVerdict}
                    </span>

                    {item.overrideStatus && (
                      <span className="text-[10px] text-cyan-300 bg-cyan-950/80 border border-cyan-700/60 px-1.5 py-0.2 rounded">
                        Human Override ({item.overrideStatus})
                      </span>
                    )}

                    <span className="text-gray-400">
                      Category: <span className="text-gray-200 font-sans">{item.category}</span>
                    </span>

                    <span className="text-gray-400">
                      Risk: <span className={`font-bold ${item.riskScore > 70 ? 'text-rose-400' : item.riskScore > 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {item.riskScore}/100
                      </span>
                    </span>
                  </div>
                </div>

                {/* Human-in-the-loop Action Controls */}
                <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-gray-800 pt-3 md:pt-0 md:pl-4 justify-end shrink-0">
                  <button
                    onClick={() => onSelectItem(item)}
                    title="Inspect Agent Thought Trace"
                    className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-cyan-400 transition cursor-pointer text-xs flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="hidden sm:inline">Trace</span>
                  </button>

                  <button
                    onClick={() => onOverride(item.id, 'APPROVED')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 border ${
                      item.overrideStatus === 'APPROVED' || (!item.overrideStatus && item.verdict === 'PUBLISH')
                        ? 'bg-emerald-500/30 text-emerald-200 border-emerald-500/60'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => onOverride(item.id, 'BLOCKED')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 border ${
                      item.overrideStatus === 'BLOCKED' || (!item.overrideStatus && item.verdict === 'AUTO_BLOCK')
                        ? 'bg-rose-500/30 text-rose-200 border-rose-500/60'
                        : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Block</span>
                  </button>

                  <button
                    onClick={() => onOverride(item.id, 'ESCALATED')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 border ${
                      item.overrideStatus === 'ESCALATED' || (!item.overrideStatus && item.verdict === 'ESCALATE_HUMAN')
                        ? 'bg-amber-500/30 text-amber-200 border-amber-500/60'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Escalate</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
