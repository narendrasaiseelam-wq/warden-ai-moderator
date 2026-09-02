'use client';

import React from 'react';
import { X, BarChart3, Cpu, Zap, Database, CheckCircle2, Award, Layers } from 'lucide-react';
import { MODEL_BENCHMARKS } from '@/data/mockFeed';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetricsModal: React.FC<MetricsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 glow-emerald">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Evaluation & Benchmarking Hub
                <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Colab Test Evaluation
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Performance comparison of fine-tuned Warden Qwen-1.5B QLoRA model against base foundation LLMs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900 border border-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Specs Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Fine-Tuned HuggingFace Hub</span>
              <span className="text-xs font-bold font-mono text-gray-200">narendraseelam/content-moderator-qwen</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-3">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-mono block">QLoRA Architecture</span>
              <span className="text-xs font-bold font-mono text-gray-200">Rank r=16 • Alpha=32 • Dropout 0.05</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Accuracy Boost</span>
              <span className="text-xs font-bold font-mono text-emerald-400">+11.6% F1 Score vs Base Model</span>
            </div>
          </div>
        </div>

        {/* Benchmark Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/90 text-[11px] font-mono uppercase text-gray-400">
                <th className="p-3.5">Model Architecture</th>
                <th className="p-3.5 text-right">Accuracy</th>
                <th className="p-3.5 text-right">Precision</th>
                <th className="p-3.5 text-right">Recall</th>
                <th className="p-3.5 text-right">F1 Score</th>
                <th className="p-3.5 text-right">Avg Latency</th>
                <th className="p-3.5 text-right">VRAM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-xs font-mono">
              {MODEL_BENCHMARKS.map((m, idx) => (
                <tr
                  key={idx}
                  className={`transition ${
                    m.isWarden
                      ? 'bg-emerald-950/30 text-white font-bold border-l-2 border-emerald-400'
                      : 'hover:bg-gray-900/40 text-gray-300'
                  }`}
                >
                  <td className="p-3.5 flex items-center gap-2">
                    {m.isWarden && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>{m.modelName}</span>
                    {m.isWarden && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                        Warden Specialist
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">{m.accuracy.toFixed(1)}%</td>
                  <td className="p-3.5 text-right">{m.precision.toFixed(1)}%</td>
                  <td className="p-3.5 text-right">{m.recall.toFixed(1)}%</td>
                  <td className={`p-3.5 text-right font-extrabold ${m.isWarden ? 'text-emerald-400' : ''}`}>
                    {m.f1Score.toFixed(1)}%
                  </td>
                  <td className="p-3.5 text-right text-cyan-400">{m.avgLatencyMs}ms</td>
                  <td className="p-3.5 text-right text-gray-400">{m.vramUsageGb} GB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fine-Tuning Hyperparameters & Methodology */}
        <div className="p-5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs space-y-3">
          <h3 className="font-bold text-gray-200 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> QLoRA Fine-Tuning Technical Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-400 leading-relaxed font-sans">
            <div>
              <p className="font-semibold text-gray-300 mb-1">Target Modules & Adapter Architecture:</p>
              <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                <li>Adapters applied to: <span className="text-gray-200">q_proj, k_proj, v_proj, o_proj</span></li>
                <li>Quantization: 4-bit NormalFloat (NF4) with Double Quantization</li>
                <li>Optimizer: Paged AdamW 32-bit with cosine learning rate schedule</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-300 mb-1">Training Dataset & Loss Function:</p>
              <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                <li>Dataset Size: 25,000 multi-domain safety & fraud samples</li>
                <li>Loss Function: Cross-Entropy with class reweighting for rare phishing attacks</li>
                <li>Final Evaluation Loss: 0.124 on holdout test split</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition cursor-pointer"
          >
            Close Benchmarks
          </button>
        </div>
      </div>
    </div>
  );
};
