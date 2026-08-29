# OKTA MVP — Design Specification

**Status:** Approved architecture, implementation not started
**Date:** 2026-08-29
**Working product name:** OKTA (brand name remains configurable)

## 1. Product Vision

OKTA is a premium, vertical-first videoconferencing platform designed around presence, host control, visual clarity and AI-ready workflows. The experience must not resemble a traditional grid-first meeting product. The default meeting composition is a Stories-style vertical video canvas on both mobile and desktop, with contextual tools revealed only when needed.

The MVP must be real and deployable: authenticated users can create/join rooms, see live video/audio, manage participants, exchange chat messages, use notes and a collaborative whiteboard, schedule meetings, manage profiles and access a replay/library area prepared for recordings.

## 2. MVP Scope

### Included in MVP v1

1. Authentication and user profiles
2. Vertical-first live videoconference using LiveKit
3. Host-controlled speaking permissions and participant focus
4. Horizontal participant rail with avatar/photo cards
5. TikTok-style overlay chat that can be shown/hidden
6. Smart meeting room links
7. Agenda / meetings home
8. Neon collaborative whiteboard on dark grid
9. Personal meeting notes with autosave
10. Profile editor
11. Replay / Library interface prepared for recorded sessions
12. Responsive desktop + mobile experience
13. Role and entitlement foundation for future paid plans
14. Basic admin data model and moderation controls
15. Dark premium UI with clean glass layers and restrained accent color

### Deferred from MVP v1 but architecture-ready

1. Paid subscriptions and billing provider
2. Full cloud recording pipeline
3. AI transcription, meeting summaries and follow-up generation
4. CRM integrations
5. Facial/emotion inference
6. Advanced engagement analytics
7. Skin retouching / computer-vision video filters
8. Gesture/voice slide control
9. Streaming to external platforms
10. Enterprise SSO / custom domains

## 3. Core User Flows

### 3.1 Onboarding

- User lands on sign-in/sign-up screen.
- User authenticates with email magic link and/or Google OAuth via Supabase Auth.
- First login opens a minimal profile setup: name, photo, role/title, company, status.
- User enters the Home / Agenda screen.

### 3.2 Create Meeting

- Host taps `Nova reunião`.
- Host chooses immediate or scheduled meeting.
- System creates a room record and a unique shareable meeting slug.
- Host can copy the room link or invite an existing contact.
- LiveKit room token is issued server-side only.

### 3.3 Join Meeting

- User opens a room link.
- If authenticated, profile is preloaded.
- If guest access is enabled later, guest joins with a lightweight name/photo flow.
- User sees prejoin camera/microphone controls.
- Meeting opens in vertical-first layout.

### 3.4 Host Controls Speaking

- Participant avatars appear in a horizontal rail.
- Host can drag/scroll the rail.
- Tapping a participant opens actions:
  - Dar a palavra
  - Fixar na tela
  - Mutar
  - Tornar co-host
  - Remover
- `Dar a palavra` updates app-level permission state and the UI emphasis. The selected speaker becomes the primary focused participant.
- In v1, hard media permission enforcement will rely on LiveKit permissions where feasible; otherwise app state controls microphone enablement and host moderation commands.

### 3.5 Chat

- Chat overlays on the live video in a compact TikTok-inspired style.
- Host can hide/show chat.
- Messages contain avatar, display name, timestamp and text.
- Reactions are lightweight and non-obstructive.
- Chat persists to Supabase for the room session.

### 3.6 Whiteboard

- Opens as a full-screen or side-panel tool without leaving the room.
- Background: near-black.
- Grid/ruler: subtle dark guide lines.
- Neon pen colors, eraser, basic shapes, text, clear canvas.
- Collaborative cursors/drawing synced in real time.
- MVP persistence stores whiteboard state by room/session.

### 3.7 Notes

- Private personal notes panel.
- Autosave to Supabase.
- Notes are linked to the room and user.
- Notes remain accessible from replay/library details.

### 3.8 Agenda

- Home screen shows today's meetings prominently.
- Date strip for upcoming days.
- Meeting cards include title, time, participant avatars and status.
- Buttons: Entrar, Copiar link, Editar.

