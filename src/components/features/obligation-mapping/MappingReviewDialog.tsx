import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '../../ui/Dialog';
import { 
  RegulatoryObligation, 
  InternalControl, 
  ControlMapping, 
  CoverageAssessment, 
  RequirementCoverageStatus 
} from '../../../types';
import { Button } from '../../ui/Button';
import { 
  MappingStatusBadge, 
  CoverageStatusBadge 
} from '../../ui/Badge';
import { Checkbox } from '../../ui/Checkbox';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  FileEdit, 
  XCircle, 
  Info,
  HelpCircle
} from 'lucide-react';

interface MappingReviewDialogProps {
  obligation: RegulatoryObligation | null;
  control: InternalControl | null;
  mapping: ControlMapping | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (payload: { reviewerRationale: string; reviewerNotes?: string; acknowledgeGaps: boolean }) => Promise<void>;
  onSaveDraft: (assessments: CoverageAssessment[], notes: string) => Promise<void>;
  onRequestReject: () => void;
  onRequestMoreInfo: () => void;
}

export const MappingReviewDialog: React.FC<MappingReviewDialogProps> = ({
  obligation,
  control,
  mapping,
  isOpen,
  onClose,
  onApprove,
  onSaveDraft,
  onRequestReject,
  onRequestMoreInfo
}) => {
  if (!obligation || !control || !mapping) return null;

  // Local state for editable coverage assessments
  const [assessments, setAssessments] = useState<CoverageAssessment[]>([]);
  const [reviewerRationale, setReviewerRationale] = useState<string>('');
  const [reviewerNotes, setReviewerNotes] = useState<string>('');
  const [acknowledgeGaps, setAcknowledgeGaps] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Sync state whenever mapping changes or dialog opens
  useEffect(() => {
    if (mapping) {
      setAssessments(JSON.parse(JSON.stringify(mapping.coverageAssessments)));
      setReviewerRationale(mapping.reviewerRationale || '');
      setReviewerNotes(mapping.reviewerNotes || '');
      setAcknowledgeGaps(false);
      setValidationError(null);
      setHasUnsavedChanges(false);
    }
  }, [mapping, isOpen]);

  // Check if any requirement components are uncovered, partially supported, or unknown
  const hasGaps = assessments.some(
    a => a.status === 'Partially supported' || a.status === 'Not supported' || a.status === 'Unknown'
  );

  const handleCoverageChange = (rcId: string, newStatus: RequirementCoverageStatus) => {
    setAssessments(prev => prev.map(item => {
      if (item.requirementComponentId === rcId) {
        return {
          ...item,
          status: newStatus,
          analystReviewed: true,
        };
      }
      return item;
    }));
    setHasUnsavedChanges(true);
  };

  const handleComponentNoteChange = (rcId: string, note: string) => {
    setAssessments(prev => prev.map(item => {
      if (item.requirementComponentId === rcId) {
        return {
          ...item,
          reviewerNote: note,
          analystReviewed: true,
        };
      }
      return item;
    }));
    setHasUnsavedChanges(true);
  };

  const handleApproveClick = async () => {
    setValidationError(null);

    // Validation: Reviewer rationale is mandatory for approval
    if (!reviewerRationale.trim() || reviewerRationale.trim().length < 5) {
      setValidationError('Reviewer rationale is mandatory for approval (must be at least 5 substantive characters).');
      return;
    }

    // Validation: Uncovered or unknown components must be explicitly acknowledged
    if (hasGaps && !acknowledgeGaps) {
      setValidationError('You must explicitly acknowledge uncovered, partially supported, or unknown requirement components before approving this mapping.');
      return;
    }

    setIsSaving(true);
    try {
      await onApprove({
        reviewerRationale: reviewerRationale.trim(),
        reviewerNotes: reviewerNotes.trim() || undefined,
        acknowledgeGaps
      });
      onClose();
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Approval failed. Please check inputs.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDraftClick = async () => {
    setIsSaving(true);
    setValidationError(null);
    try {
      await onSaveDraft(assessments, reviewerNotes.trim());
      onClose();
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          if (hasUnsavedChanges) {
            if (window.confirm("You have unsaved changes in this review dialog. Are you sure you want to discard them?")) {
              onClose();
            }
          } else {
            onClose();
          }
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        {/* Top Section */}
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F766E] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                {obligation.id} &harr; {control.id}
              </span>
              <MappingStatusBadge status={mapping.status} />
              {mapping.version > 1 && (
                <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  Version {mapping.version}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B] font-medium">Algorithmic Fit:</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-[#0F766E]">
                {mapping.matchScore}/100
              </span>
            </div>
          </div>

          <DialogTitle className="text-lg font-bold text-[#17263C]">
            Review Obligation-to-Control Mapping
          </DialogTitle>
          <DialogDescription className="text-xs text-[#64748B]">
            Perform atomic component coverage evaluation, inspect supporting evidence, and record verifiable analyst compliance determination.
          </DialogDescription>
        </DialogHeader>

        {/* Middle Section: Overview Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          {/* Obligation Summary Box */}
          <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold text-[#17263C]">
              <span className="flex items-center gap-1.5 text-[#0F766E]">
                <BookOpen className="w-4 h-4" />
                Regulatory Obligation
              </span>
              <span className="text-[11px] text-[#64748B] font-mono">{obligation.id}</span>
            </div>
            <div className="font-medium text-[#17263C]">{obligation.title}</div>
            <div className="text-[#64748B] leading-relaxed line-clamp-3">
              "{obligation.normalizedRequirement}"
            </div>
            <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200 flex justify-between">
              <span>{obligation.regulationName}</span>
              <span className="font-semibold text-slate-700">{obligation.sourceSection}</span>
            </div>
          </div>

          {/* Control Summary Box */}
          <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold text-[#17263C]">
              <span className="flex items-center gap-1.5 text-blue-700">
                <ShieldCheck className="w-4 h-4" />
                Candidate Internal Control
              </span>
              <span className="text-[11px] text-[#64748B] font-mono">{control.id}</span>
            </div>
            <div className="font-medium text-[#17263C]">{control.name}</div>
            <div className="text-[#64748B] leading-relaxed line-clamp-3">
              {control.description}
            </div>
            <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200 flex justify-between">
              <span>Owner: {control.ownerRole}</span>
              <span className="font-semibold text-slate-700">{control.frequency}</span>
            </div>
          </div>
        </div>

        {/* AI & Rule-based Match Rationale Panel */}
        <div className="p-3.5 bg-teal-50/60 border border-teal-200 rounded-xl text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#0F766E]">
              <Sparkles className="w-4 h-4" />
              Candidate Match Rationale & Gap Analysis
            </div>
            <span className="text-[10px] text-teal-800 bg-teal-100 font-semibold px-2 py-0.5 rounded">
              {mapping.matchProvider}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
            <div>
              <span className="font-semibold text-emerald-800">Positive Coverage:</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">
                {mapping.matchRationale.positiveCoverage}
              </p>
            </div>
            <div>
              <span className="font-semibold text-amber-800">Identified Limitations & Gaps:</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">
                {mapping.matchRationale.potentialGaps}
              </p>
            </div>
          </div>

          <div className="pt-1 border-t border-teal-200/60 text-[11px]">
            <span className="font-semibold text-[#0F766E]">Reviewer Recommendation: </span>
            <span className="text-slate-700">{mapping.matchRationale.suggestedReviewerAction}</span>
          </div>
        </div>

        {/* Section D: Atomic Requirement Component Coverage Table */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-[#17263C] flex items-center gap-1.5">
                <FileEdit className="w-4 h-4 text-[#0F766E]" />
                Requirement Component Coverage Breakdown
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Assess evidence support for each atomic requirement component. Distinguish explicitly absent vs unknown evidence.
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {assessments.filter(a => a.status === 'Supported').length} of {assessments.length} Supported
            </span>
          </div>

          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[#17263C] font-semibold border-b border-[#E2E8F0]">
                    <th className="p-3 w-1/4">Requirement Component</th>
                    <th className="p-3 w-1/4">Control Evidence / Source Excerpt</th>
                    <th className="p-3 w-1/6">Coverage Status</th>
                    <th className="p-3 w-1/3">Analyst Assessment & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {obligation.requirementComponents.map((rc) => {
                    const assessment = assessments.find(a => a.requirementComponentId === rc.id) || {
                      requirementComponentId: rc.id,
                      status: 'Unknown' as RequirementCoverageStatus,
                      supportingExcerpt: '',
                      rationale: '',
                      analystReviewed: false,
                      reviewerNote: ''
                    };

                    return (
                      <tr key={rc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 align-top">
                          <div className="font-bold text-[10px] text-[#0F766E] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 inline-block mb-1">
                            {rc.id}
                          </div>
                          <div className="font-medium text-[#17263C] leading-snug">
                            {rc.statement}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 italic">
                            Section: {rc.sourceSection}
                          </div>
                        </td>

                        <td className="p-3 align-top text-[#64748B]">
                          <div className="text-[11px] italic bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed">
                            {assessment.supportingExcerpt || rc.sourceExcerpt || "No specific control excerpt mapped."}
                          </div>
                        </td>

                        <td className="p-3 align-top">
                          <select
                            value={assessment.status}
                            onChange={(e) => handleCoverageChange(rc.id, e.target.value as RequirementCoverageStatus)}
                            className="w-full p-1.5 bg-white border border-[#CBD5E1] rounded text-xs font-medium text-[#17263C] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                            aria-label={`Coverage status for ${rc.id}`}
                          >
                            <option value="Supported">Supported</option>
                            <option value="Partially supported">Partially Supported</option>
                            <option value="Not supported">Not Supported</option>
                            <option value="Unknown">Unknown</option>
                          </select>
                          <div className="mt-1">
                            <CoverageStatusBadge status={assessment.status} />
                          </div>
                        </td>

                        <td className="p-3 align-top">
                          <textarea
                            rows={2}
                            placeholder="Add compliance rationale or document why component is supported/unsupported..."
                            value={assessment.reviewerNote || ''}
                            onChange={(e) => handleComponentNoteChange(rc.id, e.target.value)}
                            className="w-full p-2 text-xs border border-slate-300 rounded text-[#17263C] focus:outline-none focus:ring-1 focus:ring-[#0F766E] placeholder:text-slate-400"
                            aria-label={`Analyst note for ${rc.id}`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Warning if Gaps Exist */}
        {hasGaps && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-800">
                Uncovered or Unknown Requirement Components Detected
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                This candidate control does not provide complete 100% verified coverage. One or more components are evaluated as partially supported, not supported, or unknown. Approving will preserve these gaps in the register, and requires explicit acknowledgment below.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Section: Rationale & Governance Inputs */}
        <div className="my-2 space-y-3 pt-2 border-t border-[#E2E8F0]">
          <div>
            <label htmlFor="reviewer-rationale" className="block text-xs font-bold text-[#17263C] mb-1">
              Reviewer Approval Rationale <span className="text-red-500">*</span>
              <span className="font-normal text-[#64748B] ml-1">(Mandatory for approval decisions, min 5 chars)</span>
            </label>
            <textarea
              id="reviewer-rationale"
              rows={2}
              placeholder="State the formal business, audit, or technical justification for accepting or approving this mapping..."
              value={reviewerRationale}
              onChange={(e) => {
                setReviewerRationale(e.target.value);
                setHasUnsavedChanges(true);
                if (validationError) setValidationError(null);
              }}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>

          <div>
            <label htmlFor="reviewer-notes" className="block text-xs font-semibold text-[#17263C] mb-1">
              Reviewer Working Notes <span className="text-slate-400 font-normal">(Optional internal comments)</span>
            </label>
            <input
              id="reviewer-notes"
              type="text"
              placeholder="e.g. Discussed with Payment Ops; verify testing frequency in Q3."
              value={reviewerNotes}
              onChange={(e) => {
                setReviewerNotes(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg text-[#17263C] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            />
          </div>

          {/* Mandatory Gaps Acknowledgment Checkbox */}
          {hasGaps && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <Checkbox
                id="ack-gaps"
                checked={acknowledgeGaps}
                onCheckedChange={(checked) => {
                  setAcknowledgeGaps(Boolean(checked));
                  if (validationError) setValidationError(null);
                }}
              />
              <label 
                htmlFor="ack-gaps"
                className="text-xs text-[#17263C] font-medium leading-tight cursor-pointer"
              >
                I acknowledge that this mapping contains uncovered or unknown requirement components. I confirm that approval records acceptance of this specific relationship and does not certify complete institutional compliance.
              </label>
            </div>
          )}

          {/* Error Message Display */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex items-center gap-2 mr-auto">
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={isSaving}
              onClick={() => {
                onRequestReject();
              }}
            >
              Reject Mapping
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={() => {
                onRequestMoreInfo();
              }}
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Request More Info
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={handleDraftClick}
            >
              Save Draft
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              onClick={handleApproveClick}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Approve Mapping
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
