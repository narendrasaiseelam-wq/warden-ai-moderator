'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2, Zap, Terminal, Activity, Shield, Cpu } from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Trust & Safety Lead');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { register } = useAuth();
  const router = useRouter();

  // Password strength calculation
  const getPasswordStrength = (pass: string): { label: string; score: number; color: string } => {
    if (!pass) return { label: '', score: 0, color: 'bg-gray-800' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { label: 'Weak', score: 25, color: 'bg-rose-500' };
    if (score <= 3) return { label: 'Medium', score: 65, color: 'bg-amber-500' };
    return { label: 'Strong', score: 100, color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await register(name, email, password, selectedRole);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B0F19] cyber-grid text-gray-100 font-sans">
      {/* Left Column: Futuristic Safety Telemetry & Node Visualizer */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between border-r border-gray-800/80 relative overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#111827]">
        {/* Ambient Neon Blobs */}
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

        {/* Interactive Telemetry & Feature Visuals */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          {/* Shimmer Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Node Status: Active • Gemini 2.5 Flash Engine</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Initialize your Trust &amp; Safety <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Agent Studio</span>.
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed">
            Deploy hybrid Qwen QLoRA + Gemini AI agents to protect your community feed from crypto giveaways, phishing links, and toxic abuse.
          </p>

          {/* Animated Terminal Card Telemetry */}
          <div className="p-4 rounded-xl bg-gray-950/90 border border-gray-800/90 font-mono text-xs space-y-2 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-500 pb-2 border-b border-gray-800 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" /> telemetry.warden.log
              </span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Activity className="w-3 h-3 animate-spin" /> 140ms
              </span>
            </div>
            <div className="space-y-1 text-gray-300 text-[11px]">
              <p className="text-emerald-400">✓ [SPECIALIST] Fine-Tuned Qwen-1.5B initialized (r=16, alpha=32)</p>
              <p className="text-cyan-300">✓ [GENERALIST] Google Gemini 2.5 Flash connected</p>
              <p className="text-gray-400">✓ [POLICIES] Financial Scam &amp; Anti-Toxicity guardrails online</p>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="px-3 py-1.5 rounded-xl bg-gray-900/90 border border-gray-800 text-xs text-gray-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>95.8% Classification Accuracy</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-gray-900/90 border border-gray-800 text-xs text-gray-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Suggested Replies</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-gray-900/90 border border-gray-800 text-xs text-gray-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>1-Click Human Overrides</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-gray-500 font-mono flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Autonomous Community Defense Protocol</span>
        </div>
      </div>

      {/* Right Column: Glassmorphic Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-7 glass-panel p-8 rounded-2xl border border-gray-800 shadow-2xl relative">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">WardenAI Studio</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-xs text-gray-400 mt-1">
              Select your team role and initialize your Warden AI credentials.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Chen"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  placeholder="sarah@platform.io"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>
            </div>

            {/* Role Selection Selector Pills */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1.5">
                Select Your Operational Role
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { title: 'Trust & Safety Lead', icon: '🛡️', desc: 'Full policy enforcement & audit access' },
                  { title: 'Community Moderator', icon: '⚡', desc: 'Real-time queue actions & response tools' },
                  { title: 'Security Engineer', icon: '🔒', desc: 'Model benchmarks & API configuration' }
                ].map((roleObj) => {
                  const isSelected = selectedRole === roleObj.title;
                  return (
                    <button
                      key={roleObj.title}
                      type="button"
                      onClick={() => setSelectedRole(roleObj.title as UserRole)}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-sm'
                          : 'bg-gray-950/80 border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{roleObj.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-gray-200 block">{roleObj.title}</span>
                          <span className="text-[10px] text-gray-400 block">{roleObj.desc}</span>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password Input with Strength Indicator */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
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

              {/* Strength Meter Bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span>Password Strength</span>
                    <span className="font-bold text-gray-300">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/30 glow-emerald transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {isSubmitting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Initializing Account...</span>
                </>
              ) : (
                <>
                  <span>Initialize Warden Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
