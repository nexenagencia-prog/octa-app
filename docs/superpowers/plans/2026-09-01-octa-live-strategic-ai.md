# OCTA Live Strategic AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar assistência estratégica automática e privada durante reuniões e registrar seus resultados no Skills.

**Architecture:** Um motor puro gera sinais de comunicação a partir da transcrição; um componente cliente captura fala, monitora sinais visuais autorizados e exibe alertas; uma rota de IA refina recomendações; o fechamento salva análise estruturada compatível com Skills.

**Tech Stack:** Next.js 15, React, TypeScript, Vitest, browser SpeechRecognition/FaceDetector quando disponíveis, API interna de IA já existente.

**Spec:** `docs/superpowers/specs/2026-09-01-octa-live-strategic-ai-design.md`

## Global Constraints
- Insights e alertas são privados para o dono da conta.
- Leitura visual exige consentimento explícito.
- Nunca afirmar emoção ou desinteresse como fato.
- Competências: Comunicação, Clareza, Escuta, Objetividade, Perguntas, Argumentação e Condução.
- Sem identificação biométrica.

---

### Task 1: Motor de sinais estratégicos

**Files:**
- Create: `src/lib/live-meeting-coach.ts`
- Test: `tests/live-meeting-coach.test.ts`

**Interfaces:**
- Produces: `deriveLiveSignals(transcript: string): LiveMeetingSignal[]`
- Produces: `buildSkillsDraft(transcript: string, signals: LiveMeetingSignal[]): SkillMetric[]`

- [ ] Escrever testes para fala longa, pergunta aberta, ausência de evidência e linguagem de ação.
- [ ] Executar build e confirmar falha porque o módulo ainda não existe.
- [ ] Implementar heurísticas mínimas sem inventar pontuação quando não houver evidência.
- [ ] Executar testes novamente e confirmar passagem.

### Task 2: Painel privado ao vivo

**Files:**
- Create: `src/features/meeting/meeting-strategic-ai.tsx`
- Modify: `src/features/meeting/meeting-client.tsx`
- Modify: `src/app/octa-ai-coach.css`

**Interfaces:**
- Consumes: `deriveLiveSignals`, `buildSkillsDraft`
- Produces: componente `MeetingStrategicAI({slug,title})`

- [ ] Criar teste contratual garantindo montagem somente em reunião e presença de consentimento visual.
- [ ] Executar build e confirmar falha.
- [ ] Implementar captura SpeechRecognition, cards automáticos privados, painel e opt-in visual.
- [ ] Implementar FaceDetector opcional em elementos `<video>` sem reconhecimento de identidade.
- [ ] Executar testes.

### Task 3: Recomendações estratégicas de IA

**Files:**
- Create: `src/app/api/ai/live-meeting-coach/route.ts`

**Interfaces:**
- Consumes POST `{meetingId, transcript, signals, visualEngagement}`
- Produces `{insights:[{kind,title,message,skill,polarity}]}`

- [ ] Criar teste contratual do endpoint e regras de linguagem.
- [ ] Executar build e confirmar falha.
- [ ] Implementar endpoint usando helper JSON existente, proibindo diagnóstico emocional.
- [ ] Executar testes.

### Task 4: Persistência em Skills

**Files:**
- Modify: `src/features/meeting/meeting-strategic-ai.tsx`
- Reuse: `src/lib/meeting-analysis-store.ts`
- Reuse: `src/app/api/skills/analyses/route.ts`

**Interfaces:**
- Produces `MeetingSkillAnalysis` ao finalizar análise.

- [ ] Criar teste para conversão de sinais em métricas com evidência.
- [ ] Executar build e confirmar falha.
- [ ] Salvar análise local e best-effort Supabase.
- [ ] Executar toda a suíte e build Next.js.

### Task 5: Verificação

- [ ] Confirmar que o assistente não está no layout global.
- [ ] Confirmar que alertas automáticos aparecem apenas dentro de reuniões.
- [ ] Confirmar que leitura visual fica desligada sem consentimento.
- [ ] Confirmar que Skills recebe pontos fortes/fracos apenas com evidência.
- [ ] Confirmar Vercel Preview READY antes de qualquer merge em `main`.
