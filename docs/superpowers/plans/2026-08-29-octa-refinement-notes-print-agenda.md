# OCTA Refinement Implementation Plan

**Goal:** Implement the requested notes, screenshot, agenda, navigation and drag fixes without redesigning the approved interface.

**Architecture:** Extend the existing ToolOverlay provider with a notes tool, centralize draggable pointer behavior in focused components, persist structured notes in the existing local note store, and add a global screenshot control to AppShell and MeetingClient. Keep routing and existing feature modules intact.

**Tech Stack:** Next.js 15, React 19, TypeScript, localStorage, browser Screen Capture API, lucide-react.

**Spec:** `docs/superpowers/specs/2026-08-29-octa-refinement-notes-print-agenda-design.md`

## Global Constraints
- Preserve approved visual design, colors and existing routes.
- No mandatory login.
- No unrelated refactors.

### Task 1: Regression contract
- Add a static contract test that proves the requested navigation, notes, screenshot and agenda behaviors exist.
- Run and confirm it fails on the current baseline.

### Task 2: Structured draggable notes
- Extend notes store with subject.
- Create draggable floating note editor with title, subject and message.
- Wire sidebar Anotar and meeting Anotar to this overlay.
- Persist records to Minhas Anotações.

### Task 3: Stable calculator drag
- Replace transform-only delta logic with viewport-clamped fixed coordinates driven by pointer movement.
- Apply to global and meeting calculator.

### Task 4: Global screenshot control
- Remove Printar tela sidebar entry.
- Add a fixed screenshot button to AppShell and MeetingClient.
- Capture a single browser-approved screen frame and download PNG; surface graceful errors/cancel state.

### Task 5: Navigation and sidebar cleanup
- Remove the top collapse button and keep the footer control only.
- Remove Plans from sidebar and add to top navigation.
- Remove play glyph from Gravações label.

### Task 6: Agenda create modal
- Add date, subject, time and selectable participant avatars.
- Persist created meeting in component state and reflect participants/date in the created card.

### Task 7: Home image/card fixes
- Stop reusing the astronaut image in the lower Connect card to remove the duplicated background.
- Use a single dark gradient/texture treatment there and ensure rounded clipping with safe bottom spacing.

### Task 8: Verification
- Run all static contracts, calculator test, git diff check-equivalent syntax checks and package the project.
