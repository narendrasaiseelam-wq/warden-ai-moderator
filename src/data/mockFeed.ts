import { QueueItem } from '@/types/moderation';

export const INITIAL_MOCK_FEED: QueueItem[] = [
  {
    id: 'mod-q101',
    content: '🚀 URGENT: Elon Musk is doubling all ETH and BTC deposits! Send 0.5 ETH to 0x71A...9F2 to receive 1 ETH back instantly. Only 100 slots left! Claim at http://claim-tesla-rewards.crypto-drop.xyz 🎁',
    authorName: 'CryptoAlerts VIP',
    authorHandle: '@crypto_eth_drops',
    avatarUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=150&auto=format&fit=crop&q=80',
    platform: 'Telegram',
    createdAt: '2 mins ago',
    verdict: 'AUTO_BLOCK',
    confidence: 0.99,
    riskScore: 98,
    category: 'Crypto & Financial Scam',
    specialistScore: 97,
    latencyMs: 124,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    agentThoughts: [
      {
        stage: 'Specialist Classifier (Qwen-1.5B QLoRA)',
        detail: 'Detected high probability financial fraud pattern match (0.97). Features: deposit doubling, unverified crypto wallet address, urgency timer, third-party claim URL.',
        score: 97
      },
      {
        stage: 'Context & Intent Analysis (Llama 3.1 8B)',
        detail: 'Evaluated text for impersonation of high-profile entity (Elon Musk/Tesla) paired with high-yield direct payment scam mechanics.',
        score: 98
      },
      {
        stage: 'Policy Enforcement',
        detail: 'Triggered Rule #1 (Direct Financial Scam & Advance-Fee Fraud). Automatic quarantine mandated.',
        score: 99
      },
      {
        stage: 'Final Decision',
        detail: 'Verdict: AUTO_BLOCK. High confidence scam intent.',
        score: 99
      }
    ],
    recommendation: 'Auto-block user account, flag IP subnet, add domain claim-tesla-rewards.crypto-drop.xyz to network blacklists.',
    explanation: 'Contains high-risk advance-fee cryptocurrency scam patterns, fraudulent entity impersonation, and malicious URL redirect.'
  },
  {
    id: 'mod-q102',
    content: 'CRITICAL SECURITY NOTICE: Your Chase Online Banking access has been restricted due to unauthorized login attempts. Verify your identity immediately at https://security-update-chase-auth.com/login or your account will be permanently suspended in 2 hours.',
    authorName: 'Chase Service Alert',
    authorHandle: '@chase_help_desk',
    avatarUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80',
    platform: 'X (Twitter)',
    createdAt: '5 mins ago',
    verdict: 'AUTO_BLOCK',
    confidence: 0.98,
    riskScore: 95,
    category: 'Phishing & Malicious Links',
    specialistScore: 96,
    latencyMs: 142,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    agentThoughts: [
      {
        stage: 'Specialist Classifier (Qwen-1.5B QLoRA)',
        detail: 'Phishing signature detected (0.96). Keyword match: "account restricted", fake bank authentication domain: security-update-chase-auth.com.',
        score: 96
      },
      {
        stage: 'Context & Intent Analysis (Llama 3.1 8B)',
        detail: 'Social engineering attack: Artificially creates panic with 2-hour deadline to coerce victim into entering credentials on credential harvester.',
        score: 95
      },
      {
        stage: 'Policy Enforcement',
        detail: 'Triggered Rule #2 (Credential Phishing & Brand Impersonation). Zero-tolerance violation.',
        score: 98
      },
      {
        stage: 'Final Decision',
        detail: 'Verdict: AUTO_BLOCK with 98% confidence.',
        score: 98
      }
    ],
    recommendation: 'Immediate domain block, report to anti-phishing registry (APWG), issue automated alert to target handle.',
    explanation: 'Credential phishing attempt using deceptive banking URL and false urgency triggers.'
  },
  {
    id: 'mod-q103',
    content: 'You guys are absolute trash. Nobody likes your product, go sell somewhere else before I find out where your team is located and make you regret it. You are disgusting rats.',
    authorName: 'ShadowRider99',
    authorHandle: '@shadow_rider',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    platform: 'Discord',
    createdAt: '12 mins ago',
    verdict: 'AUTO_BLOCK',
    confidence: 0.95,
    riskScore: 92,
    category: 'Hate Speech & Abuse',
    specialistScore: 91,
    latencyMs: 110,
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    agentThoughts: [
      {
        stage: 'Specialist Classifier (Qwen-1.5B QLoRA)',
        detail: 'Toxicity score: 0.91. Severe harassment, dehumanizing language ("disgusting rats"), physical threat indicator ("find out where your team is located").',
        score: 91
      },
      {
        stage: 'Context & Intent Analysis (Llama 3.1 8B)',
        detail: 'Analyzed post for targeted intimidation vs valid criticism. Contains explicit threat of physical location tracking and violence.',
        score: 92
      },
      {
        stage: 'Policy Enforcement',
        detail: 'Triggered Rule #3 (Direct Physical Threats & Dehumanizing Harassment).',
        score: 95
      },
      {
        stage: 'Final Decision',
        detail: 'Verdict: AUTO_BLOCK.',
        score: 95
      }
    ],
    recommendation: 'Block user, log IP address for safety compliance audit, flag account for discord trust & safety team.',
    explanation: 'Contains explicit physical threats and dehumanizing abusive language targeting company staff.'
  },
  {
    id: 'mod-q104',
    content: 'While I disagree with the proposed tax reform policy, I believe the author makes some strong points regarding fiscal responsibility and small business incentives. Here is the full budget report breakdown.',
    authorName: 'Elena Rostova',
    authorHandle: '@elena_policy_lab',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    platform: 'Web Forum',
    createdAt: '18 mins ago',
    verdict: 'PUBLISH',
    confidence: 0.99,
    riskScore: 4,
    category: 'Constructive & Safe',
    specialistScore: 5,
    latencyMs: 98,
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    agentThoughts: [
      {
        stage: 'Specialist Classifier (Qwen-1.5B QLoRA)',
        detail: 'Clean content classification (0.05 risk). Respectful discourse phrasing detected.',
        score: 5
      },
      {
        stage: 'Context & Intent Analysis (Llama 3.1 8B)',
        detail: 'Civil political commentary. Strong debate, zero harassment, zero toxicity.',
        score: 4
      },
      {
        stage: 'Policy Enforcement',
        detail: 'No safety violations. Content complies 100% with community standards.',
        score: 4
      },
      {
        stage: 'Final Decision',
        detail: 'Verdict: PUBLISH.',
        score: 99
      }
    ],
    recommendation: 'Allow publication without intervention.',
    explanation: 'Constructive civic discourse with no policy violations detected.'
  },
  {
    id: 'mod-q105',
    content: 'Honestly, this politician should be forced out of office immediately. They are ruining our city budget with total corruption. If we don’t protest at city hall next Tuesday, nothing will change.',
    authorName: 'Marcus Vance',
    authorHandle: '@marcus_v_news',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    platform: 'Reddit',
    createdAt: '25 mins ago',
    verdict: 'ESCALATE_HUMAN',
    confidence: 0.76,
    riskScore: 58,
    category: 'Uncategorized Risk',
    specialistScore: 62,
    latencyMs: 156,
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    agentThoughts: [
      {
        stage: 'Specialist Classifier (Qwen-1.5B QLoRA)',
        detail: 'Borderline political content (0.62 risk). Contains strong emotional rhetoric ("forced out", "corruption") and civic rally invitation.',
        score: 62
      },
      {
        stage: 'Context & Intent Analysis (Llama 3.1 8B)',
        detail: 'Evaluated intent: Expresses strong political discontent and calls for peaceful protest. Does not contain explicit calls to violence or illegal acts, but borders on heated political rhetoric.',
        score: 58
      },
      {
        stage: 'Policy Enforcement',
        detail: 'High-sensitivity political content policy. Confidence below 85% threshold for auto-action.',
        score: 76
      },
      {
        stage: 'Final Decision',
        detail: 'Verdict: ESCALATE_HUMAN. Human moderator review recommended to assess community guidelines alignment.',
        score: 76
      }
    ],
    recommendation: 'Send to senior trust & safety moderator for context-aware manual decision.',
    explanation: 'Borderline heated political opinion with call to civic action; requires human oversight to distinguish between protected free speech and incitement.'
  },
  {
    id: 'mod-q106',
    content: 'I’ve been using WardenAI for 3 months to protect our Web3 community. The automated scam detection stopped over 4,500 fake giveaway bots. Great product!',
    authorName: 'Sarah Chen',
    authorHandle: '@sarah_dev_io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    platform: 'X (Twitter)',
    createdAt: '40 mins ago',
    verdict: 'PUBLISH',
    confidence: 0.99,
    riskScore: 2,
    category: 'Constructive & Safe',
    specialistScore: 2,
    latencyMs: 92,
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    agentThoughts: [
      {
        stage: 'Specialist Classifier (Qwen-1.5B QLoRA)',
        detail: 'Clean content (0.02 risk). Positive customer testimonial features.',
        score: 2
      },
      {
        stage: 'Context & Intent Analysis (Llama 3.1 8B)',
        detail: 'Organic product review sharing operational metrics.',
        score: 2
      },
      {
        stage: 'Policy Enforcement',
        detail: 'Passes all safety guardrails.',
        score: 2
      },
      {
        stage: 'Final Decision',
        detail: 'Verdict: PUBLISH.',
        score: 99
      }
    ],
    recommendation: 'Publish immediately.',
    explanation: 'Authentic user review with zero safety concerns.'
  }
];

