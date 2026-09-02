# OCTA Local Slide Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a high-performance local slide creator with persistent library and global hero branding.

**Architecture:** IndexedDB persists decks and binary assets locally. A new client route renders library, editor, drag/resize canvas, property inspector, imports, and local presentation mode. The existing global hero sidebar links to the studio.

**Tech Stack:** Next.js 15, React 19, TypeScript, IndexedDB, existing pdfjs presentation loader, Tailwind utilities.

**Spec:** `docs/superpowers/specs/2026-09-02-octa-local-slide-studio-design.md`

## Global Constraints
- No Supabase storage for user presentations.
- Desktop slides use 1600×900 internal coordinates (16:9).
- PDF, JPEG and PNG imports remain supported.
- Branding matches the hero sidebar.
- Publish through one final fast-forward update to `main`.

### Task 1: Local persistence model
Create `src/lib/local-slide-studio.ts` with deck/slide/element types, starter layouts, IndexedDB access, asset storage, duplicate and delete operations.

### Task 2: Slide studio route
Create `src/app/criar-slides/page.tsx` with saved library, first-slide thumbnails, autosave, starter layouts, text/image/shape editing, drag/resize, PDF/JPEG/PNG import, property inspector, and local presenter mode.

### Task 3: Global navigation and branding
Modify `src/components/global-legacy-sidebar.tsx` to add `Criar slides` and lock logo/profile typography and colors to the hero variant on every app page.

### Task 4: Regression coverage
Create `tests/slide-studio.test.ts` to verify 16:9 starter documents, local IndexedDB persistence contract, import/editor affordances, saved library actions, and hero sidebar link/branding.

### Task 5: Verification
Run the full Vercel build after the single `main` update and confirm all Vitest tests plus Next.js type/build complete successfully.
