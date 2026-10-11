import { 
  RegulatoryObligation, 
  InternalControl, 
  ControlMapping, 
  AuditEvent 
} from '../types';

export const DEMO_ORGANIZATION = {
  name: "Northstar Demo Bank",
  disclaimer: "Fictional demo organization — not a real bank.",
  analyst: {
    id: "USR-0941",
    name: "Jane Doe",
    role: "Senior Compliance Officer",
    division: "Enterprise Risk & Regulatory Affairs",
  }
};

export const SEED_OBLIGATIONS: RegulatoryObligation[] = [
  {
    id: "OBL-001",
    title: "Customer Identity Record Periodic Reviews",
    normalizedRequirement: "Customer identity records must be reviewed periodically in accordance with the applicable risk schedule, documented with audit verification, and escalated when discrepancies or missing beneficial ownership details are identified.",
    regulationName: "Fictional AML & Customer Due Diligence Standard (FD-AML-2025)",
    sourceDocumentId: "DOC-REG-01",
    sourceDocumentVersion: "v2.1 (2025)",
    sourceSection: "Section 4.2",
    sourcePage: 14,
    sourceExcerpt: "Regulated entities shall institute periodic reviews of customer identification profiles at intervals proportionate to customer risk tier. All review findings must be retained in a tamper-evident audit repository, and material discrepancies must trigger escalation to the compliance committee within five business days.",
    jurisdiction: "Federal Reserve & OCC (Simulated Framework)",
    businessFunction: "Financial Crime & AML",
    applicabilityStatus: "Applicable",
    effectiveDate: "2025-01-01",
    sourceVerificationStatus: "Synthetic demo source",
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z",
    requirementComponents: [
      {
        id: "RC-001-A",
        obligationId: "OBL-001",
        statement: "Customer identity records are within scope of periodic review",
        sourceExcerpt: "institute periodic reviews of customer identification profiles at intervals proportionate to customer risk tier",
        sourceSection: "Section 4.2.1"
      },
      {
        id: "RC-001-B",
        obligationId: "OBL-001",
        statement: "Reviews occur on an established periodic schedule",
        sourceExcerpt: "at intervals proportionate to customer risk tier",
        sourceSection: "Section 4.2.1"
      },
      {
        id: "RC-001-C",
        obligationId: "OBL-001",
        statement: "Review findings and records are formally documented with audit verification",
        sourceExcerpt: "retained in a tamper-evident audit repository",
        sourceSection: "Section 4.2.2"
      },
      {
        id: "RC-001-D",
        obligationId: "OBL-001",
        statement: "Material discrepancies and missing beneficial ownership are escalated",
        sourceExcerpt: "material discrepancies must trigger escalation to the compliance committee within five business days",
        sourceSection: "Section 4.2.3"
      }
    ]
  },
  {
    id: "OBL-002",
    title: "Real-Time Sanctions Screening on Wire Transfers",
    normalizedRequirement: "All cross-border and high-value domestic wire payment messages must undergo automated real-time screening against designated sanctions lists prior to final settlement release.",
    regulationName: "Global Sanctions & Counter-Terrorist Financing Standard (GS-CTF-2024)",
    sourceDocumentId: "DOC-REG-02",
    sourceDocumentVersion: "v3.0 (2024)",
    sourceSection: "Clause 7.1",
    sourcePage: 28,
    sourceExcerpt: "Institutions executing wire transfers must perform automated, pre-settlement screening against current domestic and international embargo registries. Systemic blocks must prevent unauthorized funds disbursement pending manual investigator clearance.",
    jurisdiction: "International Payments Authority (Simulated)",
    businessFunction: "Payments & Treasury",
    applicabilityStatus: "Applicable",
    effectiveDate: "2024-06-15",
    sourceVerificationStatus: "Synthetic demo source",
    createdAt: "2024-06-20T11:00:00Z",
    updatedAt: "2025-01-15T14:30:00Z",
    requirementComponents: [
      {
        id: "RC-002-A",
        obligationId: "OBL-002",
        statement: "Cross-border and domestic wire messages are screened in real-time",
        sourceExcerpt: "automated, pre-settlement screening against current domestic and international embargo registries",
        sourceSection: "Clause 7.1.a"
      },
      {
        id: "RC-002-B",
        obligationId: "OBL-002",
        statement: "Automated block occurs prior to settlement release upon alert hit",
        sourceExcerpt: "Systemic blocks must prevent unauthorized funds disbursement pending manual investigator clearance",
        sourceSection: "Clause 7.1.b"
      },
      {
        id: "RC-002-C",
        obligationId: "OBL-002",
        statement: "Screening lists updated synchronously with official embargo publications",
        sourceExcerpt: "against current domestic and international embargo registries",
        sourceSection: "Clause 7.1.c"
      }
    ]
  },
  {
    id: "OBL-003",
    title: "Third-Party Cloud Service Resilience Testing",
    normalizedRequirement: "Critical third-party cloud infrastructure supporting banking operations must be subjected to annual scenario-based operational resilience testing and disaster failover simulation.",
    regulationName: "Digital Operational Resilience & Outsourcing Code (DOR-2025)",
    sourceDocumentId: "DOC-REG-03",
    sourceDocumentVersion: "v1.4 (2025)",
    sourceSection: "Article 12",
    sourcePage: 45,
    sourceExcerpt: "The management body shall ensure that critical cloud service providers undergo severe-but-plausible scenario stress testing at least once every 12 months, including documented maximum tolerable downtime (MTD) validation and multi-region failover tests.",
    jurisdiction: "Prudential Supervision Authority (Simulated)",
    businessFunction: "IT Operations & Cloud",
    applicabilityStatus: "Applicable",
    effectiveDate: "2025-03-01",
    sourceVerificationStatus: "Synthetic demo source",
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-03-05T09:15:00Z",
    requirementComponents: [
      {
        id: "RC-003-A",
        obligationId: "OBL-003",
        statement: "Critical cloud providers undergo annual operational resilience scenario testing",
        sourceExcerpt: "severe-but-plausible scenario stress testing at least once every 12 months",
        sourceSection: "Article 12.1"
      },
      {
        id: "RC-003-B",
        obligationId: "OBL-003",
        statement: "Maximum tolerable downtime (MTD) and recovery objectives are verified",
        sourceExcerpt: "documented maximum tolerable downtime (MTD) validation",
        sourceSection: "Article 12.2"
      },
      {
        id: "RC-003-C",
        obligationId: "OBL-003",
        statement: "Multi-region failover simulation is executed with third-party participation",
        sourceExcerpt: "including multi-region failover tests",
        sourceSection: "Article 12.3"
      }
    ]
  },
  {
    id: "OBL-004",
    title: "Major Cyber Incident Regulatory Escalation within 4 Hours",
    normalizedRequirement: "Any cyber incident resulting in unauthorized data access or disruption to core transactional banking channels must be notified to the designated regulatory authority within 4 hours of confirmation.",
    regulationName: "Cybersecurity Notification & Incident Governance Rule (CN-2024)",
    sourceDocumentId: "DOC-REG-04",
    sourceDocumentVersion: "v2.0 (2024)",
    sourceSection: "Section 3.4",
    sourcePage: 9,
    sourceExcerpt: "A banking organization must notify its primary federal regulator of any major computer-security incident no later than 36 hours after determination, with critical service disruptions requiring immediate verbal or encrypted electronic notification within 4 hours.",
    jurisdiction: "Cyber Risk Regulatory Council (Simulated)",
    businessFunction: "Information Security",
    applicabilityStatus: "Applicable",
    effectiveDate: "2024-09-01",
    sourceVerificationStatus: "Synthetic demo source",
    createdAt: "2024-09-15T08:00:00Z",
    updatedAt: "2025-02-14T16:00:00Z",
    requirementComponents: [
      {
        id: "RC-004-A",
        obligationId: "OBL-004",
        statement: "Detection and severity classification of major cyber disruption incidents",
        sourceExcerpt: "any major computer-security incident no later than 36 hours after determination",
        sourceSection: "Section 3.4.1"
      },
      {
        id: "RC-004-B",
        obligationId: "OBL-004",
        statement: "Regulatory notification transmitted within strict 4-hour window for critical channels",
        sourceExcerpt: "critical service disruptions requiring immediate notification within 4 hours",
        sourceSection: "Section 3.4.2"
      },
      {
        id: "RC-004-C",
        obligationId: "OBL-004",
        statement: "Documentation of incident root cause and initial containment strategy",
        sourceExcerpt: "submitting detailed containment timeline and impact analysis",
        sourceSection: "Section 3.4.4"
      }
    ]
  },
  {
    id: "OBL-005",
    title: "Prudential Capital Adequacy & Quarterly Stress Testing Disclosure",
    normalizedRequirement: "Tier 1 capital ratios must be calculated monthly under standard and stressed scenarios, reviewed by the board risk committee, and publicly disclosed on a quarterly basis.",
    regulationName: "Prudential Capital & Basel III Implementation Framework (BC-2023)",
    sourceDocumentId: "DOC-REG-05",
    sourceDocumentVersion: "v4.0 (2023)",
    sourceSection: "Pillar 3, Section 8",
    sourcePage: 88,
    sourceExcerpt: "Institutions shall publish quarterly public disclosures detailing Pillar 1 and Pillar 2 capital buffers, risk-weighted asset classifications, and supervisory stress simulation outcomes signed by the Chief Risk Officer.",
    jurisdiction: "Prudential Supervision Authority (Simulated)",
    businessFunction: "Capital Management & Treasury",
    applicabilityStatus: "Applicable",
    effectiveDate: "2023-11-01",
    sourceVerificationStatus: "Synthetic demo source",
    createdAt: "2023-11-15T12:00:00Z",
    updatedAt: "2025-01-20T10:00:00Z",
    requirementComponents: [
      {
        id: "RC-005-A",
        obligationId: "OBL-005",
        statement: "Calculation of Tier 1 capital ratios under baseline and stress assumptions",
        sourceExcerpt: "Pillar 1 and Pillar 2 capital buffers, risk-weighted asset classifications",
        sourceSection: "Section 8.1"
      },
      {
        id: "RC-005-B",
        obligationId: "OBL-005",
        statement: "Executive Risk Committee review and sign-off by Chief Risk Officer",
        sourceExcerpt: "signed by the Chief Risk Officer and reviewed by the risk committee",
        sourceSection: "Section 8.3"
      },
      {
        id: "RC-005-C",
        obligationId: "OBL-005",
        statement: "Public Pillar 3 transparency disclosure published on quarterly schedule",
        sourceExcerpt: "publish quarterly public disclosures detailing buffers and stress outcomes",
        sourceSection: "Section 8.4"
      }
    ]
  },
  {
    id: "OBL-006",
    title: "Algorithmic Lending Model Bias Auditing & Disparate Impact Testing",
    normalizedRequirement: "Automated credit decision algorithms and artificial intelligence underwriting models must be independently audited for disparate demographic impact and model drift prior to production deployment and semi-annually thereafter.",
    regulationName: "Fair Lending & Algorithmic Accountability Rule (FL-AA-2025)",
    sourceDocumentId: "DOC-REG-06",
    sourceDocumentVersion: "v1.0 (2025)",
    sourceSection: "Rule 5.1",
    sourcePage: 22,
    sourceExcerpt: "All algorithmic models influencing credit terms, pricing, or approval must undergo pre-deployment and semi-annual bias audits utilizing standardized disparate impact parity tests across protected demographic categories.",
    jurisdiction: "Consumer Financial Protection Bureau (Simulated)",
    businessFunction: "Retail Lending & Credit Risk",
    applicabilityStatus: "Applicable",
    effectiveDate: "2025-04-01",
    sourceVerificationStatus: "Synthetic demo source",
    createdAt: "2025-01-05T14:00:00Z",
    updatedAt: "2025-01-05T14:00:00Z",
    requirementComponents: [
      {
        id: "RC-006-A",
        obligationId: "OBL-006",
        statement: "Pre-deployment fairness audit of automated credit underwriting algorithms",
        sourceExcerpt: "undergo pre-deployment and semi-annual bias audits",
        sourceSection: "Rule 5.1.a"
      },
      {
        id: "RC-006-B",
        obligationId: "OBL-006",
        statement: "Standardized disparate impact parity metrics calculated across protected groups",
        sourceExcerpt: "utilizing standardized disparate impact parity tests across protected demographic categories",
        sourceSection: "Rule 5.1.b"
      },
      {
        id: "RC-006-C",
        obligationId: "OBL-006",
        statement: "Semi-annual recurring drift and adverse impact re-certification",
        sourceExcerpt: "semi-annually thereafter by an independent model governance unit",
        sourceSection: "Rule 5.1.c"
      }
    ]
  },
  {
    id: "OBL-007",
    title: "Market Abuse & Personal Account Dealing Pre-Clearance",
    normalizedRequirement: "Covered employees possessing access to material non-public information (MNPI) must pre-clear all personal securities transactions through automated compliance software and adhere to minimum 30-day holding periods.",
    regulationName: "Market Abuse & Code of Conduct Regulation (MAC-2024)",
    sourceDocumentId: "DOC-REG-07",
    sourceDocumentVersion: "v1.2 (2024)",
    sourceSection: "Section 9.5",
    sourcePage: 33,
    sourceExcerpt: "Employees designated on insider project lists are barred from trading securities without prior written or electronic pre-clearance. Transactions cleared remain valid for 24 hours, and positions acquired must be maintained for not less than 30 consecutive calendar days.",
    jurisdiction: "Securities & Markets Oversight Agency (Simulated)",
    businessFunction: "Corporate Compliance & Ethics",
    applicabilityStatus: "Applicable",
    effectiveDate: "2024-05-15",
    sourceVerificationStatus: "Synthetic demo source",
    createdAt: "2024-05-20T10:00:00Z",
    updatedAt: "2025-02-18T11:45:00Z",
    requirementComponents: [
      {
        id: "RC-007-A",
        obligationId: "OBL-007",
        statement: "Maintenance of insider lists and covered employee classification",
        sourceExcerpt: "Employees designated on insider project lists",
        sourceSection: "Section 9.5.1"
      },
      {
        id: "RC-007-B",
        obligationId: "OBL-007",
        statement: "Mandatory pre-clearance workflow prior to order placement",
        sourceExcerpt: "without prior written or electronic pre-clearance valid for 24 hours",
        sourceSection: "Section 9.5.2"
      },
      {
        id: "RC-007-C",
        obligationId: "OBL-007",
        statement: "Minimum 30-day holding period enforcement on acquired securities",
        sourceExcerpt: "positions acquired must be maintained for not less than 30 consecutive calendar days",
        sourceSection: "Section 9.5.3"
      }
    ]
  },
  {
    id: "OBL-008",
    title: "Liquidity Coverage Ratio (LCR) Daily Calculation & Buffer Maintenance",
    normalizedRequirement: "The bank must calculate its Liquidity Coverage Ratio on each business day, ensuring unencumbered High-Quality Liquid Assets (HQLA) exceed 100% of projected total net cash outflows over a 30-day stress horizon.",
    regulationName: "Liquidity Risk & Stress Horizon Standards (LCR-2023)",
    sourceDocumentId: "DOC-REG-08",
    sourceDocumentVersion: "v2.0 (2023)",
    sourceSection: "Article 4",
    sourcePage: 17,
    sourceExcerpt: "Credit institutions shall maintain a liquidity buffer sufficient to ensure that the liquidity coverage ratio equals or exceeds 100% calculated at the close of business daily.",
    jurisdiction: "Central Banking Authority (Simulated)",
    businessFunction: "Treasury & Balance Sheet Management",
    applicabilityStatus: "Under Review",
    effectiveDate: "2023-10-01",
    sourceVerificationStatus: "Synthetic demo source",
    createdAt: "2023-10-10T08:30:00Z",
    updatedAt: "2025-01-12T15:20:00Z",
    requirementComponents: [
      {
        id: "RC-008-A",
        obligationId: "OBL-008",
        statement: "Daily calculation of High-Quality Liquid Assets (HQLA) at close of business",
        sourceExcerpt: "liquidity coverage ratio calculated at the close of business daily",
        sourceSection: "Article 4.1"
      },
      {
        id: "RC-008-B",
        obligationId: "OBL-008",
        statement: "Projected 30-calendar-day net cash outflow stress modeling",
        sourceExcerpt: "projected net cash outflows over a 30-day stressed liquidity scenario",
        sourceSection: "Article 4.2"
      },
      {
        id: "RC-008-C",
        obligationId: "OBL-008",
        statement: "Automatic supervisory escalation if buffer breaches 105% early-warning threshold",
        sourceExcerpt: "early warning notice to the competent authority upon ratio falling below 105%",
        sourceSection: "Article 4.5"
      }
    ]
  }
];

