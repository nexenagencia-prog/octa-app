# OCTA Recordings Reference Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/gravacoes` to match the supplied OCTA recordings reference while preserving the current home sidebar and adding persistent recording rename/cover customization.

**Architecture:** Keep the existing home CSS module as the source of truth for the sidebar and top navigation identity. Replace the recordings page body with a recordings-specific dashboard and local customization state persisted in browser localStorage after uploaded cover images are resized/compressed to WebP.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS, lucide-react, browser Canvas/FileReader/localStorage.

**Spec:** `docs/superpowers/specs/2026-09-02-recordings-reference-dashboard-design.md`

## Global Constraints
- Preserve the current home sidebar without redesigning it.
- Do not modify the home hero or other app pages.
- Use black/charcoal glass surfaces and Apple-like typography.
- Rename and cover upload must remain after refresh in the same browser.
- Avoid duplicate floating OCTA AI on `/gravacoes`.

---

### Task 1: Recordings dashboard fidelity
**Files:**
- Modify: `src/app/gravacoes/page.tsx`
- Modify: `src/app/gravacoes/recordings-netflix.css`
- Test: `tests/recordings-netflix.test.ts`

**Interfaces:**
- Consumes: home sidebar CSS classes from `src/app/home-reference.module.css`
- Produces: `GravacoesPage` with filters, grid, right report rail and OCTA AI bar.

- [ ] Write regression assertions for the home sidebar reuse, 3-column grid, report rail, filters, rename and cover upload controls.
- [ ] Replace the previous featured-replay shelf with the supplied reference composition.
- [ ] Verify the page contains no featured hero replay treatment and cards do not overlap the AI bar.

### Task 2: Persistent recording customization
**Files:**
- Modify: `src/app/gravacoes/page.tsx`
- Test: `tests/recordings-netflix.test.ts`

**Interfaces:**
- Consumes: browser `FileReader`, `HTMLCanvasElement`, `localStorage`
- Produces: customization map keyed by recording id under `octa-recording-customizations-v1`.

- [ ] Add edit modal opened from each card overflow action.
- [ ] Save custom titles and compressed WebP covers.
- [ ] Restore customizations on mount and update the card/report immediately after save.

### Task 3: Prevent duplicate AI launcher
**Files:**
- Modify: `src/components/ai/global-octa-ai.tsx`
- Test: `tests/recordings-netflix.test.ts`

**Interfaces:**
- Consumes: current pathname.
- Produces: no global floating coach on `/gravacoes` while the page-owned OCTA AI remains visible.

- [ ] Add `/gravacoes` to the global-AI suppression list.
- [ ] Verify the recordings page still renders both the right OCTA AI card and bottom composer.

### Task 4: Verification
**Files:** all files above.

- [ ] Run the recordings regression test.
- [ ] Run the full test suite and production build.
- [ ] Publish only after the complete batch is ready.
