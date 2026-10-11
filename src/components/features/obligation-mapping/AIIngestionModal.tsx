import React, { useState, useRef } from 'react';
import { Dialog, DialogContent } from '../../ui/Dialog';
import { Button } from '../../ui/Button';
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Loader2,
  X,
  Plus,
  Zap,
  Brain,
  ShieldCheck,
  Eye
} from 'lucide-react';
import {
  extractObligationsFromText,
  convertToObligation,
  hasApiKey,
  setApiKey,
  AIIngestionResult,
  ExtractedObligation
} from '../../../services/geminiService';
import { RegulatoryObligation } from '../../../types';

interface AIIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddObligations: (obligations: RegulatoryObligation[]) => void;
}

type Step = 'input' | 'processing' | 'review' | 'done';

const SAMPLE_TEXTS = [
  {
    label: 'EU AI Act — Banking Risk',
    text: `Article 9 — Risk Management System
Banks deploying high-risk AI systems in credit scoring, anti-money laundering, or fraud detection must establish, implement, document and maintain a risk management system. The risk management system shall consist of a continuous iterative process run throughout the entire lifecycle of a high-risk AI system. This process shall ensure that risks to health, safety or fundamental rights are identified and mitigated.

Article 9(4) — Testing Requirements
High-risk AI systems shall be tested for the purposes of identifying the most appropriate risk management measures. Testing shall ensure that high-risk AI systems perform consistently for their intended purpose and they are compliant with the requirements set out in this Chapter.

Article 12 — Record-keeping
High-risk AI systems shall be designed and developed with capabilities enabling the automatic recording of events (logs) while the high-risk AI systems are operating. Those logging capabilities shall ensure a level of traceability of the AI system's functioning throughout its lifecycle.

Article 13 — Transparency
High-risk AI systems shall be designed and developed in such a way to ensure that their operation is sufficiently transparent to enable deployers to interpret the system's output and use it appropriately. An appropriate type and degree of transparency shall be ensured.`
  },
  {
    label: 'Basel IV — Credit Risk',
    text: `Section 3.4 — Counterparty Credit Risk Framework
Banks must calculate counterparty credit risk (CCR) exposure for all over-the-counter derivative transactions, exchange-traded derivatives, long settlement transactions, and securities financing transactions. The standardised approach for CCR (SA-CCR) must be applied for regulatory capital purposes.

Section 3.4.1 — Margining Requirements  
For non-centrally cleared OTC derivatives, financial institutions must exchange variation margin on a daily basis. Initial margin must be posted and collected bilaterally for covered entities with aggregate average notional outstanding OTC derivatives exceeding the applicable threshold.

Section 3.4.2 — CVA Capital Charge
Banks shall calculate a CVA capital charge for all OTC derivatives that are not centrally cleared. The basic CVA (BA-CVA) or standardised CVA (SA-CVA) approach shall be used depending on the bank's regulatory approval status. Quarterly reporting to the competent authority is mandatory.`
  }
];

