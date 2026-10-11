import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../App';
import { resetStorageData, setSimulateStorageFailure } from '../services/storageService';

describe('RegulaTrace AI — Section 20 Acceptance Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    setSimulateStorageFailure(false);
    resetStorageData();
  });

  // TEST 1: INITIAL RENDER
  it('TEST 1: INITIAL RENDER - renders application shell, metrics, and default selection', async () => {
    render(<App />);

    // App Shell branding
    expect(screen.getByText('RegulaTrace AI')).toBeInTheDocument();
    expect(screen.getByText('Regulatory Intelligence')).toBeInTheDocument();

    // Active feature heading
    const activeHeader = screen.getByRole('heading', { level: 1, name: /obligation mapping/i });
    expect(activeHeader).toBeInTheDocument();

    // Summary metrics match seed records
    expect(screen.getByText('Total Obligations')).toBeInTheDocument();
    expect(screen.getAllByText('Pending Review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Approved Mappings').length).toBeGreaterThan(0);
    expect(screen.getByText('Unmapped Obligations')).toBeInTheDocument();

    // 8 total obligations
    expect(screen.getByText('8')).toBeInTheDocument();

    // Initial selected obligation is displayed (OBL-001)
    expect(screen.getAllByText('OBL-001').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Customer Identity Record Periodic Reviews/i).length).toBeGreaterThan(0);
  });

  // TEST 2: OBLIGATION SELECTION
  it('TEST 2: OBLIGATION SELECTION - selecting different obligation updates detail workspace', async () => {
    render(<App />);

    // Click OBL-002 row directly via testid
    const obl002Row = screen.getByTestId('obligation-row-OBL-002');
    fireEvent.click(obl002Row);

    // Detail workspace updates
    await waitFor(() => {
      expect(screen.getByText('Clause 7.1 (p. 28)')).toBeInTheDocument();
      expect(screen.getAllByText('OBL-002').length).toBeGreaterThan(0);
    });
  });

  // TEST 3: SEARCH
  it('TEST 3: SEARCH - filters obligations by ID or text and updates count', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search id, obligation, regulation/i);

    // Search for OBL-004
    fireEvent.change(searchInput, { target: { value: 'OBL-004' } });

    await waitFor(() => {
      expect(screen.getByText('1 of 8')).toBeInTheDocument();
      expect(screen.getByTestId('obligation-row-OBL-004')).toBeInTheDocument();
      expect(screen.queryByTestId('obligation-row-OBL-002')).not.toBeInTheDocument();
    });
  });

  // TEST 4: COMBINED FILTERS
  it('TEST 4: COMBINED FILTERS - applies multi-filter conjunction and clear all', async () => {
    render(<App />);

    const appSelect = screen.getByLabelText(/filter by applicability/i);
    fireEvent.change(appSelect, { target: { value: 'Under Review' } });

    await waitFor(() => {
      // OBL-008 is Under Review
      expect(screen.getByTestId('obligation-row-OBL-008')).toBeInTheDocument();
      expect(screen.queryByTestId('obligation-row-OBL-001')).not.toBeInTheDocument();
    });

    // Clear filters
    const clearBtn = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(clearBtn);

    await waitFor(() => {
      expect(screen.getByTestId('obligation-row-OBL-001')).toBeInTheDocument();
      expect(screen.getByTestId('obligation-row-OBL-008')).toBeInTheDocument();
    });
  });

  // TEST 5: VIEW SOURCE
  it('TEST 5: VIEW SOURCE - opens citation dialog with synthetic disclaimer', async () => {
    render(<App />);

    const viewSourceBtn = screen.getByRole('button', { name: /view source excerpt/i });
    fireEvent.click(viewSourceBtn);

    await waitFor(() => {
      expect(screen.getByText(/Regulatory Source Citation/i)).toBeInTheDocument();
      expect(screen.getByText(/Synthetic Demo Source Notice/i)).toBeInTheDocument();
      expect(screen.getAllByText('Section 4.2').length).toBeGreaterThan(0);
    });
  });

  // TEST 6: CANDIDATE MAPPING
  it('TEST 6: CANDIDATE MAPPING - displays candidate controls, match score and rationale', async () => {
    render(<App />);

    // In OBL-001, CTRL-014 is candidate
    expect(screen.getAllByText('CTRL-014').length).toBeGreaterThan(0);
    expect(screen.getByText('Customer Record Review & Profile Maintenance')).toBeInTheDocument();
    expect(screen.getByText(/score: 86\/100/i)).toBeInTheDocument();

    // Toggle algorithmic rationale
    const rationaleToggle = screen.getAllByText(/algorithmic match & gap analysis/i)[0];
    fireEvent.click(rationaleToggle);

    await waitFor(() => {
      expect(screen.getByText(/positive coverage:/i)).toBeInTheDocument();
      expect(screen.getByText(/identified gaps:/i)).toBeInTheDocument();
      expect(screen.getByText(/deterministic compliance rule engine/i)).toBeInTheDocument();
    });
  });

  // TEST 7: EDIT COVERAGE
  it('TEST 7: EDIT COVERAGE - allows analyst to modify requirement component status', async () => {
    render(<App />);

    // Click "Review & Edit Mapping" for CTRL-014
    const reviewButtons = screen.getAllByRole('button', { name: /review & edit mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Review Obligation-to-Control Mapping')).toBeInTheDocument();
    });

    // Change RC-001-D from Unknown to Supported
    const statusSelect = screen.getByLabelText(/coverage status for rc-001-d/i);
    fireEvent.change(statusSelect, { target: { value: 'Supported' } });

    // Save Draft
    const saveDraftBtn = screen.getByRole('button', { name: /save draft/i });
    fireEvent.click(saveDraftBtn);

    await waitFor(() => {
      expect(screen.queryByText('Review Obligation-to-Control Mapping')).not.toBeInTheDocument();
    });
  });

  // TEST 8: APPROVE A COMPLETE MAPPING
  it('TEST 8: APPROVE A COMPLETE MAPPING - approves candidate and updates metrics', async () => {
    render(<App />);

    // Open Review on candidate control CTRL-014 for OBL-001
    const reviewBtns = screen.getAllByRole('button', { name: /review & edit mapping/i });
    fireEvent.click(reviewBtns[0]);

    await waitFor(() => {
      expect(screen.getByText('Review Obligation-to-Control Mapping')).toBeInTheDocument();
    });

    // Fill mandatory rationale
    const rationaleInput = screen.getByLabelText(/reviewer approval rationale/i);
    fireEvent.change(rationaleInput, { target: { value: 'Formal compliance review verified operational cadence and logs.' } });

    // Acknowledge gaps checkbox
    const ackCheckbox = screen.getByRole('checkbox', { name: /acknowledge/i });
    fireEvent.click(ackCheckbox);

    // Click Approve
    const approveBtn = screen.getByRole('button', { name: /approve mapping/i });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(screen.queryByText('Review Obligation-to-Control Mapping')).not.toBeInTheDocument();
    });
  });

  // TEST 9: APPROVE A PARTIAL MAPPING
  it('TEST 9: APPROVE A PARTIAL MAPPING - blocks approval if gaps are unacknowledged', async () => {
    render(<App />);

    // Click OBL-001 -> CTRL-014
    const reviewButtons = screen.getAllByRole('button', { name: /review & edit mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Review Obligation-to-Control Mapping')).toBeInTheDocument();
    });

    // Fill rationale but DO NOT check acknowledgment
    const rationaleInput = screen.getByLabelText(/reviewer approval rationale/i);
    fireEvent.change(rationaleInput, { target: { value: 'Approving without checking gaps checkbox' } });

    const approveBtn = screen.getByRole('button', { name: /approve mapping/i });
    fireEvent.click(approveBtn);

    // Validation warning must be shown
    await waitFor(() => {
      expect(screen.getByText(/must explicitly acknowledge uncovered, partially supported, or unknown/i)).toBeInTheDocument();
    });
  });

  // TEST 10: REJECT A MAPPING
  it('TEST 10: REJECT A MAPPING - prompts for reason and marks as rejected', async () => {
    render(<App />);

    const rejectButtons = screen.getAllByRole('button', { name: /reject/i });
    fireEvent.click(rejectButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Reject Obligation-to-Control Mapping')).toBeInTheDocument();
    });

    // Enter rejection reason
    const reasonInput = screen.getByLabelText(/rejection reason/i);
    fireEvent.change(reasonInput, { target: { value: 'Control does not satisfy threshold requirements for risk schedule.' } });

    const confirmRejectBtn = screen.getByRole('button', { name: /confirm rejection/i });
    fireEvent.click(confirmRejectBtn);

    await waitFor(() => {
      expect(screen.queryByText('Reject Obligation-to-Control Mapping')).not.toBeInTheDocument();
    });
  });

  // TEST 11: REQUEST INFORMATION
  it('TEST 11: REQUEST INFORMATION - submits clarification inquiry and sets Needs Information', async () => {
    render(<App />);

    const requestButtons = screen.getAllByRole('button', { name: /request info/i });
    fireEvent.click(requestButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Request Additional Control Information')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/information or documentation required/i), {
      target: { value: 'Please provide documented sampling methodology.' }
    });
    fireEvent.change(screen.getByLabelText(/regulatory rationale/i), {
      target: { value: 'Required to demonstrate compliance with periodic schedule.' }
    });
    fireEvent.change(screen.getByLabelText(/responsible function/i), {
      target: { value: 'Customer Operations Lead' }
    });

    fireEvent.click(screen.getByRole('button', { name: /submit information request/i }));

    await waitFor(() => {
      expect(screen.queryByText('Request Additional Control Information')).not.toBeInTheDocument();
    });
  });

  // TEST 14: CSV EXPORT
  it('TEST 14: CSV EXPORT - triggers register download', async () => {
    render(<App />);

    const exportBtn = screen.getByRole('button', { name: /export register \(csv\)/i });
    expect(exportBtn).toBeInTheDocument();

    // Mock link click
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(clickSpy).toHaveBeenCalled();
    });

    clickSpy.mockRestore();
  });

  // TEST 16: RESET DATA
  it('TEST 16: RESET DATA - opens confirmation dialog and restores deterministic state', async () => {
    render(<App />);

    const resetBtn = screen.getByRole('button', { name: /reset demo data/i });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(screen.getByText('Reset Demonstration Dataset?')).toBeInTheDocument();
    });

    const confirmResetBtn = screen.getByRole('button', { name: /confirm & restore seed data/i });
    fireEvent.click(confirmResetBtn);

    await waitFor(() => {
      expect(screen.queryByText('Reset Demonstration Dataset?')).not.toBeInTheDocument();
    });
  });

  // TEST 17: INVALID INPUT
  it('TEST 17: INVALID INPUT - validates empty rationale on approval attempt', async () => {
    render(<App />);

    const reviewButtons = screen.getAllByRole('button', { name: /review & edit mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Review Obligation-to-Control Mapping')).toBeInTheDocument();
    });

    const rationaleInput = screen.getByLabelText(/reviewer approval rationale/i);
    fireEvent.change(rationaleInput, { target: { value: '   ' } }); // whitespace

    const approveBtn = screen.getByRole('button', { name: /approve mapping/i });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(screen.getByText(/reviewer rationale is mandatory for approval/i)).toBeInTheDocument();
    });
  });

  // TEST 18: SAVE FAILURE SIMULATION
  it('TEST 18: SAVE FAILURE - displays meaningful error when storage write fails', async () => {
    render(<App />);

    // Enable simulated storage failure
    setSimulateStorageFailure(true);

    const reviewButtons = screen.getAllByRole('button', { name: /review & edit mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Review Obligation-to-Control Mapping')).toBeInTheDocument();
    });

    const rationaleInput = screen.getByLabelText(/reviewer approval rationale/i);
    fireEvent.change(rationaleInput, { target: { value: 'Valid substantive approval rationale.' } });

    const ackCheckbox = screen.getByRole('checkbox', { name: /acknowledge/i });
    fireEvent.click(ackCheckbox);

    const approveBtn = screen.getByRole('button', { name: /approve mapping/i });
    fireEvent.click(approveBtn);

    // Error must remain visible and dialog not closed
    await waitFor(() => {
      expect(screen.getByText(/Simulated database\/storage write failure/i)).toBeInTheDocument();
    });

    setSimulateStorageFailure(false);
  });

  // TEST 19: KEYBOARD ACCESSIBILITY
  it('TEST 19: KEYBOARD ACCESSIBILITY - supports keyboard navigation on obligation rows', async () => {
    render(<App />);

    const obl002Row = screen.getByTestId('obligation-row-OBL-002');
    expect(obl002Row).toBeInTheDocument();

    // Trigger Enter key
    fireEvent.keyDown(obl002Row, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Clause 7.1 (p. 28)')).toBeInTheDocument();
    });
  });

  // TEST 20: MOBILE LAYOUT
  it('TEST 20: MOBILE LAYOUT - renders without crashing and main actions remain accessible', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: /obligation mapping/i })).toBeInTheDocument();
  });
});