export const SEED_CONTROLS: InternalControl[] = [
  {
    id: "CTRL-001",
    name: "Customer Due Diligence (CDD) Refresh Workflow",
    description: "Customer Operations analysts perform scheduled KYC refresh reviews for existing retail and commercial accounts based on risk tiering.",
    ownerRole: "Head of Customer Onboarding & KYC Operations",
    frequency: "Annual / Triennial based on risk tier",
    businessFunction: "Financial Crime & AML",
    designStatus: "Partially Effective",
    evidenceStatus: "Pending Verification",
    sourceDocumentId: "INT-POL-01",
    sourceDocumentVersion: "v3.2",
    sourceSection: "Procedure 14",
    sourcePage: 12,
    sourceExcerpt: "Customer operations initiates annual reviews for High-Risk accounts and triennial for Low-to-Medium risk accounts. Completed checks are recorded in the client master portal.",
    requirementComponentsAddressed: ["RC-001-A", "RC-001-B"],
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2025-01-20T11:00:00Z",
  },
  {
    id: "CTRL-002",
    name: "Automated SWIFT & Fedwire Sanctions Filter Engine",
    description: "Real-time algorithmic screening gateway intercepts all outbound and inbound payment messages against OFAC, EU, UN, and UK sanctions lists before gateway release.",
    ownerRole: "Payment Systems Engineering & AML Compliance",
    frequency: "Continuous / Real-time per transaction",
    businessFunction: "Payments & Treasury",
    designStatus: "Effective",
    evidenceStatus: "Verified",
    sourceDocumentId: "INT-SYS-04",
    sourceDocumentVersion: "v5.1",
    sourceSection: "System Spec 3.2",
    sourcePage: 7,
    sourceExcerpt: "Every wire transaction generated via SWIFT Alliance or Fedwire gateway is halted in queue until real-time fuzzy matcher confirms zero positive sanctions hit. Hits hold the transaction indefinitely pending level-2 investigator adjudication.",
    requirementComponentsAddressed: ["RC-002-A", "RC-002-B", "RC-002-C"],
    createdAt: "2023-08-10T14:00:00Z",
    updatedAt: "2025-02-10T10:00:00Z",
  },
  {
    id: "CTRL-003",
    name: "Anti-Money Laundering Exception Escalation Protocol",
    description: "Workflow for frontline and operations staff to formally log KYC file discrepancies, beneficial ownership gaps, and suspicion memos to the Financial Crime Escalation Committee.",
    ownerRole: "AML Investigations Lead",
    frequency: "Event-driven (within 48 hours of detection)",
    businessFunction: "Financial Crime & AML",
    designStatus: "Effective",
    evidenceStatus: "Verified",
    sourceDocumentId: "INT-SOP-09",
    sourceDocumentVersion: "v2.0",
    sourceSection: "SOP-AML-09",
    sourcePage: 5,
    sourceExcerpt: "Any unresolved documentation deficit or beneficial ownership mismatch discovered during review must be submitted to the committee ticket queue within 48 hours.",
    requirementComponentsAddressed: ["RC-001-C", "RC-001-D"],
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2025-01-18T16:00:00Z",
  },
  {
    id: "CTRL-004",
    name: "Daily Liquidity Ratio Automation & Balance Reconciliation",
    description: "Treasury automated batch job extracts end-of-day balances across central bank reserves and sovereign bond holdings to compute daily Liquidity Coverage Ratio.",
    ownerRole: "Treasury Senior Risk Manager",
    frequency: "Daily at 18:00 EST",
    businessFunction: "Treasury & Balance Sheet Management",
    designStatus: "Effective",
    evidenceStatus: "Verified",
    sourceDocumentId: "INT-FIN-02",
    sourceDocumentVersion: "v1.8",
    sourceSection: "Section 2.1",
    sourcePage: 9,
    sourceExcerpt: "Automated calculations compute HQLA numerator and 30-day net stressed outflow denominator daily at 18:00 EST, triggering email alerts to Treasury leadership.",
    requirementComponentsAddressed: ["RC-008-A", "RC-008-B"],
    createdAt: "2023-12-05T08:00:00Z",
    updatedAt: "2025-02-22T09:00:00Z",
  },
  {
    id: "CTRL-005",
    name: "Quarterly Basel Pillar 3 Disclosures & Risk Committee Governance",
    description: "Risk reporting team drafts quarterly Pillar 3 capital adequacy reports, conducts sensitivity stress tests, and presents metrics to Executive Risk Committee for sign-off.",
    ownerRole: "Head of Regulatory Capital Management",
    frequency: "Quarterly",
    businessFunction: "Capital Management & Treasury",
    designStatus: "Effective",
    evidenceStatus: "Verified",
    sourceDocumentId: "INT-POL-08",
    sourceDocumentVersion: "v4.0",
    sourceSection: "Chapter 6",
    sourcePage: 34,
    sourceExcerpt: "Risk reporting gathers capital metrics quarterly, coordinates board committee sign-off, and submits investor disclosures to investor relations portal.",
    requirementComponentsAddressed: ["RC-005-A", "RC-005-B", "RC-005-C"],
    createdAt: "2024-02-12T11:00:00Z",
    updatedAt: "2025-01-25T15:00:00Z",
  },
  {
    id: "CTRL-006",
    name: "Personal Account Trading Pre-Clearance Compliance Portal",
    description: "Restricted personnel submit trade pre-clearance requests via automated portal which cross-references restricted lists, blackout windows, and enforces 30-day holding periods.",
    ownerRole: "Chief Compliance Officer & Ethics Bureau",
    frequency: "Continuous / Pre-trade submission",
    businessFunction: "Corporate Compliance & Ethics",
    designStatus: "Effective",
    evidenceStatus: "Verified",
    sourceDocumentId: "INT-ETH-01",
    sourceDocumentVersion: "v2.5",
    sourceSection: "Policy Annex A",
    sourcePage: 18,
    sourceExcerpt: "All covered staff must obtain instant or manual approval before submitting broker execution orders. Trade approvals expire at market close.",
    requirementComponentsAddressed: ["RC-007-B", "RC-007-C"],
    createdAt: "2024-04-10T13:00:00Z",
    updatedAt: "2025-02-14T11:00:00Z",
  },
  {
    id: "CTRL-007",
    name: "Insider Project Registration & Conflict List Maintenance",
    description: "M&A, advisory, and compliance teams maintain real-time repository of confidential client engagements and flag employees with MNPI access.",
    ownerRole: "Control Room Compliance Manager",
    frequency: "Event-driven / Weekly audit",
    businessFunction: "Corporate Compliance & Ethics",
    designStatus: "Partially Effective",
    evidenceStatus: "Pending Verification",
    sourceDocumentId: "INT-ETH-03",
    sourceDocumentVersion: "v1.1",
    sourceSection: "SOP-CR-02",
    sourcePage: 6,
    sourceExcerpt: "Project leads must submit deal team manifests within 4 hours of transaction kickoff to establish trading embargoes.",
    requirementComponentsAddressed: ["RC-007-A"],
    createdAt: "2024-05-01T09:00:00Z",
    updatedAt: "2025-01-10T14:00:00Z",
  },
  {
    id: "CTRL-008",
    name: "Third-Party Cloud Provider Disaster Recovery & Fallback Test",
    description: "Enterprise Architecture conducts disaster recovery drills across AWS and Azure environments to evaluate database failover times.",
    ownerRole: "Director of Infrastructure Resilience",
    frequency: "Annual",
    businessFunction: "IT Operations & Cloud",
    designStatus: "Partially Effective",
    evidenceStatus: "Pending Verification",
    sourceDocumentId: "INT-IT-09",
    sourceDocumentVersion: "v2.0",
    sourceSection: "BCP Section 4",
    sourcePage: 23,
    sourceExcerpt: "Engineering conducts annual simulated database primary-to-secondary switchovers. Multi-region complete failover is currently excluded from standard drill scope due to cost constraints.",
    requirementComponentsAddressed: ["RC-003-A", "RC-003-B"],
    createdAt: "2024-06-15T15:00:00Z",
    updatedAt: "2025-02-05T13:30:00Z",
  },
  {
    id: "CTRL-009",
    name: "Informal Capital Buffer Monitoring Spreadsheet",
    description: "Spreadsheet tracker compiled by junior treasury analyst to view capital buffer movements without formal board governance or validation.",
    ownerRole: "Junior Treasury Analyst",
    frequency: "Ad-hoc / Monthly",
    businessFunction: "Capital Management & Treasury",
    designStatus: "Deficient",
    evidenceStatus: "Missing Evidence",
    sourceDocumentId: "INT-AD-HOC",
    sourceDocumentVersion: "v0.3",
    sourceSection: "N/A",
    sourcePage: 1,
    sourceExcerpt: "Spreadsheet maintained on network share. Does not contain formal supervisory sign-off or validated macro stress scenarios.",
    requirementComponentsAddressed: ["RC-005-A"],
    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-08-11T12:00:00Z",
  },
  {
    id: "CTRL-010",
    name: "Enterprise Security Incident Response Escalation Playbook",
    description: "SOC analysts triage alerts, contain detected perimeter breaches, and trigger management notifications for confirmed critical security incidents.",
    ownerRole: "CISO & Head of Cyber Operations",
    frequency: "24/7 Continuous Monitoring",
    businessFunction: "Information Security",
    designStatus: "Partially Effective",
    evidenceStatus: "Pending Verification",
    sourceDocumentId: "INT-SEC-01",
    sourceDocumentVersion: "v4.2",
    sourceSection: "Section 5 - Incident Triage",
    sourcePage: 15,
    sourceExcerpt: "SOC escalation initiates within 60 minutes of confirmation. External regulatory notification is coordinated by legal counsel, with typical initial advisories filed within 24 to 36 hours.",
    requirementComponentsAddressed: ["RC-004-A", "RC-004-C"],
    createdAt: "2023-11-20T08:00:00Z",
    updatedAt: "2025-01-30T17:00:00Z",
  },
  {
    id: "CTRL-014",
    name: "Customer Record Review & Profile Maintenance",
    description: "Operations staff review selected customer records according to an established schedule in the core banking system.",
    ownerRole: "Customer Operations Lead",
    frequency: "Quarterly",
    businessFunction: "Financial Crime & AML",
    designStatus: "Partially Effective",
    evidenceStatus: "Pending Verification",
    sourceDocumentId: "INT-OPS-14",
    sourceDocumentVersion: "v1.5",
    sourceSection: "Section 3.1",
    sourcePage: 6,
    sourceExcerpt: "Operations staff review selected customer identity records quarterly. The sampling methodology focuses on corporate accounts with activity over $100,000.",
    requirementComponentsAddressed: ["RC-001-A", "RC-001-B"],
    createdAt: "2024-02-18T10:00:00Z",
    updatedAt: "2025-01-22T14:00:00Z",
  }
];

