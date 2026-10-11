import { 
  RegulatoryObligation, 
  InternalControl, 
  ControlMapping, 
  AuditEvent, 
  CoverageAssessment,
  SummaryMetrics,
  OverallCoverageStatus 
} from '../types';
import { 
  SEED_OBLIGATIONS, 
  SEED_CONTROLS, 
  SEED_MAPPINGS, 
  SEED_AUDIT_EVENTS, 
  DEMO_ORGANIZATION 
} from '../data/seedData';
import { 
  ApprovalPayloadSchema, 
  RejectionPayloadSchema, 
  RequestInfoPayloadSchema 
} from '../schemas';

const STORAGE_KEY = 'regulatrace_ai_store_v1';

export interface StorageData {
  version: number;
  obligations: RegulatoryObligation[];
  controls: InternalControl[];
  mappings: ControlMapping[];
  auditEvents: AuditEvent[];
  lastUpdated: string;
}

let simulateFailure = false;

export function setSimulateStorageFailure(fail: boolean) {
  simulateFailure = fail;
}

export function isStorageFailureSimulated() {
  return simulateFailure;
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

function getInitialData(): StorageData {
  return {
    version: 1,
    obligations: JSON.parse(JSON.stringify(SEED_OBLIGATIONS)),
    controls: JSON.parse(JSON.stringify(SEED_CONTROLS)),
    mappings: JSON.parse(JSON.stringify(SEED_MAPPINGS)),
    auditEvents: JSON.parse(JSON.stringify(SEED_AUDIT_EVENTS)),
    lastUpdated: new Date().toISOString()
  };
}

export function loadStorageData(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialData();
      saveStorageData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as StorageData;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.obligations)) {
      console.warn("Storage schema version mismatch or corrupted data, resetting to seed data");
      const initial = getInitialData();
      saveStorageData(initial);
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to read localStorage:", err);
    return getInitialData();
  }
}

export function saveStorageData(data: StorageData): void {
  if (simulateFailure) {
    throw new StorageError("Simulated database/storage write failure. Transaction rolled back.");
  }
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    throw new StorageError(`LocalStorage write error: ${err instanceof Error ? err.message : 'Unknown storage error'}`);
  }
}

export function resetStorageData(): StorageData {
  const resetData: StorageData = {
    version: 1,
    obligations: JSON.parse(JSON.stringify(SEED_OBLIGATIONS)),
    controls: JSON.parse(JSON.stringify(SEED_CONTROLS)),
    mappings: JSON.parse(JSON.stringify(SEED_MAPPINGS)),
    auditEvents: [
      {
        id: `AUD-RESET-${Date.now()}`,
        entityType: 'System',
        entityId: 'SYSTEM',
        action: 'DEMO_DATA_RESET',
        actorId: DEMO_ORGANIZATION.analyst.id,
        actorDisplayName: `${DEMO_ORGANIZATION.analyst.name} (${DEMO_ORGANIZATION.analyst.role})`,
        timestamp: new Date().toISOString(),
        reason: 'Restored deterministic seed dataset to initial state.',
      },
      ...JSON.parse(JSON.stringify(SEED_AUDIT_EVENTS)),
    ],
    lastUpdated: new Date().toISOString()
  };
  saveStorageData(resetData);
  return resetData;
}

export function appendAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
  const data = loadStorageData();
  const fullEvent: AuditEvent = {
    ...event,
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString()
  };
  data.auditEvents.unshift(fullEvent);
  saveStorageData(data);
}

// Data access operations
export function getObligations(): RegulatoryObligation[] {
  return loadStorageData().obligations;
}

export function getObligationById(id: string): RegulatoryObligation | undefined {
  return loadStorageData().obligations.find(o => o.id === id);
}

export function getControls(): InternalControl[] {
  return loadStorageData().controls;
}

export function getControlById(id: string): InternalControl | undefined {
  return loadStorageData().controls.find(c => c.id === id);
}

