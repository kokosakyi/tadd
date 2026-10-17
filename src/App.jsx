import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { UnitProvider } from './context/UnitContext';
import Header from './components/common/Header';
import ProjectSetupModal from './components/project/ProjectSetupModal';
import Dashboard from './components/dashboard/Dashboard';

const ClearanceCalculatorView = lazy(() => import('./components/calculators/ClearanceCalculatorView'));
const WeatherCriteriaView = lazy(() => import('./components/calculators/WeatherCriteriaView'));
const WoodPoleCalculatorView = lazy(() => import('./components/calculators/WoodPoleCalculatorView'));
const CodeLibraryBrowser = lazy(() => import('./components/codeLibrary/CodeLibraryBrowser'));

function ViewLoadingFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: 'var(--text-muted)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '28px', height: '28px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: '0.85rem' }}>Loading workspace module...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const mainViewRef = useRef(null);

  // Synchronize document theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [activeCitation, setActiveCitation] = useState(null);

  const runViewTransition = (updateStateFn) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (typeof document === 'undefined' || !document.startViewTransition || prefersReducedMotion) {
      updateStateFn();
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        try { window.scrollTo(0, 0); } catch { /* ignore in JSDOM */ }
      }
      mainViewRef.current?.focus?.({ preventScroll: true });
      return;
    }

    const transition = document.startViewTransition(() => {
      updateStateFn();
    });
    transition.finished.finally(() => {
      try { window.scrollTo(0, 0); } catch { /* ignore */ }
      mainViewRef.current?.focus?.({ preventScroll: true });
    });
  };

  const handleNavigate = (viewId) => {
    runViewTransition(() => {
      setCurrentView(viewId);
    });
  };

  const handleOpenCitation = (citation) => {
    runViewTransition(() => {
      setActiveCitation(citation);
      setCurrentView('code_library');
    });
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.25rem' }}>
      
      {/* LineDesk CA Global Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Workspace Router */}
      <main
        ref={mainViewRef}
        tabIndex={-1}
        key={currentView}
        className="animate-view-enter"
        style={{ minHeight: '80vh', outline: 'none' }}
      >
        <Suspense fallback={<ViewLoadingFallback />}>
          {currentView === 'dashboard' && (
            <Dashboard onNavigate={handleNavigate} />
          )}

          {currentView === 'clearance' && (
            <ClearanceCalculatorView onOpenCitation={handleOpenCitation} />
          )}

          {currentView === 'weather' && (
            <WeatherCriteriaView onOpenCitation={handleOpenCitation} />
          )}

          {currentView === 'wood_pole' && (
            <WoodPoleCalculatorView onOpenCitation={handleOpenCitation} />
          )}

          {currentView === 'code_library' && (
            <CodeLibraryBrowser
              onOpenCalculator={handleNavigate}
              initialCitation={activeCitation}
              onClearCitation={() => setActiveCitation(null)}
            />
          )}
        </Suspense>
      </main>


      {/* Global Project Setup Wizard Modal */}
      <ProjectSetupModal />

    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <UnitProvider>
        <AppContent />
      </UnitProvider>
    </ProjectProvider>
  );
}
