# OCTA AI Global Voice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the existing ASK OCTA/OCTA Coach experience to OCTA AI, make its digital floating control global, and add private high-performance realtime voice conversation without breaking text chat or Skills context.

**Architecture:** Reuse `OctaSkillCoach` as the single global assistant UI, mount it from `src/app/layout.tsx`, and keep Skills as an event-driven entry point. Add a focused client-side WebRTC voice controller plus a protected Next.js API route that establishes an OpenAI Realtime session server-side so the permanent API key never reaches the browser.

**Tech Stack:** Next.js 15, React, TypeScript, Vitest, WebRTC (`RTCPeerConnection`/`getUserMedia`), OpenAI Realtime API, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-01-octa-ai-global-voice-design.md`

## Global Constraints
- User-facing assistant name is exactly `OCTA AI`.
- Selected voice personality is feminine, sophisticated and calm.
- Portuguese from Brazil is the default voice language.
- Preserve black/silver/chrome/glass styling and do not introduce blue as the primary AI color.
- Keep existing evidence-grounded Skills behavior.
- Do not expose `OPENAI_API_KEY` to client code.
- Voice activation must be explicit and must not request microphone permission when the panel merely opens.
- Text chat remains available whenever voice is unavailable.
- Default Realtime model is `gpt-realtime-2.1`; allow override through `OPENAI_REALTIME_MODEL`.
- Default voice is `marin`; allow override through `OPENAI_REALTIME_VOICE`.
- Production completion requires passing tests, successful Next.js build, successful Vercel deployment, and READY state.

---

### Task 1: Rename and globalize OCTA AI

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/skills/page.tsx`
- Modify: `src/components/ai/octa-skill-coach.tsx`
- Test: `tests/octa-ai-global.test.ts`

**Interfaces:**
- Consumes: existing `OctaSkillCoach({meetingTitle?})` and `octa-ai:open` custom event.
- Produces: one global `<OctaSkillCoach/>` mounted from root layout; Skills buttons continue opening it via `octa-ai:open`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe,expect,it } from 'vitest';
import fs from 'node:fs';

const read=(path:string)=>fs.readFileSync(path,'utf8');