export const AIIngestionModal: React.FC<AIIngestionModalProps> = ({
  isOpen,
  onClose,
  onAddObligations,
}) => {
  const [step, setStep] = useState<Step>('input');
  const [rawText, setRawText] = useState('');
  const [regulationHint, setRegulationHint] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!hasApiKey());
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIIngestionResult | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setStep('input');
    setRawText('');
    setRegulationHint('');
    setResult(null);
    setSelectedIndices(new Set());
    setError(null);
    onClose();
  };

  const handleExtract = async () => {
    if (!rawText.trim() || rawText.trim().length < 50) {
      setError('Please paste at least 50 characters of regulatory text.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setStep('processing');

    // Save API key if user provided one
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKeyInput(false);
    }

    try {
      const extracted = await extractObligationsFromText(rawText, regulationHint || undefined);
      setResult(extracted);
      // Pre-select all obligations
      setSelectedIndices(new Set(extracted.obligations.map((_, i) => i)));
      setStep('review');
    } catch (err) {
      setError(`Extraction failed: ${String(err)}`);
      setStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRawText(text.substring(0, 8000)); // cap at 8K chars for Gemini
    };
    reader.readAsText(file);
  };

  const handleToggleObligation = (idx: number) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleAddSelected = () => {
    if (!result || selectedIndices.size === 0) return;
    const toAdd = [...selectedIndices]
      .sort()
      .map((i) => convertToObligation(result.obligations[i], i));
    onAddObligations(toAdd);
    setStep('done');
  };

  const confidenceColor = {
    High: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Medium: 'text-amber-700 bg-amber-50 border-amber-200',
    Low: 'text-red-700 bg-red-50 border-red-200',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col min-h-0" style={{ maxHeight: '85vh' }}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-4 px-6 pt-6 pb-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#17263C]">AI Regulatory Ingestion</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
                <Sparkles className="w-2.5 h-2.5" /> GEMINI POWERED
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Paste raw regulation text → Gemini AI extracts structured obligations automatically
            </p>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Progress Steps ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-0 px-6 py-3 bg-slate-50 border-b border-[#E2E8F0] flex-shrink-0">
          {[
            { key: 'input', label: '1. Input Text', icon: FileText },
            { key: 'processing', label: '2. AI Extraction', icon: Brain },
            { key: 'review', label: '3. Review & Select', icon: Eye },
            { key: 'done', label: '4. Added', icon: CheckCircle2 },
          ].map((s, i, arr) => {
            const stepOrder = ['input', 'processing', 'review', 'done'];
            const currentIdx = stepOrder.indexOf(step);
            const thisIdx = stepOrder.indexOf(s.key);
            const isDone = thisIdx < currentIdx;
            const isCurrent = s.key === step;

            return (
              <React.Fragment key={s.key}>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCurrent ? 'bg-indigo-100 text-indigo-700' :
                  isDone ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  <s.icon className="w-3.5 h-3.5" />
                  {s.label}
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── STEP: INPUT ─────────────────────────────────────────────── */}
          {step === 'input' && (
            <div className="space-y-4">
              {/* API Key section */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-800">Gemini API Configuration</span>
                  </div>
                  {hasApiKey() && !showApiKeyInput && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      API Key Active
                    </div>
                  )}
                </div>

                {showApiKeyInput ? (
                  <div className="space-y-2">
                    <p className="text-xs text-indigo-700">
                      Enter your Gemini API key to enable live AI extraction.
                      Get a free key at{' '}
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                        className="underline font-medium">aistudio.google.com</a>
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="AIza..."
                        className="flex-1 px-3 py-2 text-xs border border-indigo-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          if (apiKeyInput.trim()) {
                            setApiKey(apiKeyInput.trim());
                            setShowApiKeyInput(false);
                          }
                        }}
                      >
                        Save Key
                      </Button>
                    </div>
                    <p className="text-[10px] text-indigo-600">
                      Without a key, the tool runs in Demo Mode with a mock response.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-indigo-700">
                      Gemini API key is configured. AI extraction is ready.
                    </p>
                    <button
                      className="text-xs text-indigo-500 underline"
                      onClick={() => setShowApiKeyInput(true)}
                    >
                      Change key
                    </button>
                  </div>
                )}
              </div>

              {/* Sample text buttons */}
              <div>
                <p className="text-xs font-semibold text-[#64748B] mb-2">Quick Load Sample Text:</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_TEXTS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => {
                        setRawText(s.text);
                        setRegulationHint(s.label);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-[#475569] font-medium"
                    >
                      <FileText className="w-3 h-3" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regulation hint */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Regulation Name / Hint <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={regulationHint}
                  onChange={(e) => setRegulationHint(e.target.value)}
                  placeholder="e.g. EU AI Act 2024, Basel IV, DORA, UK FCA SMCR..."
                  className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                />
              </div>

              {/* Text area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#374151]">
                    Raw Regulatory Text <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{rawText.length}/8000 chars</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <Upload className="w-3 h-3" /> Upload .txt
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value.substring(0, 8000))}
                  placeholder="Paste raw regulation text here (articles, sections, requirements)..."
                  className="w-full h-52 px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white resize-none font-mono leading-relaxed"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* ── STEP: PROCESSING ────────────────────────────────────────── */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 rounded-full border-4 border-indigo-200 animate-ping opacity-30" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17263C] mb-1">Gemini is Analysing…</h3>
                <p className="text-xs text-[#64748B] max-w-xs">
                  Extracting regulatory obligations, identifying requirement components,
                  and classifying by business function.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-xs text-slate-500 w-full max-w-sm">
                {[
                  '✓ Parsing regulatory structure',
                  '✓ Identifying distinct obligations',
                  '◎ Extracting atomic requirements…',
                  '○ Classifying by business function',
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP: REVIEW ────────────────────────────────────────────── */}
          {step === 'review' && result && (
            <div className="space-y-4">
              {/* Summary banner */}
              <div className="p-4 rounded-xl border bg-slate-50 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#17263C] mb-1">AI Extraction Summary</p>
                  <p className="text-xs text-[#475569] mb-2">{result.regulationSummary}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${confidenceColor[result.confidence]}`}>
                      {result.confidence} Confidence
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {result.obligations.length} obligation{result.obligations.length !== 1 ? 's' : ''} extracted
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <ul className="text-xs text-amber-700 space-y-0.5">
                    {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}

              {/* Obligation cards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-[#374151]">
                    Select obligations to add to the workbench:
                  </p>
                  <div className="flex gap-2">
                    <button className="text-[10px] text-indigo-600 underline"
                      onClick={() => setSelectedIndices(new Set(result.obligations.map((_, i) => i)))}>
                      Select All
                    </button>
                    <button className="text-[10px] text-slate-400 underline"
                      onClick={() => setSelectedIndices(new Set())}>
                      None
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {result.obligations.map((ob: ExtractedObligation, idx: number) => {
                    const isSelected = selectedIndices.has(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleToggleObligation(idx)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-[#E2E8F0] bg-white hover:border-indigo-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 flex-wrap mb-1">
                              <span className="text-sm font-bold text-[#17263C]">{ob.title}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium flex-shrink-0">
                                AI-Extracted
                              </span>
                            </div>
                            <p className="text-xs text-[#475569] mb-2">{ob.normalizedRequirement}</p>
                            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                              <span className="px-2 py-0.5 rounded bg-slate-100">{ob.regulationName}</span>
                              <span className="px-2 py-0.5 rounded bg-slate-100">{ob.jurisdiction}</span>
                              <span className="px-2 py-0.5 rounded bg-slate-100">{ob.businessFunction}</span>
                              <span className="px-2 py-0.5 rounded bg-slate-100">{ob.sourceSection}</span>
                            </div>
                            <div className="mt-2 pl-2 border-l-2 border-indigo-200">
                              <p className="text-[10px] font-semibold text-slate-400 mb-1">
                                {ob.requirementComponents.length} Requirement Components:
                              </p>
                              {ob.requirementComponents.map((rc, rci) => (
                                <p key={rci} className="text-[10px] text-[#475569] leading-relaxed">
                                  • {rc.statement}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP: DONE ──────────────────────────────────────────────── */}
          {step === 'done' && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17263C] mb-1">Obligations Added!</h3>
                <p className="text-xs text-[#64748B] max-w-xs">
                  {selectedIndices.size} AI-extracted obligation{selectedIndices.size !== 1 ? 's have' : ' has'}{' '}
                  been added to your workbench with status <strong>Under Review</strong>.
                  Assign them to controls using the matching engine.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 max-w-sm">
                <strong>Important:</strong> AI-extracted obligations are marked as "Unverified source".
                A compliance analyst must verify the source text before approval.
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E2E8F0] bg-slate-50 flex-shrink-0">
          <Button variant="secondary" onClick={handleClose}>
            {step === 'done' ? 'Close' : 'Cancel'}
          </Button>

          <div className="flex items-center gap-3">
            {step === 'review' && (
              <Button
                variant="secondary"
                onClick={() => setStep('input')}
              >
                ← Back
              </Button>
            )}

            {step === 'input' && (
              <Button
                variant="primary"
                onClick={handleExtract}
                disabled={isLoading || rawText.trim().length < 50}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Extract with Gemini AI
              </Button>
            )}

            {step === 'review' && (
              <Button
                variant="primary"
                onClick={handleAddSelected}
                disabled={selectedIndices.size === 0}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add {selectedIndices.size} Obligation{selectedIndices.size !== 1 ? 's' : ''} to Workbench
              </Button>
            )}

            {step === 'done' && (
              <Button variant="primary" onClick={() => {
                setStep('input');
                setRawText('');
                setResult(null);
                setSelectedIndices(new Set());
              }}>
                Extract More
              </Button>
            )}
          </div>
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
};
