import React, { useState } from 'react';
import { 
  RegulatoryObligation, 
  ControlMapping, 
  InternalControl 
} from '../../../types';
import { 
  FileText, 
  Target, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck2, 
  Activity, 
  AlertTriangle, 
  Wrench, 
  Eye, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface RegulatoryTraceabilityChainProps {
  obligation: RegulatoryObligation;
  mappings: ControlMapping[];
  controls: InternalControl[];
  onOpenReview?: (mapping: ControlMapping) => void;
}

export const RegulatoryTraceabilityChain: React.FC<RegulatoryTraceabilityChainProps> = ({
  obligation,
  mappings,
  controls,
  onOpenReview
}) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const obMappings = mappings.filter(m => m.obligationId === obligation.id && m.active !== false);
  const primaryMapping = obMappings.find(m => m.status === 'Approved') || obMappings[0];
  const primaryControl = primaryMapping ? controls.find(c => c.id === primaryMapping.controlId) : undefined;

  // Uncovered count
  const allComponents = obligation.requirementComponents;
  const coveredComponentIds = new Set<string>();
  if (primaryMapping) {
    primaryMapping.coverageAssessments.forEach(a => {
      if (a.status === 'Supported') {
        coveredComponentIds.add(a.requirementComponentId);
      }
    });
  }
  const uncoveredCount = allComponents.filter(c => !coveredComponentIds.has(c.id)).length;
  const hasGaps = uncoveredCount > 0 || obMappings.length === 0;

  const steps = [
    {
      id: 1,
      name: 'Regulation',
      icon: FileText,
      value: obligation.regulationName.split('(')[0].trim(),
      subtitle: `Sec: ${obligation.sourceSection} · p.${obligation.sourcePage}`,
      status: 'verified',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      badge: 'Source Ingested',
      detail: `Regulatory authority: ${obligation.jurisdiction}. Document: ${obligation.sourceDocumentId} (${obligation.sourceDocumentVersion}). Effective: ${obligation.effectiveDate}.`
    },
    {
      id: 2,
      name: 'Obligation',
      icon: Target,
      value: obligation.id,
      subtitle: `${allComponents.length} atomic components`,
      status: 'verified',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      badge: 'Extracted',
      detail: `Normalized requirement: "${obligation.normalizedRequirement.slice(0, 100)}..."`
    },
    {
      id: 3,
      name: 'Applicability',
      icon: CheckCircle2,
      value: obligation.applicabilityStatus,
      subtitle: obligation.businessFunction,
      status: obligation.applicabilityStatus === 'Applicable' ? 'verified' : 'warning',
      color: 'text-teal-700 bg-teal-50 border-teal-200',
      badge: 'Scoped',
      detail: `Assessed applicable for ${obligation.businessFunction} operating unit under Northstar Bank enterprise policy.`
    },
    {
      id: 4,
      name: 'Policies & Controls',
      icon: ShieldCheck,
      value: primaryControl ? primaryControl.id : 'Unmapped',
      subtitle: primaryControl ? `${primaryControl.name.slice(0, 20)}...` : 'No control linked',
      status: primaryControl ? (primaryMapping?.status === 'Approved' ? 'verified' : 'warning') : 'danger',
      color: primaryControl ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-700 bg-red-50 border-red-200',
      badge: primaryMapping ? primaryMapping.status : 'Gap',
      detail: primaryControl 
        ? `${primaryControl.name} (Design: ${primaryControl.designStatus}, Match: ${primaryMapping?.matchScore || 0}%). Owned by ${primaryControl.ownerRole}.` 
        : 'Zero candidate controls mapped. Critical compliance gap requiring remediation.'
    },
    {
      id: 5,
      name: 'Evidence',
      icon: FileCheck2,
      value: primaryControl ? primaryControl.evidenceStatus : 'No Evidence',
      subtitle: primaryControl ? primaryControl.sourceDocumentId : 'Pending mapping',
      status: primaryControl?.evidenceStatus === 'Verified' ? 'verified' : 'warning',
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      badge: primaryControl?.evidenceStatus || 'Missing',
      detail: primaryControl 
        ? `Evidence artifact reference: ${primaryControl.sourceDocumentId} (${primaryControl.sourceDocumentVersion}), ${primaryControl.sourceSection}. Excerpt verified.`
        : 'Evidence cannot be validated until an internal control is linked.'
    },
    {
      id: 6,
      name: 'Testing Cadence',
      icon: Activity,
      value: primaryControl ? primaryControl.frequency : 'Ad-hoc',
      subtitle: 'Periodic verification',
      status: 'verified',
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      badge: primaryControl?.frequency || 'Unscheduled',
      detail: primaryControl 
        ? `Operational verification schedule: ${primaryControl.frequency}. Supervised by ${primaryControl.ownerRole}.`
        : 'No testing cadence defined for unmapped obligation.'
    },
    {
      id: 7,
      name: 'Gap Analysis',
      icon: AlertTriangle,
      value: hasGaps ? `${uncoveredCount} Uncovered` : 'No Gaps',
      subtitle: hasGaps ? 'Partial coverage' : '100% Covered',
      status: hasGaps ? 'warning' : 'verified',
      color: hasGaps ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badge: hasGaps ? 'Deficiency' : 'Compliant',
      detail: hasGaps 
        ? `Identified ${uncoveredCount} requirement components lacking validated control coverage. Reviewer acknowledgment required before approval.`
        : 'All atomic requirement components are mapped to verified operational controls.'
    },
    {
      id: 8,
      name: 'Remediation',
      icon: Wrench,
      value: primaryMapping?.matchRationale.suggestedReviewerAction.slice(0, 18) + '...' || 'Draft Policy Request',
      subtitle: hasGaps ? 'Action recommended' : 'Controls in place',
      status: hasGaps ? 'warning' : 'verified',
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      badge: 'Actionable',
      detail: primaryMapping 
        ? primaryMapping.matchRationale.suggestedReviewerAction 
        : `Initiate a control drafting request to Business Unit (${obligation.businessFunction}) to author an operational policy addressing the ${obligation.requirementComponents.length} defined atomic requirement components.`
    },
    {
      id: 9,
      name: 'Monitoring',
      icon: Eye,
      value: 'Continuous SIEM / Audit',
      subtitle: 'Drift detection active',
      status: 'verified',
      color: 'text-slate-700 bg-slate-50 border-slate-200',
      badge: 'Active Watch',
      detail: 'Registered in RegulaTrace audit ledger. Changes in regulatory source or control degradation automatically trigger re-scoring.'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm space-y-3">
      {/* Title & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0F766E] flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#17263C] uppercase tracking-wider flex items-center gap-1.5">
              Regulatory Traceability Chain
              <span className="text-[10px] lowercase font-normal px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
                end-to-end lineage
              </span>
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Continuous lifecycle mapping from supervisory mandate to ongoing audit monitoring.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          9-Stage Chain: {primaryMapping?.status || 'Unmapped'}
        </span>
      </div>

      {/* Horizontal Scrollable Flow Pipeline */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center min-w-[850px] justify-between gap-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setActiveStep(prev => prev === step.id ? null : step.id)}
                  className={`flex-1 p-2 rounded-lg border text-left transition-all relative group ${step.color} ${
                    isSelected ? 'ring-2 ring-[#0F766E] shadow-sm scale-[1.02]' : 'hover:shadow-xs'
                  }`}
                  title={`Click to inspect ${step.name} stage`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                      {step.id}. {step.name}
                    </span>
                    <Icon className="w-3 h-3 opacity-80" />
                  </div>
                  <div className="font-bold text-xs truncate leading-tight" title={step.value}>
                    {step.value}
                  </div>
                  <div className="text-[10px] opacity-75 truncate mt-0.5" title={step.subtitle}>
                    {step.subtitle}
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Expandable Step Inspector */}
      {activeStep !== null && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-[#17263C] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#0F766E]" />
              Stage {activeStep}: {steps.find(s => s.id === activeStep)?.name} Details
            </span>
            <button
              onClick={() => setActiveStep(null)}
              className="text-[11px] text-[#64748B] hover:text-[#17263C] hover:underline"
            >
              Dismiss
            </button>
          </div>
          <p className="text-[#64748B] text-[11px] leading-relaxed">
            {steps.find(s => s.id === activeStep)?.detail}
          </p>
        </div>
      )}
    </div>
  );
};
