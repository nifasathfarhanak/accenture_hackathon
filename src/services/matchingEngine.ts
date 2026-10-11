import { 
  RegulatoryObligation, 
  InternalControl, 
  MatchRationale 
} from '../types';

export interface MatchingResult {
  matchScore: number;
  matchScoreDisplay: string;
  matchProvider: string;
  rationale: MatchRationale;
}

/**
 * Deterministic Matching & Scoring Engine
 * Implements Section 9: AI Matching and Coverage Logic
 * Uses documented weighted criteria:
 * - Requirement-component overlap: up to 50 pts
 * - Operational process & business function alignment: up to 25 pts
 * - Frequency and ownership alignment: up to 15 pts
 * - Supporting metadata & evidence status: up to 10 pts
 */
export function evaluateControlMatch(
  obligation: RegulatoryObligation, 
  control: InternalControl
): MatchingResult {
  const provider = "Deterministic Compliance Rule Engine v1.2";

  // 1. Requirement component overlap (0 - 50 points)
  const obligationComponentIds = obligation.requirementComponents.map(rc => rc.id);
  const matchedComponents = control.requirementComponentsAddressed.filter(id => 
    obligationComponentIds.includes(id)
  );

  let componentOverlapScore = 0;
  if (obligationComponentIds.length > 0) {
    const ratio = matchedComponents.length / obligationComponentIds.length;
    componentOverlapScore = Math.round(ratio * 50);
  }

  // 2. Operational process & business function alignment (0 - 25 points)
  let processAlignmentScore = 0;
  const functionMatches = obligation.businessFunction.toLowerCase().includes(control.businessFunction.toLowerCase()) ||
    control.businessFunction.toLowerCase().includes(obligation.businessFunction.toLowerCase());

  if (functionMatches) {
    processAlignmentScore = 20;
  } else {
    // Cross-functional or partial match
    processAlignmentScore = 5;
  }

  // Check description keyword overlap
  const obTokens = obligation.normalizedRequirement.toLowerCase().split(/\W+/).filter(w => w.length > 4);
  const ctrlTokens = control.description.toLowerCase().split(/\W+/).filter(w => w.length > 4);
  const sharedTokens = obTokens.filter(t => ctrlTokens.includes(t));
  if (sharedTokens.length >= 3) {
    processAlignmentScore = Math.min(25, processAlignmentScore + 5);
  }

  // 3. Frequency & ownership alignment (0 - 15 points)
  let frequencyAndOwnershipScore = 0;
  if (control.ownerRole && control.ownerRole.length > 3) {
    frequencyAndOwnershipScore += 7;
  }
  if (control.frequency && control.frequency !== 'Ad-hoc / Monthly' && control.frequency !== 'N/A') {
    frequencyAndOwnershipScore += 8;
  }

  // 4. Supporting metadata alignment (0 - 10 points)
  let metadataScore = 0;
  if (control.evidenceStatus === 'Verified') {
    metadataScore += 5;
  } else if (control.evidenceStatus === 'Pending Verification') {
    metadataScore += 2;
  }
  if (control.designStatus === 'Effective') {
    metadataScore += 5;
  } else if (control.designStatus === 'Partially Effective') {
    metadataScore += 3;
  }

  const totalScore = Math.min(100, Math.max(0, 
    componentOverlapScore + processAlignmentScore + frequencyAndOwnershipScore + metadataScore
  ));

  // Determine positive coverage and gaps
  const positiveParts: string[] = [];
  const gapParts: string[] = [];

  if (matchedComponents.length > 0) {
    positiveParts.push(`Addresses ${matchedComponents.length} of ${obligationComponentIds.length} defined requirement components (${matchedComponents.join(', ')}).`);
  }
  if (functionMatches) {
    positiveParts.push(`Direct business function alignment (${control.businessFunction}).`);
  }
  if (control.evidenceStatus === 'Verified') {
    positiveParts.push(`Evidence status is verified with audit-traceable source.`);
  }

  const unaddressedCount = obligationComponentIds.length - matchedComponents.length;
  if (unaddressedCount > 0) {
    gapParts.push(`${unaddressedCount} requirement component(s) remain unaddressed or unconfirmed in control documentation.`);
  }
  if (control.designStatus === 'Partially Effective' || control.designStatus === 'Deficient') {
    gapParts.push(`Control design status is currently assessed as ${control.designStatus}.`);
  }
  if (control.evidenceStatus !== 'Verified') {
    gapParts.push(`Supporting evidence is not fully verified (${control.evidenceStatus}).`);
  }

  const positiveCoverage = positiveParts.length > 0 
    ? positiveParts.join(' ') 
    : "Limited or peripheral keyword alignment with obligation scope.";
  
  const potentialGaps = gapParts.length > 0
    ? gapParts.join(' ')
    : "No primary gaps identified in baseline documentation. Continuous testing recommended.";

  let suggestedAction = "Review component-level evidence before proceeding.";
  if (totalScore >= 85 && unaddressedCount === 0) {
    suggestedAction = "Strong candidate for full approval. Verify current testing cadence.";
  } else if (totalScore >= 60) {
    suggestedAction = "Review partial coverage. Consider pairing with complementary controls or requesting SLA clarification.";
  } else {
    suggestedAction = "Low alignment score. Confirm whether control is intended to support this obligation or reject mapping.";
  }

  return {
    matchScore: totalScore,
    matchScoreDisplay: `${totalScore}/100`,
    matchProvider: provider,
    rationale: {
      positiveCoverage,
      potentialGaps,
      suggestedReviewerAction: suggestedAction,
      scoreBreakdown: {
        componentOverlap: componentOverlapScore,
        processAlignment: processAlignmentScore,
        frequencyAndOwnership: frequencyAndOwnershipScore,
        supportingMetadata: metadataScore
      }
    }
  };
}
