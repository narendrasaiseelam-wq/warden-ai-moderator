'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, Zap, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('creator@warden.ai');
  const [password, setPassword] = useState<string>('warden123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
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

  const handleGoogleLogin = () => {
    loginWithGoogle();
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#080B11] cyber-grid text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Left Column: Visual Telemetry Hero */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between border-r border-slate-800/80 relative overflow-hidden bg-gradient-to-br from-[#080B11] via-[#0F172A] to-[#111827]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-900 border border-purple-500/40 avatar-neon-glow text-emerald-400">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              Warden<span className="text-purple-400">AI</span>
            </span>
            <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Studio v2.5
            </span>
          </div>
        </div>

        {/* Tagline & Features */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>🚀 Social Media Growth &amp; Safety Co-Pilot</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight font-sans">
            Welcome back to <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">WardenAI Studio</span>.
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            Real-time trust &amp; safety agent console providing dynamic content evaluation, AI suggested replies, and human-in-the-loop overrides.
          </p>

          <div className="space-y-3 pt-2 font-sans text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time Gemini 2.5 Flash agent moderation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Suggested Moderator Replies with 1-click copying</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Persistent multi-session workspace memory</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500 font-mono flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sub-150ms Average Moderation Latency</span>
        </div>
      </div>

      {/* Right Column: Sign In Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-[#111827] backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-slate-900 border border-purple-500/40 text-emerald-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-lg font-bold text-white">WardenAI Studio</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight font-sans">Sign in to your account</h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Enter your credentials to access your Warden AI workspace.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-sans">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@warden.ai"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-sans"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-sans">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-800 bg-slate-900/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isSubmitting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-mono text-slate-500 uppercase">── OR ──</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Google 1-Click Demo Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer */}
          <div className="text-center pt-2 text-xs text-slate-400 font-sans">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-emerald-400 font-semibold hover:underline">
              Create one →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
