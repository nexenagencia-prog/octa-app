# OKTA Functional Navigation Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved OCTA interface into a no-page-scroll desktop app shell with a collapsible sidebar and functional routes/tools, while preserving the approved visual design.

**Architecture:** Keep the existing Next.js App Router project and add a shared client-side application shell that owns sidebar state and navigation. Each sidebar item maps to a real route; browser-only tools are isolated as focused client components and persist simple state in localStorage where useful.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-29-okta-navigation-functional-shell-design.md`

## Global Constraints

- Preserve the current approved OCTA visual language; no unrequested redesign.
- Desktop shell uses `100dvh` and avoids document-level vertical scrolling.
- Sidebar must expand/collapse and persist the choice locally.
- Existing room/profile/Supabase/LiveKit routes must remain intact.
- Authentication gating is deferred; existing `/login` is not made mandatory in this phase.

---

### Task 1: Shared application shell and collapsible sidebar

**Files:**
- Create: `src/components/app-shell.tsx`
- Modify: `src/components/nav.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/navigation-contract.test.ts`

**Interfaces:**
- Consumes: Next.js `usePathname`, route links, browser `localStorage`.
- Produces: `AppShell`, `DashboardSidebar`, route-aware navigation, persisted `octa-sidebar-collapsed` state.

- [ ] Write a failing contract test that requires all sidebar routes and collapsed-state hooks.
- [ ] Run the test and confirm it fails for missing routes/state markers.
- [ ] Implement `AppShell` and collapsible sidebar without changing approved colors/visual hierarchy.
- [ ] Run the contract test and confirm it passes.
- [ ] Commit the shell change.

### Task 2: Wire home actions and remove page-level desktop scroll

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/home-contract.test.ts`

**Interfaces:**
- Consumes: routes from Task 1.
- Produces: functional home CTA links and a viewport-bounded home composition.

- [ ] Write a failing contract test for home CTAs and viewport shell classes.
- [ ] Run it and confirm the intended failures.
- [ ] Replace hash/button placeholders with real route links and bound the desktop layout to the viewport.
- [ ] Run the test and confirm it passes.
- [ ] Commit the home wiring change.

### Task 3: Core content pages

**Files:**
- Create: `src/components/page-shell.tsx`
- Create: `src/app/agenda/page.tsx`
- Create: `src/app/reunioes/page.tsx`
- Create: `src/app/contatos/page.tsx`
- Create: `src/app/gravacoes/page.tsx`
- Test: `tests/route-contract.test.ts`

**Interfaces:**
- Consumes: `AppShell`, existing demo data, existing room route.
- Produces: real pages for agenda, meetings, contacts, and recordings.

- [ ] Write a failing route contract test that asserts all required page files exist.
- [ ] Run it and confirm missing-route failures.
- [ ] Implement each route using bounded cards/grids and existing visual tokens.
- [ ] Run the route test and confirm it passes.
- [ ] Commit the core route pages.

### Task 4: Digital calculator

**Files:**
- Create: `src/lib/calculator.ts`
- Create: `src/components/calculator-panel.tsx`
- Create: `src/app/calculadora/page.tsx`
- Test: `tests/calculator.test.ts`

**Interfaces:**
- Consumes: keyboard/keypad input.
- Produces: `applyCalculatorInput(state, key)` and a functional calculator page.

- [ ] Write failing tests for digits, decimal, arithmetic, equals, clear, backspace, and percent.
- [ ] Run tests and confirm they fail because calculator logic is missing.
- [ ] Implement the minimal calculator state machine and UI.
- [ ] Run calculator tests and confirm they pass.
- [ ] Commit calculator feature.

### Task 5: Browser tools pages

**Files:**
- Create: `src/app/filtros/page.tsx`
- Create: `src/app/compartilhar-tela/page.tsx`
- Create: `src/app/gravar/page.tsx`
- Create: `src/app/mutar/page.tsx`
- Create: `src/app/chat/page.tsx`
- Create: `src/app/printar-tela/page.tsx`
- Create: `src/app/anotacoes/page.tsx`
- Create: `src/app/configuracoes/page.tsx`
- Create: `src/components/browser-tools.tsx`
- Test: `tests/tool-pages-contract.test.ts`

**Interfaces:**
- Consumes: `navigator.mediaDevices`, `MediaRecorder`, `window.print`, `localStorage` where supported.
- Produces: explicit active/denied/unsupported states for browser-dependent features.

- [ ] Write a failing contract test for all tool route files and expected browser API markers.
- [ ] Run and confirm missing-feature failures.
- [ ] Implement focused browser-tool components and route pages with graceful fallback states.
- [ ] Run contract tests and confirm they pass.
- [ ] Commit tool pages.

### Task 6: Verification and GitHub package

**Files:**
- Modify: `README.md`
- Create: `/mnt/data/okta-app-functional-github.zip`

**Interfaces:**
- Consumes: complete app from Tasks 1–5.
- Produces: verified repository archive ready to replace files in the existing GitHub repo.

- [ ] Run `npm install` if dependencies are unavailable.
- [ ] Run `npm test` and confirm zero failures.
- [ ] Run `npm run typecheck` and confirm zero TypeScript errors.
- [ ] Run `npm run build` and confirm exit code 0.
- [ ] Run `git diff --check` and confirm no whitespace errors.
- [ ] Update README with routes and deployment notes.
- [ ] Create the ZIP excluding `.git`, `.next`, and `node_modules`.
