# OCTA Reference Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved reference-driven black/liquid-silver polish across Home, Instant Meeting, Calculator, Skills, Plans, Notes, and dark mode while preserving existing product behavior.

**Architecture:** Keep existing route/component boundaries. Behavioral changes stay inside the current meeting/chat/notes components; visual changes are layered through one new final override stylesheet imported after existing product CSS so approved legacy styling is not rewritten wholesale.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind utilities, CSS, Vitest/contract tests.

**Spec:** `docs/superpowers/specs/2026-08-31-octa-reference-polish-design.md`

## Global Constraints
- Do not create a mockup or parallel project.
- Keep the video player vertical 9:16.
- Preserve routes, calculator engine, notes store, and meeting controls.
- User-facing dark surfaces use black/graphite/silver; no blue-dominant backgrounds.
- All changed UI actions remain clickable and production build must pass.

---

### Task 1: Home overlap fixes
**Files:** Modify `src/app/page.tsx`; create/import final polish CSS.
- [ ] Add stable global hooks to the next-meeting time/today label and metrics strip.
- [ ] Override spacing/stacking so `Hoje` never collides with the time or agenda link.
- [ ] Move metrics below the hero flow so it cannot cover hero CTAs on desktop or responsive widths.
- [ ] Verify `/` compiles.

### Task 2: Instant meeting chat and participant picker
**Files:** Modify `src/features/meeting/instant-meeting-shell.tsx`, `src/features/meeting/instant-meeting-client.tsx`, `src/features/chat/chat-overlay.tsx`.
- [ ] Move Add participant into the meeting header through an `onAddParticipant` callback.
- [ ] Replace mixed picker cards with a two-mode selector: `Miniaturas` and `WhatsApp`.
- [ ] Make thumbnail selection interactive and WhatsApp launch a real `wa.me` share URL.
- [ ] Anchor live chat to `bottom: 0`, `left: 0`, `right: 0` inside the 9:16 video with full-width glass gradient.
- [ ] Preserve close/send behavior.

### Task 3: Calculator premium treatment
**Files:** Modify `src/components/calculator-panel.tsx`; style through final polish CSS.
- [ ] Add semantic display/keypad hooks without touching calculator logic.
- [ ] Apply premium dark-glass shell, silver display typography, pill keys, distinct operators, pressed/hover states.
- [ ] Keep keyboard input behavior unchanged.

### Task 4: Skills reference system
**Files:** Modify `src/app/skills/page.tsx`; style through final polish CSS.
- [ ] Keep all four tabs functional.
- [ ] Replace blue-oriented labels/buttons with neutral/silver hooks.
- [ ] Present competency bars, trend chart, radar, goal, transcript, training and evolution in a coherent status-widget/card system.
- [ ] Preserve load animations and numerical content.

### Task 5: Pricing cards
**Files:** Modify `src/app/planos/page.tsx`; style through final polish CSS.
- [ ] Keep plan data and CTA behavior.
- [ ] Add pricing-card structural hooks for metallic price, glass edge, silver CTA and featured glow.
- [ ] Ensure three cards remain readable and responsive.

### Task 6: Simplified notes
**Files:** Modify `src/app/anotacoes/page.tsx`, `src/features/notes/floating-notes-card.tsx`, `tests/refinement-round2-contract.mjs`.
- [ ] Replace subject/rich-editor UI with only `Título` and `Texto`.
- [ ] Save plain text through the existing notes store with meeting context preserved.
- [ ] Keep floating card draggable, closable, and savable.
- [ ] Update the refinement contract to assert the new simplified note UI.

### Task 7: Dark-mode black sweep
**Files:** Create `src/app/octa-reference-polish.css`; modify `src/app/layout.tsx`.
- [ ] Import stylesheet after existing `octa-black-silver-v2.css`.
- [ ] Override known cyan/blue dark-mode surfaces, sidebars, panels, buttons and utility classes to black/graphite/silver.
- [ ] Keep semantic green/red states intact.
- [ ] Avoid changing CMS/admin visuals.

### Task 8: Verification
**Files:** no new production files unless a regression fix is required.
- [ ] Verify latest Vercel production deployment reaches READY.
- [ ] Inspect build logs for TypeScript/Next.js errors.
- [ ] Confirm changed routes are generated: `/`, `/reuniao-instantanea`, `/calculadora`, `/skills`, `/planos`, `/anotacoes`.
- [ ] Report exact final commit and production status.