export const PRESET_EXAMPLES = [
  {
    title: 'Crypto Giveaway Scam',
    badge: 'High Risk / Fraud',
    color: 'crimson',
    text: '🎁 SPECIAL A drop: 50,000,000 $DOGE to celebrate our mainnet! Send 10,000 DOGE to the official smart contract address below and get 20,000 back instantly. Hurry up, link expires in 30 mins! 👉 http://doge-airdrop-bonus.tech/claim'
  },
  {
    title: 'Aggressive Hate Speech',
    badge: 'Toxic Harassment',
    color: 'crimson',
    text: 'You miserable worthless losers should quit life right now. Nobody wants your pathetic group in our neighborhood. We will hunt down everyone on your team and burn your office down!'
  },
  {
    title: 'Constructive Debate',
    badge: 'Safe Discourse',
    color: 'emerald',
    text: 'While the newly proposed AI regulation framework introduces some compliance overhead for early-stage startups, it provides essential guardrails for consumer data privacy and model transparency.'
  },
  {
    title: 'Bank Phishing Link',
    badge: 'Credential Theft',
    color: 'crimson',
    text: 'Bank Alert: Suspicious transaction of $4,850.00 detected on your card. If you did not authorize this payment, cancel it immediately at https://secure-auth-bankofamerica-verify.com/account/login'
  },
  {
    title: 'Legitimate Review',
    badge: 'Verified User',
    color: 'emerald',
    text: 'The dashboard UI is super intuitive and saved our moderation team hours of manual sorting every week. Fast API response times too!'
  }
];

export const MODEL_BENCHMARKS = [
  {
    modelName: 'Fine-Tuned Warden Qwen-1.5B (QLoRA)',
    accuracy: 95.8,
    precision: 96.4,
    recall: 94.7,
    f1Score: 95.5,
    avgLatencyMs: 125,
    vramUsageGb: 3.2,
    trainingSamples: 25000,
    isWarden: true
  },
  {
    modelName: 'Base Qwen 2.5 1.5B (Zero-Shot)',
    accuracy: 84.2,
    precision: 81.0,
    recall: 79.5,
    f1Score: 80.2,
    avgLatencyMs: 140,
    vramUsageGb: 3.1,
    trainingSamples: 0,
    isWarden: false
  },
  {
    modelName: 'Llama 3.1 8B Instant (Generalist Base)',
    accuracy: 91.5,
    precision: 90.2,
    recall: 89.8,
    f1Score: 90.0,
    avgLatencyMs: 420,
    vramUsageGb: 16.0,
    trainingSamples: 0,
    isWarden: false
  }
];
