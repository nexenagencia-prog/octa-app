# OCTA In-Meeting Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add floating calculator and video filters, editable local profile, Brazilian plans, saved notes library, compact contacts, Portuguese meeting labels, and higher-resolution/correctly framed astronaut imagery without redesigning the approved OCTA UI.

**Architecture:** Keep the current `AppShell` and meeting tree mounted while opening tools through a lightweight global overlay controller. Use browser-local stores for profile and notes, static plan data for pricing, and CSS filters on the visible meeting stage with a graceful preview fallback. Preserve all existing routes; `/calculadora` and `/filtros` remain compatible but sidebar interactions use overlays.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind/global CSS, LiveKit, localStorage, lucide-react.

**Spec:** `docs/superpowers/specs/2026-08-29-octa-inmeeting-tools-plans-notes-design.md`

## Global Constraints
- Preserve the approved dashboard layout, colors, typography, and route behavior.
- No mandatory login.
- No checkout or real billing.
- Prices: Grátis R$ 0; Pro R$ 69,90/mês; Business R$ 109,90/mês.
- Filters: Natural, Pele Suave, Luz de Estúdio, Quente, Frio, P&B, Cinema.
- Do not depend on Instagram filters or proprietary third-party presets.
- Existing routes remain valid.

---

### Task 1: Contract tests for approved behavior
**Files:** Create `tests/architectural-update-contract.mjs`; modify `package.json`.
- [ ] Write failing assertions for overlay tools, plans, notes library, profile edit, Portuguese meeting labels, compact contacts and image asset.
- [ ] Run the test and confirm it fails before production changes.
- [ ] Add the contract to `test:contracts`.

### Task 2: Global tool overlay controller
**Files:** Create `src/components/tool-overlay-context.tsx`, `src/components/tool-overlay.tsx`; modify `src/components/app-shell.tsx`, `src/components/nav.tsx`, `src/components/calculator-panel.tsx`.
- [ ] Add context with `openTool('calculator'|'filters')` and `closeTool()`.
- [ ] Change sidebar Calculadora/Filtros from navigation to overlay actions.
- [ ] Render floating panels above current content without unmounting route content.
- [ ] Keep calculator keyboard listeners active only while panel exists.

### Task 3: Video filter presets inside meetings
**Files:** Create `src/lib/video-filters.ts`, `src/components/video-filter-panel.tsx`; modify `src/features/meeting/meeting-client.tsx`.
- [ ] Define seven stable presets and intensity interpolation.
- [ ] Add filter button in meeting controls and render compact overlay.
- [ ] Apply selected CSS filter to visible meeting video/photo stage, with preview fallback.
- [ ] Translate remaining meeting labels to Portuguese.

### Task 4: Editable local profile
**Files:** Create `src/lib/profile-store.ts`, `src/components/profile-editor.tsx`; modify `src/components/nav.tsx`.
- [ ] Add safe localStorage read/write with fallback to demo profile.
- [ ] Show pencil button next to own profile.
- [ ] Support name and photo URL/file data URL editing and immediate sidebar refresh.

### Task 5: Plans and prices
**Files:** Create `src/lib/plans.ts`, `src/app/planos/page.tsx`; modify `src/components/nav.tsx`.
- [ ] Define BRL plan data once.
- [ ] Add menu route `Planos e preços`.
- [ ] Add compact UI/UX plan cards consistent with existing OCTA panels and non-transactional CTAs.

### Task 6: Saved notes library
**Files:** Create `src/lib/notes-store.ts`, `src/app/minhas-anotacoes/page.tsx`; modify `src/features/notes/notes-panel.tsx`, `src/components/nav.tsx`.
- [ ] Store titled meeting notes in a single local collection.
- [ ] Add title input/save action to quick meeting notes.
- [ ] Add `Minhas Anotações` route with compact cards, search and expanded note view.

### Task 7: Compact contacts and image corrections
**Files:** Modify `src/app/contatos/page.tsx`, `src/app/page.tsx`, `src/app/globals.css`; replace `public/octa-space.png` with higher-resolution crop.
- [ ] Reduce contact card padding/avatar size/gaps and increase visible density.
- [ ] Use a higher-resolution crop from the approved source image.
- [ ] Correct lower-right image focal point so it does not clip awkwardly.

### Task 8: Verification and packaging
- [ ] Run all contract tests and calculator test.
- [ ] Run `git diff --check`.
- [ ] Attempt production install/build; report environment limitation if registry access prevents it.
- [ ] Package clean ZIP without `.git`, `node_modules`, `.next` or local artifacts.
