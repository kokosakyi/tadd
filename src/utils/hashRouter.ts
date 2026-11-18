export type AppViewId =
  | 'dashboard'
  | 'clearance'
  | 'weather'
  | 'wood_pole'
  | 'asce_tower'
  | 'code_library';

export const VALID_VIEW_IDS: readonly AppViewId[] = [
  'dashboard',
  'clearance',
  'weather',
  'wood_pole',
  'asce_tower',
  'code_library'
] as const;

export interface ParsedHashRoute {
  view: AppViewId;
  params: Record<string, string>;
}

/**
 * Safely parses window.location.hash (e.g. "#/weather?tab=matrix&province=Ontario")
 * into a validated AppViewId and flat string params map.
 */
export function parseHashRoute(hashString?: string): ParsedHashRoute {
  const raw =
    typeof hashString === 'string'
      ? hashString
      : typeof window !== 'undefined' && window.location
        ? window.location.hash || ''
        : '';

  const cleaned = raw.replace(/^#\/?/, '').trim();
  if (!cleaned) {
    return { view: 'dashboard', params: {} };
  }

  const [pathPart, queryPart = ''] = cleaned.split('?');
  const firstSegment = (pathPart.split('/')[0] || '').trim().toLowerCase();

  const view: AppViewId = (VALID_VIEW_IDS as readonly string[]).includes(firstSegment)
    ? (firstSegment as AppViewId)
    : 'dashboard';

  const params: Record<string, string> = {};
  if (queryPart) {
    try {
      const searchParams = new URLSearchParams(queryPart);
      searchParams.forEach((value, key) => {
        if (key && value !== '') {
          params[key] = value;
        }
      });
    } catch {
      // Ignore malformed query strings
    }
  }

  return { view, params };
}

/**
 * Builds a normalized hash URL string (e.g. "#/clearance" or "#/code_library?book=c22_3_no1").
 */
export function buildHashRoute(
  view: AppViewId,
  params: Record<string, string | number | boolean | null | undefined> = {}
): string {
  const safeView: AppViewId = (VALID_VIEW_IDS as readonly string[]).includes(view)
    ? view
    : 'dashboard';

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      searchParams.set(key, String(val));
    }
  });

  const qs = searchParams.toString();
  return qs ? `#/${safeView}?${qs}` : `#/${safeView}`;
}

/**
 * Writes a route to window.location.hash without causing redundant hashchange churn.
 */
export function writeHashRoute(
  view: AppViewId,
  params: Record<string, string | number | boolean | null | undefined> = {},
  replace = false
): string {
  const nextHash = buildHashRoute(view, params);
  if (typeof window === 'undefined' || !window.location) {
    return nextHash;
  }

  if (window.location.hash === nextHash) {
    return nextHash;
  }

  try {
    if (replace && window.history && typeof window.history.replaceState === 'function') {
      const baseUrl = window.location.href.split('#')[0];
      window.history.replaceState(null, '', `${baseUrl}${nextHash}`);
    } else {
      window.location.hash = nextHash;
    }
  } catch {
    // Ignore restricted history/JSDOM environments
  }

  return nextHash;
}
