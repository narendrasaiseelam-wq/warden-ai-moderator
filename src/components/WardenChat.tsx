'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, Sparkles, Send, Copy, Check, ChevronDown, ChevronUp, Cpu, 
  Lightbulb, Briefcase, Zap, ShieldAlert, MessageSquare, ShieldCheck, 
  AlertTriangle, ArrowRight, Share2, CheckCircle2, CornerDownLeft, RefreshCw 
} from 'lucide-react';
import { ModerationResult, QueueItem, AgentMode, SuggestedReplyOption } from '@/types/moderation';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'warden';
  text: string;
  timestamp: string;
  mode?: AgentMode;
  result?: ModerationResult;
}

interface WardenChatProps {
  onAnalyze: (text: string, mode?: AgentMode) => Promise<ModerationResult>;
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
  const [activeMode, setActiveMode] = useState<AgentMode>('linkedin');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'warden',
      text: "Hello! I'm Warden, your Social Media Growth & Safety Co-Pilot.\n\nChoose a mode below — whether crafting LinkedIn stories, punchy X/Threads openers, checking suspicious DMs in Shield Mode, or general brainstorming. Every post draft is automatically verified with fine-tuned Qwen-1.5B pre-flight safety guardrails!",
      timestamp: 'Just now',
      mode: 'general'
    }
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sync external input from page hero presets
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

  // Mode Quick Action Presets
  const modeActions: Record<AgentMode, { label: string; text: string }[]> = {
    linkedin: [
      { label: '💼 Turn project into LinkedIn post', text: 'I built a real-time AI moderation agent using Google Gemini 2.5 Flash and fine-tuned Qwen-1.5B QLoRA. Turned latency to 125ms and stopped 95% of scams.' },
      { label: '🚀 Post on learning QLoRA', text: 'Write a professional LinkedIn post about my journey learning QLoRA fine-tuning for LLMs, key takeaways, and tips for indie devs.' },
      { label: '📩 Polite reply to recruiter', text: 'Draft a polite, professional LinkedIn reply thanking a tech recruiter for an opportunity while expressing interest in staying connected.' }
    ],
    twitter: [
      { label: '⚡ Viral web dev hook', text: 'Create a viral X/Twitter thread opener on why full-stack devs should learn AI agent engineering in 2026.' },
      { label: '🏆 Hackathon win summary', text: 'Summarize our team hackathon victory building an AI content guardian in under 280 characters with bullet points.' },
      { label: '🔥 Short tech opinion', text: 'Write a sharp, high-engagement X post about the death of traditional moderation tools vs real-time AI agents.' }
    ],
    shield: [
      { label: '🚨 Check fake sponsor email', text: 'Hi! We love your channel and want to sponsor a video for $5,000. Download our sponsorship agreement executable at http://sponsors-brand-verify.exe/download' },
      { label: '🤬 Reply to aggressive troll', text: 'You guys are absolute trash. Nobody likes your product, go sell somewhere else before I find out where your team is located.' },
      { label: '🎁 Spot crypto giveaway DM', text: 'URGENT: Elon Musk is doubling all ETH and BTC deposits! Send 0.5 ETH to receive 1 ETH back instantly. Claim at http://claim-rewards-crypto.drop' }
    ],
    general: [
      { label: '💡 Brainstorm post ideas', text: 'Give me 3 high-impact social media post ideas for a computer science student building open-source projects.' },
      { label: '🛡️ Review bio for brand safety', text: 'Review my Twitter bio: "Full-Stack Dev | AI Builder | Web3 Enthusiast | DM for collab" and suggest improvements.' },
      { label: '📈 Engagement tips', text: 'What are the top 3 strategies to increase organic post reach without spending money on ads?' }
    ]
  };

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSubmit = (customText || inputVal).trim();
    if (!textToSubmit || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const result = await onAnalyze(textToSubmit, activeMode);
      const botMsgId = `warden-${Date.now()}`;
      
      const assessment = result.conversationalAssessment || result.friendlySummary || result.explanation || 'I evaluated your request and generated custom growth & safety recommendations.';

      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'warden',
        text: assessment,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
        result
      };

      setMessages(prev => [...prev, botMsg]);

      // Add to live queue if handler passed
      if (onAddToQueue && result) {
        const queueItem: QueueItem = {
          ...result,
          content: textToSubmit,
          authorName: 'Co-Pilot Creator',
          authorHandle: '@creator_lab',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          platform: 'Web Forum',
          createdAt: 'Just now'
        };
        onAddToQueue(queueItem);
      }
    } catch (err) {
      console.error('WardenChat Co-Pilot error:', err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'warden',
        text: "I encountered an issue processing that request. Please ensure the backend is connected and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (textToCopy: string, copyKey: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(copyKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoning(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
      {/* Top Header & Mode Switcher Capsule */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-2xl bg-slate-900 border border-purple-500/40 avatar-neon-glow flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight font-sans">
                Warden Co-Pilot
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Gemini 2.5 + Qwen Guardrails
              </span>
            </div>
            <p className="text-xs text-slate-400">Social Media Growth &amp; Safety Assistant</p>
          </div>
        </div>

        {/* Mode Selector Capsule */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMode('linkedin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeMode === 'linkedin'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>💼 LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('twitter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeMode === 'twitter'
                ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>⚡ X / Threads</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('shield')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeMode === 'shield'
                ? 'bg-rose-600/30 text-rose-200 border border-rose-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>🛡️ Shield</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('general')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeMode === 'general'
                ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>💬 General</span>
          </button>
        </div>
      </div>

      {/* Contextual Quick Actions per Mode */}
      <div className="px-5 sm:px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
          Quick Actions:
        </span>
        {modeActions[activeMode].map((act, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(undefined, act.text)}
            disabled={isLoading}
            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-purple-500/40 transition cursor-pointer shrink-0"
          >
            {act.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6 min-h-[380px] max-h-[580px]"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const crafted = msg.result?.craftedContent;
          const safety = msg.result?.safetyCheck;
          const shieldOpts = msg.result?.shieldReplies;

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
              <div className={`max-w-[90%] sm:max-w-[82%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* User Message Bubble */}
                {isUser ? (
                  <div className="px-4.5 py-3 rounded-2xl bg-slate-800/90 text-slate-100 text-sm font-sans leading-relaxed border border-slate-700/60 shadow-md">
                    {msg.text}
                  </div>
                ) : (
                  /* Warden Message & Crafted Post Preview Card */
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-slate-200 text-sm font-sans space-y-4 shadow-xl">
                    {/* Warden Conversational Advice */}
                    <div className="text-slate-200 leading-relaxed font-sans font-normal whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Rich Post Preview Card */}
                    {crafted && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3.5 relative shadow-inner">
                        {/* Header Row: Pre-Flight Safety Badge & Copy Action */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                          {/* Pre-Flight Safety Badge */}
                          {safety && (
                            <div className="flex items-center gap-2">
                              {safety.status === 'CLEARED' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 glow-emerald">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>🛡️ Pre-Flight Safety Cleared (Risk: {safety.riskScore}%)</span>
                                </span>
                              )}
                              {safety.status === 'NEEDS_CAUTION' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 glow-amber">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                  <span>⚠️ Caution Advised (Risk: {safety.riskScore}%)</span>
                                </span>
                              )}
                              {safety.status === 'BLOCKED' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 glow-crimson">
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                                  <span>🚨 Threat Blocked (Risk: {safety.riskScore}%)</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* 1-Click Copy Post Button */}
                          {crafted.mainBody && (
                            <button
                              type="button"
                              onClick={() => handleCopy(`${crafted.title ? crafted.title + '\n\n' : ''}${crafted.mainBody}\n\n${crafted.hashtags?.join(' ') || ''}`, `${msg.id}-main`)}
                              className="px-3 py-1.5 rounded-full text-xs font-bold font-sans btn-peach flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              {copiedId === `${msg.id}-main` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-slate-900" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-900" />
                                  <span>📋 Copy Post</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Title if present */}
                        {crafted.title && (
                          <h4 className="text-sm font-bold text-white font-sans tracking-tight">
                            {crafted.title}
                          </h4>
                        )}

                        {/* Main Body formatted */}
                        {crafted.mainBody && (
                          <div className="text-xs sm:text-sm leading-relaxed text-slate-200 font-sans whitespace-pre-line bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                            {crafted.mainBody}
                          </div>
                        )}

                        {/* Hooks Variations */}
                        {crafted.hooks && crafted.hooks.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-mono text-purple-300 font-semibold block uppercase">
                              💡 Alternative Hook Variations:
                            </span>
                            <ul className="space-y-1">
                              {crafted.hooks.map((h, hIdx) => (
                                <li key={hIdx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                  <span>&quot;{h}&quot;</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Clickable Hashtags */}
                        {crafted.hashtags && crafted.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {crafted.hashtags.map((tag, tIdx) => (
                              <button
                                key={tIdx}
                                type="button"
                                onClick={() => handleCopy(tag, `${msg.id}-tag-${tIdx}`)}
                                className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition cursor-pointer"
                              >
                                {copiedId === `${msg.id}-tag-${tIdx}` ? 'Copied!' : tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Shield Mode 3 Quick Responses */}
                    {msg.mode === 'shield' && shieldOpts && shieldOpts.length > 0 && (
                      <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-900/40 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 border-b border-slate-800 pb-2">
                          <Lightbulb className="w-4 h-4 text-cyan-400" />
                          <span>🛡️ 3 Recommended Response Strategies:</span>
                        </div>

                        <div className="space-y-2.5">
                          {shieldOpts.map((opt, oIdx) => (
                            <div key={oIdx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">
                                  {opt.label}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(opt.text, `${msg.id}-opt-${oIdx}`)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                                >
                                  {copiedId === `${msg.id}-opt-${oIdx}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-cyan-400" />
                                      <span>Copy Reply</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                                &quot;{opt.text}&quot;
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Collapsible Model Insight Accordion */}
                    {msg.result?.agentThoughts && msg.result.agentThoughts.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => toggleReasoning(msg.id)}
                          className="text-xs font-mono text-slate-400 hover:text-purple-300 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Cpu className="w-3.5 h-3.5 text-purple-400" />
                          <span>Inspect Multi-Model Pipeline (Qwen-1.5B Specialist + Gemini 2.5 Brain)</span>
                          {expandedReasoning[msg.id] ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>

                        {expandedReasoning[msg.id] && (
                          <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                            {msg.result.agentThoughts.map((thought, idx) => {
                              const stage = typeof thought === 'string' ? `Layer ${idx + 1}` : thought.stage;
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
              <span className="text-slate-300 font-sans">Warden is analyzing in {activeMode.toUpperCase()} mode...</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Bottom Input Capsule */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60">
        <form onSubmit={handleSend} className="relative flex items-center">
          <div className="relative w-full flex items-center">
            {/* Left Mode Icon */}
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              {activeMode === 'linkedin' && <Briefcase className="w-4 h-4 text-purple-400" />}
              {activeMode === 'twitter' && <Zap className="w-4 h-4 text-cyan-400" />}
              {activeMode === 'shield' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
              {activeMode === 'general' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
            </div>

            {/* Capsule Input */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                activeMode === 'linkedin' ? "Paste project notes or ideas for LinkedIn post..." :
                activeMode === 'twitter' ? "Type topic or idea for viral X/Threads post..." :
                activeMode === 'shield' ? "Paste suspicious message, email, or DM to inspect..." :
                "Ask Warden for growth advice, reviews, or brainstorming..."
              }
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
