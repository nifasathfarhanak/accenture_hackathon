import React from 'react';
import { 
  RegulatoryObligation, 
  ControlMapping, 
  OverallCoverageStatus 
} from '../../../types';
import { 
  ApplicabilityBadge, 
  OverallCoverageBadge, 
  Badge 
} from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { 
  FileText, 
  ShieldCheck, 
  ExternalLink, 
  AlertTriangle, 
  Calendar, 
  Globe, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Layers 
} from 'lucide-react';
import { computeOverallCoverage } from '../../../services/storageService';

interface ObligationDetailsProps {
  obligation: RegulatoryObligation;
  mappings: ControlMapping[];
  onViewSource: () => void;
}

export const ObligationDetails: React.FC<ObligationDetailsProps> = ({
  obligation,
  mappings,
  onViewSource
}) => {
  const obMappings = mappings.filter(m => m.obligationId === obligation.id && m.active !== false);
  const overallCoverage = computeOverallCoverage(obligation, obMappings);
  const approvedMappings = obMappings.filter(m => m.status === 'Approved');
  const proposedMappings = obMappings.filter(m => m.status === 'Suggested' || m.status === 'Pending Review');

  // Count uncovered components across requirement components
  const allComponents = obligation.requirementComponents;
  const isReviewed = obMappings.some(m => m.status === 'Approved');
  const isProvisional = !isReviewed && obMappings.length > 0;

  // Uncovered count: components not marked as Supported in ANY approved mapping
  const coveredComponentIds = new Set<string>();
  approvedMappings.forEach(m => {
    m.coverageAssessments.forEach(a => {
      if (a.status === 'Supported') {
        coveredComponentIds.add(a.requirementComponentId);
      }
    });
  });
  const uncoveredCount = allComponents.filter(c => !coveredComponentIds.has(c.id)).length;

  return (
    <div className="space-y-4">
      {/* SECTION A: OBLIGATION DETAILS */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-sm text-[#0F766E] bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
              {obligation.id}
            </span>
            <ApplicabilityBadge status={obligation.applicabilityStatus} />
            <Badge variant="warning">
              {obligation.sourceVerificationStatus}
            </Badge>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewSource}
            className="text-xs"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-[#0F766E]" />
            View Source Excerpt
          </Button>
        </div>

        {/* Title and Normalized Requirement */}
        <div className="mt-3.5 space-y-2">
          <h1 className="text-lg font-bold text-[#17263C] tracking-tight">
            {obligation.title}
          </h1>

          <div className="text-xs text-[#17263C] bg-slate-50 p-3.5 rounded-lg border border-slate-200 leading-relaxed font-normal">
            <span className="font-semibold text-slate-700 block mb-1">
              Normalized Requirement Statement:
            </span>
            "{obligation.normalizedRequirement}"
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-slate-100">
          <div>
            <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-medium">
              <Globe className="w-3 h-3 text-slate-400" />
              Regulation
            </span>
            <span className="font-semibold text-[#17263C] truncate block mt-0.5" title={obligation.regulationName}>
              {obligation.regulationName}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-medium">
              <Layers className="w-3 h-3 text-slate-400" />
              Source Section
            </span>
            <span className="font-semibold text-[#17263C] block mt-0.5">
              {obligation.sourceSection} (p. {obligation.sourcePage})
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-medium">
              <Briefcase className="w-3 h-3 text-slate-400" />
              Business Function
            </span>
            <span className="font-semibold text-[#17263C] block mt-0.5">
              {obligation.businessFunction}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3 text-slate-400" />
              Effective Date
            </span>
            <span className="font-semibold text-[#17263C] block mt-0.5">
              {obligation.effectiveDate}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION B: COVERAGE SUMMARY */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#17263C] uppercase tracking-wider">
              Control Coverage Assessment
            </span>
            <OverallCoverageBadge status={overallCoverage} isProvisional={isProvisional} />
          </div>

          <div className="text-xs text-[#64748B]">
            Status: <span className="font-semibold text-slate-800">{isReviewed ? 'Analyst Reviewed' : 'Awaiting Final Review'}</span>
          </div>
        </div>

        {/* 4 Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div className="text-[11px] text-[#64748B]">Candidate Controls</div>
            <div className="font-bold text-base text-[#17263C] mt-0.5">
              {obMappings.length}
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-lg text-xs">
            <div className="text-[11px] text-emerald-800">Approved Controls</div>
            <div className="font-bold text-base text-emerald-700 mt-0.5">
              {approvedMappings.length}
            </div>
          </div>

          <div className="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-lg text-xs">
            <div className="text-[11px] text-amber-800">Uncovered Components</div>
            <div className="font-bold text-base text-amber-700 mt-0.5">
              {uncoveredCount} of {allComponents.length}
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div className="text-[11px] text-[#64748B]">Atomic Requirements</div>
            <div className="font-bold text-base text-[#17263C] mt-0.5">
              {allComponents.length} components
            </div>
          </div>
        </div>

        {/* Mandatory Decision-Support Disclaimer Banner */}
        <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-[#64748B] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-semibold text-slate-700">Decision-Support System:</span> Approval of a mapping records analyst validation of policy alignment and does not constitute a legal or supervisory guarantee of compliance.
          </div>
        </div>
      </div>
    </div>
  );
};