export const SEED_MAPPINGS: ControlMapping[] = [
  // Mapping 1: OBL-001 <-> CTRL-014 (Suggested / Partial coverage awaiting review)
  {
    id: "MAP-001-014",
    obligationId: "OBL-001",
    controlId: "CTRL-014",
    status: "Suggested",
    matchScore: 86,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "The control describes periodic reviews of customer identity records and enforces quarterly cadence for active business accounts.",
      potentialGaps: "The control does not specify which customer categories are included (retail vs corporate) nor does it mandate formal escalation within 5 days when discrepancies or beneficial ownership gaps are identified.",
      suggestedReviewerAction: "Confirm the covered population and verify integration with CTRL-003 (Discrepancy Escalation Protocol) before final approval.",
      scoreBreakdown: {
        componentOverlap: 40,
        processAlignment: 22,
        frequencyAndOwnership: 14,
        supportingMetadata: 10
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-001-A",
        status: "Supported",
        supportingExcerpt: "Operations staff review selected customer identity records quarterly.",
        rationale: "Control explicitly targets customer identity profile documentation.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-001-B",
        status: "Supported",
        supportingExcerpt: "Quarterly review cadence specified in operating procedure Section 3.1.",
        rationale: "Quarterly schedule satisfies periodic review requirement.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-001-C",
        status: "Partially supported",
        supportingExcerpt: "Core banking audit trail logs review date and staff ID.",
        rationale: "Audit log exists but lacks independent verification protocol.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-001-D",
        status: "Unknown",
        supportingExcerpt: "No escalation procedure identified in CTRL-014 documentation.",
        rationale: "Escalation to compliance committee within 5 days is absent from this procedure.",
        analystReviewed: false,
      }
    ],
    version: 1,
    active: true,
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z"
  },

  // Mapping 2: OBL-001 <-> CTRL-001 (Draft mapping undergoing analyst edits)
  {
    id: "MAP-001-001",
    obligationId: "OBL-001",
    controlId: "CTRL-001",
    status: "Draft",
    matchScore: 78,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "Covers customer due diligence refresh and risk-tier frequency for customer profiles.",
      potentialGaps: "Lacks explicit 5-day regulatory committee escalation mechanism.",
      suggestedReviewerAction: "Pair with CTRL-003 to achieve composite compliance coverage.",
      scoreBreakdown: {
        componentOverlap: 36,
        processAlignment: 20,
        frequencyAndOwnership: 12,
        supportingMetadata: 10
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-001-A",
        status: "Supported",
        supportingExcerpt: "Customer operations initiates annual reviews for High-Risk accounts.",
        rationale: "Customer identification profiles are systematically refreshed.",
        analystReviewed: true,
        reviewerNote: "Confirmed during Q1 operations walkthrough."
      },
      {
        requirementComponentId: "RC-001-B",
        status: "Supported",
        supportingExcerpt: "Annual for High-Risk and triennial for Low-to-Medium risk accounts.",
        rationale: "Frequency matches risk-based schedule.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-001-C",
        status: "Supported",
        supportingExcerpt: "Completed checks are recorded in the client master portal.",
        rationale: "Portal maintains verifiable logs.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-001-D",
        status: "Not supported",
        supportingExcerpt: "Procedure 14 does not provide discrepancy escalation workflow.",
        rationale: "Frontend staff cannot escalate directly to AML committee via this control.",
        analystReviewed: true,
        reviewerNote: "Discrepancies require handover to CTRL-003."
      }
    ],
    reviewerNotes: "Working draft: will submit after cross-referencing CTRL-003 exception tickets.",
    version: 1,
    active: true,
    createdAt: "2025-02-02T11:00:00Z",
    updatedAt: "2025-02-05T14:30:00Z"
  },

  // Mapping 3: OBL-002 <-> CTRL-002 (Fully Approved mapping)
  {
    id: "MAP-002-002",
    obligationId: "OBL-002",
    controlId: "CTRL-002",
    status: "Approved",
    matchScore: 98,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "All SWIFT Alliance and Fedwire outbound/inbound payments intercepted prior to release. Fully verified against OFAC and international sanctions registries.",
      potentialGaps: "None identified. Independent model audit completed in Q4 2024.",
      suggestedReviewerAction: "Approved. Maintain quarterly list synchronization health checks.",
      scoreBreakdown: {
        componentOverlap: 50,
        processAlignment: 25,
        frequencyAndOwnership: 15,
        supportingMetadata: 8
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-002-A",
        status: "Supported",
        supportingExcerpt: "Every wire transaction generated via SWIFT Alliance or Fedwire gateway is halted in queue.",
        rationale: "Continuous automated pre-settlement screening matches regulatory mandate.",
        analystReviewed: true,
        reviewerNote: "Architecture documentation confirms hard gate before release."
      },
      {
        requirementComponentId: "RC-002-B",
        status: "Supported",
        supportingExcerpt: "Hits hold the transaction indefinitely pending level-2 investigator adjudication.",
        rationale: "Systemic lock prevents automated release until human investigator sign-off.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-002-C",
        status: "Supported",
        supportingExcerpt: "Sanctions list engine updates automatically via hourly delta feeds from official regulatory authorities.",
        rationale: "Screening lists remain synchronous with published sanctions.",
        analystReviewed: true,
      }
    ],
    reviewerRationale: "Comprehensive technical control with 100% component coverage, real-time message blocking, and verified audit history.",
    reviewedBy: "Jane Doe (Senior Compliance Officer)",
    reviewedAt: "2025-02-10T16:00:00Z",
    version: 1,
    active: true,
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-02-10T16:00:00Z"
  },

  // Mapping 4: OBL-003 <-> CTRL-008 (Needs Information example)
  {
    id: "MAP-003-008",
    obligationId: "OBL-003",
    controlId: "CTRL-008",
    status: "Needs Information",
    matchScore: 68,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "Conducts annual database disaster recovery tests.",
      potentialGaps: "Multi-region failover and external cloud provider involvement are explicitly noted as excluded in the internal standard due to budget.",
      suggestedReviewerAction: "Request formal clarification from Cloud Architecture on multi-region failover schedule.",
      scoreBreakdown: {
        componentOverlap: 30,
        processAlignment: 18,
        frequencyAndOwnership: 12,
        supportingMetadata: 8
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-003-A",
        status: "Supported",
        supportingExcerpt: "Engineering conducts annual simulated database primary-to-secondary switchovers.",
        rationale: "Annual cadence satisfied for database tier.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-003-B",
        status: "Partially supported",
        supportingExcerpt: "Database RTO/RPO tested; full application MTD unverified.",
        rationale: "MTD validation exists only for isolated databases, not full banking stack.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-003-C",
        status: "Unknown",
        supportingExcerpt: "Multi-region complete failover is currently excluded from standard drill scope.",
        rationale: "Third-party cloud provider joint participation is not documented.",
        analystReviewed: true,
        reviewerNote: "Awaiting SLA response from Enterprise Architecture."
      }
    ],
    requestedInformation: {
      informationRequired: "Documentation on whether annual disaster recovery tests include cross-region failover and direct cloud provider SLA verification.",
      reason: "Article 12.3 requires multi-region testing with third-party participation. Current internal policy lists this as excluded.",
      requestedRole: "Director of Infrastructure Resilience",
      dueDate: "2025-04-15",
      requestedAt: "2025-03-02T14:00:00Z",
      requestedBy: "Jane Doe (Senior Compliance Officer)"
    },
    version: 1,
    active: true,
    createdAt: "2025-02-28T09:30:00Z",
    updatedAt: "2025-03-02T14:00:00Z"
  },

  // Mapping 5: OBL-004 <-> CTRL-010 (Pending Review example)
  {
    id: "MAP-004-010",
    obligationId: "OBL-004",
    controlId: "CTRL-010",
    status: "Pending Review",
    matchScore: 72,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "24/7 security incident monitoring and triage within 60 minutes.",
      potentialGaps: "Playbook indicates regulatory advisories are filed within 24 to 36 hours, which conflicts with the strict 4-hour critical disruption mandate.",
      suggestedReviewerAction: "Update playbook escalation SLA to 4 hours before final approval.",
      scoreBreakdown: {
        componentOverlap: 34,
        processAlignment: 18,
        frequencyAndOwnership: 12,
        supportingMetadata: 8
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-004-A",
        status: "Supported",
        supportingExcerpt: "SOC escalation initiates within 60 minutes of confirmation.",
        rationale: "Severity classification occurs rapidly upon detection.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-004-B",
        status: "Not supported",
        supportingExcerpt: "External regulatory notification is filed within 24 to 36 hours.",
        rationale: "Direct timing conflict with the 4-hour mandate in Section 3.4.2.",
        analystReviewed: true,
        reviewerNote: "Deficiency identified in escalation timeline."
      },
      {
        requirementComponentId: "RC-004-C",
        status: "Supported",
        supportingExcerpt: "Root cause containment timeline prepared by incident commander.",
        rationale: "Containment analysis documentation is standard practice.",
        analystReviewed: true,
      }
    ],
    version: 1,
    active: true,
    createdAt: "2025-02-15T11:00:00Z",
    updatedAt: "2025-02-16T10:00:00Z"
  },

  // Mapping 6: OBL-005 <-> CTRL-009 (Rejected mapping example)
  {
    id: "MAP-005-009",
    obligationId: "OBL-005",
    controlId: "CTRL-009",
    status: "Rejected",
    matchScore: 32,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "Mentions capital buffer tracking numbers.",
      potentialGaps: "Uncontrolled spreadsheet on shared drive. Lacks board governance, validation, and quarterly public disclosure workflow.",
      suggestedReviewerAction: "Reject this mapping immediately. End-user computing spreadsheet cannot be recognized as an enterprise prudential control.",
      scoreBreakdown: {
        componentOverlap: 15,
        processAlignment: 7,
        frequencyAndOwnership: 5,
        supportingMetadata: 5
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-005-A",
        status: "Partially supported",
        supportingExcerpt: "Ad-hoc buffer estimate without macroeconomic stress scenarios.",
        rationale: "Lacks rigorous Pillar 1 and Pillar 2 stress testing methodology.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-005-B",
        status: "Not supported",
        supportingExcerpt: "Spreadsheet lacks formal board committee review or CRO sign-off.",
        rationale: "Zero executive oversight.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-005-C",
        status: "Not supported",
        supportingExcerpt: "No public disclosure capability.",
        rationale: "Internal scratch sheet only.",
        analystReviewed: true,
      }
    ],
    rejectionReason: "Informal, unvalidated end-user spreadsheet cannot be recognized as an enterprise compliance control for prudential capital reporting. Does not satisfy board sign-off or public disclosure requirements.",
    reviewedBy: "Jane Doe (Senior Compliance Officer)",
    reviewedAt: "2025-01-22T14:15:00Z",
    version: 1,
    active: false,
    createdAt: "2025-01-18T09:00:00Z",
    updatedAt: "2025-01-22T14:15:00Z"
  },

  // Mapping 7: OBL-005 <-> CTRL-005 (Approved mapping)
  {
    id: "MAP-005-005",
    obligationId: "OBL-005",
    controlId: "CTRL-005",
    status: "Approved",
    matchScore: 95,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "Robust quarterly Pillar 3 capital disclosures with CRO sign-off and Executive Risk Committee governance.",
      potentialGaps: "None. Direct alignment with Pillar 3 mandate.",
      suggestedReviewerAction: "Approved mapping. Maintain annual policy review.",
      scoreBreakdown: {
        componentOverlap: 50,
        processAlignment: 24,
        frequencyAndOwnership: 14,
        supportingMetadata: 7
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-005-A",
        status: "Supported",
        supportingExcerpt: "Risk reporting gathers capital metrics and stress scenario outcomes.",
        rationale: "Calculates Tier 1 ratios under baseline and stress assumptions.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-005-B",
        status: "Supported",
        supportingExcerpt: "Presents metrics to Executive Risk Committee for sign-off.",
        rationale: "Board risk committee review and CRO sign-off verified.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-005-C",
        status: "Supported",
        supportingExcerpt: "Submits investor disclosures to investor relations portal quarterly.",
        rationale: "Public transparency disclosures meet quarterly deadline.",
        analystReviewed: true,
      }
    ],
    reviewerRationale: "Fully compliant control with established executive sign-off, verifiable audit trail, and published disclosures.",
    reviewedBy: "Jane Doe (Senior Compliance Officer)",
    reviewedAt: "2025-01-26T11:00:00Z",
    version: 1,
    active: true,
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-01-26T11:00:00Z"
  },

  // Mapping 8: OBL-007 <-> CTRL-006 (Approved mapping)
  {
    id: "MAP-007-006",
    obligationId: "OBL-007",
    controlId: "CTRL-006",
    status: "Approved",
    matchScore: 88,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "Pre-clearance portal enforces automated restrictions and 30-day minimum holding periods for restricted personnel.",
      potentialGaps: "Requires upstream integration with CTRL-007 (Insider List Registration).",
      suggestedReviewerAction: "Approved. Verified in conjunction with insider list roster.",
      scoreBreakdown: {
        componentOverlap: 44,
        processAlignment: 22,
        frequencyAndOwnership: 14,
        supportingMetadata: 8
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-007-A",
        status: "Partially supported",
        supportingExcerpt: "Pre-clearance portal relies on active HR insider project classifications.",
        rationale: "Relies on external feed for insider roster classification.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-007-B",
        status: "Supported",
        supportingExcerpt: "All covered staff must obtain instant or manual approval before submitting broker orders.",
        rationale: "Mandatory pre-clearance workflow is systemically enforced.",
        analystReviewed: true,
      },
      {
        requirementComponentId: "RC-007-C",
        status: "Supported",
        supportingExcerpt: "Trade approvals expire at market close; holding period enforced by compliance engine.",
        rationale: "30-day holding period verified.",
        analystReviewed: true,
      }
    ],
    reviewerRationale: "Covers pre-trade clearances and 30-day holding restrictions. Acknowledged partial dependency on insider list registration feed.",
    reviewedBy: "Jane Doe (Senior Compliance Officer)",
    reviewedAt: "2025-02-19T10:30:00Z",
    version: 1,
    active: true,
    createdAt: "2025-02-15T09:00:00Z",
    updatedAt: "2025-02-19T10:30:00Z"
  },

  // Mapping 9: OBL-007 <-> CTRL-007 (Suggested candidate for companion coverage)
  {
    id: "MAP-007-007",
    obligationId: "OBL-007",
    controlId: "CTRL-007",
    status: "Suggested",
    matchScore: 74,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "Maintains real-time repository of confidential client engagements and covered employee rosters.",
      potentialGaps: "Does not execute trade pre-clearance directly.",
      suggestedReviewerAction: "Review as secondary control supporting RC-007-A.",
      scoreBreakdown: {
        componentOverlap: 32,
        processAlignment: 20,
        frequencyAndOwnership: 12,
        supportingMetadata: 10
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-007-A",
        status: "Supported",
        supportingExcerpt: "Project leads must submit deal team manifests within 4 hours of transaction kickoff.",
        rationale: "Directly addresses insider list creation and maintenance.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-007-B",
        status: "Unknown",
        supportingExcerpt: "No trade execution pre-clearance engine in this SOP.",
        rationale: "Pre-clearance handled by separate portal CTRL-006.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-007-C",
        status: "Not supported",
        supportingExcerpt: "Holding period enforcement is outside scope of list registration.",
        rationale: "Not supported by this control.",
        analystReviewed: false,
      }
    ],
    version: 1,
    active: true,
    createdAt: "2025-02-18T14:00:00Z",
    updatedAt: "2025-02-18T14:00:00Z"
  },

  // Mapping 10: OBL-008 <-> CTRL-004 (Suggested mapping for LCR)
  {
    id: "MAP-008-004",
    obligationId: "OBL-008",
    controlId: "CTRL-004",
    status: "Suggested",
    matchScore: 82,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "Automates daily calculation of HQLA and 30-day net stressed outflows at 18:00 EST.",
      potentialGaps: "Does not include automated regulatory notification trigger if ratio falls below 105% early warning threshold.",
      suggestedReviewerAction: "Confirm early-warning escalation threshold before formal approval.",
      scoreBreakdown: {
        componentOverlap: 40,
        processAlignment: 22,
        frequencyAndOwnership: 12,
        supportingMetadata: 8
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-008-A",
        status: "Supported",
        supportingExcerpt: "Automated calculations compute HQLA numerator daily at 18:00 EST.",
        rationale: "Daily HQLA computation verified.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-008-B",
        status: "Supported",
        supportingExcerpt: "Computes 30-day net stressed outflow denominator daily.",
        rationale: "30-day stress horizon modeled.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-008-C",
        status: "Partially supported",
        supportingExcerpt: "Email alerts sent to Treasury leadership; regulatory notification is manual.",
        rationale: "Escalation to authority is not automated in batch script.",
        analystReviewed: false,
      }
    ],
    version: 1,
    active: true,
    createdAt: "2025-01-14T09:00:00Z",
    updatedAt: "2025-01-14T09:00:00Z"
  },

  // Mapping 11: OBL-001 <-> CTRL-003 (Suggested companion for OBL-001)
  {
    id: "MAP-001-003",
    obligationId: "OBL-001",
    controlId: "CTRL-003",
    status: "Suggested",
    matchScore: 65,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "Escalates KYC discrepancies and beneficial ownership gaps to AML committee within 48 hours.",
      potentialGaps: "Does not perform the periodic review itself; acts as downstream exception escalation.",
      suggestedReviewerAction: "Link as secondary control alongside CTRL-001 / CTRL-014.",
      scoreBreakdown: {
        componentOverlap: 30,
        processAlignment: 16,
        frequencyAndOwnership: 11,
        supportingMetadata: 8
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-001-A",
        status: "Unknown",
        supportingExcerpt: "Does not conduct initial review.",
        rationale: "Only handles incoming escalation tickets.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-001-B",
        status: "Not supported",
        supportingExcerpt: "Event-driven frequency, not periodic.",
        rationale: "Triggers on discrepancy detection.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-001-C",
        status: "Supported",
        supportingExcerpt: "Retains ticket queue with verified audit trail.",
        rationale: "Escalations are documented and archived.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-001-D",
        status: "Supported",
        supportingExcerpt: "Submits to committee ticket queue within 48 hours.",
        rationale: "Directly fulfills escalation to compliance committee.",
        analystReviewed: false,
      }
    ],
    version: 1,
    active: true,
    createdAt: "2025-02-01T10:30:00Z",
    updatedAt: "2025-02-01T10:30:00Z"
  },

  // Mapping 12: OBL-004 <-> CTRL-008 (Suggested cross-domain candidate with poor fit)
  {
    id: "MAP-004-008",
    obligationId: "OBL-004",
    controlId: "CTRL-008",
    status: "Suggested",
    matchScore: 28,
    matchProvider: "Deterministic Compliance Rule Engine v1.2",
    matchRationale: {
      positiveCoverage: "Addresses IT infrastructure and database fallback.",
      potentialGaps: "Does not provide cyber incident notification, SOC triage, or external regulatory communication channels.",
      suggestedReviewerAction: "Reject or discard. Control is an annual DR test, not an incident notification mechanism.",
      scoreBreakdown: {
        componentOverlap: 12,
        processAlignment: 8,
        frequencyAndOwnership: 5,
        supportingMetadata: 3
      }
    },
    coverageAssessments: [
      {
        requirementComponentId: "RC-004-A",
        status: "Not supported",
        supportingExcerpt: "DR test does not monitor real-time cyber intrusions.",
        rationale: "Planned drill only.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-004-B",
        status: "Not supported",
        supportingExcerpt: "No 4-hour regulatory escalation pathway.",
        rationale: "Missing regulatory escalation workflow.",
        analystReviewed: false,
      },
      {
        requirementComponentId: "RC-004-C",
        status: "Partially supported",
        supportingExcerpt: "Generates post-drill technical report.",
        rationale: "Produces testing reports but not security breach forensics.",
        analystReviewed: false,
      }
    ],
    version: 1,
    active: true,
    createdAt: "2025-02-15T11:30:00Z",
    updatedAt: "2025-02-15T11:30:00Z"
  }
];

