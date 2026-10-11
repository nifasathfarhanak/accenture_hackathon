import React, { useState } from 'react';
import { 
  RegulatoryObligation, 
  ControlMapping, 
  InternalControl 
} from '../../../types';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { 
  Wrench, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  Send,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { appendAuditEvent } from '../../../services/storageService';

interface RemediationAdvisorProps {
  obligation: RegulatoryObligation;
  mappings: ControlMapping[];
  controls: InternalControl[];
  currentAnalyst: string;
  onRefreshData?: () => void;
}

export const RemediationAdvisor: React.FC<RemediationAdvisorProps> = ({
  obligation,
  mappings,
  controls,
  currentAnalyst,
  onRefreshData
}) => {
  const { addToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActionSubmitted, setIsActionSubmitted] = useState(false);

  const obMappings = mappings.filter(m => m.obligationId === obligation.id && m.active !== false);
  const approvedMappings = obMappings.filter(m => m.status === 'Approved');

  // Identify uncovered components
  const allComponents = obligation.requirementComponents;
  const coveredComponentIds = new Set<string>();
  approvedMappings.forEach(m => {
    m.coverageAssessments.forEach(a => {
      if (a.status === 'Supported') {
        coveredComponentIds.add(a.requirementComponentId);
      }
    });
  });

  const uncoveredComponents = allComponents.filter(c => !coveredComponentIds.has(c.id));
  const hasGaps = uncoveredComponents.length > 0 || obMappings.length === 0;

  // Derive risk priority based on business function and severity
  const isHighRiskDomain = 
    obligation.businessFunction.includes('AML') || 
    obligation.businessFunction.includes('Security') || 
    obligation.businessFunction.includes('Payments');

  const riskTier = obMappings.length === 0 
    ? 'CRITICAL (Tier 1)' 
    : isHighRiskDomain 
    ? 'HIGH (Tier 2)' 
    : 'MEDIUM (Tier 3)';

  const riskColor = obMappings.length === 0
    ? 'bg-red-50 text-red-800 border-red-200'
    : isHighRiskDomain
    ? 'bg-amber-50 text-amber-800 border-amber-200'
    : 'bg-blue-50 text-blue-800 border-blue-200';

  const slaDays = obMappings.length === 0 ? '14 Days' : '30 Days';

  const handleCreateRemediationTicket = () => {
    try {
      appendAuditEvent({
        entityType: 'Obligation',
        entityId: obligation.id,
        action: 'INFORMATION_REQUESTED',
        actorId: 'USR-REMEDIATE',
        actorDisplayName: currentAnalyst,
        reason: `Remediation action ticket generated: ${uncoveredComponents.length} uncovered components assigned to ${obligation.businessFunction} owner with SLA ${slaDays}.`,
        relatedRecordIds: uncoveredComponents.map(c => c.id)
      });

      setIsActionSubmitted(true);
      if (onRefreshData) onRefreshData();

      addToast({
        type: 'success',
        title: 'Remediation Ticket Dispatched',
        description: `Autonomous remediation action recorded for ${obligation.id}. Assigned to ${obligation.businessFunction} with ${slaDays} resolution SLA.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Remediation Dispatch Failed',
        description: err instanceof Error ? err.message : 'Failed to record remediation'
      });
    }
  };

  if (!hasGaps) {
    return (
      <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-900">
              Zero Remediation Required
            </div>
            <div className="text-[11px] text-emerald-700">
              All {allComponents.length} atomic requirement components have verified internal control coverage.
            </div>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
          Compliant
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-amber-200/90 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 bg-gradient-to-r from-amber-50/60 to-orange-50/30 border-b border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#17263C] flex items-center gap-2">
              Autonomous Remediation Advisory Engine
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${riskColor}`}>
                {riskTier}
              </span>
            </div>
            <div className="text-[11px] text-[#64748B]">
              {uncoveredComponents.length > 0 
                ? `${uncoveredComponents.length} requirement components lack operational control coverage.`
                : 'Obligation has zero mapped internal controls.'
              }
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
        >
          {isExpanded ? 'Collapse Plan' : 'View Action Plan'}
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Remediation Body */}
      {isExpanded && (
        <div className="p-5 space-y-4 text-xs">
          {/* Key Gap Summary */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Identified Compliance Deficiencies
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[#64748B] text-[11px]">
              {uncoveredComponents.map(c => (
                <li key={c.id}>
                  <strong className="text-slate-700">{c.id}:</strong> {c.statement}
                </li>
              ))}
              {uncoveredComponents.length === 0 && (
                <li>No candidate control exists in repository matching requirement criteria.</li>
              )}
            </ul>
          </div>

          {/* Action Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Recommended Policy Action
              </div>
              <div className="font-bold text-slate-800 text-xs">
                {obMappings.length === 0 
                  ? 'Author New Operational Policy' 
                  : 'Amend Existing Control Specification'}
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Formalize control mechanics addressing identified missing clauses.
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Business Owner
              </div>
              <div className="font-bold text-slate-800 text-xs">
                {obligation.businessFunction} Lead
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Mandatory operational sign-off required prior to next audit cycle.
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Remediation Target SLA
              </div>
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-amber-700">
                <Clock className="w-3.5 h-3.5" />
                {slaDays}
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                Standard enterprise risk escalation window.
              </div>
            </div>
          </div>

          {/* Dispatch action */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="text-[11px] text-[#64748B]">
              Dispatching logs a traceable escalation ticket into the immutable audit history.
            </div>

            <Button
              variant="primary"
              size="sm"
              disabled={isActionSubmitted}
              onClick={handleCreateRemediationTicket}
              className="text-xs bg-amber-700 hover:bg-amber-800 text-white"
            >
              {isActionSubmitted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-white" />
                  Ticket Dispatched
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Dispatch Remediation Action
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
