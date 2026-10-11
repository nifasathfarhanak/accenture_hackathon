import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  RegulatoryObligation, 
  InternalControl, 
  ControlMapping, 
  AuditEvent, 
  FilterState, 
  CoverageAssessment 
} from '../../../types';
import { 
  loadStorageData, 
  resetStorageData, 
  approveMapping, 
  rejectMapping, 
  requestInformation, 
  saveDraft, 
  updateCoverage, 
  computeSummaryMetrics, 
  exportRegisterCSV,
  saveObligations
} from '../../../services/storageService';
import { SummaryMetricsBar } from './SummaryMetrics';
import { ObligationExplorer } from './ObligationExplorer';
import { ObligationDetails } from './ObligationDetails';
import { CandidateControlList } from './CandidateControlList';
import { CoverageTable } from './CoverageTable';
import { MappingActivity } from './MappingActivity';
import { ViewSourceDialog } from './ViewSourceDialog';
import { MappingReviewDialog } from './MappingReviewDialog';
import { RejectMappingDialog } from './RejectMappingDialog';
import { RequestInfoDialog } from './RequestInfoDialog';
import { ResetDemoDataDialog } from './ResetDemoDataDialog';
import { SettingsDialog } from './SettingsDialog';
import { RegulatoryTraceabilityChain } from './RegulatoryTraceabilityChain';
import { RemediationAdvisor } from './RemediationAdvisor';
import { SimulationModal } from './SimulationModal';
import { AIIngestionModal } from './AIIngestionModal';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { 
  Download, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FlaskConical,
  Brain
} from 'lucide-react';

interface MappingWorkbenchProps {
  currentAnalyst: string;
  globalSearch: string;
}