export function getMappings(obligationId?: string): ControlMapping[] {
  const mappings = loadStorageData().mappings;
  if (obligationId) {
    return mappings.filter(m => m.obligationId === obligationId);
  }
  return mappings;
}

export function getMappingById(id: string): ControlMapping | undefined {
  return loadStorageData().mappings.find(m => m.id === id);
}

export function getAuditEvents(obligationId?: string): AuditEvent[] {
  const events = loadStorageData().auditEvents;
  if (obligationId) {
    return events.filter(e => 
      e.entityId === obligationId || 
      (e.relatedRecordIds && e.relatedRecordIds.includes(obligationId))
    );
  }
  return events;
}

export function computeOverallCoverage(
  obligation: RegulatoryObligation, 
  mappings: ControlMapping[]
): OverallCoverageStatus {
  if (obligation.applicabilityStatus === 'Under Review') {
    return 'Applicability requires review';
  }
  if (obligation.applicabilityStatus === 'Not Applicable') {
    return 'No control identified';
  }

  const activeMappings = mappings.filter(m => m.obligationId === obligation.id && m.active !== false);

  if (activeMappings.length === 0) {
    const rejectedMappings = mappings.filter(m => m.obligationId === obligation.id && m.status === 'Rejected');
    if (rejectedMappings.length > 0) {
      return 'Mapping rejected';
    }
    return 'No control identified';
  }

  const approved = activeMappings.filter(m => m.status === 'Approved');
  if (approved.length > 0) {
    return 'Approved mapping';
  }

  const pending = activeMappings.filter(m => m.status === 'Pending Review');
  if (pending.length > 0) {
    // Check if fully supported
    const hasFullCoverage = pending.some(m => 
      m.coverageAssessments.every(a => a.status === 'Supported')
    );
    if (hasFullCoverage) {
      return 'Fully mapped, pending approval';
    }
    return 'Partial coverage';
  }

  const partial = activeMappings.some(m => 
    m.coverageAssessments.some(a => a.status === 'Supported' || a.status === 'Partially supported')
  );

  if (partial) {
    return 'Partial coverage';
  }

  return 'Mapping suggested';
}

export function computeSummaryMetrics(): SummaryMetrics {
  const data = loadStorageData();
  const obligations = data.obligations;
  const mappings = data.mappings;

  // 1. Total Obligations
  const totalObligations = obligations.length;

  // 2. Pending Review
  // Definition: Number of obligation records that still have at least one proposed mapping awaiting review,
  // or that are explicitly awaiting mapping review.
  const pendingReviewCount = obligations.filter(o => {
    const obMappings = mappings.filter(m => m.obligationId === o.id && m.active !== false);
    return obMappings.some(m => m.status === 'Pending Review' || m.status === 'Suggested');
  }).length;

  // 3. Approved Mappings
  // Definition: Number of currently approved active obligation-control relationship records.
  const approvedMappings = mappings.filter(m => m.status === 'Approved' && m.active !== false).length;

  // 4. Unmapped Obligations
  // Definition: Number of applicable obligations with no approved active mapping.
  const unmappedObligations = obligations.filter(o => {
    if (o.applicabilityStatus !== 'Applicable') return false;
    const obMappings = mappings.filter(m => m.obligationId === o.id && m.active !== false);
    const hasApproved = obMappings.some(m => m.status === 'Approved');
    return !hasApproved;
  }).length;

  return {
    totalObligations,
    pendingReview: pendingReviewCount,
    approvedMappings,
    unmappedObligations
  };
}

