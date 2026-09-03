# OCTA AI General Business Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a OCTA AI em uma assistente geral, com especialização forte em negócios e uso inteligente do contexto de reuniões/Skills, mantendo a interface atual.

**Architecture:** A rota existente continua como ponto de entrada para evitar regressões visuais. Uma política compartilhada define o comportamento geral/business e a rota recebe histórico recente da conversa além do contexto de Skills/reuniões. O fallback deixa de fingir inteligência generativa quando o provedor está indisponível.

**Tech Stack:** Next.js 15, TypeScript, React 19, Zod, Vitest, OpenAI Responses API/Vercel AI Gateway.

**Spec:** Conversa aprovada em 2026-09-03: responder qualquer assunto, com viés útil para negócios/aprendizado/vida real quando pertinente, domínio aprofundado de vendas, persuasão, branding, comunicação, metas e consumidor; usar reuniões/Skills como contexto sem inventar evidências.

## Global Constraints

- Preservar layout, cores e estrutura visual atual.
- Responder perguntas gerais sem redirecionar forçadamente para reuniões.
- Usar histórico recente para continuidade da conversa.
- Só citar fatos sobre reuniões/Skills quando existirem no contexto fornecido.
- Não usar respostas locais repetitivas como substituto silencioso de IA generativa.

---

### Task 1: Política geral da OCTA AI

**Files:**
- Create: `src/lib/ai/octa-assistant-policy.ts`
- Create: `src/lib/ai/octa-assistant-policy.test.ts`

**Interfaces:**
- Produces: `OCTA_AI_SYSTEM_PROMPT: string`

- [ ] **Step 1: Write the failing test**

```ts
import {describe,expect,it} from 'vitest';
import {OCTA_AI_SYSTEM_PROMPT} from './octa-assistant-policy';

describe('OCTA AI policy',()=>{
  it('allows general questions while preserving business specialization',()=>{
    expect(OCTA_AI_SYSTEM_PROMPT).toContain('qualquer assunto');
    expect(OCTA_AI_SYSTEM_PROMPT).toContain('negócios');
    expect(OCTA_AI_SYSTEM_PROMPT).not.toContain('especialista apenas em reuniões');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/ai/octa-assistant-policy.test.ts`
Expected: FAIL because `./octa-assistant-policy` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create a single exported system prompt that makes OCTA AI general-purpose, business-specialized, evidence-grounded for meeting facts, and explicit about uncertainty/current information.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/ai/octa-assistant-policy.test.ts`
Expected: PASS.

### Task 2: Conversational memory and honest provider failure

**Files:**
- Modify: `src/app/api/ai/skills-coach/route.ts`
- Modify: `src/components/ai/octa-skill-coach.tsx`

**Interfaces:**
- Consumes: `OCTA_AI_SYSTEM_PROMPT`
- POST body adds `history: Array<{role:'user'|'assistant'; text:string}>`

- [ ] **Step 1: Extend route validation** to accept up to 16 recent history messages with bounded text length.
- [ ] **Step 2: Feed history + current question + meeting/Skills context to the model** using the shared policy.
- [ ] **Step 3: Remove the meeting-only system restriction** and return HTTP 503 with a clear temporary-unavailable message when generative AI is configured but provider execution fails.
- [ ] **Step 4: Update client send()** to send recent chat history, preserving current UI and actions.
- [ ] **Step 5: Update user-facing copy** from meeting-only language to general business/learning language without layout changes.

### Task 3: Verification and production deployment

**Files:**
- No product file changes unless verification reveals a defect.

- [ ] **Step 1: Run** `npm test`.
- [ ] **Step 2: Run** `npm run typecheck`.
- [ ] **Step 3: Run** `npm run build`.
- [ ] **Step 4: Verify route behavior** for a general question, a meeting-context question, and provider-unavailable behavior.
- [ ] **Step 5: Merge to `main` and verify the Vercel production deployment is Ready.**
