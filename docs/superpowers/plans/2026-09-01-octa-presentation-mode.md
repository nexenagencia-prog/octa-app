# OCTA Presentation Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an in-meeting presentation workflow for PDF, JPEG and PNG with private preview, explicit approval, public presentation mode, keyboard navigation and optional participant rail.

**Architecture:** Keep private preview state local to the presenter and isolate presentation behavior into focused `src/features/meeting/presentation-*` units. Both normal and instant meetings render the same presentation UI. Image files become slides directly; PDF pages are rasterized in-browser with `pdfjs-dist`, so each page is an independent slide. Public state remains local in this release because the current demo room does not expose a shared data-channel state API; the UI must never leak private preview state when realtime sync is unavailable.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Vitest, Testing Library, pdfjs-dist.

**Spec:** `docs/superpowers/specs/2026-09-01-octa-presentation-mode-design.md`

## Global Constraints

- Accept only PDF, JPEG and PNG.
- Clicking a thumbnail must never publish it.
- Publishing requires the explicit `Apresentar este slide` action.
- ESC closes private preview only.
- ArrowLeft/ArrowRight navigate published slides for the presenter.
- `Parar apresentação` returns to the normal meeting layout.
- Must work in both `MeetingClient` and `InstantMeetingClient`.
- Build and existing tests must pass before publication.

---

### Task 1: Presentation model and file ingestion

**Files:**
- Create: `src/features/meeting/presentation-model.ts`
- Create: `tests/presentation-model.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `PresentationSlide`, `isSupportedPresentationFile(file)`, `loadPresentationFiles(files)`.

- [ ] **Step 1: Write failing tests** for MIME validation, multiple image ordering, and unsupported-file rejection.
- [ ] **Step 2: Run** `npx vitest run tests/presentation-model.test.ts` and confirm RED because the module does not exist.
- [ ] **Step 3: Add `pdfjs-dist`** and implement image-object URLs plus PDF page rasterization into image data URLs.
- [ ] **Step 4: Run** `npx vitest run tests/presentation-model.test.ts` and confirm GREEN.
- [ ] **Step 5: Commit** model, dependency, and tests.

### Task 2: Shared presentation UI

**Files:**
- Create: `src/features/meeting/presentation-mode.tsx`
- Create: `tests/presentation-mode.test.tsx`

**Interfaces:**
- Consumes: `PresentationSlide`, `loadPresentationFiles`.
- Produces: `PresentationMode({open,onClose,participants})` component.

- [ ] **Step 1: Write failing UI tests** proving thumbnail click opens `Só você está vendo`, does not show `AO VIVO`, approval shows `AO VIVO`, participant rail toggles, and stop returns to library state.
- [ ] **Step 2: Run** `npx vitest run tests/presentation-mode.test.tsx` and confirm RED.
- [ ] **Step 3: Implement** right drawer, upload zone, vertical thumbnails, half-screen private preview, explicit approval, full-screen public stage, previous/next controls, keyboard handling, and optional participant rail.
- [ ] **Step 4: Run** `npx vitest run tests/presentation-mode.test.tsx` and confirm GREEN.
- [ ] **Step 5: Commit** shared presentation UI and tests.

### Task 3: Integrate both meeting flows

**Files:**
- Modify: `src/features/meeting/meeting-client.tsx`
- Modify: `src/features/meeting/instant-meeting-client.tsx`
- Create: `tests/presentation-integration-contract.mjs`

**Interfaces:**
- Consumes: `PresentationMode`.
- Produces: in-meeting `Compartilhar` behavior with `Apresentação` and traditional browser share options.

- [ ] **Step 1: Write failing contract test** asserting both clients import/render `PresentationMode` and wire the share control to the in-room chooser instead of navigating to `/compartilhar-tela`.
- [ ] **Step 2: Run** `node tests/presentation-integration-contract.mjs` and confirm RED.
- [ ] **Step 3: Implement** a compact share chooser in both meeting clients: `Apresentação` opens the drawer; `Tela ou janela` calls `navigator.mediaDevices.getDisplayMedia({video:true,audio:true})` when available, with safe cancellation feedback.
- [ ] **Step 4: Run** the contract test and presentation tests and confirm GREEN.
- [ ] **Step 5: Commit** integrations.

### Task 4: Regression verification and publication

**Files:**
- Modify only if verification exposes a defect.

- [ ] **Step 1: Run** `npm test`.
- [ ] **Step 2: Run** `npm run typecheck`.
- [ ] **Step 3: Run** `npm run build`.
- [ ] **Step 4: Verify** the production deployment associated with `main` succeeds and inspect build logs if it does not.
- [ ] **Step 5: Confirm** the published site loads the meeting route without runtime/build errors and report the commit/deployment result.