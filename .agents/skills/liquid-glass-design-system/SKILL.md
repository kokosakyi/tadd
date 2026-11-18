---
name: liquid-glass-design-system
description: Design tokens, frosted glass styling, responsive navigation, spring physics, and testing patterns for LineDesk CA's Apple iOS 26 Liquid Glass UI.
---

# iOS 26 Liquid Glass Design System Guide

Use this skill when creating, styling, or refactoring UI components in `src/components/`, modifying `src/index.css`, or building interactive engineering calculators.

## 1. Design Philosophy & Core Tokens
The UI is inspired by Apple's iOS 26 Liquid Glass design language, supporting dual themes:
- **Twilight Aurora (Dark Mode)**: Deep navy/slate canvas (`#0b1120`) with cyan, violet, and amber ambient glows.
- **Daylight Iridescent Pearl (Light Mode)**: Soft iridescent alabaster canvas (`#f1f5fb`) with subtle azure and lilac rim reflections.

### Surface Elevation & Glass Hierarchy
1. **Canvas Level (`.liquid-canvas`)**:
   - Fixed background container with 4 floating, blurred ambient blobs (`.liquid-blob.blob-1..4`).
   - Blobs drift with gentle keyframe animations (`float-drift-1..4`, 22–32s cycle time).
2. **Primary Panels (`.glass-panel`)**:
   - `background: var(--bg-card);`
   - `backdrop-filter: blur(28px) saturate(190%);`
   - Specular rim highlight: `border: 1px solid var(--border-glass);` + `box-shadow: inset 0 1px 0 0 var(--border-highlight), var(--shadow-glass);`
   - Radii: Cards use `var(--radius-card, 24px)`; Modals use `var(--radius-modal, 28px)`.
3. **Sub-Wells & Inset Containers (`.glass-inset`)**:
   - `background: var(--bg-inset);`
   - `border: 1px solid var(--border-subtle);`
   - Radius: `var(--radius-sm, 14px)`.
4. **Interactive Cards (`.glass-card-interactive`)**:
   - On hover: `translate: 0 -4px;`, `box-shadow: var(--shadow-glass-hover);`, `border-color: var(--border-focus);`.

## 2. Navigation Architecture
- **Desktop (`>= 1024px`)**:
  - Main shell uses `.glass-sidebar` (`width: 272px; border-radius: 28px; position: sticky; top: 1.5rem;`).
  - Contains branding, project selector, primary view nav, unit selector, and theme toggle.
  - Workspace view renders inside `.workspace-main` (`@container workspace (min-width: ...)`).
- **Mobile / Tablet (`< 1024px`)**:
  - Collapses desktop sidebar into `.glass-mobile-topbar` (`height: 60px;`).
  - Bottom navigation renders as `.glass-bottom-tabbar` (`border-radius: 9999px; position: fixed; bottom: max(1rem, env(safe-area-inset-bottom));`).
  - Nav tabs use horizontal single-line touch scrolling (`overflow-x: auto; flex-wrap: nowrap; scrollbar-width: none;`).

## 3. Spring Physics & Motion Rules
- **Linear Spring Curves**:
  - Standard spring: `--spring-easing: linear(0, 0.006, 0.025, 0.063, 0.124, 0.208, 0.315, 0.437, 0.567, 0.697, 0.817, 0.916, 0.988, 1.031, 1.05, 1.051, 1.041, 1.024, 1.008, 0.997, 0.993, 0.993, 0.996, 0.999, 1);` (0.44s–0.5s duration).
  - Snappy spring: `--spring-snappy: linear(0, 0.012, 0.05, 0.124, 0.24, 0.388, 0.551, 0.709, 0.843, 0.941, 1.001, 1.03, 1.036, 1.028, 1.014, 1.004, 0.998, 0.996, 0.997, 1);` (0.28s–0.34s duration).
- **Rule of Separation**:
  - Always apply spring easing to spatial properties (`translate`, `scale`).
  - Never apply spring easing with overshooting curves to `opacity`—use standard `ease` or `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Reduced Motion**:
  - Always wrap motion in `@media (prefers-reduced-motion: reduce)` to disable floating blobs and replace springs with `opacity 0.15s ease`.

## 4. UI Invariants & Code Hygiene
1. **Zero Hardcoded Opaque Gradients**: Avoid hardcoding `background: rgba(15, 23, 42, 0.9)` or `color: #e2e8f0` inline in JSX. Use CSS variables (`var(--bg-card)`, `var(--text-main)`, `var(--text-secondary)`, `var(--border-color)`).
2. **Form Controls**: Use `.form-input` or global frosted `input`, `select`, and `textarea` styling with `border-radius: 9999px` (search pills) or `var(--radius-sm, 14px)`.
3. **Asynchronous Testing with React Lazy**:
   - Views loaded with `React.lazy()` inside `<Suspense>` must be asserted in Vitest tests using `await screen.findByText(...)`, never synchronous `screen.getByText(...)`.