export function approveMapping(
  mappingId: string, 
  payload: { 
    reviewerRationale: string; 
    reviewerNotes?: string; 
    acknowledgeGaps: boolean; 
    analystName: string;
  }
): ControlMapping {
  // Validate with Zod
  const validated = ApprovalPayloadSchema.parse(payload);

  const data = loadStorageData();
  const mappingIndex = data.mappings.findIndex(m => m.id === mappingId);
  if (mappingIndex === -1) {
    throw new Error(`Mapping with ID ${mappingId} does not exist`);
  }

  const mapping = data.mappings[mappingIndex];
  const obligation = data.obligations.find(o => o.id === mapping.obligationId);
  const control = data.controls.find(c => c.id === mapping.controlId);

  if (!obligation || !control) {
    throw new Error("Associated obligation or control record could not be found");
  }

  // Check for uncovered / unknown components
  const hasGaps = mapping.coverageAssessments.some(
    a => a.status === 'Partially supported' || a.status === 'Not supported' || a.status === 'Unknown'
  );

  if (hasGaps && !validated.acknowledgeGaps) {
    throw new Error("You must explicitly acknowledge uncovered or unknown requirement components before approving this mapping.");
  }

  const previousState = mapping.status;
  const updatedMapping: ControlMapping = {
    ...mapping,
    status: 'Approved',
    reviewerRationale: validated.reviewerRationale,
    reviewerNotes: validated.reviewerNotes || mapping.reviewerNotes,
    reviewedBy: validated.analystName,
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    active: true
  };

  data.mappings[mappingIndex] = updatedMapping;

  // Add audit event
  const auditEvent: AuditEvent = {
    id: `AUD-${Date.now()}`,
    entityType: 'Mapping',
    entityId: mapping.id,
    action: 'MAPPING_APPROVED',
    actorId: DEMO_ORGANIZATION.analyst.id,
    actorDisplayName: validated.analystName,
    timestamp: new Date().toISOString(),
    previousState,
    newState: 'Approved',
    reason: validated.reviewerRationale,
    relatedRecordIds: [obligation.id, control.id]
  };

  data.auditEvents.unshift(auditEvent);
  saveStorageData(data);
  return updatedMapping;
}

export function rejectMapping(
  mappingId: string, 
  payload: { 
    rejectionReason: string; 
    reviewerNotes?: string; 
    analystName: string;
  }
): ControlMapping {
  // Validate with Zod
  const validated = RejectionPayloadSchema.parse(payload);

  const data = loadStorageData();
  const mappingIndex = data.mappings.findIndex(m => m.id === mappingId);
  if (mappingIndex === -1) {
    throw new Error(`Mapping with ID ${mappingId} does not exist`);
  }

  const mapping = data.mappings[mappingIndex];
  const previousState = mapping.status;

  const updatedMapping: ControlMapping = {
    ...mapping,
    status: 'Rejected',
    rejectionReason: validated.rejectionReason,
    reviewerNotes: validated.reviewerNotes || mapping.reviewerNotes,
    reviewedBy: validated.analystName,
    reviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    active: false // Excluded from active approved coverage calculations
  };

  data.mappings[mappingIndex] = updatedMapping;

  const auditEvent: AuditEvent = {
    id: `AUD-${Date.now()}`,
    entityType: 'Mapping',
    entityId: mapping.id,
    action: 'MAPPING_REJECTED',
    actorId: DEMO_ORGANIZATION.analyst.id,
    actorDisplayName: validated.analystName,
    timestamp: new Date().toISOString(),
    previousState,
    newState: 'Rejected',
    reason: validated.rejectionReason,
    relatedRecordIds: [mapping.obligationId, mapping.controlId]
  };

  data.auditEvents.unshift(auditEvent);
  saveStorageData(data);
  return updatedMapping;
}

