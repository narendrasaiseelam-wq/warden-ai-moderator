'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { WardenChat } from '@/components/WardenChat';
import { ModerationQueue } from '@/components/ModerationQueue';
import { MetricsModal } from '@/components/MetricsModal';
import { AgentThoughtDrawer } from '@/components/AgentThoughtDrawer';
import { INITIAL_MOCK_FEED, MODEL_BENCHMARKS } from '@/data/mockFeed';
import { QueueItem, ModerationResult } from '@/types/moderation';
import { ShieldCheck, BarChart3, CheckCircle2, Award, Layers, Database, Sparkles, AlertTriangle, MessageSquare } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'CHAT' | 'QUEUE' | 'BENCHMARKS'>('CHAT');
  const [feedItems, setFeedItems] = useState<QueueItem[]>(INITIAL_MOCK_FEED);
  const [isMetricsOpen, setIsMetricsOpen] = useState<boolean>(false);
  const [selectedDrawerItem, setSelectedDrawerItem] = useState<QueueItem | null>(null);
  const [latestLatency, setLatestLatency] = useState<number>(125);
  const [presetInputText, setPresetInputText] = useState<string>('');

  const quickPills = [
    {
      label: '🚨 Crypto Scam',
      text: '🚀 URGENT: Elon Musk is doubling all ETH and BTC deposits! Send 0.5 ETH to 0x71A...9F2 to receive 1 ETH back instantly. Claim at http://claim-tesla-rewards.crypto-drop.xyz'
    },
    {
      label: '🤬 Toxic Attack',
      text: 'You guys are absolute trash. Nobody likes your product, go sell somewhere else before I find out where your team is located and make you regret it. You are disgusting rats.'
    },
    {
      label: '💡 Constructive Critique',
      text: 'While the newly proposed regulation framework introduces compliance overhead for startups, it provides essential guardrails for consumer data privacy and model transparency.'
    },
    {
      label: '💬 Friendly Inquiry',
      text: 'I’ve been using WardenAI for 3 months to protect our Web3 community. The automated scam detection stopped over 4,500 fake giveaway bots. Great product!'
    }
  ];

  const handleAnalyzeText = async (text: string): Promise<ModerationResult> => {
    const res = await fetch('/api/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data: ModerationResult = await res.json();
    if (data.latencyMs) {
      setLatestLatency(data.latencyMs);
    }
    return data;
  };

  const handleAddToQueue = (newItem: QueueItem) => {
    setFeedItems(prev => [newItem, ...prev]);
  };

  const handleOverrideStatus = (id: string, action: 'APPROVED' | 'BLOCKED' | 'ESCALATED') => {
    setFeedItems(prev =>
      prev.map(item => (item.id === id ? { ...item, overrideStatus: action } : item))
    );
  };

  const handleSelectPill = (text: string) => {
    setPresetInputText(text);
    if (activeTab !== 'CHAT') {
      setActiveTab('CHAT');
    }
  };

  return (
    <div className="min-h-screen cosmic-bg vignette-glow text-slate-100 flex flex-col font-sans selection:bg-purple-500/30">
      {/* Top Minimalist Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMetrics={() => setIsMetricsOpen(true)}
        latencyMs={latestLatency}
      />

      {/* Main Studio Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Minimalist Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Small Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>🛡️ Trust &amp; Safety Co-Pilot</span>
          </div>

          {/* Large Clean Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Meet Warden, Your AI Community Guardian
          </h1>

          {/* Elegant Subtitle */}
          <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            A calm, consistent moderator trained to spot toxicity, scams, and nuanced feedback in real time.
          </p>

          {/* Quick-test Suggestion Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPill(pill.text)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-purple-500/40 transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* View 1: Centerpiece Conversational Chat Widget */}
        {activeTab === 'CHAT' && (
          <div className="animate-in fade-in duration-300">
            <WardenChat
              onAnalyze={handleAnalyzeText}
              onAddToQueue={handleAddToQueue}
              externalInput={presetInputText}
              onClearExternalInput={() => setPresetInputText('')}
            />
          </div>
        )}

        {/* View 2: Live Community Queue */}
        {activeTab === 'QUEUE' && (
          <div className="animate-in fade-in duration-300">
            <ModerationQueue
              items={feedItems}
              onOverride={handleOverrideStatus}
              onSelectItem={(item) => setSelectedDrawerItem(item)}
            />
          </div>
        )}

        {/* View 3: Benchmarks */}
        {activeTab === 'BENCHMARKS' && (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 font-sans">
                    Evaluation &amp; Benchmarking Hub
                    <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                      Colab Test Split
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Performance benchmarks of fine-tuned Warden Qwen-1.5B QLoRA model vs base LLMs.
                  </p>
                </div>
              </div>
            </div>

            {/* Model Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                <Database className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Fine-Tuned Hub Model</span>
                  <span className="text-xs font-bold font-mono text-slate-200">narendraseelam/content-moderator-qwen</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                <Layers className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">QLoRA Architecture</span>
                  <span className="text-xs font-bold font-mono text-slate-200">Rank r=16 • Alpha=32 • Target: q/k/v/o_proj</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Accuracy Boost</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">+11.6% F1 Score vs Base Model</span>
                </div>
              </div>
            </div>

            {/* Benchmark Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 bg-slate-900/60">
                    <th className="p-4">Model Architecture</th>
                    <th className="p-4 text-right">Accuracy</th>
                    <th className="p-4 text-right">Precision</th>
                    <th className="p-4 text-right">Recall</th>
                    <th className="p-4 text-right">F1 Score</th>
                    <th className="p-4 text-right">Avg Latency</th>
                    <th className="p-4 text-right">VRAM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
                  {MODEL_BENCHMARKS.map((m, idx) => (
                    <tr
                      key={idx}
                      className={`transition ${
                        m.isWarden
                          ? 'bg-purple-950/20 text-white font-bold border-l-2 border-purple-400'
                          : 'hover:bg-slate-900/40 text-slate-300'
                      }`}
                    >
                      <td className="p-4 flex items-center gap-2">
                        {m.isWarden && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        <span>{m.modelName}</span>
                        {m.isWarden && (
                          <span className="text-[9px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                            Warden Specialist
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">{m.accuracy.toFixed(1)}%</td>
                      <td className="p-4 text-right">{m.precision.toFixed(1)}%</td>
                      <td className="p-4 text-right">{m.recall.toFixed(1)}%</td>
                      <td className={`p-4 text-right font-extrabold ${m.isWarden ? 'text-emerald-400' : ''}`}>
                        {m.f1Score.toFixed(1)}%
                      </td>
                      <td className="p-4 text-right text-cyan-400">{m.avgLatencyMs}ms</td>
                      <td className="p-4 text-right text-slate-400">{m.vramUsageGb} GB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 glass-panel-dribbble mt-16">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>WardenAI Guardian • Model: <span className="text-slate-200">narendraseelam/content-moderator-qwen</span></span>
          </div>
          <div className="text-slate-500">
            Powered by Google Gemini 2.5 Flash &amp; Qwen-1.5B QLoRA
          </div>
        </div>
      </footer>

      {/* Benchmarks Modal */}
      <MetricsModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
      />

      {/* Forensic Thought Trace Drawer */}
      <AgentThoughtDrawer
        item={selectedDrawerItem}
        onClose={() => setSelectedDrawerItem(null)}
        onOverride={handleOverrideStatus}
      />
    </div>
  );
}
