import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WeatherCriteriaForm from '../src/components/WeatherCriteriaForm.jsx';

describe('UI Component Test Suite - Dropdown Ordering & Form Interaction', () => {
  const dummyProvinces = ['Alberta', 'British Columbia', 'Ontario', 'Quebec', 'Saskatchewan'];
  const dummyCities = [
    { location: 'Calgary' },
    { location: 'Edmonton' },
    { location: 'Ottawa' },
    { location: 'Toronto' }
  ];

  it('renders province options in alphabetical order per AGENTS.md rule', () => {
    const { container } = render(
      <WeatherCriteriaForm
        provinces={dummyProvinces}
        selectedProvince="Ontario"
        setSelectedProvince={vi.fn()}
        citiesInProvince={dummyCities}
        selectedCity="Ottawa"
        setSelectedCity={vi.fn()}
        geoData={{ provinces: {} }}
        returnPeriod={150}
        setReturnPeriod={vi.fn()}
        returnPeriodFactors={{}}
        district="Heavy"
        setDistrict={vi.fn()}
        deterministicMinimums={{}}
        rulingSpan={250}
        setRulingSpan={vi.fn()}
        conductorDiameter={28.14}
        setConductorDiameter={vi.fn()}
        hasDampers={true}
        setHasDampers={vi.fn()}
        isTransmission={true}
        setIsTransmission={vi.fn()}
        rtsKn={140}
        setRtsKn={vi.fn()}
        conductorWeightNm={15.9}
        setConductorWeightNm={vi.fn()}
        isBundled={false}
        setIsBundled={vi.fn()}
      />
    );

    const selects = container.querySelectorAll('select');
    const provinceSelect = selects[0];
    const options = Array.from(provinceSelect.querySelectorAll('option')).map(opt => opt.value);

    // Verify alphabetical ordering using localeCompare
    for (let i = 0; i < options.length - 1; i++) {
      expect(options[i].localeCompare(options[i + 1])).toBeLessThanOrEqual(0);
    }
  });

  it('triggers setSelectedProvince when selecting another province', () => {
    const handleSetProvince = vi.fn();

    const { container } = render(
      <WeatherCriteriaForm
        provinces={dummyProvinces}
        selectedProvince="Ontario"
        setSelectedProvince={handleSetProvince}
        citiesInProvince={dummyCities}
        selectedCity="Ottawa"
        setSelectedCity={vi.fn()}
        geoData={{ provinces: {} }}
        returnPeriod={150}
        setReturnPeriod={vi.fn()}
        returnPeriodFactors={{}}
        district="Heavy"
        setDistrict={vi.fn()}
        deterministicMinimums={{}}
        rulingSpan={250}
        setRulingSpan={vi.fn()}
        conductorDiameter={28.14}
        setConductorDiameter={vi.fn()}
        hasDampers={true}
        setHasDampers={vi.fn()}
        isTransmission={true}
        setIsTransmission={vi.fn()}
        rtsKn={140}
        setRtsKn={vi.fn()}
        conductorWeightNm={15.9}
        setConductorWeightNm={vi.fn()}
        isBundled={false}
        setIsBundled={vi.fn()}
      />
    );

    const selects = container.querySelectorAll('select');
    const provinceSelect = selects[0];
    fireEvent.change(provinceSelect, { target: { value: 'Alberta' } });

    expect(handleSetProvince).toHaveBeenCalledWith('Alberta');
  });
});

