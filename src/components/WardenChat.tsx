'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Shield, Sparkles, Send, Copy, Check, ChevronDown, ChevronUp, Cpu, Lightbulb, CornerDownLeft, RefreshCw, AlertCircle, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { ModerationResult, QueueItem } from '@/types/moderation';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'warden';
  text: string;
  timestamp: string;
  result?: ModerationResult;
}

interface WardenChatProps {
  onAnalyze: (text: string) => Promise<ModerationResult>;
  onAddToQueue?: (item: QueueItem) => void;
  externalInput?: string;
  onClearExternalInput?: () => void;
}

export const WardenChat: React.FC<WardenChatProps> = ({
  onAnalyze,
  onAddToQueue,
  externalInput = '',
  onClearExternalInput
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'warden',
      text: "Hello! I'm Warden, your AI Community Guardian. I monitor digital conversations to spot crypto scams, toxic harassment, phishing links, and nuanced feedback in real time.\n\nPaste any comment below or click a quick-test suggestion above to see how I review content!",
      timestamp: 'Just now'
    }
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sync external input from quick-test pills
  useEffect(() => {
    if (externalInput) {
      setInputVal(externalInput);
      if (onClearExternalInput) {
        onClearExternalInput();
      }
    }
  }, [externalInput, onClearExternalInput]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const result = await onAnalyze(trimmed);
      const botMsgId = `warden-${Date.now()}`;
      
      const assessment = result.conversationalAssessment || result.friendlySummary || result.explanation || 'I evaluated this message and generated a verdict.';

      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'warden',
        text: assessment,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result
      };

      setMessages(prev => [...prev, botMsg]);

      // Automatically add to queue if handler passed
      if (onAddToQueue && result) {
        const queueItem: QueueItem = {
          ...result,
          content: trimmed,
          authorName: 'Chat User',
          authorHandle: '@community_member',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          platform: 'Web Forum',
          createdAt: 'Just now'
        };
        onAddToQueue(queueItem);
      }
    } catch (err) {
      console.error('WardenChat analysis error:', err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'warden',
        text: "I encountered an issue analyzing that message. Please ensure the backend is connected and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoning(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  // Helper for rendering verdict badge
  const renderVerdictBadge = (verdict?: string) => {
    if (!verdict) return null;

    if (verdict === 'PUBLISH') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 glow-emerald">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SAFE</span>
        </span>
      );
    }
    if (verdict === 'AUTO_BLOCK') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 glow-crimson">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>AUTO-BLOCK</span>
        </span>
      );
    }
    // ESCALATE_HUMAN or FLAG_WARNING or default review
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 glow-amber">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        <span>NEEDS REVIEW</span>
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
      {/* Top Card Bar */}
      <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-2xl bg-slate-900 border border-purple-500/40 avatar-neon-glow flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight font-sans">
                Warden Advisor
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Qwen + Gemini Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-time Trust &amp; Safety Co-Pilot</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="hidden sm:inline">Online &amp; Monitoring</span>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6 min-h-[380px] max-h-[580px]"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Warden Avatar on Left */}
              {!isUser && (
                <div className="relative shrink-0 p-2 rounded-2xl bg-slate-900 border border-purple-500/40 avatar-neon-glow flex items-center justify-center text-purple-300 mt-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
              )}

              {/* Message Content Container */}
              <div className={`max-w-[85%] sm:max-w-[78%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* User Message Bubble */}
                {isUser ? (
                  <div className="px-4 py-3 rounded-2xl bg-slate-800/90 text-slate-100 text-sm font-sans leading-relaxed border border-slate-700/60 shadow-md">
                    {msg.text}
                  </div>
                ) : (
                  /* Warden Message Bubble & Intelligence Card */
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-slate-200 text-sm font-sans space-y-4 shadow-xl">
                    {/* Header Row: Verdict & Category */}
                    {msg.result && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                            Verdict:
                          </span>
                          {renderVerdictBadge(msg.result.verdict)}
                        </div>

                        <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                          {msg.result.category}
                        </span>
                      </div>
                    )}

                    {/* Main Conversational Assessment text */}
                    <div className="text-slate-200 leading-relaxed font-sans font-normal whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* AI Suggested Reply Box (If present) */}
                    {msg.result?.suggestedReplies?.moderatorResponse && (
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-2 relative group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Suggested Reply to User</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopy(msg.result?.suggestedReplies?.moderatorResponse || '', msg.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-cyan-400" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs text-cyan-100 font-sans italic pr-16 leading-relaxed">
                          &quot;{msg.result.suggestedReplies.moderatorResponse}&quot;
                        </p>
                      </div>
                    )}

                    {/* Optional Collapsible Model Reasoning Toggle */}
                    {msg.result?.agentThoughts && msg.result.agentThoughts.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => toggleReasoning(msg.id)}
                          className="text-xs font-mono text-slate-400 hover:text-purple-300 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Cpu className="w-3.5 h-3.5 text-purple-400" />
                          <span>Inspect Model Reasoning</span>
                          {expandedReasoning[msg.id] ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>

                        {expandedReasoning[msg.id] && (
                          <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                            {msg.result.agentThoughts.map((thought, idx) => {
                              const stage = typeof thought === 'string' ? `Step ${idx + 1}` : thought.stage;
                              const detail = typeof thought === 'string' ? thought : thought.detail;

                              return (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2.5"
                                >
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-purple-300 shrink-0">
                                    {stage}
                                  </span>
                                  <p className="text-[11px] leading-relaxed text-slate-400 flex-1">
                                    {detail}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Timestamp */}
                <div
                  suppressHydrationWarning
                  className={`text-[10px] font-mono text-slate-500 ${isUser ? 'text-right' : 'text-left'}`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3.5 justify-start animate-fade-in">
            <div className="p-2 rounded-2xl bg-slate-900 border border-purple-500/40 avatar-neon-glow flex items-center justify-center text-purple-300 mt-1">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="px-5 py-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-slate-300 text-xs font-mono flex items-center gap-3 shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 typing-dot" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 typing-dot" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 typing-dot" />
              </div>
              <span className="text-slate-300 font-sans">Warden is analyzing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Bottom Input Capsule */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60">
        <form onSubmit={handleSend} className="relative flex items-center">
          <div className="relative w-full flex items-center">
            {/* Left Emoji / Sparkle Icon */}
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>

            {/* Capsule Input */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Paste a comment or ask Warden to review..."
              disabled={isLoading}
              className="w-full pl-11 pr-28 py-3.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition font-sans"
            />

            {/* Right Warm Peach Send Pill Button */}
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className={`absolute right-2 px-4 py-2 rounded-full text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                !inputVal.trim() || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'btn-peach hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-900" />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5 text-slate-900" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
