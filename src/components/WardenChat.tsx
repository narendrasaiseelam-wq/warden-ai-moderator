'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, Sparkles, Send, Copy, Check, ChevronDown, ChevronUp, Cpu, 
  Lightbulb, Briefcase, Zap, ShieldAlert, MessageSquare, ShieldCheck, 
  AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, Camera
} from 'lucide-react';
import { ModerationResult, QueueItem, AgentMode, SuggestedReplyOption } from '@/types/moderation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'warden';
  text: string;
  timestamp: string;
  mode?: AgentMode;
  result?: ModerationResult;
}

interface WardenChatProps {
  onAnalyze: (text: string, mode?: AgentMode, history?: ChatMessage[]) => Promise<ModerationResult>;
  onAddToQueue?: (item: QueueItem) => void;
  externalInput?: string;
  onClearExternalInput?: () => void;
}

/**
 * Format markdown bold tags (**bold**) and replace escaped literal "\n" strings with clean line breaks
 */
function renderFormattedMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  // Replace literal escaped "\n" or "\\n" with real newlines
  const unescaped = text.replace(/\\n/g, '\n');
  const lines = unescaped.split('\n');

  return (
    <>
      {lines.map((line, lIdx) => {
        // Parse **bold** markdown tokens in line
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <React.Fragment key={lIdx}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-bold text-white font-sans">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
            {lIdx < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </>
  );
}

/**
 * Format main post body content into visual micro-cards if multi-slide Instagram content is detected
 */
function renderMainBodyContent(body: string, isInstagram: boolean): React.ReactNode {
  if (!body) return null;
  const unescaped = body.replace(/\\n/g, '\n');

  const containsSlideHeader = /(?:Slide\s*\d+:)/i.test(unescaped);

  if (isInstagram || containsSlideHeader) {
    const rawSlides = unescaped.split(/(?=(?:Slide\s*\d+:))/gi).filter(s => s.trim().length > 0);
    
    if (rawSlides.length > 1) {
      return (
        <div className="space-y-2.5 my-3">
          {rawSlides.map((slide, idx) => (
            <div 
              key={idx} 
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans shadow-sm"
            >
              {renderFormattedMarkdown(slide.trim())}
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div className="text-xs sm:text-sm leading-relaxed text-slate-200 font-sans whitespace-pre-line bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      {renderFormattedMarkdown(unescaped)}
    </div>
  );
}

export const DEFAULT_WORKSPACE_MESSAGES: Record<AgentMode, ChatMessage[]> = {
  linkedin: [
    {
      id: 'welcome-linkedin',
      sender: 'warden',
      text: "Hello! I'm your LinkedIn Growth Strategist. Paste your raw technical milestones or project notes to draft high-engagement posts.",
      timestamp: 'Just now',
      mode: 'linkedin'
    }
  ],
  twitter: [
    {
      id: 'welcome-twitter',
      sender: 'warden',
      text: "Ready to build viral threads! Give me an opinion, hot take, or project overview to turn into punchy tweets.",
      timestamp: 'Just now',
      mode: 'twitter'
    }
  ],
  instagram: [
    {
      id: 'welcome-instagram',
      sender: 'warden',
      text: "Instagram Creator Co-Pilot active! Share your project ideas, Reel concept, or notes to generate aesthetic captions & 5-slide visual carousels.",
      timestamp: 'Just now',
      mode: 'instagram'
    }
  ],
  shield: [
    {
      id: 'welcome-shield',
      sender: 'warden',
      text: "Inbox & Scam Shield active. Paste any suspicious DM, collaboration offer, or toxic comment to verify safety and draft responses.",
      timestamp: 'Just now',
      mode: 'shield'
    }
  ],
  general: [
    {
      id: 'welcome-general',
      sender: 'warden',
      text: "Warden Co-Pilot ready. How can I assist with your content workflow today?",
      timestamp: 'Just now',
      mode: 'general'
    }
  ]
};

export function getInitialWelcomeMessages(mode: AgentMode = 'linkedin'): Record<AgentMode, ChatMessage[]> {
  return DEFAULT_WORKSPACE_MESSAGES;
}

export const WardenChat: React.FC<WardenChatProps> = ({
  onAnalyze,
  onAddToQueue,
  externalInput = '',
  onClearExternalInput
}) => {
  const { user, logout } = useAuth();
  const userKey = user?.email || user?.id;
  const storageKey = userKey ? `warden_sessions_${userKey}` : 'warden_sessions_guest';

  const [activeMode, setActiveMode] = useState<AgentMode>('linkedin');
  const [chatSessions, setChatSessions] = useState<Record<AgentMode, ChatMessage[]>>(DEFAULT_WORKSPACE_MESSAGES);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.debug('Supabase sign out note:', e);
    }
    setChatSessions(getInitialWelcomeMessages(activeMode));
    logout();
  };

  // Client-safe user-scoped hydration check & Sign-out reset
  useEffect(() => {
    let isMounted = true;

    if (!user) {
      // Immediate clean state reset on sign-out
      setChatSessions(getInitialWelcomeMessages(activeMode));
      setIsHydrated(true);
      return;
    }

    const hydrateChat = async () => {
      try {
        const saved = localStorage.getItem(storageKey) || localStorage.getItem(`warden_agentic_sessions_${userKey}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (isMounted) {
            setChatSessions({
              linkedin: Array.isArray(parsed.linkedin) && parsed.linkedin.length > 0 ? parsed.linkedin : getInitialWelcomeMessages(activeMode).linkedin,
              twitter: Array.isArray(parsed.twitter) && parsed.twitter.length > 0 ? parsed.twitter : getInitialWelcomeMessages(activeMode).twitter,
              instagram: Array.isArray(parsed.instagram) && parsed.instagram.length > 0 ? parsed.instagram : getInitialWelcomeMessages(activeMode).instagram,
              shield: Array.isArray(parsed.shield) && parsed.shield.length > 0 ? parsed.shield : getInitialWelcomeMessages(activeMode).shield,
              general: Array.isArray(parsed.general) && parsed.general.length > 0 ? parsed.general : getInitialWelcomeMessages(activeMode).general
            });
          }
        } else {
          if (isMounted) {
            setChatSessions(getInitialWelcomeMessages(activeMode));
          }
        }

        // Fetch user-scoped chat history from Supabase if user is logged in
        if (userKey) {
          const { data, error } = await supabase
            .from('chat_sessions')
            .select('sessions_data')
            .eq('user_id', userKey)
            .maybeSingle();

          if (!error && data?.sessions_data && isMounted) {
            const remote = data.sessions_data;
            setChatSessions({
              linkedin: Array.isArray(remote.linkedin) && remote.linkedin.length > 0 ? remote.linkedin : getInitialWelcomeMessages(activeMode).linkedin,
              twitter: Array.isArray(remote.twitter) && remote.twitter.length > 0 ? remote.twitter : getInitialWelcomeMessages(activeMode).twitter,
              instagram: Array.isArray(remote.instagram) && remote.instagram.length > 0 ? remote.instagram : getInitialWelcomeMessages(activeMode).instagram,
              shield: Array.isArray(remote.shield) && remote.shield.length > 0 ? remote.shield : getInitialWelcomeMessages(activeMode).shield,
              general: Array.isArray(remote.general) && remote.general.length > 0 ? remote.general : getInitialWelcomeMessages(activeMode).general
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load saved chat sessions:', err);
        if (isMounted) setChatSessions(getInitialWelcomeMessages(activeMode));
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    };

    hydrateChat();
    return () => { isMounted = false; };
  }, [user, activeMode, storageKey, userKey]);

  // Persist user-scoped chat sessions to localStorage & Supabase when updated
  useEffect(() => {
    if (isHydrated && user) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(chatSessions));
      } catch (err) {
        console.warn('Failed to persist chat sessions to localStorage:', err);
      }

      if (userKey) {
        Promise.resolve(
          supabase
            .from('chat_sessions')
            .upsert({
              user_id: userKey,
              sessions_data: chatSessions,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
        ).then(({ error }) => {
          if (error) {
            console.debug('Supabase chat persistence note:', error.message);
          }
        }).catch(() => {});
      }
    }
  }, [chatSessions, isHydrated, storageKey, user, userKey]);

  // Sync external input from page hero presets
  useEffect(() => {
    if (externalInput) {
      setInputVal(externalInput);
      if (onClearExternalInput) {
        onClearExternalInput();
      }
    }
  }, [externalInput, onClearExternalInput]);

  const activeMessages = chatSessions[activeMode] || DEFAULT_WORKSPACE_MESSAGES[activeMode];

  // Smooth auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isLoading]);

  // SVG Mode Options Configuration
  const modes: { id: AgentMode; label: string; icon: React.ReactNode }[] = [
    { id: 'linkedin', label: 'LinkedIn', icon: <Briefcase className="w-4 h-4 mr-1.5 text-sky-400" /> },
    { id: 'twitter', label: 'X / Threads', icon: <Zap className="w-4 h-4 mr-1.5 text-amber-400" /> },
    { id: 'instagram', label: 'Instagram', icon: <Camera className="w-4 h-4 mr-1.5 text-pink-400" /> },
    { id: 'shield', label: 'Shield', icon: <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-400" /> },
    { id: 'general', label: 'General', icon: <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-400" /> }
  ];

  // Mode Quick Action Presets
  const modeActions: Record<AgentMode, { label: string; text: string; icon: React.ReactNode }[]> = {
    linkedin: [
      { label: 'Turn project into LinkedIn post', text: 'I built a real-time AI moderation agent using Google Gemini 3.6 Flash and fine-tuned Qwen-1.5B QLoRA. Turned latency to 125ms and stopped 95% of scams.', icon: <Briefcase className="w-3.5 h-3.5 text-sky-400 mr-1.5 inline" /> },
      { label: 'Post on learning QLoRA', text: 'Write a professional LinkedIn post about my journey learning QLoRA fine-tuning for LLMs, key takeaways, and tips for indie devs.', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-1.5 inline" /> },
      { label: 'Polite reply to recruiter', text: 'Draft a polite, professional LinkedIn reply thanking a tech recruiter for an opportunity while expressing interest in staying connected.', icon: <ArrowRight className="w-3.5 h-3.5 text-emerald-400 mr-1.5 inline" /> }
    ],
    twitter: [
      { label: 'Viral web dev hook', text: 'Create a viral X/Twitter thread opener on why full-stack devs should learn AI agent engineering in 2026.', icon: <Zap className="w-3.5 h-3.5 text-amber-400 mr-1.5 inline" /> },
      { label: 'Hackathon win summary', text: 'Summarize our team hackathon victory building an AI content guardian in under 280 characters with bullet points.', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-1.5 inline" /> },
      { label: 'Short tech opinion', text: 'Write a sharp, high-engagement X post about the death of traditional moderation tools vs real-time AI agents.', icon: <MessageSquare className="w-3.5 h-3.5 text-cyan-400 mr-1.5 inline" /> }
    ],
    instagram: [
      { label: 'Craft Reel & 5-Slide Carousel', text: 'Create an aesthetic Instagram caption and 5-slide carousel breakdown on how to fine-tune Qwen 1.5B on Google Colab for AI moderation.', icon: <Camera className="w-3.5 h-3.5 text-pink-400 mr-1.5 inline" /> },
      { label: 'Product launch caption', text: 'Draft an engaging Instagram caption announcing WardenAI Studio v2.5 with 15 targeted hashtags and a clear call-to-action.', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-1.5 inline" /> },
      { label: 'Viral creator tips', text: 'Give me 3 Instagram Reels visual hook ideas for developer creators showcasing open-source projects.', icon: <Lightbulb className="w-3.5 h-3.5 text-amber-400 mr-1.5 inline" /> }
    ],
    shield: [
      { label: 'Check fake sponsor email', text: 'Hi! We love your channel and want to sponsor a video for $5,000. Download our sponsorship agreement executable at http://sponsors-brand-verify.exe/download', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400 mr-1.5 inline" /> },
      { label: 'Reply to aggressive troll', text: 'You guys are absolute trash. Nobody likes your product, go sell somewhere else before I find out where your team is located.', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mr-1.5 inline" /> },
      { label: 'Spot crypto giveaway DM', text: 'URGENT: Elon Musk is doubling all ETH and BTC deposits! Send 0.5 ETH to receive 1 ETH back instantly. Claim at http://claim-rewards-crypto.drop', icon: <ShieldCheck className="w-3.5 h-3.5 text-rose-400 mr-1.5 inline" /> }
    ],
    general: [
      { label: 'Brainstorm post ideas', text: 'Give me 3 high-impact social media post ideas for a computer science student building open-source projects.', icon: <Lightbulb className="w-3.5 h-3.5 text-amber-400 mr-1.5 inline" /> },
      { label: 'Review bio for brand safety', text: 'Review my Twitter bio: "Full-Stack Dev | AI Builder | Web3 Enthusiast | DM for collab" and suggest improvements.', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1.5 inline" /> },
      { label: 'Engagement tips', text: 'What are the top 3 strategies to increase organic post reach without spending money on ads?', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-1.5 inline" /> }
    ]
  };

  const handleClearHistory = () => {
    setChatSessions(prev => ({
      ...prev,
      [activeMode]: DEFAULT_WORKSPACE_MESSAGES[activeMode]
    }));
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

    const currentSession = chatSessions[activeMode] || [];
    const history = currentSession.slice(-6);

    setChatSessions(prev => ({
      ...prev,
      [activeMode]: [...(prev[activeMode] || []), userMsg]
    }));
    setInputVal('');
    setIsLoading(true);

    try {
      const result = await onAnalyze(textToSubmit, activeMode, history);
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

      setChatSessions(prev => ({
        ...prev,
        [activeMode]: [...(prev[activeMode] || []), botMsg]
      }));

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
    } catch (err: any) {
      console.error('WardenChat Agent execution error:', err);
      const detailMsg = err instanceof Error ? err.message : String(err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'warden',
        text: `🚨 Warden Agent Error: ${detailMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode
      };
      setChatSessions(prev => ({
        ...prev,
        [activeMode]: [...(prev[activeMode] || []), errMsg]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (textToCopy: string, copyKey: string) => {
    // Unescape \n when copying to clipboard
    const cleanText = textToCopy.replace(/\\n/g, '\n');
    navigator.clipboard.writeText(cleanText);
    setCopiedId(copyKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoning(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-[#0F172A]/70 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
      
      {/* Two-Tier Responsive Header Scaffolding */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-5 py-4 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md rounded-t-2xl">
        {/* Left: Brand Identity & Model Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-slate-100 font-sans">Warden Co-Pilot</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                Gemini 3.6 Flash + Qwen Guardrails
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">Social Media Growth &amp; Safety Assistant</p>
          </div>
        </div>

        {/* Right: Mode Selector Tabs + Clear Action */}
        <div className="flex items-center flex-wrap gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMode(m.id)}
              className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors duration-200 ${
                activeMode === m.id
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {m.icon}
              <span className="font-sans">{m.label}</span>
            </button>
          ))}
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />
          <button
            type="button"
            onClick={handleClearHistory}
            className="flex items-center px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer transition-colors duration-200"
            title="Clear current mode conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Contextual Quick Actions per Mode */}
      <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
          Quick Actions:
        </span>
        {modeActions[activeMode]?.map((act, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(undefined, act.text)}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-purple-500/40 transition cursor-pointer shrink-0 font-sans"
          >
            {act.icon}
            <span>{act.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div
        ref={chatContainerRef}
        className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6 min-h-[380px] max-h-[580px]"
      >
        {activeMessages.map((msg) => {
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
              <div className={`max-w-[92%] sm:max-w-[85%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* User Message Bubble */}
                {isUser ? (
                  <div className="px-4.5 py-3 rounded-2xl bg-slate-800/90 text-slate-100 text-sm font-sans leading-relaxed border border-slate-700/60 shadow-md">
                    {renderFormattedMarkdown(msg.text)}
                  </div>
                ) : (
                  /* Warden Message & Crafted Post Preview Card */
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 text-sm font-sans space-y-4 shadow-xl">
                    {/* Warden Conversational Advice with clean formatting */}
                    <div className="text-slate-200 leading-relaxed font-sans font-normal">
                      {renderFormattedMarkdown(msg.text)}
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
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Pre-Flight Safety Cleared (Risk: {safety.riskScore}%)</span>
                                </span>
                              )}
                              {safety.status === 'NEEDS_CAUTION' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Caution Advised (Risk: {safety.riskScore}%)</span>
                                </span>
                              )}
                              {safety.status === 'BLOCKED' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Threat Blocked (Risk: {safety.riskScore}%)</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* 1-Click Copy Post Button */}
                          {crafted.mainBody && (
                            <button
                              type="button"
                              onClick={() => handleCopy(`${crafted.title ? crafted.title + '\n\n' : ''}${crafted.mainBody}\n\n${crafted.hashtags?.join(' ') || ''}`, `${msg.id}-main`)}
                              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 transition cursor-pointer border border-slate-700 shadow-sm"
                            >
                              {copiedId === `${msg.id}-main` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                  <span>Copy Post</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Title if present */}
                        {crafted.title && (
                          <h4 className="text-sm font-bold text-white font-sans tracking-tight">
                            {renderFormattedMarkdown(crafted.title)}
                          </h4>
                        )}

                        {/* Main Body formatted with high readability leading-relaxed & carousel micro-card detection */}
                        {crafted.mainBody && renderMainBodyContent(crafted.mainBody, activeMode === 'instagram')}

                        {/* Hooks Variations */}
                        {crafted.hooks && crafted.hooks.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-mono text-purple-300 font-semibold block uppercase inline-flex items-center">
                              <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
                              Alternative Hook Variations:
                            </span>
                            <ul className="space-y-1">
                              {crafted.hooks.map((h, hIdx) => (
                                <li key={hIdx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                  <span>{renderFormattedMarkdown(`"${h}"`)}</span>
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
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 border-b border-slate-800 pb-2 font-sans">
                          <Shield className="w-4 h-4 text-cyan-400" />
                          <span>Recommended Response Strategies:</span>
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
                                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition cursor-pointer relative"
                                >
                                  {copiedId === `${msg.id}-opt-${oIdx}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400 mr-1" />
                                      <span className="text-emerald-400">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-cyan-400 mr-1" />
                                      <span>Copy Reply</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                                {renderFormattedMarkdown(`"${opt.text}"`)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Collapsible Model Insight Accordion */}
                    {msg.result?.agentThoughts && msg.result.agentThoughts.length > 0 && (
                      <div className="pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => toggleReasoning(msg.id)}
                          className="text-xs font-mono text-slate-400 hover:text-purple-300 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Cpu className="w-3.5 h-3.5 text-purple-400" />
                          <span>Inspect Agent Pipeline Reasoner</span>
                          {expandedReasoning[msg.id] ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>

                        {expandedReasoning[msg.id] && (
                          <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                            {msg.result.agentThoughts.map((thought, idx) => {
                              const stage = typeof thought === 'string' ? `Stage ${idx + 1}` : thought.stage;
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
              <span className="text-slate-300 font-sans">Warden Agent analyzing in {activeMode.toUpperCase()} mode...</span>
            </div>
          </div>
        )}

        {/* Scroll anchor target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Bottom Input Capsule */}
      <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60">
        <form onSubmit={handleSend} className="relative flex items-center">
          <div className="relative w-full flex items-center">
            {/* Left Mode Icon */}
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              {activeMode === 'linkedin' && <Briefcase className="w-4 h-4 text-sky-400" />}
              {activeMode === 'twitter' && <Zap className="w-4 h-4 text-amber-400" />}
              {activeMode === 'instagram' && <Camera className="w-4 h-4 text-pink-400" />}
              {activeMode === 'shield' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
              {activeMode === 'general' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
            </div>

            {/* Capsule Input with explicit focus ring */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                activeMode === 'linkedin' ? "Paste project notes or ideas for LinkedIn post..." :
                activeMode === 'twitter' ? "Type topic or idea for viral X/Threads post..." :
                activeMode === 'instagram' ? "Type topic for Instagram caption & 5-slide carousel..." :
                activeMode === 'shield' ? "Paste suspicious message, email, or DM to inspect..." :
                "Ask Warden for growth advice, reviews, or brainstorming..."
              }
              disabled={isLoading}
              className="w-full pl-11 pr-28 py-3.5 rounded-full bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 font-sans transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 min-h-[44px]"
            />

            {/* Right Primary Send Pill Button */}
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className={`absolute right-2 px-4 py-2 rounded-full text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer transition-all shadow-md min-h-[36px] ${
                !inputVal.trim() || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-105 active:scale-95'
              }`}
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