describe('UI Component Test Suite - Code Library of Books & Cover Display', () => {
  it('renders the library shelf view with all 3 standard book volumes', async () => {
    const { default: CodeLibraryBrowser } = await import('../src/components/codeLibrary/CodeLibraryBrowser.jsx');
    const { container } = render(<CodeLibraryBrowser />);

    // Check shelf view presence
    expect(screen.getByText('CSA Overhead Systems Code Library')).toBeDefined();
    expect(screen.getByText('Standard Volumes & Editions')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined(); // 3 Book Volumes

    // Check individual book codes rendered
    expect(screen.getAllByText('CSA C22.3 No. 1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CSA C22.3 No. 60826').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CSA O15').length).toBeGreaterThanOrEqual(1);

    // Verify SVG covers rendered
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  it('navigates to specific book reader when clicking open volume', async () => {
    const { default: CodeLibraryBrowser } = await import('../src/components/codeLibrary/CodeLibraryBrowser.jsx');
    render(<CodeLibraryBrowser />);

    // Click on Read Volume for CSA O15
    const o15Btn = screen.getByText('Read Volume (CSA O15)');
    fireEvent.click(o15Btn);

    // Should switch to reader view showing Book: CSA O15
    expect(screen.getByText('Return to Library Shelf')).toBeDefined();
    expect(screen.getAllByText(/Wood Utility Poles and Reinforcing Stubs/i).length).toBeGreaterThanOrEqual(1);

    // Return back to library shelf
    const returnBtn = screen.getByText('Return to Library Shelf');
    fireEvent.click(returnBtn);
    expect(screen.getByText('Standard Volumes & Editions')).toBeDefined();
  });

  it('renders hierarchical TOC sidebar, opens companion split-pane for tables, and pins bookmarks', async () => {
    const { default: CodeLibraryBrowser } = await import('../src/components/codeLibrary/CodeLibraryBrowser.jsx');
    render(<CodeLibraryBrowser />);

    // Open CSA O15 Volume
    fireEvent.click(screen.getByText('Read Volume (CSA O15)'));

    // Verify TOC Sidebar is present
    expect(screen.getByLabelText('Book Table of Contents Sidebar')).toBeDefined();
    expect(screen.getByText('Table of Contents — Chapters')).toBeDefined();

    // Clause 0 of CSA O15 references Table 3 — click the Table 3 button to open Split-Pane Inspector
    const table3Buttons = screen.getAllByText('Table 3');
    fireEvent.click(table3Buttons[0]);

    // Verify Companion Split-Pane opens with Table 3 details
    expect(screen.getByLabelText('Companion Inspector: Table 3')).toBeDefined();
    expect(screen.getByText('Full View')).toBeDefined();

    // Pin/Bookmark Clause 0
    const bookmarkBtn = screen.getByLabelText('Bookmark Clause 0');
    fireEvent.click(bookmarkBtn);

    // Return to Library Shelf and verify the bookmark appears on the Pinned Reference Shelf
    fireEvent.click(screen.getByText('Return to Library Shelf'));
    expect(screen.getByText('Pinned & Bookmarked Reference Shelf (1)')).toBeDefined();
    expect(screen.getByText('CSA O15 Cl. 0')).toBeDefined();
  });

  it('UniversalTableRenderer renders all 83 digitized tables completely with zero [object Object] or blank tables', async () => {
    const { ALL_TABLES } = await import('../src/core/code/codeLibraryRegistry.js');
    const { getTableDetails } = await import('../src/core/code/tableContentResolver.js');
    const { default: UniversalTableRenderer } = await import('../src/components/codeLibrary/UniversalTableRenderer.jsx');

    expect(ALL_TABLES.length).toBe(83);

    for (const tbl of ALL_TABLES) {
      const fullTable = getTableDetails(tbl.id);
      const { container, unmount } = render(<UniversalTableRenderer table={fullTable} />);

      const tables = container.querySelectorAll('table');
      expect(tables.length, `Table ${tbl.id} (${tbl.number}) must render at least 1 <table>`).toBeGreaterThanOrEqual(1);

      const dataRows = container.querySelectorAll('tbody tr');
      expect(dataRows.length, `Table ${tbl.id} (${tbl.number}) must render at least 1 data row`).toBeGreaterThanOrEqual(1);

      const text = container.textContent || '';
      expect(text.includes('[object Object]'), `Table ${tbl.id} must not render [object Object]`).toBe(false);

      // Ensure cells are not all empty dashes ('—')
      const allCells = Array.from(container.querySelectorAll('tbody td')).map((td) => td.textContent.trim());
      const nonEmptyCells = allCells.filter((c) => c !== '' && c !== '—');
      expect(nonEmptyCells.length, `Table ${tbl.id} must have populated engineering cell values`).toBeGreaterThan(1);

      unmount();
    }
  });

  it('renders PLS CADD - Lessons learned book, opens dialogue reader, and renders Alex and Dan engineer avatars', async () => {
    const { default: CodeLibraryBrowser } = await import('../src/components/codeLibrary/CodeLibraryBrowser.jsx');
    render(<CodeLibraryBrowser />);

    // Check that PLS-CADD book is rendered on the library shelf
    expect(screen.getByText('PLS CADD - Lessons learned')).toBeDefined();
    expect(screen.getByText('Read Volume (PLS-CADD)')).toBeDefined();

    // Click to open PLS-CADD Lessons Learned volume
    fireEvent.click(screen.getByText('Read Volume (PLS-CADD)'));

    // Check that lessons reader view is displayed with avatars and names
    expect(screen.getByText(/Alex Rivera, E.I.T./i)).toBeDefined();
    expect(screen.getByText(/Dan Miller, P.Eng./i)).toBeDefined();
    expect(screen.getByLabelText('Alex Rivera, E.I.T. Avatar')).toBeDefined();
    expect(screen.getByLabelText('Dan Miller, P.Eng. Avatar')).toBeDefined();
    expect(screen.getByText(/P&P Sheet View Drafting/i)).toBeDefined();

    // Verify speaker filter works
    fireEvent.click(screen.getByText('Alex (Junior Qs)'));
    expect(screen.getByText('Showing 1 of 2 dialogue turns')).toBeDefined();

    // Switch to Dan
    fireEvent.click(screen.getByText('Dan (Senior As)'));
    expect(screen.getByText('Showing 1 of 2 dialogue turns')).toBeDefined();

    // Reset to All Dialogue
    fireEvent.click(screen.getByText('All Dialogue'));
    expect(screen.getByText('Showing 2 of 2 dialogue turns')).toBeDefined();

    // Return back to shelf
    fireEvent.click(screen.getByText('Return to Library Shelf'));
    expect(screen.getByText('Standard Volumes & Editions')).toBeDefined();
  });

  it('supports mobile view table of contents toggle drawer and responsive layout elements', async () => {
    const { default: CodeLibraryBrowser } = await import('../src/components/codeLibrary/CodeLibraryBrowser.jsx');
    const { container } = render(<CodeLibraryBrowser />);

    // Open CSA O15 volume
    fireEvent.click(screen.getByText('Read Volume (CSA O15)'));

    // Verify mobile TOC toggle button exists
    const mobileToggleBtn = screen.getByLabelText('Open Table of Contents');
    expect(mobileToggleBtn).toBeDefined();

    // Initially mobile TOC drawer is not open (no backdrop in DOM)
    expect(container.querySelector('.book-toc-backdrop')).toBeNull();

    // Click to open mobile TOC drawer
    fireEvent.click(mobileToggleBtn);

    // Backdrop should now be visible and sidebar has .mobile-open
    const backdrop = container.querySelector('.book-toc-backdrop');
    expect(backdrop).not.toBeNull();
    const sidebar = screen.getByLabelText('Book Table of Contents Sidebar');
    expect(sidebar.classList.contains('mobile-open')).toBe(true);

    // Close button should be present inside drawer
    const closeBtn = screen.getByLabelText('Close Table of Contents');
    expect(closeBtn).toBeDefined();

    // Clicking close button dismisses drawer
    fireEvent.click(closeBtn);
    expect(container.querySelector('.book-toc-backdrop')).toBeNull();
    expect(sidebar.classList.contains('mobile-open')).toBe(false);

    // Open again and click backdrop to dismiss
    fireEvent.click(mobileToggleBtn);
    expect(container.querySelector('.book-toc-backdrop')).not.toBeNull();
    fireEvent.click(container.querySelector('.book-toc-backdrop'));
    expect(container.querySelector('.book-toc-backdrop')).toBeNull();
  });
});

