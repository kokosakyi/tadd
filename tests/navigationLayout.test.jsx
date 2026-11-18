import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { parseHashRoute, buildHashRoute } from '../src/utils/hashRouter';
import { resolveCitationReference } from '../src/core/code/citationResolver';

describe('Navigation & Layout Overhaul Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('parses and builds normalized URL hash routes with sub-route params', () => {
    expect(parseHashRoute('')).toEqual({ view: 'dashboard', params: {} });
    expect(parseHashRoute('#/clearance')).toEqual({ view: 'clearance', params: {} });
    expect(parseHashRoute('#/weather?tab=matrix&province=Alberta&city=Calgary')).toEqual({
      view: 'weather',
      params: { tab: 'matrix', province: 'Alberta', city: 'Calgary' }
    });
    expect(parseHashRoute('#/unknown_route')).toEqual({ view: 'dashboard', params: {} });

    expect(buildHashRoute('code_library', { book: 'c22_3_no1', q: '5.3.1' })).toBe(
      '#/code_library?book=c22_3_no1&q=5.3.1'
    );
  });

  it('resolves CSA/ASCE table and clause citations deterministically', () => {
    const tbl = resolveCitationReference('CSA C22.3 No. 1 Table 2');
    expect(tbl?.type).toBe('table');
    expect(tbl?.standardId).toBe('c22_3_no1');
    expect(tbl?.table?.number).toMatch(/Table 2/i);

    const cl = resolveCitationReference('CSA C22.3 No. 1 Cl. 5.3.1.1');
    expect(cl?.type).toBe('clause');
    expect(cl?.standardId).toBe('c22_3_no1');
    expect(cl?.clause?.clauseNumber).toContain('5.3');
  });

  it('supports collapsible desktop sidebar (button & "[" key), mobile project switcher, URL hash sync, and per-project calculator persistence', async () => {
    const { default: App } = await import('../src/App.jsx');
    render(<App />);

    const desktopSidebar = screen.getByLabelText('Desktop Navigation Sidebar');
    expect(desktopSidebar.classList.contains('sidebar-collapsed')).toBe(false);

    // Toggle sidebar via collapse button
    fireEvent.click(screen.getByLabelText('Collapse sidebar'));
    expect(desktopSidebar.classList.contains('sidebar-collapsed')).toBe(true);

    // Toggle back via '[' keyboard shortcut
    fireEvent.keyDown(window, { key: '[' });
    expect(desktopSidebar.classList.contains('sidebar-collapsed')).toBe(false);

    // Mobile topbar exposes alphabetically sorted Project Switcher
    const mobileProjectSelect = screen.getByLabelText('Mobile Active Engineering Project');
    expect(mobileProjectSelect).toBeDefined();
    expect(mobileProjectSelect.querySelectorAll('option').length).toBeGreaterThanOrEqual(1);

    // Navigate to Clearances -> URL hash updates to #/clearance
    const navButtons = desktopSidebar.querySelectorAll('.sidebar-nav-btn');
    fireEvent.click(navButtons[1]);
    expect(await screen.findByText(/Vertical Clearance Engine & Compliance/i)).toBeDefined();
    expect(window.location.hash).toBe('#/clearance');

    // Modify midspan sag and switch away and back to confirm per-project persistence
    const numberInputs = document.querySelectorAll('input[type="number"]');
    // Operating Voltage is the first numeric input in ClearanceCalculatorView
    fireEvent.change(numberInputs[0], { target: { value: '115' } });
    expect(numberInputs[0].value).toBe('115');

    // Switch to Wood Pole Sizing
    fireEvent.click(navButtons[3]);
    expect(await screen.findByText(/Wood Pole Loading & Structural Sizing/i)).toBeDefined();
    expect(window.location.hash).toBe('#/wood_pole');

    // Switch back to Clearances -> 115 kV input must still be preserved
    fireEvent.click(navButtons[1]);
    expect(await screen.findByText(/Vertical Clearance Engine & Compliance/i)).toBeDefined();
    const restoredInputs = document.querySelectorAll('input[type="number"]');
    expect(restoredInputs[0].value).toBe('115');
  });

  it('opens Global Command Palette via Ctrl+K and jumps directly to a Canadian weather station', async () => {
    const { default: App } = await import('../src/App.jsx');
    render(<App />);

    // Open Command Palette with Ctrl+K
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: 'Global Command Palette' })).toBeDefined();

    const searchInput = screen.getByLabelText(
      'Search modules, projects, clauses, tables, or weather stations'
    );
    fireEvent.change(searchInput, { target: { value: 'Calgary' } });

    // Select Calgary weather station hit
    const calgaryOption = await screen.findByRole('option', { name: /Calgary/i });
    fireEvent.click(calgaryOption);

    // Navigates directly to WeatherCriteriaView with Calgary active
    expect(await screen.findByText(/Weather Criteria & Load Case Matrix/i)).toBeDefined();
    expect((await screen.findAllByText(/Calgary/i)).length).toBeGreaterThanOrEqual(1);
  });

  it('opens Slide-Over Citation Quick-Inspector from a calculator trace and escalates to Code Library with a Back breadcrumb', async () => {
    const { default: App } = await import('../src/App.jsx');
    render(<App />);

    // Open Clearances calculator
    const desktopSidebar = screen.getByLabelText('Desktop Navigation Sidebar');
    fireEvent.click(desktopSidebar.querySelectorAll('.sidebar-nav-btn')[1]);
    expect(await screen.findByText(/Vertical Clearance Engine & Compliance/i)).toBeDefined();

    // Expand Audit Trace or click first citation badge
    const citationBadges = document.querySelectorAll('button.badge-info.mono');
    expect(citationBadges.length).toBeGreaterThan(0);
    fireEvent.click(citationBadges[0]);

    // Quick-Inspector Drawer opens over the calculator without leaving Clearances
    const drawer = await screen.findByRole('dialog', { name: 'Citation Quick Inspector' });
    expect(drawer).toBeDefined();
    expect(screen.getByText(/Vertical Clearance Engine & Compliance/i)).toBeDefined();

    // Escalate to full Code Library
    fireEvent.click(screen.getByText('Open in Code Library'));
    expect(await screen.findByText('Back to Clearances')).toBeDefined();

    // Clicking Back breadcrumb returns cleanly to Clearances
    fireEvent.click(screen.getByText('Back to Clearances'));
    expect(await screen.findByText(/Vertical Clearance Engine & Compliance/i)).toBeDefined();
  });

  it('auto-collapses desktop Book TOC in Code Library when Companion Split Pane opens and allows toggling back', async () => {
    const { default: CodeLibraryBrowser } = await import('../src/components/codeLibrary/CodeLibraryBrowser.jsx');
    render(<CodeLibraryBrowser />);

    fireEvent.click(screen.getByText('Read Volume (CSA O15)'));
    const tocSidebar = screen.getByLabelText('Book Table of Contents Sidebar');
    expect(tocSidebar.classList.contains('desktop-collapsed')).toBe(false);

    // Click Table 3 reference to open Companion Split Pane -> desktop TOC auto-collapses
    const table3Buttons = screen.getAllByText('Table 3');
    fireEvent.click(table3Buttons[0]);
    expect(screen.getByLabelText('Companion Inspector: Table 3')).toBeDefined();
    expect(tocSidebar.classList.contains('desktop-collapsed')).toBe(true);

    // User can manually restore TOC via sticky reader bar toggle
    fireEvent.click(screen.getByLabelText('Show Table of Contents'));
    expect(tocSidebar.classList.contains('desktop-collapsed')).toBe(false);
  });

  it('renders Wood Pole Sizing with unified sub-tabs, sticky summary rail, and zero KaTeX errors', async () => {
    const { default: App } = await import('../src/App.jsx');
    const { container } = render(<App />);

    const desktopSidebar = screen.getByLabelText('Desktop Navigation Sidebar');
    fireEvent.click(desktopSidebar.querySelectorAll('.sidebar-nav-btn')[3]);

    expect(await screen.findByText(/Wood Pole Loading & Structural Sizing/i)).toBeDefined();
    expect(screen.getByLabelText('Live Results Summary')).toBeDefined();

    // Navigate through Wood Pole sub-tabs
    fireEvent.click(screen.getByRole('tab', { name: /2\. Loads & Attachments/i }));
    expect(await screen.findByText(/Attachments & Cables/i)).toBeDefined();

    fireEvent.click(screen.getByRole('tab', { name: /3\. Elevation Profile & Math/i }));
    expect(await screen.findByText(/Multi-Segment Stress Profile & Critical Elevation Analysis/i)).toBeDefined();
    expect(container.querySelectorAll('.katex-error').length).toBe(0);

    fireEvent.click(screen.getByRole('tab', { name: /4\. Audit Trace/i }));
    expect(container.querySelectorAll('.katex-error').length).toBe(0);
  });
});
