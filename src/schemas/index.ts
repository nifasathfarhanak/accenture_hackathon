import { z } from 'zod';

export const RequirementComponentSchema = z.object({
  id: z.string(),
  obligationId: z.string(),
  statement: z.string().min(1),
  sourceExcerpt: z.string(),
  sourceSection: z.string(),
});

export const CoverageAssessmentSchema = z.object({
  requirementComponentId: z.string(),
  status: z.enum(['Supported', 'Partially supported', 'Not supported', 'Unknown']),
  supportingExcerpt: z.string(),
  rationale: z.string(),
  analystReviewed: z.boolean(),
  reviewerNote: z.string().optional(),
});

export const MatchRationaleSchema = z.object({
  positiveCoverage: z.string(),
  potentialGaps: z.string(),
  suggestedReviewerAction: z.string(),
  scoreBreakdown: z.object({
    componentOverlap: z.number(),
    processAlignment: z.number(),
    frequencyAndOwnership: z.number(),
    supportingMetadata: z.number(),
  }).optional(),
});

export const RequestedInformationSchema = z.object({
  informationRequired: z.string().min(3, 'Required information description must be at least 3 characters'),
  reason: z.string().min(3, 'Reason must be provided'),
  requestedRole: z.string().min(2, 'Responsible function/role is required'),
  dueDate: z.string().optional(),
  requestedAt: z.string(),
  requestedBy: z.string(),
});

export const ControlMappingSchema = z.object({
  id: z.string(),
  obligationId: z.string(),
  controlId: z.string(),
  status: z.enum(['Suggested', 'Draft', 'Pending Review', 'Needs Information', 'Approved', 'Rejected', 'Superseded']),
  matchScore: z.number().min(0).max(100),
  matchProvider: z.string(),
  matchRationale: MatchRationaleSchema,
  coverageAssessments: z.array(CoverageAssessmentSchema),
  reviewerRationale: z.string().optional(),
  reviewerNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
  requestedInformation: RequestedInformationSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
  version: z.number().int().positive(),
  supersedesMappingId: z.string().optional(),
  active: z.boolean(),
});

export const ApprovalPayloadSchema = z.object({
  reviewerRationale: z.string().trim().min(5, 'Reviewer rationale is mandatory and must be at least 5 characters'),
  reviewerNotes: z.string().optional(),
  acknowledgeGaps: z.boolean(),
  analystName: z.string().min(1),
});

export const RejectionPayloadSchema = z.object({
  rejectionReason: z.string().trim().min(5, 'Rejection reason is required and must be at least 5 characters'),
  reviewerNotes: z.string().optional(),
  analystName: z.string().min(1),
});

export const RequestInfoPayloadSchema = z.object({
  informationRequired: z.string().trim().min(5, 'Information required must be at least 5 characters'),
  reason: z.string().trim().min(5, 'Reason must be at least 5 characters'),
  requestedRole: z.string().trim().min(2, 'Responsible function is required'),
  dueDate: z.string().optional(),
  analystName: z.string().min(1),
});

export const AuditEventSchema = z.object({
  id: z.string(),
  entityType: z.enum(['Mapping', 'Obligation', 'System']),
  entityId: z.string(),
  action: z.enum([
    'MAPPING_SUGGESTION_CREATED',
    'MAPPING_DRAFT_SAVED',
    'COVERAGE_UPDATED',
    'MAPPING_SUBMITTED_FOR_REVIEW',
    'MAPPING_APPROVED',
    'MAPPING_REJECTED',
    'INFORMATION_REQUESTED',
    'MAPPING_SUPERSEDED',
    'DEMO_DATA_RESET',
  ]),
  actorId: z.string(),
  actorDisplayName: z.string(),
  timestamp: z.string(),
  previousState: z.string().optional(),
  newState: z.string().optional(),
  reason: z.string().optional(),
  relatedRecordIds: z.array(z.string()).optional(),
});
