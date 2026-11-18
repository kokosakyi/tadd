import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { UnitProvider } from './context/UnitContext';
import Header, { MobileBottomTabBar } from './components/common/Header';
import LiquidBackground from './components/common/LiquidBackground';
import ProjectSetupModal from './components/project/ProjectSetupModal';
import Dashboard from './components/dashboard/Dashboard';

const ClearanceCalculatorView = lazy(() => import('./components/calculators/ClearanceCalculatorView'));
const WeatherCriteriaView = lazy(() => import('./components/calculators/WeatherCriteriaView'));
const WoodPoleCalculatorView = lazy(() => import('./components/calculators/WoodPoleCalculatorView'));
const CodeLibraryBrowser = lazy(() => import('./components/codeLibrary/CodeLibraryBrowser'));

function ViewLoadingFallback() {
  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '46vh',
        color: 'var(--text-muted)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-cyan)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <span style={{ fontSize: '0.88rem', fontWeight: 550 }}>Loading workspace module...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('linedesk_ca_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* ignore storage errors */
    }
    return 'dark';
  });
  const mainViewRef = useRef(null);

  // Synchronize document theme attribute & persist user preference
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('linedesk_ca_theme', theme);
    } catch {
      /* ignore storage errors */
    }
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
    <>
      {/* Ambient Soft Gradient & Floating Color Blobs */}
      <LiquidBackground />

      <div className="app-shell">
        {/* Desktop Floating Glass Sidebar & Mobile Glass Top Bar */}
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
          className="workspace-main animate-view-enter"
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

        {/* Mobile Floating Glass Bottom Tab Bar (< 1024px) */}
        <MobileBottomTabBar
          currentView={currentView}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Global Project Setup Wizard Modal */}
      <ProjectSetupModal />
    </>
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