### 3.9 Replay / Library

- MVP presents the library experience even before full cloud recording is enabled.
- Library sections:
  - Continuar assistindo
  - Recentes
  - Favoritos
  - Categories/tags
- Session detail supports metadata, participants, notes and future tabs for transcript/AI summary.
- Data model must support recorded asset URLs later without schema replacement.

## 4. UX / Visual System

### 4.1 Design principles

- Vertical video is the default visual language.
- Avoid dense control bars and traditional meeting grids.
- The human face/video is the primary content.
- Controls are contextual, compact and gesture-friendly.
- Desktop should use side space for tools, not stretch vertical video unnecessarily.
- Dark mode is primary.
- Light mode can be deferred.
- Rounded geometry, soft glass layers, large photography, minimal borders.
- Accent color must be configurable in design tokens.

### 4.2 Mobile meeting layout

- Primary speaker occupies the main vertical canvas.
- Participant rail can sit above/below depending on room state.
- Bottom floating dock contains microphone, camera, participants, tools and leave.
- TikTok chat overlays near the lower-left/lower-center safe area.
- Swipe/drag gestures may reveal participant rail or contextual panels.

### 4.3 Desktop meeting layout

- Center: vertical 9:16 primary video.
- Left/right rails are used for one active context at a time:
  - Participants
  - Chat
  - Notes
  - Whiteboard
  - Meeting info
- Secondary participants remain in a horizontally scrollable or compact vertical rail depending on viewport width.
- Horizontal video mode is optional, never default.

## 5. Technical Architecture

### Frontend

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Radix UI or equivalent accessible primitives
- Framer Motion for restrained transitions

### Backend / Data

- Supabase Auth
- Supabase Postgres
- Supabase Realtime
- Supabase Storage for avatars and future meeting assets
- Row Level Security on all user-owned and room-scoped tables

### Realtime Video

- LiveKit Cloud for MVP
- LiveKit React components used selectively; meeting UI remains custom
- Server-side token creation through Next.js route handler/server action
- LiveKit secrets never exposed client-side

### Deployment

- GitHub as source of truth
- Vercel for web deployment and serverless/edge-capable API routes
- Environment variables managed in Vercel

### Future integrations

- Billing: Stripe / Mercado Pago / Asaas decision deferred
- AI: transcription + LLM service behind provider-agnostic adapter
- CRM: provider adapters behind webhook/event layer

## 6. Data Model

### profiles

- id uuid pk references auth.users
- display_name text
- username text unique nullable
- avatar_url text nullable
- headline text nullable
- company text nullable
- status text nullable
- created_at timestamptz
- updated_at timestamptz

### rooms

- id uuid pk
- slug text unique
- title text
- owner_id uuid references profiles.id
- livekit_room_name text unique
- status enum: scheduled | live | ended
- scheduled_at timestamptz nullable
- started_at timestamptz nullable
- ended_at timestamptz nullable
- chat_enabled boolean default true
- created_at timestamptz

### room_members

- id uuid pk
- room_id uuid references rooms.id
- user_id uuid references profiles.id
- role enum: host | cohost | participant
- can_speak boolean default true
- is_pinned boolean default false
- joined_at timestamptz nullable
- left_at timestamptz nullable
- unique(room_id, user_id)

### room_messages

- id uuid pk
- room_id uuid references rooms.id
- user_id uuid references profiles.id
- body text
- created_at timestamptz

### meeting_notes

- id uuid pk
- room_id uuid references rooms.id
- user_id uuid references profiles.id
- content text
- updated_at timestamptz
- unique(room_id, user_id)

### whiteboard_documents

- id uuid pk
- room_id uuid references rooms.id
- snapshot jsonb
- updated_at timestamptz

### recordings

- id uuid pk
- room_id uuid references rooms.id
- title text
- thumbnail_url text nullable
- video_url text nullable
- duration_seconds integer nullable
- status enum: pending | ready | failed
- created_at timestamptz

### meeting_tags

- id uuid pk
- room_id uuid references rooms.id
- label text

### user_entitlements

- id uuid pk
- user_id uuid references profiles.id
- plan_code text default 'free'
- capabilities jsonb default '{}'
- updated_at timestamptz

