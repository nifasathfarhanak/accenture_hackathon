import { GoogleGenerativeAI } from '@google/generative-ai';
import { RegulatoryObligation, RequirementComponent } from '../types';

// ─── API Key Resolution ───────────────────────────────────────────────────────
// Priority: user-supplied runtime key (stored in localStorage) → Vite env var
function resolveApiKey(): string | null {
  const stored = localStorage.getItem('regulatrace_gemini_api_key');
  if (stored && stored.trim().length > 10) return stored.trim();
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 10) return envKey.trim();
  return null;
}

function getClient(): GoogleGenerativeAI | null {
  const key = resolveApiKey();
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ExtractedObligation {
  title: string;
  normalizedRequirement: string;
  regulationName: string;
  jurisdiction: string;
  businessFunction: string;
  effectiveDate: string;
  sourceSection: string;
  sourceExcerpt: string;
  requirementComponents: {
    statement: string;
    sourceExcerpt: string;
    sourceSection: string;
  }[];
}

export interface AIIngestionResult {
  obligations: ExtractedObligation[];
  regulationSummary: string;
  confidence: 'High' | 'Medium' | 'Low';
  warnings: string[];
}

export interface AIMatchEnhancement {
  enhancedRationale: string;
  riskFlags: string[];
  suggestedNextStep: string;
}

// ─── Feature 1: Extract Obligations from Raw Regulatory Text ──────────────────
export async function extractObligationsFromText(
  rawText: string,
  regulationHint?: string
): Promise<AIIngestionResult> {
  const client = getClient();

  if (!client) {
    // Graceful fallback: return a mock extraction for demo
    return mockExtractObligations(rawText, regulationHint);
  }

  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a specialist regulatory compliance analyst for a large bank. Your task is to extract structured regulatory obligations from raw regulatory text.

REGULATORY TEXT TO ANALYSE:
${regulationHint ? `Regulation Hint: ${regulationHint}\n` : ''}
---
${rawText}
---

Return a JSON object (no markdown, no code fences) with EXACTLY this structure:
{
  "regulationSummary": "<1-2 sentence summary of what regulation this appears to be>",
  "confidence": "High" | "Medium" | "Low",
  "warnings": ["<any extraction warnings or ambiguities>"],
  "obligations": [
    {
      "title": "<short obligation title e.g. 'Customer Due Diligence Periodic Review'>",
      "normalizedRequirement": "<plain English statement of what the bank must do, 1-2 sentences>",
      "regulationName": "<regulation short name e.g. 'EU AML Directive 6AMLD'>",
      "jurisdiction": "<e.g. EU, UK, US-Federal>",
      "businessFunction": "<e.g. Financial Crime & AML, Treasury & Balance Sheet, Capital Management>",
      "effectiveDate": "<YYYY-MM-DD or 'TBD'>",
      "sourceSection": "<article/section reference e.g. 'Article 8(1)'>",
      "sourceExcerpt": "<verbatim excerpt from the input text, max 150 chars>",
      "requirementComponents": [
        {
          "statement": "<atomic sub-requirement statement>",
          "sourceExcerpt": "<verbatim excerpt from text, max 100 chars>",
          "sourceSection": "<article/subsection reference>"
        }
      ]
    }
  ]
}

Rules:
- Extract ALL distinct obligations from the text (at minimum 1, maximum 8)
- Each obligation must have 2-4 requirementComponents (atomic sub-requirements)
- Use concise, banker-friendly language
- Jurisdiction must be one of: EU, UK, US-Federal, US-State, Singapore, Switzerland, Global/BCBS
- businessFunction must be one of: Financial Crime & AML, Payments & Treasury, Treasury & Balance Sheet Management, Capital Management & Treasury, Corporate Compliance & Ethics, IT Operations & Cloud, Risk Management, Consumer Protection
- ONLY return the JSON object. No other text.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip potential markdown code fences
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned) as AIIngestionResult;
    return parsed;
  } catch (err) {
    console.error('[GeminiService] Extraction failed:', err);
    return {
      obligations: [],
      regulationSummary: 'AI extraction encountered an error. Please check your API key and try again.',
      confidence: 'Low',
      warnings: [String(err)],
    };
  }
}

