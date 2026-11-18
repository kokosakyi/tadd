import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_PREFIX = 'linedesk_ca_module_state_v1';

function buildStorageKey(projectId: string | undefined, moduleId: string): string {
  return `${STORAGE_PREFIX}:${projectId || 'default'}:${moduleId}`;
}

function readStoredState<T extends Record<string, unknown>>(
  key: string,
  defaults: T
): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaults;
    }
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { ...defaults, ...parsed };
    }
  } catch {
    // Ignore corrupt or unavailable localStorage
  }
  return defaults;
}

/**
 * Persists calculator/module state in localStorage scoped by active project ID,
 * so switching tabs, jumping to Code Library, or refreshing preserves user work.
 */
export function useProjectScopedState<T extends Record<string, unknown>>(
  projectId: string | undefined,
  moduleId: string,
  getDefaults: () => T
): [T, (updater: Partial<T> | ((prev: T) => T)) => void, () => void] {
  const storageKey = buildStorageKey(projectId, moduleId);
  const getDefaultsRef = useRef(getDefaults);
  getDefaultsRef.current = getDefaults;

  const [state, setState] = useState<T>(() =>
    readStoredState(storageKey, getDefaultsRef.current())
  );

  const prevKeyRef = useRef(storageKey);

  // Re-hydrate whenever the active project changes
  useEffect(() => {
    if (prevKeyRef.current !== storageKey) {
      prevKeyRef.current = storageKey;
      setState(readStoredState(storageKey, getDefaultsRef.current()));
    }
  }, [storageKey]);

  // Persist updates to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
      }
    } catch {
      // Ignore quota / privacy mode storage errors
    }
  }, [storageKey, state]);

  const updateState = useCallback((updater: Partial<T> | ((prev: T) => T)) => {
    setState((prev) => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return { ...prev, ...updater };
    });
  }, []);

  const resetState = useCallback(() => {
    const freshDefaults = getDefaultsRef.current();
    setState(freshDefaults);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  return [state, updateState, resetState];
}
