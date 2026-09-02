# OCTA Meeting Reference Experience Design

## Goal
Rebuild the Create Meeting experience to match the approved dark glass reference while preserving the application's already-fixed global Home sidebar.

## Scope
- Keep the global Home sidebar untouched and do not render a second meeting sidebar.
- Recompose the meeting workspace into host, participant stage, realtime Skills rail, slide rail, highlights, top navigation and bottom controls.
- Keep LiveKit active-speaker support, filters, notes, whiteboard, mute-all, add-participant and sharing behavior.
- Add chat activation/deactivation, emoji insertion and like reactions.
- Add a clickable heart reaction on the host video.
- Add a horizontally scrollable slide rail. Clicking a slide launches the full-screen presentation immediately and broadcasts the selected slide through the existing Supabase room channel.
- Preserve manual PDF/image upload and private preview before presentation.
- Improve full-screen slide navigation with keyboard/arrows and adjacent-image preloading.
- Add a realtime Skills panel using observable meeting signals only: active speaker events, participation activity, chat/reactions and elapsed time. Do not infer emotional or psychological state from facial appearance. The face frame is visual presentation only.
- When recent activity is absent for the configured interval, surface an estimated low-interaction moment, its minute and the current meeting topic plus a concrete facilitation suggestion.

## Visual system
Dark graphite/black workspace, translucent glass panels, thin white borders, restrained green live-state indicators, warm neutral highlights, SF Pro/Apple-style system typography, rounded cards and compact controls. Participant and host imagery remain the visual focus.

## Architecture
`InstantMeetingClient` owns the meeting composition and live interaction state. `ChatOverlay` owns message/emoji/reaction UI. `PresentationMode` remains the single synchronized presentation subsystem and gains an optional launch-slide contract. Existing `ParticipantStage`, LiveKit, notes, filters and whiteboard remain reused rather than duplicated.

## Safety and truthfulness
The Skills rail must describe its outputs as estimates based on observable meeting activity. It must not claim facial microexpression, emotion, interest or intent detection from a person's face.

## Verification
Source-contract tests cover the approved layout, fixed-sidebar compatibility, chat reactions/emojis, slide launching/broadcasting, slide preloading and the evidence-based Skills copy. Full project `vitest` and Next.js production build must pass before the deployment is considered complete.
