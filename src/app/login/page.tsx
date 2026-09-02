'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, Zap, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('alex.warden@trustsafety.io');
  const [password, setPassword] = useState<string>('warden123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { login, loginAsDemoLead, loginAsDemoModerator } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('Failed to log in. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLeadClick = () => {
    loginAsDemoLead();
    router.push('/');
  };

  const handleDemoModeratorClick = () => {
    loginAsDemoModerator();
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B0F19] cyber-grid text-gray-100 font-sans">
      {/* Left Column: Branding & Safety Lead Features */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between border-r border-gray-800/80 relative overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#111827]">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 glow-emerald">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              WardenAI
            </span>
            <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Studio v2.4
            </span>
          </div>
        </div>

        {/* Tagline & Key Features */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hybrid Qwen + Google Gemini 2.5 Intelligence</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Welcome back to <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">WardenAI Studio</span>.
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed">
            Real-time trust &amp; safety agent console providing dynamic content evaluation, AI suggested replies, and human-in-the-loop overrides.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time Gemini 2.5 Flash agent moderation</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Suggested Moderator Replies with 1-click copying</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Persistent session management &amp; role presets</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-gray-500 font-mono flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sub-150ms Average Moderation Latency</span>
        </div>
      </div>

      {/* Right Column: Sign In Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-7 glass-panel p-8 rounded-2xl border border-gray-800 shadow-2xl relative">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">WardenAI Studio</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to your account</h2>
            <p className="text-xs text-gray-400 mt-1">
              Access your trust &amp; safety agent dashboard or test with demo presets.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Quick Demo Instant Buttons */}
          <div className="space-y-2 pb-1">
            <label className="text-[11px] font-mono font-semibold text-gray-400 uppercase tracking-wider block">
              1-Click Demo Profiles:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoLeadClick}
                className="p-2.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/40 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-0.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Safety Lead</span>
                </div>
                <span className="text-[10px] text-gray-400 block font-mono">Alex Warden</span>
              </button>

              <button
                type="button"
                onClick={handleDemoModeratorClick}
                className="p-2.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-cyan-500/40 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-0.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Moderator</span>
                </div>
                <span className="text-[10px] text-gray-400 block font-mono">Sarah Chen</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono text-gray-500 uppercase">Or Sign In With Email</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.warden@trustsafety.io"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/30 glow-emerald transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Sign In to Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-gray-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
