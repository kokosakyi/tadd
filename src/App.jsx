import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { UnitProvider } from './context/UnitContext';
import Header, { MobileBottomTabBar, NAV_ITEMS } from './components/common/Header';
import LiquidBackground from './components/common/LiquidBackground';
import ProjectSetupModal from './components/project/ProjectSetupModal';
import Dashboard from './components/dashboard/Dashboard';
import CommandPalette from './components/common/CommandPalette';
import CitationInspectorDrawer from './components/common/CitationInspectorDrawer';
import { parseHashRoute, writeHashRoute } from './utils/hashRouter';

const ClearanceCalculatorView = lazy(() => import('./components/calculators/ClearanceCalculatorView'));
const WeatherCriteriaView = lazy(() => import('./components/calculators/WeatherCriteriaView'));
const WoodPoleCalculatorView = lazy(() => import('./components/calculators/WoodPoleCalculatorView'));
const AsceTowerDesignView = lazy(() => import('./components/calculators/AsceTowerDesignView'));
const CodeLibraryBrowser = lazy(() => import('./components/codeLibrary/CodeLibraryBrowser'));

const SIDEBAR_COLLAPSE_KEY = 'linedesk_ca_sidebar_collapsed';

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

function getModuleLabel(viewId) {
  return NAV_ITEMS.find((item) => item.id === viewId)?.label || 'Calculator';
}

