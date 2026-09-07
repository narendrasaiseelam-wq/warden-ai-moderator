'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Cpu, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Terminal, Zap, ChevronDown, ChevronUp, Bot, Check, ShieldCheck, AlertCircle, Copy, Lightbulb, ShieldAlert, Flag } from 'lucide-react';
import { ModerationResult, QueueItem } from '@/types/moderation';
import { PRESET_EXAMPLES } from '@/data/mockFeed';

interface PlaygroundProps {
  onAnalyze: (text: string) => Promise<ModerationResult>;
  onAddToQueue: (item: QueueItem) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({ onAnalyze, onAddToQueue }) => {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<ModerationResult | null>(null);
  const [addedToQueue, setAddedToQueue] = useState<boolean>(false);
  const [showTechnicalTrace, setShowTechnicalTrace] = useState<boolean>(false);
  const [copiedReply, setCopiedReply] = useState<boolean>(false);

  const charLimit = 2000;

  const handlePresetSelect = (text: string) => {
    setInputText(text);
    setCurrentResult(null);
    setAddedToQueue(false);
    setShowTechnicalTrace(false);
    setCopiedReply(false);
  };

  const handleClear = () => {
    setInputText('');
    setCurrentResult(null);
    setAddedToQueue(false);
    setShowTechnicalTrace(false);
    setCopiedReply(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setCurrentResult(null);
    setAddedToQueue(false);
    setShowTechnicalTrace(false);
    setCopiedReply(false);

    try {
      const result = await onAnalyze(inputText);
      setCurrentResult(result);
    } catch (err) {
      console.error('Playground analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushToQueue = () => {
    if (!currentResult) return;
    const newItem: QueueItem = {
      ...currentResult,
      content: inputText,
      authorName: 'Playground Tester',
      authorHandle: '@sandbox_user',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      platform: 'Web Forum',
      createdAt: 'Just now'
    };
    onAddToQueue(newItem);
    setAddedToQueue(true);
  };

  const handleCopyReply = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  const assessmentText = currentResult?.conversationalAssessment || currentResult?.friendlySummary || currentResult?.explanation || '';
  const findingsList = currentResult?.keyFindings || currentResult?.keyTakeaways || [];
  const suggested = currentResult?.suggestedReplies;

  return (
    <div className="rounded-2xl glass-panel border border-gray-800/90 p-5 sm:p-7 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Interactive Safety Playground (Gemini 2.0 Flash Agent)
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Test custom text or click quick-test presets to evaluate Warden Agent&apos;s real-time assessment and AI suggested replies.
          </p>
        </div>

        {inputText && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-gray-200 transition px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 cursor-pointer self-start sm:self-auto"
          >
            Clear
          </button>
        )}
      </div>

      {/* Presets */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
          Quick Test Presets:
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_EXAMPLES.map((preset, idx) => {
            const isSelected = inputText === preset.text;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset.text)}
                className={`text-xs px-3 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-gray-900/90 hover:bg-gray-800 text-gray-300 border border-gray-800 hover:border-gray-700'
                }`}
              >
                <span>{preset.title}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  preset.color === 'crimson' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {preset.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative mb-5">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, charLimit))}
            placeholder="Type or paste any community comment, chat message, or link here to analyze with Warden..."
            rows={4}
            className="w-full rounded-xl bg-gray-950/90 border border-gray-800 p-4 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition resize-none font-sans"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-3">
            <span className={`text-[11px] font-mono ${
              inputText.length > charLimit * 0.9 ? 'text-amber-400 font-bold' : 'text-gray-500'
            }`}>
              {inputText.length} / {charLimit}
            </span>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`px-4 py-2 rounded-xl font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                !inputText.trim() || isLoading
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/30 glow-emerald active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-200" />
                  <span>Evaluating with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Moderate Content</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="p-5 rounded-xl bg-gray-950/90 border border-emerald-500/30 animate-pulse space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Bot className="w-4 h-4 animate-bounce text-emerald-400" />
            <span>Warden Agent is running Google Gemini 2.0 Flash contextual evaluation...</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-teal-400 animate-pulse w-4/5" />
          </div>
        </div>
      )}

      {/* Result Card: Warden's Take & AI Suggested Replies */}
      {currentResult && !isLoading && (
        <div className={`rounded-xl bg-gray-950/95 border p-5 sm:p-6 space-y-5 transition-all ${
          currentResult.verdict === 'AUTO_BLOCK'
            ? 'border-rose-900/60 shadow-lg shadow-rose-950/20'
            : currentResult.verdict === 'ESCALATE_HUMAN' || currentResult.verdict === 'FLAG_WARNING'
            ? 'border-amber-900/60 shadow-lg shadow-amber-950/20'
            : 'border-emerald-900/60 shadow-lg shadow-emerald-950/20'
        }`}>
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              {currentResult.verdict === 'AUTO_BLOCK' && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-400 glow-crimson flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              {(currentResult.verdict === 'ESCALATE_HUMAN' || currentResult.verdict === 'FLAG_WARNING') && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 glow-amber flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              {currentResult.verdict === 'PUBLISH' && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 glow-emerald flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400">
                    Warden Verdict
                  </span>
                  <span className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded ${
                    currentResult.verdict === 'PUBLISH'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                      : currentResult.verdict === 'AUTO_BLOCK'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                  }`}>
                    {currentResult.verdict}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Category: <span className="font-semibold text-gray-200">{currentResult.category}</span> • Engine: <span className="font-mono text-cyan-400 font-bold">Gemini 2.0 Flash</span> ({currentResult.latencyMs || 140}ms)
                </p>
              </div>
            </div>

            {/* Dynamic Risk Gauge */}
            <div className="w-full sm:w-52 bg-gray-900 p-3 rounded-xl border border-gray-800 flex flex-col justify-center">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-gray-400 text-[10px] font-mono uppercase">Risk Level</span>
                <span className={`font-mono font-extrabold ${
                  currentResult.riskScore > 70 ? 'text-rose-400' : currentResult.riskScore > 35 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {currentResult.riskScore} / 100
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentResult.riskScore > 70
                      ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600'
                      : currentResult.riskScore > 35
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${currentResult.riskScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Conversational Assessment */}
          <div className={`p-4 sm:p-5 rounded-xl border ${
            currentResult.verdict === 'AUTO_BLOCK'
              ? 'bg-rose-950/20 border-rose-900/40 text-rose-100'
              : currentResult.verdict === 'ESCALATE_HUMAN' || currentResult.verdict === 'FLAG_WARNING'
              ? 'bg-amber-950/20 border-amber-900/40 text-amber-100'
              : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-100'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2">
              <Bot className="w-4 h-4" /> Warden&apos;s Conversational Take:
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed font-sans font-medium">
              &quot;{assessmentText}&quot;
            </p>
          </div>

          {/* AI Suggested Replies Box */}
          {suggested && (
            <div className="p-4 sm:p-5 rounded-xl bg-gray-900/90 border border-cyan-900/40 space-y-3 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-100 tracking-tight">
                    💡 AI Suggested Reply &amp; Guidance
                  </h4>
                </div>

                {suggested.userActionAdvice && (
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                    Advice: {suggested.userActionAdvice}
                  </span>
                )}
              </div>

              {/* Suggested Reply Box */}
              <div className="p-3.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 relative group">
                <div className="pr-20 font-sans text-xs leading-relaxed text-cyan-100">
                  &quot;{suggested.moderatorResponse}&quot;
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyReply(suggested.moderatorResponse)}
                  className="absolute right-2.5 top-2.5 px-2.5 py-1 rounded-md bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedReply ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy Reply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Key Findings Bullet List */}
          {findingsList.length > 0 && (
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <h4 className="text-xs font-semibold text-gray-300 uppercase font-mono tracking-wider">
                Key Findings &amp; Observations:
              </h4>
              <ul className="space-y-1.5">
                {findingsList.map((finding, idx) => (
                  <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                    {currentResult.verdict === 'PUBLISH' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : currentResult.verdict === 'AUTO_BLOCK' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation & Inject Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-xs text-gray-400">
              <span className="font-semibold text-gray-300">Action Recommendation: </span>
              <span>{currentResult.recommendation}</span>
            </div>

            <button
              onClick={handlePushToQueue}
              disabled={addedToQueue}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                addedToQueue
                  ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-default'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 active:scale-95'
              }`}
            >
              {addedToQueue ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added to Queue</span>
                </>
              ) : (
                <>
                  <span>Inject to Live Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Collapsible Agent Reasoning & Model Trace */}
          <div className="pt-2 border-t border-gray-800/80">
            <button
              type="button"
              onClick={() => setShowTechnicalTrace(!showTechnicalTrace)}
              className="w-full text-xs font-mono text-gray-400 hover:text-gray-200 py-1.5 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Inspect Agent Reasoning &amp; Model Trace (Qwen QLoRA + Gemini 2.0 Flash)
              </span>
              {showTechnicalTrace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTechnicalTrace && (
              <div className="mt-3 space-y-2 animate-in fade-in duration-150">
                {currentResult.agentThoughts.map((thought, idx) => {
                  const stageName = typeof thought === 'string' ? `Layer ${idx + 1}` : thought.stage;
                  const detailText = typeof thought === 'string' ? thought : thought.detail;

                  return (
                    <div key={idx} className="p-3 rounded-lg bg-gray-900/90 border border-gray-800 text-xs flex items-start gap-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-800 text-emerald-400 border border-gray-700 shrink-0">
                        Layer {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-200 mb-0.5">{stageName}</div>
                        <div className="text-gray-400 text-[11px] leading-relaxed font-mono">{detailText}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