export function requestInformation(
  mappingId: string,
  payload: {
    informationRequired: string;
    reason: string;
    requestedRole: string;
    dueDate?: string;
    analystName: string;
  }
): ControlMapping {
  const validated = RequestInfoPayloadSchema.parse(payload);

  const data = loadStorageData();
  const mappingIndex = data.mappings.findIndex(m => m.id === mappingId);
  if (mappingIndex === -1) {
    throw new Error(`Mapping with ID ${mappingId} does not exist`);
  }

  const mapping = data.mappings[mappingIndex];
  const previousState = mapping.status;

  const requestedInfo = {
    informationRequired: validated.informationRequired,
    reason: validated.reason,
    requestedRole: validated.requestedRole,
    dueDate: validated.dueDate,
    requestedAt: new Date().toISOString(),
    requestedBy: validated.analystName
  };

  const updatedMapping: ControlMapping = {
    ...mapping,
    status: 'Needs Information',
    requestedInformation: requestedInfo,
    updatedAt: new Date().toISOString(),
  };

  data.mappings[mappingIndex] = updatedMapping;

  const auditEvent: AuditEvent = {
    id: `AUD-${Date.now()}`,
    entityType: 'Mapping',
    entityId: mapping.id,
    action: 'INFORMATION_REQUESTED',
    actorId: DEMO_ORGANIZATION.analyst.id,
    actorDisplayName: validated.analystName,
    timestamp: new Date().toISOString(),
    previousState,
    newState: 'Needs Information',
    reason: `${validated.requestedRole}: ${validated.informationRequired} (${validated.reason})`,
    relatedRecordIds: [mapping.obligationId, mapping.controlId]
  };

  data.auditEvents.unshift(auditEvent);
  saveStorageData(data);
  return updatedMapping;
}

export function updateCoverage(
  mappingId: string,
  assessments: CoverageAssessment[],
  analystName: string,
  reviewerNotes?: string
): ControlMapping {
  const data = loadStorageData();
  const mappingIndex = data.mappings.findIndex(m => m.id === mappingId);
  if (mappingIndex === -1) {
    throw new Error(`Mapping with ID ${mappingId} does not exist`);
  }

  const mapping = data.mappings[mappingIndex];
  const previousState = mapping.status;

  // If mapping was already Approved, saving changes invalidates approval and requires re-approval!
  let newStatus = mapping.status;
  let action: AuditEvent['action'] = 'COVERAGE_UPDATED';
  let supersedesId: string | undefined = undefined;

  if (mapping.status === 'Approved') {
    newStatus = 'Pending Review'; // Requires re-approval!
    action = 'MAPPING_SUPERSEDED';
    supersedesId = mapping.id;

    // Record superseding audit event for historical trace
    const supersedeEvent: AuditEvent = {
      id: `AUD-${Date.now()}-SUP`,
      entityType: 'Mapping',
      entityId: mapping.id,
      action: 'MAPPING_SUPERSEDED',
      actorId: DEMO_ORGANIZATION.analyst.id,
      actorDisplayName: analystName,
      timestamp: new Date().toISOString(),
      previousState: 'Approved',
      newState: 'Pending Review',
      reason: 'Modified requirement component coverage on an approved mapping. Previous approval invalidated; re-approval required.',
      relatedRecordIds: [mapping.obligationId, mapping.controlId]
    };
    data.auditEvents.unshift(supersedeEvent);
  } else if (mapping.status === 'Suggested') {
    newStatus = 'Draft';
    action = 'MAPPING_DRAFT_SAVED';
  }

  const updatedMapping: ControlMapping = {
    ...mapping,
    status: newStatus,
    coverageAssessments: assessments,
    reviewerNotes: reviewerNotes !== undefined ? reviewerNotes : mapping.reviewerNotes,
    version: mapping.status === 'Approved' ? mapping.version + 1 : mapping.version,
    supersedesMappingId: supersedesId || mapping.supersedesMappingId,
    updatedAt: new Date().toISOString()
  };

  data.mappings[mappingIndex] = updatedMapping;

  const auditEvent: AuditEvent = {
    id: `AUD-${Date.now()}`,
    entityType: 'Mapping',
    entityId: mapping.id,
    action,
    actorId: DEMO_ORGANIZATION.analyst.id,
    actorDisplayName: analystName,
    timestamp: new Date().toISOString(),
    previousState,
    newState: newStatus,
    reason: `Updated component coverage assessment (${assessments.length} components evaluated).`,
    relatedRecordIds: [mapping.obligationId, mapping.controlId]
  };

  data.auditEvents.unshift(auditEvent);
  saveStorageData(data);
  return updatedMapping;
}

