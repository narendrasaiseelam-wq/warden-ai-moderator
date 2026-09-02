export type ModerationVerdict = 'PUBLISH' | 'AUTO_BLOCK' | 'ESCALATE_HUMAN' | 'FLAG_WARNING';

export type ModerationCategory = 
  | 'Hate Speech & Harassment'
  | 'Crypto & Financial Fraud'
  | 'Phishing & Malicious Links'
  | 'Heated Discourse / Review'
  | 'Constructive & Safe'
  | 'Constructive Critique'
  | 'Crypto Phishing Scam'
  | 'Toxic Harassment'
  | 'Technical Question'
  | 'Impersonation Attempt'
  | string;

export interface AgentThought {
  stage: string;
  detail: string;
  score?: number;
  timestamp?: string;
}

export interface SuggestedReplies {
  moderatorResponse: string;
  userActionAdvice: string;
}

export interface ModerationResult {
  id: string;
  verdict: ModerationVerdict;
  confidence: number; // 0 to 100 or 0.0 to 1.0
  riskScore: number; // 0 to 100
  category: ModerationCategory;
  conversationalAssessment?: string;
  friendlySummary?: string;
  keyFindings?: string[];
  keyTakeaways?: string[];
  suggestedReplies?: SuggestedReplies;
  agentThoughts: (AgentThought | string)[];
  recommendation: string;
  explanation?: string;
  timestamp: string;
  latencyMs?: number;
  specialistScore?: number;
}

export interface ModerationRequest {
  text: string;
  context?: string;
  authorId?: string;
  platform?: string;
}

export interface QueueItem extends ModerationResult {
  content: string;
  authorName: string;
  authorHandle: string;
  avatarUrl?: string;
  platform: 'X (Twitter)' | 'Telegram' | 'Discord' | 'Reddit' | 'YouTube' | 'Web Forum';
  createdAt: string;
  overrideStatus?: 'APPROVED' | 'BLOCKED' | 'ESCALATED';
  overrideBy?: string;
}

export interface BenchmarkMetrics {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  avgLatencyMs: number;
  vramUsageGb: number;
  trainingSamples: number;
  isWarden?: boolean;
}