## 7. Security and Privacy

- Supabase RLS enabled for all application tables.
- Users can only edit their own profile.
- Room owners/cohosts can manage room settings and participant permissions.
- Room members can read room-scoped data only when authorized.
- LiveKit access tokens are short-lived and issued by the server.
- No emotion/facial analysis is included in v1.
- Future behavioral analytics require explicit consent and must be framed as engagement signals rather than definitive mental-state diagnosis.

## 8. Component Boundaries

### `features/auth`
Authentication and first-run profile setup.

### `features/agenda`
Meeting list, date navigation, create/edit meeting flows.

### `features/meeting`
Room shell, LiveKit connection, host moderation, speaker focus, participant rail and room state.

### `features/chat`
Realtime room chat and overlay rendering.

### `features/whiteboard`
Collaborative canvas and persistence.

### `features/notes`
Private room-linked notes.

### `features/library`
Replay browsing and recording metadata UI.

### `features/profile`
Profile viewing/editing.

### `lib/supabase`
Browser/server Supabase clients and typed DB helpers.

### `lib/livekit`
Token request client, role/permission adapter and LiveKit room helpers.

### `lib/permissions`
Application-level authorization predicates.

## 9. Error Handling

- Every network mutation has explicit loading, success and failure states.
- Joining a room must distinguish: invalid room, unauthorized, expired token and connection failure.
- LiveKit disconnects show a reconnect state before failing the meeting.
- Chat/notes/whiteboard optimistic updates must rollback or surface retry state on failure.
- Missing camera/mic permission must not block text-only participation.

## 10. Performance

- Lazy-load non-core meeting tools.
- Keep the initial meeting bundle focused on video, participant rail and essential controls.
- Avoid mounting whiteboard/library/analytics code until opened.
- Use image optimization for avatars and thumbnails.
- Virtualize long participant lists when needed.

## 11. Testing Strategy

### Unit tests

- Permission predicates
- Room role transitions
- Meeting slug creation
- Chat visibility state
- Agenda date grouping
- Library grouping

### Component tests

- Participant rail interactions
- Host action sheet
- TikTok chat overlay
- Notes autosave state
- Whiteboard toolbar

### Integration tests

- Authenticated room creation
- Join flow and LiveKit token endpoint
- Host gives/removes speaking permission
- Chat message persistence
- Notes persistence

### End-to-end smoke test

- Sign in
- Create meeting
- Open second browser context as participant
- Join room
- Host selects participant and changes permission
- Exchange chat messages
- Open notes and whiteboard
- End meeting
- See session in library metadata

## 12. MVP Acceptance Criteria

The MVP is considered ready for first external testing when:

1. It deploys successfully to Vercel from GitHub.
2. Supabase authentication works in production.
3. Two users can join the same LiveKit room with stable audio/video.
4. Video defaults to a vertical-first UI on desktop and mobile.
5. Host can select a participant from the avatar rail and apply moderation actions.
6. Chat works in real time and can be hidden.
7. Agenda can create and display scheduled rooms.
8. Notes autosave and reopen correctly.
9. Whiteboard supports collaborative drawing and room persistence.
10. Profile data persists.
11. Library displays ended sessions and recording-ready metadata.
12. RLS blocks unauthorized cross-user/cross-room data access.
13. Core flows pass automated smoke tests.

## 13. MVP Build Order

1. Project foundation + design tokens
2. Supabase auth + schema + RLS
3. Agenda + room creation
4. LiveKit token service + meeting shell
5. Vertical meeting UI + participant rail
6. Host moderation and speaking permission state
7. TikTok-style chat
8. Notes
9. Neon whiteboard
10. Profile editor
11. Replay/library
12. Responsive refinement
13. E2E and production deploy hardening

## 14. Explicit Non-Goals for v1

- Full Zoom/Teams feature parity
- Large-scale webinar broadcasting
- AI emotion detection
- Automated sales persuasion coaching
- Built-in CRM
- Production billing
- Enterprise SSO
- Native iOS/Android apps

The MVP is a production-quality responsive web app/PWA foundation designed to validate the vertical-first meeting experience before expanding into those modules.
