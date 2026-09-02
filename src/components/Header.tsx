'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, BarChart3, LogOut, LogIn, ChevronDown, MessageSquare, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onOpenMetrics?: () => void;
  activeTab?: 'CHAT' | 'QUEUE' | 'BENCHMARKS';
  onSelectTab?: (tab: 'CHAT' | 'QUEUE' | 'BENCHMARKS') => void;
  latencyMs?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMetrics,
  activeTab = 'CHAT',
  onSelectTab,
  latencyMs = 125
}) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel-dribbble border-b border-slate-800/80 px-4 lg:px-8 py-3 backdrop-blur-xl bg-slate-950/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Minimalist Branding Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-2xl bg-slate-900 border border-purple-500/40 avatar-neon-glow flex items-center justify-center text-purple-300 transition group-hover:scale-105">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white font-sans block">
              Warden<span className="text-purple-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium block">
              AI Guardian Co-Pilot
            </span>
          </div>
        </Link>

        {/* Center: Simple Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-800">
          <button
            onClick={() => onSelectTab && onSelectTab('CHAT')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CHAT'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Chat Guardian</span>
          </button>

          <button
            onClick={() => onSelectTab && onSelectTab('QUEUE')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'QUEUE'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span>Moderation Queue</span>
          </button>

          <button
            onClick={() => {
              if (onSelectTab) onSelectTab('BENCHMARKS');
              else if (onOpenMetrics) onOpenMetrics();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'BENCHMARKS'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Benchmarks</span>
          </button>
        </nav>

        {/* Right: User Profile Pill / Sign In */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 font-bold text-xs font-mono">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-200 hidden sm:inline">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <span className="text-xs font-bold text-white block">{user.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">{user.email}</span>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-900 btn-peach rounded-full transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-900" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
