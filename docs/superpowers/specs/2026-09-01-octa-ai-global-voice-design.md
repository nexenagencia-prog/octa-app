# OCTA AI Global Voice — Design

## Goal
Transform the existing ASK OCTA/OCTA Coach surface into one global assistant named **OCTA AI**, available throughout the site through a fixed floating digital button and capable of natural text and voice conversation.

## Product behavior
- Replace user-facing `ASK OCTA` and `OCTA Coach` naming with `OCTA AI`.
- Keep the existing evidence-grounded Skills behavior and meeting context.
- Mount the assistant once at app root so the floating control is available across the site instead of only on Skills.
- The floating trigger stays fixed in the lower-right corner, visually inspired by the discoverability of a WhatsApp floating button without copying WhatsApp branding or shape details.
- The trigger uses the existing OCTA digital mark, black/silver/chrome/glass styling, subtle pulse/energy treatment, and no blue primary color.
- Opening the trigger reveals the existing OCTA AI chat panel without navigating away from the current page.

## Voice personality
The selected voice personality is **feminine, sophisticated and calm**. The assistant should sound confident, warm and concise rather than theatrical. Portuguese from Brazil is the default conversational language.

## Voice interaction
- Text remains fully functional.
- A microphone control is added to the composer.
- Voice mode uses browser WebRTC with the OpenAI Realtime API for low-latency speech-to-speech interaction.
- The browser receives remote audio through the peer connection; the permanent `OPENAI_API_KEY` never goes to the client.
- A server route creates the protected Realtime session. The current OpenAI browser guidance recommends WebRTC for client voice apps and documents `gpt-realtime-2.1`; the documented WebRTC example uses the `marin` voice, which will be the default unless `OPENAI_REALTIME_VOICE` overrides it.
- The Realtime model is configurable with `OPENAI_REALTIME_MODEL`, defaulting to `gpt-realtime-2.1`.
- The user can stop/mute voice mode at any time.
- Voice activation is explicit; opening OCTA AI must not automatically request microphone permission.
- When voice is unavailable, denied, or fails, text chat continues normally and a concise status message is shown.

## Conversation context
Voice mode receives the same product identity and behavioral constraints as the existing OCTA AI text coach: it may use only context made available by OCTA and must not fabricate meetings, scores, trends, decisions, evidence, or participant behavior. The client may provide current-page context and Skills summary, but secrets and server credentials stay server-side.

## Meeting privacy
- OCTA AI voice is private to the account owner.
- Starting voice mode during a meeting does not publish OCTA AI responses to other participants.
- No biometric identification is introduced.
- Existing live strategic analysis rules remain unchanged.

## Global UI
The root component owns one `OctaSkillCoach` instance. Skills-specific buttons dispatch `octa-ai:open` as before, but their visible copy becomes `OCTA AI`. The floating button is circular/compact when closed, with the digital mark at its center and an optional small `OCTA AI` label on larger screens. On mobile or inside a meeting stage it must avoid overlapping primary call controls.

## Realtime session architecture
1. User opens OCTA AI.
2. User taps the microphone button.
3. Client requests microphone access.
4. Client creates an `RTCPeerConnection` and local audio track.
5. Client posts its SDP offer to `/api/ai/realtime/session`.
6. The server forwards the SDP to the OpenAI Realtime session endpoint with server-side auth and a session config containing model, voice, Portuguese instructions, and audio output.
7. Server returns the SDP answer to the client.
8. Remote assistant audio plays through an `<audio autoplay>` element.
9. A data channel carries Realtime events and lets the UI reflect connecting/listening/speaking/error states.
10. Stopping voice closes tracks, data channel, peer connection, and audio playback cleanly.

## Naming changes
User-facing strings should use **OCTA AI**. `OCTA Coach`, `ASK OCTA`, and `Perguntar ao OCTA Coach` should disappear from the visible product UI. Internal route names may remain when changing them would create unnecessary migration risk.

## Error states
- No `OPENAI_API_KEY`: show that OCTA AI voice is not configured while preserving text mode.
- Microphone denied: show `Microfone não autorizado. Você ainda pode conversar por texto.`
- Realtime connection failure: show `A voz da OCTA AI não conseguiu conectar. O chat por texto continua disponível.`
- Component unmount/close: all microphone and WebRTC resources are released.

## Testing and acceptance criteria
- A repository test proves no visible `ASK OCTA`/`OCTA Coach` labels remain in the target Skills/assistant components.
- A repository test proves the root layout mounts OCTA AI globally.
- A repository test proves the chat contains a microphone/voice control and voice status states.
- API tests verify missing-key failure and valid Realtime session forwarding without exposing the permanent key.
- Existing Skills coach tests remain green.
- `npm run build` passes, including Vitest and Next.js type/build checks.
- Production deployment is only considered complete after a successful Vercel build and READY state.
