# OCTA Meeting Reference Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Create Meeting to the approved reference with chat reactions, synchronized slide launch and evidence-based realtime Skills while preserving the fixed Home sidebar.

**Architecture:** Keep `InstantMeetingClient` as the meeting state owner, reuse `ParticipantStage` and LiveKit, extend `ChatOverlay` for lightweight interaction, and extend the existing `PresentationMode` broadcast channel instead of introducing a second presentation system. Meeting-specific visual rules remain in the already-imported `meeting-chat-visibility.css` so no root-layout change is required.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind utility classes, CSS, Lucide icons, Supabase Realtime, LiveKit, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-02-meeting-reference-design.md`

## Global Constraints
- Keep the existing global Home sidebar unchanged.
- Do not infer emotion, interest, intent or microexpressions from facial appearance.
- Preserve existing meeting tools and LiveKit behavior.
- Publish all functional changes through one final `main` ref update.

---

### Task 1: Meeting composition
**Files:** Modify `src/features/meeting/instant-meeting-client.tsx`; Modify `src/app/meeting-chat-visibility.css`; Test `tests/participant-stage-ui.test.ts`; Test `tests/meeting-reference-experience.test.ts`.
**Interfaces:** Consumes existing `ParticipantStage`, `LiveKitStage`, notes, filters, whiteboard and `PresentationMode`. Produces `presentationLaunchId`, evidence-based activity state and the approved three-column meeting UI.
- [ ] Write source-contract tests for host, participant stage, right rail and absence of the old local sidebar.
- [ ] Verify the old source fails the new contract.
- [ ] Replace the local sidebar composition with the reference topbar, host zone, participant stage, right rail and bottom toolbar.
- [ ] Add activity tracking from active-speaker events, reactions and chat interactions.
- [ ] Add the Skills rail and low-interaction estimate using elapsed meeting activity only.
- [ ] Run the focused tests and verify they pass.

### Task 2: Interactive chat
**Files:** Modify `src/features/chat/chat-overlay.tsx`; Test `tests/meeting-chat-visibility.test.ts`.
**Interfaces:** Consumes `initialMessages`, `onClose`, optional `onActivity`. Produces emoji insertion, per-message like counts and activity callbacks.
- [ ] Update the chat contract to require emoji and like controls.
- [ ] Add emoji picker state, clickable message hearts and activity callbacks.
- [ ] Keep chat close as an explicit activation/deactivation control and preserve the message composer.
- [ ] Verify the focused chat contract passes.

### Task 3: Synchronized slide rail and presentation
**Files:** Modify `src/features/meeting/presentation-mode.tsx`; Test `tests/presentation-mode.test.tsx`.
**Interfaces:** Consumes optional `launchSlideId:string|null` plus `initialSlides`. Produces immediate full-screen show/broadcast for a selected rail slide, presenter navigation and adjacent-slide preload.
- [ ] Update the presentation contract for selected-slide launch and preload.
- [ ] Add `launchSlideId` handling that reuses the existing `presentation` Supabase broadcast.
- [ ] Keep upload/private preview and stop-presentation broadcast behavior.
- [ ] Preload adjacent images and preserve arrow-key navigation.
- [ ] Verify the focused presentation contract passes.

### Task 4: Production verification
**Files:** No additional production files.
**Interfaces:** Consumes the complete tree from Tasks 1-3. Produces one production commit.
- [ ] Build one Git tree containing all source, tests, spec and plan changes on top of the current `main` tree.
- [ ] Create one commit and update `main` once.
- [ ] Verify Vercel runs the full Vitest suite and Next.js production build successfully.
- [ ] Confirm the resulting production deployment reaches READY and carries the final commit SHA.