// ─── Feature 2: AI-Enhanced Match Rationale ───────────────────────────────────
export async function enhanceMatchRationale(
  obligationTitle: string,
  obligationRequirement: string,
  controlName: string,
  controlDescription: string,
  matchScore: number,
  existingRationale: string
): Promise<AIMatchEnhancement> {
  const client = getClient();

  if (!client) {
    return {
      enhancedRationale: existingRationale + ' [AI enhancement unavailable — set API key in Settings]',
      riskFlags: [],
      suggestedNextStep: 'Review manually and set your Gemini API key in Settings for AI-enhanced analysis.',
    };
  }

  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a senior banking compliance analyst reviewing a regulatory obligation-to-control mapping.

OBLIGATION: ${obligationTitle}
Requirement: ${obligationRequirement}

CONTROL: ${controlName}
Description: ${controlDescription}

CURRENT MATCH SCORE: ${matchScore}/100
EXISTING RATIONALE: ${existingRationale}

Provide a concise JSON response (no markdown, no code fences):
{
  "enhancedRationale": "<2-3 sentence enhanced professional rationale explaining why this control does or does not adequately cover this obligation — be specific about mechanisms>",
  "riskFlags": ["<any compliance risk flags — e.g. 'Control frequency may not meet daily reporting mandate'>", ...],
  "suggestedNextStep": "<one specific actionable recommendation for the compliance reviewer>"
}

Be direct, professional, and specific to banking/financial regulation context. ONLY return JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned) as AIMatchEnhancement;
  } catch (err) {
    console.error('[GeminiService] Match enhancement failed:', err);
    return {
      enhancedRationale: existingRationale,
      riskFlags: [],
      suggestedNextStep: 'AI enhancement failed. Please check your API key.',
    };
  }
}

// ─── Mock Fallback for Demo (no API key required) ─────────────────────────────
function mockExtractObligations(
  rawText: string,
  regulationHint?: string
): AIIngestionResult {
  const hint = regulationHint || 'Regulation';
  const wordCount = rawText.split(/\s+/).length;

  return {
    regulationSummary: `AI Demo Mode — Set your Gemini API key in Settings to enable live extraction. This mock shows what Gemini would extract from your ${hint} text (${wordCount} words detected).`,
    confidence: 'Low',
    warnings: [
      'Running in demo mode — no API key detected.',
      'Set your Gemini API key in Settings → AI Configuration to enable live extraction.',
    ],
    obligations: [
      {
        title: `[Demo] ${hint} — Primary Obligation`,
        normalizedRequirement: `Financial institutions must comply with ${hint} requirements by implementing appropriate internal controls and maintaining documented evidence of compliance.`,
        regulationName: hint,
        jurisdiction: 'EU',
        businessFunction: 'Risk Management',
        effectiveDate: new Date().toISOString().split('T')[0],
        sourceSection: 'Article 1',
        sourceExcerpt: rawText.substring(0, 120).trim() + '...',
        requirementComponents: [
          {
            statement: 'Implement documented internal controls aligned to regulatory requirements',
            sourceExcerpt: rawText.substring(0, 80).trim(),
            sourceSection: 'Article 1(a)',
          },
          {
            statement: 'Maintain audit-traceable evidence of control effectiveness',
            sourceExcerpt: rawText.substring(Math.min(80, rawText.length - 1), Math.min(160, rawText.length)).trim(),
            sourceSection: 'Article 1(b)',
          },
        ],
      },
    ],
  };
}

// ─── Utility ──────────────────────────────────────────────────────────────────
export function hasApiKey(): boolean {
  return resolveApiKey() !== null;
}

export function setApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem('regulatrace_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('regulatrace_gemini_api_key');
  }
}

export function clearApiKey(): void {
  localStorage.removeItem('regulatrace_gemini_api_key');
}

// ─── Convert Extracted → RegulatoryObligation type ───────────────────────────
export function convertToObligation(
  extracted: ExtractedObligation,
  index: number
): RegulatoryObligation {
  const id = `OBL-AI-${Date.now()}-${index}`;
  const now = new Date().toISOString();

  const requirementComponents: RequirementComponent[] = extracted.requirementComponents.map(
    (rc, i) => ({
      id: `RC-AI-${Date.now()}-${index}-${i}`,
      obligationId: id,
      statement: rc.statement,
      sourceExcerpt: rc.sourceExcerpt,
      sourceSection: rc.sourceSection,
    })
  );

  return {
    id,
    title: extracted.title,
    normalizedRequirement: extracted.normalizedRequirement,
    regulationName: extracted.regulationName,
    sourceDocumentId: `AI-INGESTED-${Date.now()}`,
    sourceDocumentVersion: 'v1.0-AI',
    sourceSection: extracted.sourceSection,
    sourcePage: 'AI-extracted',
    sourceExcerpt: extracted.sourceExcerpt,
    jurisdiction: extracted.jurisdiction,
    businessFunction: extracted.businessFunction,
    applicabilityStatus: 'Under Review',
    effectiveDate: extracted.effectiveDate,
    sourceVerificationStatus: 'Unverified source',
    requirementComponents,
    createdAt: now,
    updatedAt: now,
  };
}