function AppContent() {
  const initialRoute = parseHashRoute();
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [routeParams, setRouteParams] = useState(initialRoute.params);

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('linedesk_ca_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* ignore storage errors */
    }
    return 'dark';
  });

  // User preference for collapsible desktop sidebar rail (272px <-> 76px)
  const [manualSidebarCollapsed, setManualSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [autoCompactActive, setAutoCompactActive] = useState(false);

  // Command Palette & Citation Quick-Inspector state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [inspectedCitation, setInspectedCitation] = useState(null);
  const [activeCitation, setActiveCitation] = useState(null);
  const [returnFromView, setReturnFromView] = useState(null);
  const [pendingStationJump, setPendingStationJump] = useState(() =>
    initialRoute.view === 'weather' && initialRoute.params.province && initialRoute.params.city
      ? { province: initialRoute.params.province, city: initialRoute.params.city }
      : null
  );

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

  // Persist manual sidebar collapsed state
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(manualSidebarCollapsed));
    } catch {
      /* ignore storage errors */
    }
  }, [manualSidebarCollapsed]);

  // Auto-compact desktop sidebar on dense Code Library views for narrower desktop screens (< 1440px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (currentView === 'code_library' && window.innerWidth >= 1024 && window.innerWidth < 1440) {
      setAutoCompactActive(true);
    } else {
      setAutoCompactActive(false);
    }
  }, [currentView]);

  const isSidebarCollapsed = manualSidebarCollapsed || autoCompactActive;

  const handleToggleSidebar = useCallback(() => {
    if (autoCompactActive) {
      setAutoCompactActive(false);
      setManualSidebarCollapsed(false);
      return;
    }
    setManualSidebarCollapsed((prev) => !prev);
  }, [autoCompactActive]);

  // Sync browser Back/Forward hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHashRoute();
      setCurrentView(parsed.view);
      setRouteParams(parsed.params);
      if (parsed.view === 'weather' && parsed.params.province && parsed.params.city) {
        setPendingStationJump({
          province: parsed.params.province,
          city: parsed.params.city
        });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global keyboard shortcuts: Ctrl/Cmd+K for Command Palette, '[' for sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === '[' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target?.tagName || '').toLowerCase();
        const isEditable =
          tag === 'input' || tag === 'textarea' || tag === 'select' || e.target?.isContentEditable;
        if (!isEditable) {
          e.preventDefault();
          handleToggleSidebar();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleSidebar]);

  const runViewTransition = useCallback((updateStateFn) => {
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
  }, []);

  const handleNavigate = useCallback((viewId, params = {}, options = {}) => {
    const { preserveReturnBreadcrumb = false } = options;
    runViewTransition(() => {
      setCurrentView(viewId);
      setRouteParams(params);
      if (!preserveReturnBreadcrumb && viewId !== 'code_library') {
        setReturnFromView(null);
      }
      writeHashRoute(viewId, params);
    });
  }, [runViewTransition]);

  // Clicking a citation inside a calculator opens the non-destructive slide-over Quick-Inspector
  const handleInspectCitation = useCallback((citation) => {
    if (!citation) return;
    if (currentView === 'code_library') {
      setActiveCitation(citation);
      return;
    }
    setInspectedCitation(citation);
  }, [currentView]);

  // Escalating from the Quick-Inspector drawer to the full Code Library records a return breadcrumb
  const handleOpenCitationInLibrary = useCallback((citation) => {
    const originView = currentView !== 'code_library' && currentView !== 'dashboard'
      ? currentView
      : returnFromView;

    setInspectedCitation(null);
    runViewTransition(() => {
      setReturnFromView(originView || null);
      setActiveCitation(citation);
      setCurrentView('code_library');
      setRouteParams({ q: String(citation || '') });
      writeHashRoute('code_library', { q: String(citation || '') });
    });
  }, [currentView, returnFromView, runViewTransition]);

  // Jumping directly to a specific weather station from Command Palette
  const handleOpenStation = useCallback((province, city) => {
    setPendingStationJump({ province, city });
    handleNavigate('weather', { province, city });
  }, [handleNavigate]);

  // Sync sub-tab or deep-link parameter updates to URL hash without triggering view transition
  const handleUpdateRouteParams = useCallback((partialParams) => {
    setRouteParams((prev) => {
      const next = { ...prev, ...partialParams };
      writeHashRoute(currentView, next, true);
      return next;
    });
  }, [currentView]);

  return (
    <>
      {/* Ambient Soft Gradient & Floating Color Blobs */}
      <LiquidBackground />

      <div className="app-shell">
        {/* Desktop Floating Glass Sidebar & Mobile Glass Top Bar */}
        <Header
          currentView={currentView}
          onNavigate={(viewId) => handleNavigate(viewId)}
          theme={theme}
          setTheme={setTheme}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
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
              <Dashboard onNavigate={(viewId) => handleNavigate(viewId)} />
            )}

            {currentView === 'clearance' && (
              <ClearanceCalculatorView onOpenCitation={handleInspectCitation} />
            )}

            {currentView === 'weather' && (
              <WeatherCriteriaView
                onOpenCitation={handleInspectCitation}
                initialTab={routeParams.tab}
                initialStation={pendingStationJump}
                onClearInitialStation={() => setPendingStationJump(null)}
                onTabChange={(tab) => handleUpdateRouteParams({ tab })}
              />
            )}

            {currentView === 'wood_pole' && (
              <WoodPoleCalculatorView
                onOpenCitation={handleInspectCitation}
                initialTab={routeParams.tab}
                onTabChange={(tab) => handleUpdateRouteParams({ tab })}
              />
            )}

            {currentView === 'asce_tower' && (
              <AsceTowerDesignView
                onOpenCitation={handleInspectCitation}
                initialTab={routeParams.tab}
                onTabChange={(tab) => handleUpdateRouteParams({ tab })}
              />
            )}

            {currentView === 'code_library' && (
              <CodeLibraryBrowser
                onOpenCalculator={(viewId) => handleNavigate(viewId)}
                initialCitation={activeCitation}
                onClearCitation={() => setActiveCitation(null)}
                initialRouteParams={routeParams}
                onRouteParamsChange={handleUpdateRouteParams}
                returnToView={
                  returnFromView
                    ? { id: returnFromView, label: getModuleLabel(returnFromView) }
                    : null
                }
                onReturnToCalculator={() => {
                  if (returnFromView) {
                    const target = returnFromView;
                    setReturnFromView(null);
                    handleNavigate(target);
                  }
                }}
              />
            )}
          </Suspense>
        </main>

        {/* Mobile Floating Glass Bottom Tab Bar (< 1024px) */}
        <MobileBottomTabBar
          currentView={currentView}
          onNavigate={(viewId) => handleNavigate(viewId)}
        />
      </div>

      {/* Slide-over Citation Quick-Inspector Drawer */}
      <CitationInspectorDrawer
        citation={inspectedCitation}
        onClose={() => setInspectedCitation(null)}
        onOpenInLibrary={handleOpenCitationInLibrary}
      />

      {/* Global Command Palette (Ctrl/Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(viewId) => handleNavigate(viewId)}
        onOpenStation={handleOpenStation}
        onInspectCitation={handleInspectCitation}
      />

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