export const SEED_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "AUD-001",
    entityType: "Mapping",
    entityId: "MAP-002-002",
    action: "MAPPING_APPROVED",
    actorId: "USR-0941",
    actorDisplayName: "Jane Doe (Senior Compliance Officer)",
    timestamp: "2025-02-10T16:00:00Z",
    previousState: "Pending Review",
    newState: "Approved",
    reason: "Approved after verifying real-time SWIFT and Fedwire filter test logs. 100% component coverage demonstrated.",
    relatedRecordIds: ["OBL-002", "CTRL-002"]
  },
  {
    id: "AUD-002",
    entityType: "Mapping",
    entityId: "MAP-005-009",
    action: "MAPPING_REJECTED",
    actorId: "USR-0941",
    actorDisplayName: "Jane Doe (Senior Compliance Officer)",
    timestamp: "2025-01-22T14:15:00Z",
    previousState: "Suggested",
    newState: "Rejected",
    reason: "Informal end-user spreadsheet cannot be recognized as an enterprise prudential capital control.",
    relatedRecordIds: ["OBL-005", "CTRL-009"]
  },
  {
    id: "AUD-003",
    entityType: "Mapping",
    entityId: "MAP-005-005",
    action: "MAPPING_APPROVED",
    actorId: "USR-0941",
    actorDisplayName: "Jane Doe (Senior Compliance Officer)",
    timestamp: "2025-01-26T11:00:00Z",
    previousState: "Pending Review",
    newState: "Approved",
    reason: "Approved based on formal Pillar 3 disclosure sign-off by Chief Risk Officer and Board Risk Committee.",
    relatedRecordIds: ["OBL-005", "CTRL-005"]
  },
  {
    id: "AUD-004",
    entityType: "Mapping",
    entityId: "MAP-007-006",
    action: "MAPPING_APPROVED",
    actorId: "USR-0941",
    actorDisplayName: "Jane Doe (Senior Compliance Officer)",
    timestamp: "2025-02-19T10:30:00Z",
    previousState: "Pending Review",
    newState: "Approved",
    reason: "Approved personal trading pre-clearance workflow with acknowledged dependency on insider roster feed.",
    relatedRecordIds: ["OBL-007", "CTRL-006"]
  },
  {
    id: "AUD-005",
    entityType: "Mapping",
    entityId: "MAP-003-008",
    action: "INFORMATION_REQUESTED",
    actorId: "USR-0941",
    actorDisplayName: "Jane Doe (Senior Compliance Officer)",
    timestamp: "2025-03-02T14:00:00Z",
    previousState: "Suggested",
    newState: "Needs Information",
    reason: "Requested clarification from Cloud Architecture on multi-region failover and cloud provider SLA.",
    relatedRecordIds: ["OBL-003", "CTRL-008"]
  },
  {
    id: "AUD-006",
    entityType: "Mapping",
    entityId: "MAP-001-001",
    action: "MAPPING_DRAFT_SAVED",
    actorId: "USR-0941",
    actorDisplayName: "Jane Doe (Senior Compliance Officer)",
    timestamp: "2025-02-05T14:30:00Z",
    previousState: "Suggested",
    newState: "Draft",
    reason: "Analyst saved working draft notes after reviewing Q1 Operations KYC walkthrough.",
    relatedRecordIds: ["OBL-001", "CTRL-001"]
  },
  {
    id: "AUD-007",
    entityType: "Mapping",
    entityId: "MAP-004-010",
    action: "MAPPING_SUBMITTED_FOR_REVIEW",
    actorId: "USR-0941",
    actorDisplayName: "Jane Doe (Senior Compliance Officer)",
    timestamp: "2025-02-16T10:00:00Z",
    previousState: "Suggested",
    newState: "Pending Review",
    reason: "Submitted for compliance review to highlight 4-hour regulatory escalation gap in SOC playbook.",
    relatedRecordIds: ["OBL-004", "CTRL-010"]
  }
];
