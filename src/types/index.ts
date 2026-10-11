export type ApplicabilityStatus = 'Applicable' | 'Not Applicable' | 'Under Review';

export type SourceVerificationStatus = 
  | 'Synthetic demo source' 
  | 'Verified regulatory source' 
  | 'Unverified source';

export type RequirementCoverageStatus = 
  | 'Supported' 
  | 'Partially supported' 
  | 'Not supported' 
  | 'Unknown';

export type MappingStatus = 
  | 'Suggested' 
  | 'Draft' 
  | 'Pending Review' 
  | 'Needs Information' 
  | 'Approved' 
  | 'Rejected' 
  | 'Superseded';

export type ControlDesignStatus = 
  | 'Effective' 
  | 'Partially Effective' 
  | 'Deficient' 
  | 'Under Design';

export type ControlEvidenceStatus = 
  | 'Verified' 
  | 'Pending Verification' 
  | 'Missing Evidence';

export type OverallCoverageStatus = 
  | 'No control identified'
  | 'Mapping suggested'
  | 'Partial coverage'
  | 'Fully mapped, pending approval'
  | 'Approved mapping'
  | 'Mapping rejected'
  | 'Applicability requires review';

export interface RequirementComponent {
  id: string;
  obligationId: string;
  statement: string;
  sourceExcerpt: string;
  sourceSection: string;
}

export interface RegulatoryObligation {
  id: string;
  title: string;
  normalizedRequirement: string;
  regulationName: string;
  sourceDocumentId: string;
  sourceDocumentVersion: string;
  sourceSection: string;
  sourcePage: number | string;
  sourceExcerpt: string;
  jurisdiction: string;
  businessFunction: string;
  applicabilityStatus: ApplicabilityStatus;
  effectiveDate: string;
  sourceVerificationStatus: SourceVerificationStatus;
  requirementComponents: RequirementComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface InternalControl {
  id: string;
  name: string;
  description: string;
  ownerRole: string;
  frequency: string;
  businessFunction: string;
  designStatus: ControlDesignStatus;
  evidenceStatus: ControlEvidenceStatus;
  sourceDocumentId: string;
  sourceDocumentVersion: string;
  sourceSection: string;
  sourcePage: number | string;
  sourceExcerpt: string;
  requirementComponentsAddressed: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CoverageAssessment {
  requirementComponentId: string;
  status: RequirementCoverageStatus;
  supportingExcerpt: string;
  rationale: string;
  analystReviewed: boolean;
  reviewerNote?: string;
}

export interface MatchRationale {
  positiveCoverage: string;
  potentialGaps: string;
  suggestedReviewerAction: string;
  scoreBreakdown?: {
    componentOverlap: number;
    processAlignment: number;
    frequencyAndOwnership: number;
    supportingMetadata: number;
  };
}

export interface RequestedInformation {
  informationRequired: string;
  reason: string;
  requestedRole: string;
  dueDate?: string;
  requestedAt: string;
  requestedBy: string;
}

export interface ControlMapping {
  id: string;
  obligationId: string;
  controlId: string;
  status: MappingStatus;
  matchScore: number; // 0 - 100
  matchProvider: string;
  matchRationale: MatchRationale;
  coverageAssessments: CoverageAssessment[];
  reviewerRationale?: string;
  reviewerNotes?: string;
  rejectionReason?: string;
  requestedInformation?: RequestedInformation;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
  supersedesMappingId?: string;
  active: boolean;
}

export type AuditAction = 
  | 'MAPPING_SUGGESTION_CREATED'
  | 'MAPPING_DRAFT_SAVED'
  | 'COVERAGE_UPDATED'
  | 'MAPPING_SUBMITTED_FOR_REVIEW'
  | 'MAPPING_APPROVED'
  | 'MAPPING_REJECTED'
  | 'INFORMATION_REQUESTED'
  | 'MAPPING_SUPERSEDED'
  | 'DEMO_DATA_RESET';

export interface AuditEvent {
  id: string;
  entityType: 'Mapping' | 'Obligation' | 'System';
  entityId: string;
  action: AuditAction;
  actorId: string;
  actorDisplayName: string;
  timestamp: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  relatedRecordIds?: string[];
}

export interface SummaryMetrics {
  totalObligations: number;
  pendingReview: number;
  approvedMappings: number;
  unmappedObligations: number;
}

export interface FilterState {
  searchQuery: string;
  regulation: string;
  applicability: string;
  mappingStatus: string;
  reviewStatus: string;
  businessFunction: string;
}
