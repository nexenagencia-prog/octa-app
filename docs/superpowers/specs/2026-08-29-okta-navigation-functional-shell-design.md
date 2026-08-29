# OKTA Functional Navigation Shell — Design Specification

## Goal
Transform the approved OKTA interface into a fully navigable desktop application shell without changing the approved visual design. The main screen must fit within the browser viewport without page-level vertical scrolling.

## Approved Visual Constraint
The current approved home design remains visually intact. This phase changes behavior, routing, responsive sizing, and functional interactions only. No unrequested redesign, color change, typography change, card redesign, or structural restyling is permitted.

## Viewport and Layout Behavior
- Desktop application shell uses `100dvh` and must not create page-level vertical scrolling.
- Sidebar and top navigation remain inside the viewport.
- Main content resizes to available space.
- Overflow-heavy content uses tabs, pagination, carousels, or bounded internal panels instead of document-level vertical scrolling.
- Layout must adapt correctly when the sidebar changes width.

## Collapsible Sidebar
Two states are required:

### Expanded
- Profile photo, Denner Biersack, role, and status are visible.
- Every navigation item shows icon + text.
- Existing approved sidebar styling is preserved.

### Collapsed
- Sidebar reduces to a compact icon rail.
- Text labels and profile metadata are hidden while icons remain available.
- Tooltips identify icons on hover/focus.
- Main content expands into the newly available horizontal space.
- Cards and panels resize/reflow without overlap or clipping.
- Collapse/expand button remains visible in both states.
- State is persisted locally so refresh keeps the user's choice.

## Routes and Navigation
The sidebar and top navigation must use real routes:

- `/` — Início
- `/agenda` — Agenda
- `/reunioes` — Reuniões
- `/contatos` — Contatos
- `/gravacoes` — Gravações / replay library
- `/calculadora` — Calculadora digital
- `/filtros` — Filtros
- `/compartilhar-tela` — Compartilhar Tela
- `/gravar` — Gravar
- `/mutar` — Mutar
- `/chat` — Desativar Chat / chat control
- `/printar-tela` — Printar tela
- `/anotacoes` — Anotar
- `/configuracoes` — Configurações

Existing working routes such as meeting-room, profile, Supabase, and LiveKit-related routes must not be removed or broken.

## Home Button Wiring
Approved home controls become functional:
- `Entrar` opens the meeting flow.
- `Ver agenda` routes to `/agenda`.
- `Nova reunião` routes to the meeting creation/start flow.
- `Agendar` routes to `/agenda` with the scheduling interface active.
- `Contatos` routes to `/contatos`.
- `Gravações` routes to `/gravacoes`.
- `Ver agenda completa` routes to `/agenda`.
- Instant-meeting avatars open the relevant contact/meeting action.

## Functional Pages

### Calculadora
A separate digital calculator page with working number keys, decimal input, clear, backspace, percentage, basic arithmetic operations, equals, keyboard support, and a clean display matching the approved visual language.

### Agenda
Visual agenda with date selector, meeting cards, upcoming/today states, join action, and scheduling action. It must fit the viewport through bounded sections rather than page scroll.

### Reuniões
Meeting list/status view with create, join, and open-room actions.

### Contatos
Contact grid/list with search and instant-meeting action.

### Gravações
Replay/library view with recordings and open/play actions, preserving the streaming-library direction already approved.

### Filtros
Filter selection and preview controls. If live camera is not connected, the interface must remain demonstrable without pretending an unavailable effect is active.

### Compartilhar Tela
Uses the browser screen-sharing capability where supported. It must display a clear unsupported/permission-denied state rather than failing silently.

### Gravar
Recording controls page. Browser/local recording controls may be exposed where technically available; cloud meeting recording remains dependent on LiveKit configuration.

### Mutar
Microphone control interface with current state and permission handling.

### Chat
Chat enabled/disabled state and meeting-chat preview. Existing real-time integration remains compatible with future Supabase/LiveKit hookup.

### Printar Tela
Provides a capture/print workflow supported by the browser, with explicit fallback where direct capture is restricted.

### Anotações
Editable notes with local persistence until Supabase persistence is enabled.

### Configurações
Application preferences including sidebar state and interface-level controls that already exist in the product scope. No new unrelated settings are introduced.

## Interaction and State
- Shared application shell owns sidebar state.
- Active navigation item reflects the current route.
- Local-only features use browser storage where persistence is useful.
- Features requiring browser permissions must handle denied/cancelled permissions visibly.
- LiveKit/Supabase integration points remain intact and must not be replaced by fake production data paths.

## Responsive Behavior
Desktop is the primary target for the no-scroll shell. On smaller screens, the interface may switch to a mobile navigation pattern where required for usability, but must preserve the same route structure and functionality.

## Testing and Verification
Implementation is considered complete only when:
- Every sidebar item routes to a real page.
- Every home CTA routes or performs the intended action.
- Sidebar expands/collapses and the main layout adapts correctly.
- Desktop home has no page-level vertical scrollbar at the target viewport.
- Calculator operations pass automated tests.
- Route contract tests confirm required pages exist.
- Existing tests continue to pass.
- Production build completes successfully.
- `git diff --check` reports no whitespace errors.

## Out of Scope for This Phase
- Redesigning the approved interface.
- Changing approved colors, typography, imagery, or card styling.
- Adding billing.
- Completing cloud AI/transcription services.
- Replacing Supabase or LiveKit architecture.