describe('global OCTA AI',()=>{
  it('mounts OCTA AI globally and removes legacy visible naming',()=>{
    const layout=read('src/app/layout.tsx');
    const skills=read('src/app/skills/page.tsx');
    const coach=read('src/components/ai/octa-skill-coach.tsx');
    expect(layout).toContain('<OctaSkillCoach/>');
    expect(skills).not.toContain('ASK OCTA');
    expect(skills).not.toContain('OCTA Coach');
    expect(coach).not.toContain('OCTA Coach');
    expect(skills).toContain('OCTA AI');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/octa-ai-global.test.ts`
Expected: FAIL because the assistant is still mounted only on Skills and legacy labels remain.

- [ ] **Step 3: Implement the minimal naming/global mount change**

Update `src/app/layout.tsx` to import and mount the global assistant after `{children}`:

```tsx
import { OctaSkillCoach } from '@/components/ai/octa-skill-coach';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CmsRuntime/>{children}<OctaSkillCoach/></body></html>;
}
```

In `src/app/skills/page.tsx`, remove the page-local `<OctaSkillCoach/>` and replace visible strings:

```tsx
<button className="skills-dark-link" onClick={()=>window.dispatchEvent(new CustomEvent('octa-ai:open'))}>OCTA AI <Sparkles size={13}/></button>
```

```tsx
<button className="skills-silver-button" onClick={()=>window.dispatchEvent(new CustomEvent('octa-ai:open',{detail:{question:askQuestion}}))}>Perguntar à OCTA AI <ArrowRight size={15}/></button>
```

Keep internal event name `octa-ai:open` unchanged.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/octa-ai-global.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/skills/page.tsx src/components/ai/octa-skill-coach.tsx tests/octa-ai-global.test.ts
git commit -m "feat: globalize OCTA AI assistant"
```

---

### Task 2: Add the protected Realtime session endpoint

**Files:**
- Create: `src/app/api/ai/realtime/session/route.ts`
- Test: `tests/octa-ai-realtime-session.test.ts`

**Interfaces:**
- Consumes: request body as raw SDP (`Content-Type: application/sdp` or `text/plain`), server env `OPENAI_API_KEY`, optional `OPENAI_REALTIME_MODEL`, optional `OPENAI_REALTIME_VOICE`.
- Produces: raw SDP answer with HTTP 200, or JSON error for configuration/upstream failures.

- [ ] **Step 1: Write the failing test**

```ts
import { afterEach,describe,expect,it,vi } from 'vitest';
import { POST } from '@/app/api/ai/realtime/session/route';

afterEach(()=>{
  vi.unstubAllGlobals();
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_REALTIME_MODEL;
  delete process.env.OPENAI_REALTIME_VOICE;
});

describe('OCTA AI realtime session route',()=>{
  it('fails safely when the API key is missing',async()=>{
    const request=new Request('http://localhost/api/ai/realtime/session',{method:'POST',headers:{'Content-Type':'application/sdp'},body:'v=0'});
    const response=await POST(request);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ok:false,message:'OCTA AI voice is not configured.'});
  });

  it('forwards SDP server-side without exposing the permanent key',async()=>{
    process.env.OPENAI_API_KEY='server-secret';
    process.env.OPENAI_REALTIME_MODEL='gpt-realtime-2.1';
    process.env.OPENAI_REALTIME_VOICE='marin';
    const fetchMock=vi.fn(async(_url:string,init:RequestInit)=>{
      expect(init.headers).toMatchObject({Authorization:'Bearer server-secret'});
      expect(String(init.body)).toContain('v=0');
      return new Response('v=0\r\na=answer',{status:200,headers:{'Content-Type':'application/sdp'}});
    });
    vi.stubGlobal('fetch',fetchMock);
    const request=new Request('http://localhost/api/ai/realtime/session',{method:'POST',headers:{'Content-Type':'application/sdp'},body:'v=0\r\na=offer'});
    const response=await POST(request);
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('a=answer');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/octa-ai-realtime-session.test.ts`
Expected: FAIL because the route does not exist.

- [ ] **Step 3: Implement the route**

Create `src/app/api/ai/realtime/session/route.ts` with this behavior:

```ts
import { NextResponse } from 'next/server';

export const runtime='nodejs';

export async function POST(request:Request){
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey){
    return NextResponse.json({ok:false,message:'OCTA AI voice is not configured.'},{status:503});
  }

  const sdp=await request.text();
  if(!sdp.trim()){
    return NextResponse.json({ok:false,message:'Missing WebRTC offer.'},{status:400});
  }

  const model=process.env.OPENAI_REALTIME_MODEL||'gpt-realtime-2.1';
  const voice=process.env.OPENAI_REALTIME_VOICE||'marin';
  const session=JSON.stringify({
    type:'realtime',
    model,
    audio:{output:{voice}},
    instructions:'Você é a OCTA AI, assistente privada de reuniões. Fale em português do Brasil com voz feminina, sofisticada, calma, natural e objetiva. Nunca invente reunião, nota, tendência ou evidência. Quando não houver contexto suficiente, diga isso claramente.'
  });

  const body=new FormData();
  body.set('sdp',sdp);
  body.set('session',session);
  const upstream=await fetch('https://api.openai.com/v1/realtime/calls',{
    method:'POST',
    headers:{Authorization:`Bearer ${apiKey}`},
    body
  });

  const payload=await upstream.text();
  if(!upstream.ok){
    return NextResponse.json({ok:false,message:'A voz da OCTA AI não conseguiu conectar.'},{status:upstream.status>=500?502:upstream.status});
  }
  return new Response(payload,{status:200,headers:{'Content-Type':'application/sdp'}});
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/octa-ai-realtime-session.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/ai/realtime/session/route.ts tests/octa-ai-realtime-session.test.ts
git commit -m "feat: add OCTA AI realtime session endpoint"
```

---

### Task 3: Add WebRTC voice mode to the existing OCTA AI panel

**Files:**
- Create: `src/components/ai/use-octa-realtime-voice.ts`
- Modify: `src/components/ai/octa-skill-coach.tsx`
- Test: `tests/octa-ai-voice-ui.test.ts`

**Interfaces:**
- Produces hook:

```ts
export type OctaVoiceState='idle'|'connecting'|'listening'|'speaking'|'error';
export function useOctaRealtimeVoice():{
  state:OctaVoiceState;
  error:string|null;
  start:()=>Promise<void>;
  stop:()=>void;
  active:boolean;
};
```

- Consumes: `/api/ai/realtime/session` raw SDP endpoint.

- [ ] **Step 1: Write the failing UI contract test**

```ts
import { describe,expect,it } from 'vitest';
import fs from 'node:fs';

const read=(path:string)=>fs.readFileSync(path,'utf8');

describe('OCTA AI voice UI',()=>{
  it('exposes microphone and voice states while preserving text input',()=>{
    const coach=read('src/components/ai/octa-skill-coach.tsx');
    const hook=read('src/components/ai/use-octa-realtime-voice.ts');
    expect(coach).toContain('Mic');
    expect(coach).toContain('voice.start');
    expect(coach).toContain('voice.stop');
    expect(coach).toContain('Pergunte à OCTA AI');
    expect(hook).toContain("'connecting'");
    expect(hook).toContain("'listening'");
    expect(hook).toContain("'speaking'");
    expect(hook).toContain('getUserMedia');
    expect(hook).toContain('RTCPeerConnection');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/octa-ai-voice-ui.test.ts`
Expected: FAIL because the hook and microphone UI do not exist.

- [ ] **Step 3: Implement `useOctaRealtimeVoice`**

The hook must:
- request `navigator.mediaDevices.getUserMedia({audio:true})` only inside `start()`;
- create an `RTCPeerConnection`;
- add the microphone track;
- create an `Audio` element with `autoplay=true` and attach remote stream in `pc.ontrack`;
- create a data channel named `oai-events`;
- set `speaking` when response audio events arrive and `listening` after response completion/input speech events;
- POST the local SDP to `/api/ai/realtime/session` with `Content-Type: application/sdp`;
- set the returned SDP as remote description;
- on permission error, expose `Microfone não autorizado. Você ainda pode conversar por texto.`;
- on connection error, expose `A voz da OCTA AI não conseguiu conectar. O chat por texto continua disponível.`;
- on `stop()`, stop every local track, close the data channel, close the peer connection, pause the audio element, clear its source, and return to `idle`.

Use refs for `RTCPeerConnection`, `RTCDataChannel`, `MediaStream`, and `HTMLAudioElement` so React re-renders do not recreate active media resources.

- [ ] **Step 4: Add the microphone control to `OctaSkillCoach`**

Import `Mic`, `MicOff`, `Volume2` from `lucide-react` plus the new hook. Change the composer placeholder to:

```tsx
placeholder="Pergunte à OCTA AI..."
```

Add a voice button adjacent to send:

```tsx
<button type="button" className={`octa-ai-voice-button ${voice.active?'is-active':''}`} onClick={()=>voice.active?voice.stop():void voice.start()} aria-label={voice.active?'Desligar voz da OCTA AI':'Falar com a OCTA AI'}>
  {voice.active?<MicOff size={17}/>:<Mic size={17}/>} 
</button>
```

Render a compact state row above the composer:

```tsx
{voice.state!=='idle'&&<div className={`octa-ai-voice-state is-${voice.state}`}>
  <Volume2 size={13}/>
  <span>{voice.state==='connecting'?'Conectando voz...':voice.state==='speaking'?'OCTA AI falando...':voice.state==='listening'?'OCTA AI ouvindo...':voice.error}</span>
</div>}
```

When the panel is explicitly closed, call `voice.stop()` before `setOpen(false)` so microphone capture never continues invisibly.

- [ ] **Step 5: Run the focused tests**

Run: `npx vitest run tests/octa-ai-voice-ui.test.ts tests/octa-ai-global.test.ts tests/ask-octa-site-integration.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ai/use-octa-realtime-voice.ts src/components/ai/octa-skill-coach.tsx tests/octa-ai-voice-ui.test.ts
git commit -m "feat: add realtime voice to OCTA AI"
```

---

### Task 4: Polish the floating OCTA AI control and responsive placement

**Files:**
- Modify: `src/app/octa-ai-coach.css`
- Test: `tests/octa-ai-floating-style.test.ts`

**Interfaces:**
- Consumes: `.octa-ai-coach`, `.octa-ai-orb`, `.octa-ai-panel`, `.meeting-octa-ai`.
- Produces: always-fixed premium circular assistant trigger and visual states for voice.

- [ ] **Step 1: Write the failing style contract test**

```ts
import { describe,expect,it } from 'vitest';
import fs from 'node:fs';

describe('OCTA AI floating style',()=>{
  it('keeps a fixed circular digital trigger and voice states',()=>{
    const css=fs.readFileSync('src/app/octa-ai-coach.css','utf8');
    expect(css).toContain('.octa-ai-coach{position:fixed');
    expect(css).toContain('.octa-ai-orb');
    expect(css).toContain('border-radius:50%');
    expect(css).toContain('.octa-ai-voice-button');
    expect(css).toContain('.octa-ai-voice-state');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/octa-ai-floating-style.test.ts`
Expected: FAIL because global circular styling and voice classes are incomplete.

- [ ] **Step 3: Implement style polish**

Keep the current black/silver glass panel, but make the closed control globally compact and circular:

```css
.octa-ai-orb{width:60px;height:60px;justify-content:center;border-radius:50%;padding:0;position:relative;overflow:visible}
.octa-ai-orb>span,.octa-ai-orb>svg:last-child{display:none}
.octa-ai-orb::after{content:'';position:absolute;inset:-5px;border-radius:50%;border:1px solid rgba(255,255,255,.16);opacity:.55;animation:octaAiPulse 2.8s ease-out infinite;pointer-events:none}
@keyframes octaAiPulse{0%{transform:scale(.9);opacity:.55}70%,100%{transform:scale(1.22);opacity:0}}
.octa-ai-voice-button{display:grid;place-items:center;width:36px;height:36px;flex:none;border-radius:13px;background:rgba(255,255,255,.07);color:#e8e8e8}
.octa-ai-voice-button.is-active{background:linear-gradient(145deg,#f2f2f2,#9e9e9e);color:#050505}
.octa-ai-voice-state{display:flex;align-items:center;gap:7px;margin:0 14px 8px;padding:8px 10px;border-radius:13px;background:rgba(255,255,255,.045);color:rgba(255,255,255,.62);font-size:10px}
```

For mobile, keep the trigger above lower navigation/call controls with `bottom:82px` when viewport is `<=900px`. Keep meeting-specific rules compatible with existing `.meeting-octa-ai` overrides.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/octa-ai-floating-style.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/octa-ai-coach.css tests/octa-ai-floating-style.test.ts
git commit -m "style: polish global OCTA AI floating control"
```

---

### Task 5: Full regression, preview deploy, review and production verification

**Files:**
- Verify all changed files from Tasks 1–4.

**Interfaces:**
- Consumes: complete feature branch.
- Produces: verified build suitable for merge and production.

- [ ] **Step 1: Run the full test/build pipeline**

Run: `npm run build`
Expected: all Vitest tests pass, Next.js compiles, type checking succeeds, and static generation completes.

- [ ] **Step 2: Search for legacy visible naming**

Run: `grep -R "ASK OCTA\|OCTA Coach" src/app src/components -n`
Expected: no user-facing matches; internal comments/tests may be reviewed individually rather than blindly renamed.

- [ ] **Step 3: Deploy branch to Vercel preview**

Create a preview deployment for `feat/octa-ai-voice-global` and wait for `READY`.
Expected: preview build succeeds.

- [ ] **Step 4: Manual browser acceptance on preview**

Verify these exact flows:
1. Floating OCTA AI mark appears on normal pages and Skills.
2. Clicking it opens the existing text chat without navigation.
3. Skills `OCTA AI` and `Perguntar à OCTA AI` buttons open the same global panel.
4. Opening the panel does not request microphone permission.
5. Clicking microphone requests permission and enters `Conectando voz...`, then listening/speaking state when configured.
6. Denying permission leaves text chat usable and shows the specified denial message.
7. Closing the panel stops microphone capture.
8. Meeting controls are not covered by the floating button.
9. No primary blue AI visual is introduced.

- [ ] **Step 5: Request code review before merge**

Review the full branch diff against `docs/superpowers/specs/2026-09-01-octa-ai-global-voice-design.md`. Fix any blocking findings and rerun `npm run build` after fixes.

- [ ] **Step 6: Merge only after verification**

Create/merge a PR from `feat/octa-ai-voice-global` to `main` only if preview state is READY and the full build remains green.

- [ ] **Step 7: Verify production**

Watch the production deployment generated from the merge commit until state is `READY`; if it is `ERROR`, do not claim completion and inspect build logs before any further merge/deploy attempt.