export function saveDraft(
  mappingId: string,
  assessments: CoverageAssessment[],
  notes: string,
  analystName: string
): ControlMapping {
  const data = loadStorageData();
  const mappingIndex = data.mappings.findIndex(m => m.id === mappingId);
  if (mappingIndex === -1) {
    throw new Error(`Mapping with ID ${mappingId} does not exist`);
  }

  const mapping = data.mappings[mappingIndex];
  const previousState = mapping.status;

  const updatedMapping: ControlMapping = {
    ...mapping,
    status: 'Draft',
    coverageAssessments: assessments,
    reviewerNotes: notes,
    updatedAt: new Date().toISOString()
  };

  data.mappings[mappingIndex] = updatedMapping;

  const auditEvent: AuditEvent = {
    id: `AUD-${Date.now()}`,
    entityType: 'Mapping',
    entityId: mapping.id,
    action: 'MAPPING_DRAFT_SAVED',
    actorId: DEMO_ORGANIZATION.analyst.id,
    actorDisplayName: analystName,
    timestamp: new Date().toISOString(),
    previousState,
    newState: 'Draft',
    reason: 'Reviewer saved draft changes and reviewer notes.',
    relatedRecordIds: [mapping.obligationId, mapping.controlId]
  };

  data.auditEvents.unshift(auditEvent);
  saveStorageData(data);
  return updatedMapping;
}

/**
 * Generates an RFC-4180 compliant CSV register of mappings
 * Supports filtering by visible obligation IDs
 */
export function exportRegisterCSV(visibleObligationIds?: string[]): string {
  const data = loadStorageData();
  const obligations = visibleObligationIds 
    ? data.obligations.filter(o => visibleObligationIds.includes(o.id))
    : data.obligations;

  const headers = [
    "Obligation ID",
    "Requirement Title",
    "Regulation",
    "Source Reference",
    "Applicability",
    "Control ID",
    "Control Name",
    "Mapping Status",
    "Coverage Summary",
    "Match Score",
    "Reviewer",
    "Review Timestamp"
  ];

  const escapeCSV = (field: string | number | undefined | null) => {
    if (field === undefined || field === null) return '""';
    const str = String(field);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows: string[] = [];
  rows.push(headers.map(escapeCSV).join(','));

  for (const obligation of obligations) {
    const obMappings = data.mappings.filter(m => m.obligationId === obligation.id);
    if (obMappings.length === 0) {
      // Unmapped row
      rows.push([
        obligation.id,
        obligation.title,
        obligation.regulationName,
        `${obligation.sourceDocumentVersion} ${obligation.sourceSection}`,
        obligation.applicabilityStatus,
        "UNMAPPED",
        "No internal control mapped",
        "Unmapped",
        "0 controls identified",
        "N/A",
        "N/A",
        "N/A"
      ].map(escapeCSV).join(','));
    } else {
      for (const mapping of obMappings) {
        const control = data.controls.find(c => c.id === mapping.controlId);
        const supportedCount = mapping.coverageAssessments.filter(a => a.status === 'Supported').length;
        const totalCount = mapping.coverageAssessments.length;
        const coverageSummary = `${supportedCount}/${totalCount} components supported`;

        rows.push([
          obligation.id,
          obligation.title,
          obligation.regulationName,
          `${obligation.sourceDocumentVersion} ${obligation.sourceSection}`,
          obligation.applicabilityStatus,
          mapping.controlId,
          control?.name || "Unknown Control",
          mapping.status,
          coverageSummary,
          `${mapping.matchScore}/100`,
          mapping.reviewedBy || "Pending Review",
          mapping.reviewedAt || mapping.updatedAt
        ].map(escapeCSV).join(','));
      }
    }
  }

  return rows.join('\r\n');
}
