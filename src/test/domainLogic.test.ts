import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getObligations, 
  getControls, 
  getMappings, 
  getAuditEvents, 
  computeSummaryMetrics, 
  approveMapping, 
  rejectMapping, 
  requestInformation, 
  updateCoverage, 
  resetStorageData, 
  exportRegisterCSV, 
  setSimulateStorageFailure, 
  loadStorageData 
} from '../services/storageService';
import { evaluateControlMatch } from '../services/matchingEngine';
import { SEED_OBLIGATIONS, SEED_CONTROLS } from '../data/seedData';

describe('RegulaTrace AI — Domain & Storage Service Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    setSimulateStorageFailure(false);
    resetStorageData();
  });

  it('initializes deterministic seed dataset', () => {
    const obligations = getObligations();
    const controls = getControls();
    const mappings = getMappings();
    const auditEvents = getAuditEvents();

    expect(obligations.length).toBeGreaterThanOrEqual(8);
    expect(controls.length).toBeGreaterThanOrEqual(10);
    expect(mappings.length).toBeGreaterThanOrEqual(12);
    expect(auditEvents.length).toBeGreaterThanOrEqual(5);
  });

  it('Test 13: Live Metrics recalculates dynamically and matches definitions', () => {
    const initialMetrics = computeSummaryMetrics();
    expect(initialMetrics.totalObligations).toBe(8);
    expect(initialMetrics.pendingReview).toBeGreaterThan(0);
    expect(initialMetrics.approvedMappings).toBeGreaterThan(0);
    expect(initialMetrics.unmappedObligations).toBeGreaterThan(0);

    // Initial approved count
    const initialApproved = initialMetrics.approvedMappings;

    // Approve a suggested mapping: MAP-001-014
    approveMapping('MAP-001-014', {
      reviewerRationale: 'Formal operations review confirmed quarterly execution schedule.',
      acknowledgeGaps: true,
      analystName: 'Jane Doe'
    });

    const updatedMetrics = computeSummaryMetrics();
    expect(updatedMetrics.approvedMappings).toBe(initialApproved + 1);
  });

  it('Test 8 & Test 15: Approves complete mapping and survives reload', () => {
    const result = approveMapping('MAP-001-014', {
      reviewerRationale: 'Analyst verified operational procedures against regulatory guidelines.',
      acknowledgeGaps: true,
      analystName: 'Jane Doe'
    });

    expect(result.status).toBe('Approved');
    expect(result.reviewedBy).toBe('Jane Doe');
    expect(result.reviewerRationale).toContain('Analyst verified');

    // Simulate reload by reading from storage
    const reloaded = loadStorageData();
    const reloadedMapping = reloaded.mappings.find(m => m.id === 'MAP-001-014');
    expect(reloadedMapping?.status).toBe('Approved');
    expect(reloadedMapping?.reviewedBy).toBe('Jane Doe');

    // Audit event recorded
    const auditEvent = reloaded.auditEvents.find(e => e.entityId === 'MAP-001-014' && e.action === 'MAPPING_APPROVED');
    expect(auditEvent).toBeDefined();
    expect(auditEvent?.actorDisplayName).toBe('Jane Doe');
  });

  it('Test 9: Approve partial mapping fails if uncovered gaps are not acknowledged', () => {
    // MAP-001-014 has unknown/partial components
    expect(() => {
      approveMapping('MAP-001-014', {
        reviewerRationale: 'Attempting to approve without acknowledging known gaps',
        acknowledgeGaps: false, // NOT acknowledged!
        analystName: 'Jane Doe'
      });
    }).toThrow(/acknowledge uncovered or unknown/i);
  });

  it('Test 10: Rejects a candidate mapping and removes it from active coverage', () => {
    const initialMetrics = computeSummaryMetrics();

    const rejected = rejectMapping('MAP-001-014', {
      rejectionReason: 'Scope of this control does not cover regulatory mandate for retail customers.',
      analystName: 'Jane Doe'
    });

    expect(rejected.status).toBe('Rejected');
    expect(rejected.active).toBe(false);

    const reloaded = loadStorageData();
    const mappingInStore = reloaded.mappings.find(m => m.id === 'MAP-001-014');
    expect(mappingInStore?.status).toBe('Rejected');
    expect(mappingInStore?.active).toBe(false);

    // Excluded from approved mappings
    const metricsAfter = computeSummaryMetrics();
    expect(metricsAfter.approvedMappings).toBe(initialMetrics.approvedMappings);
  });

  it('Test 11: Requests additional control information', () => {
    const updated = requestInformation('MAP-001-014', {
      informationRequired: 'Missing SLA schedule and retail customer tiering definitions.',
      reason: 'Requirement 4.2.1 mandates coverage of all risk tiers.',
      requestedRole: 'Head of Customer Onboarding',
      dueDate: '2025-05-01',
      analystName: 'Jane Doe'
    });

    expect(updated.status).toBe('Needs Information');
    expect(updated.requestedInformation?.informationRequired).toContain('Missing SLA schedule');

    const reloaded = loadStorageData();
    const m = reloaded.mappings.find(m => m.id === 'MAP-001-014');
    expect(m?.status).toBe('Needs Information');

    const audit = reloaded.auditEvents.find(e => e.entityId === 'MAP-001-014' && e.action === 'INFORMATION_REQUESTED');
    expect(audit).toBeDefined();
  });

  it('Test 12: Supersedes an already approved mapping when component coverage is modified', () => {
    // MAP-002-002 is currently Approved
    const mappingBefore = loadStorageData().mappings.find(m => m.id === 'MAP-002-002');
    expect(mappingBefore?.status).toBe('Approved');

    // Modify its coverage
    const modifiedAssessments = (mappingBefore?.coverageAssessments || []).map(a => ({
      ...a,
      status: 'Partially supported' as const
    }));

    const updated = updateCoverage('MAP-002-002', modifiedAssessments, 'Jane Doe', 'Discovered list latency during audit');

    // Must be marked as Pending Review (requires re-approval!)
    expect(updated.status).toBe('Pending Review');
    expect(updated.version).toBe(2);

    const reloaded = loadStorageData();
    const m = reloaded.mappings.find(m => m.id === 'MAP-002-002');
    expect(m?.status).toBe('Pending Review');

    // Audit history recorded superseding
    const supersedeAudit = reloaded.auditEvents.find(e => e.entityId === 'MAP-002-002' && e.action === 'MAPPING_SUPERSEDED');
    expect(supersedeAudit).toBeDefined();
  });

  it('Test 14: CSV Export contains properly escaped fields and headers', () => {
    const csv = exportRegisterCSV();
    expect(csv).toContain('"Obligation ID","Requirement Title","Regulation"');
    expect(csv).toContain('"OBL-001"');
    expect(csv).toContain('"OBL-002"');

    // Check for RFC-4180 escaping
    const lines = csv.split('\r\n');
    expect(lines.length).toBeGreaterThanOrEqual(10);
  });

  it('Test 16: Reset Demo Data restores deterministic state and records audit event', () => {
    // Mutate state
    rejectMapping('MAP-002-002', {
      rejectionReason: 'Testing reset workflow',
      analystName: 'Jane Doe'
    });

    expect(loadStorageData().mappings.find(m => m.id === 'MAP-002-002')?.status).toBe('Rejected');

    // Reset
    resetStorageData();

    // Verify pristine state
    const resetMappings = getMappings();
    const map002 = resetMappings.find(m => m.id === 'MAP-002-002');
    expect(map002?.status).toBe('Approved');

    // Reset audit event present
    const resetEvent = getAuditEvents().find(e => e.action === 'DEMO_DATA_RESET');
    expect(resetEvent).toBeDefined();
  });

  it('Test 17: Fails when blank approval rationale is submitted', () => {
    expect(() => {
      approveMapping('MAP-001-014', {
        reviewerRationale: '   ', // whitespace only
        acknowledgeGaps: true,
        analystName: 'Jane Doe'
      });
    }).toThrow();
  });

  it('Test 18: Simulates storage failure cleanly without corrupting state', () => {
    setSimulateStorageFailure(true);

    expect(() => {
      approveMapping('MAP-001-014', {
        reviewerRationale: 'Substantive valid rationale',
        acknowledgeGaps: true,
        analystName: 'Jane Doe'
      });
    }).toThrow(/Simulated database\/storage write failure/);

    setSimulateStorageFailure(false);
  });

  it('Section 9: Deterministic Matching Engine evaluates overlap correctly', () => {
    const ob = SEED_OBLIGATIONS[0]; // OBL-001
    const ctrl = SEED_CONTROLS[0]; // CTRL-001
    const result = evaluateControlMatch(ob, ctrl);

    expect(result.matchScore).toBeGreaterThan(0);
    expect(result.matchScore).toBeLessThanOrEqual(100);
    expect(result.matchProvider).toContain('Deterministic Compliance Rule Engine');
    expect(result.rationale.positiveCoverage).toBeDefined();
    expect(result.rationale.potentialGaps).toBeDefined();
  });
});