export const MappingWorkbench: React.FC<MappingWorkbenchProps> = ({
  currentAnalyst,
  globalSearch
}) => {
  const { addToast } = useToast();

  // Primary data states loaded from storage
  const [obligations, setObligations] = useState<RegulatoryObligation[]>(() => loadStorageData().obligations);
  const [controls, setControls] = useState<InternalControl[]>(() => loadStorageData().controls);
  const [mappings, setMappings] = useState<ControlMapping[]>(() => loadStorageData().mappings);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => loadStorageData().auditEvents);
  const [selectedObligation, setSelectedObligation] = useState<RegulatoryObligation | null>(() => {
    const d = loadStorageData();
    return d.obligations[0] || null;
  });

  // Active filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    regulation: '',
    applicability: '',
    mappingStatus: '',
    reviewStatus: '',
    businessFunction: '',
  });

  const [activeMetricFilter, setActiveMetricFilter] = useState<'all' | 'pending' | 'approved' | 'unmapped' | undefined>(undefined);

  // Sync global search into filters
  useEffect(() => {
    if (globalSearch !== undefined) {
      setFilters(prev => ({ ...prev, searchQuery: globalSearch }));
    }
  }, [globalSearch]);

  // Dialog states
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isRequestInfoDialogOpen, setIsRequestInfoDialogOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isAIIngestionOpen, setIsAIIngestionOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState('baseline');

  // Active target mapping for review dialogs
  const [activeReviewMapping, setActiveReviewMapping] = useState<ControlMapping | null>(null);
  const [activeReviewControl, setActiveReviewControl] = useState<InternalControl | null>(null);

  // Apply What-If simulation scenario
  const handleApplyScenario = (scenarioId: string) => {
    setActiveScenario(scenarioId);
    const base = loadStorageData();
    if (scenarioId === 'baseline') {
      setObligations(base.obligations);
      setControls(base.controls);
      setMappings(base.mappings);
    } else if (scenarioId === 'amendment') {
      setControls(prev => prev.map(c => c.id === 'CTRL-010' ? { ...c, designStatus: 'Deficient' as const } : c));
      setMappings(prev => prev.map(m => m.controlId === 'CTRL-010' ? {
        ...m,
        matchScore: 42,
        matchRationale: {
          ...m.matchRationale,
          potentialGaps: 'CRITICAL REGULATORY AMENDMENT: Incident escalation SLA fails new 90-minute supervisory mandate.'
        }
      } : m));
    } else if (scenarioId === 'control_failure') {
      setControls(prev => prev.map(c => c.id === 'CTRL-007' ? { ...c, evidenceStatus: 'Missing Evidence' as const, designStatus: 'Deficient' as const } : c));
      setMappings(prev => prev.map(m => m.controlId === 'CTRL-007' ? {
        ...m,
        matchScore: 35,
        status: 'Suggested' as const
      } : m));
    }
  };

  // Refresh data from persistent storage
  const refreshData = useCallback(() => {
    const data = loadStorageData();
    setObligations(data.obligations);
    setControls(data.controls);
    setMappings(data.mappings);
    setAuditEvents(data.auditEvents);

    // Keep selected obligation up to date
    setSelectedObligation(prev => {
      if (!prev) return data.obligations[0] || null;
      const updated = data.obligations.find(o => o.id === prev.id);
      return updated || data.obligations[0] || null;
    });
  }, []);

  // Live recalculated metrics
  const metrics = useMemo(() => {
    return computeSummaryMetrics();
  }, [obligations, mappings]);

  // Handle metric card filter clicks
  const handleSelectMetricFilter = (metricType: 'all' | 'pending' | 'approved' | 'unmapped') => {
    setActiveMetricFilter(metricType);
    if (metricType === 'all') {
      setFilters(prev => ({ ...prev, mappingStatus: '', reviewStatus: '' }));
    } else if (metricType === 'pending') {
      setFilters(prev => ({ ...prev, reviewStatus: 'Pending Review', mappingStatus: '' }));
    } else if (metricType === 'approved') {
      setFilters(prev => ({ ...prev, mappingStatus: 'Approved', reviewStatus: '' }));
    } else if (metricType === 'unmapped') {
      setFilters(prev => ({ ...prev, mappingStatus: 'Unmapped', reviewStatus: '' }));
    }
  };

  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
    setActiveMetricFilter(undefined);
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      regulation: '',
      applicability: '',
      mappingStatus: '',
      reviewStatus: '',
      businessFunction: '',
    });
    setActiveMetricFilter(undefined);
  };

  // CSV Export Action
  const handleExportRegister = () => {
    try {
      const csvString = exportRegisterCSV();
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `regulatrace_mapping_register_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        type: 'success',
        title: 'Mapping Register Exported',
        description: 'Successfully downloaded RFC-4180 compliant CSV export containing active obligations and controls.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Export Failed',
        description: err instanceof Error ? err.message : 'Failed to generate register export'
      });
    }
  };

  // Reset Demo Data Action
  const handleConfirmReset = () => {
    try {
      resetStorageData();
      refreshData();
      addToast({
        type: 'info',
        title: 'Demo Dataset Restored',
        description: 'Deterministic seed obligations, candidate controls, and historical events restored to pristine state.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Reset Failed',
        description: err instanceof Error ? err.message : 'Unable to reset demo dataset'
      });
    }
  };

  // Open Review Dialog handler
  const handleOpenReview = (mapping: ControlMapping, control?: InternalControl) => {
    setActiveReviewMapping(mapping);
    setActiveReviewControl(control || controls.find(c => c.id === mapping.controlId) || null);
    setIsReviewDialogOpen(true);
  };

  // Approve Mapping handler
  const handleApproveMapping = async (payload: { reviewerRationale: string; reviewerNotes?: string; acknowledgeGaps: boolean }) => {
    if (!activeReviewMapping) return;
    try {
      approveMapping(activeReviewMapping.id, {
        ...payload,
        analystName: currentAnalyst
      });
      refreshData();
      addToast({
        type: 'success',
        title: 'Mapping Approved Successfully',
        description: `Control ${activeReviewMapping.controlId} is now recorded as an approved mapping for obligation ${activeReviewMapping.obligationId}.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Approval Failed',
        description: err instanceof Error ? err.message : 'An error occurred during approval.'
      });
      throw err;
    }
  };

  // Reject Mapping handler
  const handleConfirmReject = async (reason: string, notes?: string) => {
    if (!activeReviewMapping) return;
    try {
      rejectMapping(activeReviewMapping.id, {
        rejectionReason: reason,
        reviewerNotes: notes,
        analystName: currentAnalyst
      });
      refreshData();
      addToast({
        type: 'warning',
        title: 'Mapping Rejected',
        description: `Mapping ${activeReviewMapping.id} marked as Rejected and excluded from active coverage.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Rejection Failed',
        description: err instanceof Error ? err.message : 'An error occurred during rejection.'
      });
      throw err;
    }
  };

  // Request Information handler
  const handleConfirmRequestInfo = async (payload: {
    informationRequired: string;
    reason: string;
    requestedRole: string;
    dueDate?: string;
  }) => {
    if (!activeReviewMapping) return;
    try {
      requestInformation(activeReviewMapping.id, {
        ...payload,
        analystName: currentAnalyst
      });
      refreshData();
      addToast({
        type: 'info',
        title: 'Clarification Request Recorded',
        description: `Mapping status set to "Needs Information". Inquiry routed to ${payload.requestedRole}.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Request Submission Failed',
        description: err instanceof Error ? err.message : 'An error occurred.'
      });
      throw err;
    }
  };

  // AI Ingestion: add Gemini-extracted obligations to storage and state
  const handleAddAIObligations = (newObligations: RegulatoryObligation[]) => {
    if (!newObligations.length) return;
    try {
      saveObligations([...obligations, ...newObligations]);
      setObligations(prev => [...prev, ...newObligations]);
      addToast({
        type: 'success',
        title: `${newObligations.length} AI Obligation${newObligations.length !== 1 ? 's' : ''} Added`,
        description: 'Gemini-extracted obligations are now visible in the explorer. Status: Under Review.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed to Save Obligations',
        description: err instanceof Error ? err.message : 'Storage write failed.'
      });
    }
  };

  // Save Draft handler
  const handleSaveDraft = async (assessments: CoverageAssessment[], notes: string) => {
    if (!activeReviewMapping) return;
    try {
      updateCoverage(activeReviewMapping.id, assessments, currentAnalyst, notes);
      refreshData();
      addToast({
        type: 'info',
        title: 'Mapping Draft Saved',
        description: `Updated component coverage assessment for mapping ${activeReviewMapping.id}.`
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: err instanceof Error ? err.message : 'Failed to save changes.'
      });
      throw err;
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* MAIN PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#17263C] tracking-tight flex items-center gap-2.5">
            Obligation Mapping
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
              Workbench
            </span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-3xl">
            Review regulatory obligations against internal controls, assess coverage, and record traceable compliance decisions.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* AI INGESTION BUTTON — primary differentiator */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAIIngestionOpen(true)}
            className="text-xs relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              boxShadow: '0 0 16px rgba(99,102,241,0.4)'
            }}
          >
            <Brain className="w-3.5 h-3.5 mr-1.5" />
            AI Ingest Regulation
            <span className="ml-1.5 text-[9px] font-bold opacity-80">GEMINI</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSimulationOpen(true)}
            className={`text-xs ${activeScenario !== 'baseline' ? 'border-amber-400 bg-amber-50 text-amber-800' : ''}`}
          >
            <FlaskConical className="w-3.5 h-3.5 mr-1.5 text-[#0F766E]" />
            {activeScenario !== 'baseline' ? 'Simulation Active' : 'What-If Simulation'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportRegister}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#0F766E]" />
            Export Register (CSV)
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            className="text-xs text-slate-600 hover:text-red-700 hover:bg-red-50"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Demo Data
          </Button>
        </div>
      </div>

      {/* SUMMARY METRICS */}
      <SummaryMetricsBar
        metrics={metrics}
        activeFilterKey={activeMetricFilter}
        onSelectMetricFilter={handleSelectMetricFilter}
      />

      {/* MAIN WORKSPACE TWO-COLUMN LAYOUT (Section 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: OBLIGATION EXPLORER (~40% -> 5 cols on lg) */}
        <div className="lg:col-span-5">
          <ObligationExplorer
            obligations={obligations}
            mappings={mappings}
            selectedObligationId={selectedObligation?.id || null}
            onSelectObligation={(ob) => setSelectedObligation(ob)}
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* RIGHT COLUMN: MAPPING DETAIL WORKSPACE (~60% -> 7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedObligation ? (
            <>
              {/* SECTION A & B: OBLIGATION DETAILS & COVERAGE SUMMARY */}
              <ObligationDetails
                obligation={selectedObligation}
                mappings={mappings}
                onViewSource={() => setIsSourceDialogOpen(true)}
              />

              {/* SECTION LINEAGE: REGULATORY TRACEABILITY CHAIN (9-Stage Flow) */}
              <RegulatoryTraceabilityChain
                obligation={selectedObligation}
                mappings={mappings}
                controls={controls}
                onOpenReview={(m) => handleOpenReview(m)}
              />

              {/* SECTION REMEDIATION: AUTONOMOUS REMEDIATION ADVISOR */}
              <RemediationAdvisor
                obligation={selectedObligation}
                mappings={mappings}
                controls={controls}
                currentAnalyst={currentAnalyst}
                onRefreshData={refreshData}
              />

              {/* SECTION C: CANDIDATE INTERNAL CONTROLS */}
              <CandidateControlList
                obligation={selectedObligation}
                controls={controls}
                mappings={mappings}
                onOpenReviewDialog={(m, ctrl) => handleOpenReview(m, ctrl)}
                onRequestReject={(m) => {
                  setActiveReviewMapping(m);
                  setIsRejectDialogOpen(true);
                }}
                onRequestMoreInfo={(m) => {
                  setActiveReviewMapping(m);
                  setIsRequestInfoDialogOpen(true);
                }}
              />

              {/* SECTION D: REQUIREMENT COMPONENT COVERAGE TABLE */}
              <CoverageTable
                obligation={selectedObligation}
                mappings={mappings}
                controls={controls}
                onOpenReview={(m) => handleOpenReview(m)}
              />

              {/* SECTION E: COLLAPSIBLE AUDIT ACTIVITY */}
              <MappingActivity
                obligationId={selectedObligation.id}
                events={auditEvents}
              />
            </>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-[#E2E8F0]">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-[#17263C]">No Obligation Selected</h2>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Please select a regulatory obligation from the explorer on the left to review its candidate controls and atomic component coverage.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DIALOGS */}
      <ViewSourceDialog
        obligation={selectedObligation}
        isOpen={isSourceDialogOpen}
        onClose={() => setIsSourceDialogOpen(false)}
      />

      <MappingReviewDialog
        obligation={selectedObligation}
        control={activeReviewControl}
        mapping={activeReviewMapping}
        isOpen={isReviewDialogOpen}
        onClose={() => {
          setIsReviewDialogOpen(false);
          setActiveReviewMapping(null);
          setActiveReviewControl(null);
        }}
        onApprove={handleApproveMapping}
        onSaveDraft={handleSaveDraft}
        onRequestReject={() => {
          setIsReviewDialogOpen(false);
          setIsRejectDialogOpen(true);
        }}
        onRequestMoreInfo={() => {
          setIsReviewDialogOpen(false);
          setIsRequestInfoDialogOpen(true);
        }}
      />

      <RejectMappingDialog
        mapping={activeReviewMapping}
        isOpen={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
        }}
        onConfirmReject={handleConfirmReject}
      />

      <RequestInfoDialog
        mapping={activeReviewMapping}
        isOpen={isRequestInfoDialogOpen}
        onClose={() => {
          setIsRequestInfoDialogOpen(false);
        }}
        onConfirmRequest={handleConfirmRequestInfo}
      />

      <ResetDemoDataDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirmReset={handleConfirmReset}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onTriggerReset={() => setIsResetConfirmOpen(true)}
      />

      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        activeScenario={activeScenario}
        onApplyScenario={handleApplyScenario}
      />

      <AIIngestionModal
        isOpen={isAIIngestionOpen}
        onClose={() => setIsAIIngestionOpen(false)}
        onAddObligations={handleAddAIObligations}
      />
    </div>
  );
};
