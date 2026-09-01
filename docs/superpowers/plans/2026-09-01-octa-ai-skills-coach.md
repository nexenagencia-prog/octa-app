# OCTA AI Skills Coach Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir IA integrada que analisa reuniões, alimenta Skills e atua como coach conversacional flutuante.

**Architecture:** Uma camada de domínio normaliza análises por reunião e agrega métricas de Skills. Rotas server-side executam análise e coach com provedor configurado, enquanto componentes clientes consomem dados persistidos e exibem estados honestos quando a IA não estiver configurada.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, Supabase/persistência existente, API server-side de IA, testes Node existentes.

**Spec:** `docs/superpowers/specs/2026-09-01-octa-ai-skills-coach-design.md`

## Global Constraints
- Identidade visual preto, prata/cromado, vidro e branco; sem azul como cor principal.
- Símbolo do coach abstrato/digital, sem robô, cérebro ou chip.
- Nunca inventar nota quando não houver evidência suficiente.
- Segredos de IA permanecem exclusivamente no servidor.
- Falha ou ausência do provedor de IA não pode quebrar reunião ou Skills.

---

### Task 1: Modelo compartilhado de análise e agregação

**Files:**
- Create: `src/lib/skills-analysis.ts`
- Test: `tests/skills-analysis-contract.mjs`

**Interfaces:**
- Produces: `SkillMetric`, `MeetingSkillAnalysis`, `aggregateSkillAnalyses(analyses)` e `overallScore(metrics)`.

- [ ] **Step 1: Write the failing test**
Criar teste que exige sete competências, ignora métricas sem evidência suficiente e calcula média somente com notas válidas.
- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/skills-analysis-contract.mjs`
Expected: FAIL porque o módulo ainda não existe.
- [ ] **Step 3: Write minimal implementation**
Implementar tipos, validação de evidência e agregação determinística 0–100.
- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/skills-analysis-contract.mjs`
Expected: PASS.
- [ ] **Step 5: Commit**
`git commit -m "feat: add skills analysis domain model"`

### Task 2: Persistência de análises por reunião

**Files:**
- Create: `src/lib/meeting-analysis-store.ts`
- Modify: camada Supabase existente usada pelo projeto, somente onde necessário
- Test: `tests/meeting-analysis-store-contract.mjs`

**Interfaces:**
- Consumes: `MeetingSkillAnalysis`.
- Produces: `saveMeetingAnalysis`, `getMeetingAnalysis`, `listUserMeetingAnalyses`.

- [ ] **Step 1: Write the failing test**
Cobrir gravação, leitura, ordenação por data e ausência de dados.
- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/meeting-analysis-store-contract.mjs`
Expected: FAIL.
- [ ] **Step 3: Write minimal implementation**
Usar persistência existente com fallback local controlado para demo; nunca marcar demo como análise real.
- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/meeting-analysis-store-contract.mjs`
Expected: PASS.
- [ ] **Step 5: Commit**
`git commit -m "feat: persist meeting skill analyses"`

### Task 3: Rota server-side para avaliar uma reunião

**Files:**
- Create: `src/app/api/ai/analyze-meeting/route.ts`
- Create: `src/lib/ai/meeting-evaluator.ts`
- Test: `tests/meeting-ai-route-contract.mjs`

**Interfaces:**
- Consumes: `{meetingId,title,transcript}`.
- Produces: `MeetingSkillAnalysis` estruturado.

- [ ] **Step 1: Write the failing test**
Exigir validação de transcrição vazia, saída estruturada, evidências e estado `not_configured` quando não houver provedor.
- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/meeting-ai-route-contract.mjs`
Expected: FAIL.
- [ ] **Step 3: Write minimal implementation**
Criar prompt/contrato que exige nota, confiança, justificativa, evidências e recomendação por competência; omitir nota sem evidência.
- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/meeting-ai-route-contract.mjs`
Expected: PASS.
- [ ] **Step 5: Commit**
`git commit -m "feat: analyze meetings with AI"`

### Task 4: Integrar análise ao ciclo da reunião

**Files:**
- Modify: `src/features/meeting/meeting-client.tsx`
- Create: `src/features/meeting/meeting-ai-insight.tsx`
- Test: `tests/meeting-ai-integration-contract.mjs`

**Interfaces:**
- Consumes: rota `/api/ai/analyze-meeting` e store de análise.
- Produces: insight discreto e análise consolidada persistida.

- [ ] **Step 1: Write the failing test**
Exigir gatilho de análise somente com transcrição disponível e renderização de insight sem cobrir controles principais.
- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/meeting-ai-integration-contract.mjs`
Expected: FAIL.
- [ ] **Step 3: Write minimal implementation**
Adicionar estado de análise, processamento e insight; erro da IA permanece não bloqueante.
- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/meeting-ai-integration-contract.mjs`
Expected: PASS.
- [ ] **Step 5: Commit**
`git commit -m "feat: connect meeting AI insights to skills"`

### Task 5: Transformar Skills em painel alimentado pelas análises

**Files:**
- Modify: `src/app/skills/page.tsx`
- Create: `src/components/skills/meeting-analysis-detail.tsx`
- Test: `tests/skills-live-data-contract.mjs`

**Interfaces:**
- Consumes: `listUserMeetingAnalyses`, `aggregateSkillAnalyses`.
- Produces: métricas reais, histórico, explicação de notas e fallback identificado como demonstração.

- [ ] **Step 1: Write the failing test**
Exigir que Skills prefira análises persistidas, mostre motivo/evidência e identifique fallback demo.
- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/skills-live-data-contract.mjs`
Expected: FAIL.
- [ ] **Step 3: Write minimal implementation**
Substituir hardcodes quando existirem análises e ligar Visão geral, Transcrição, Treino e Evolução à mesma fonte.
- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/skills-live-data-contract.mjs`
Expected: PASS.
- [ ] **Step 5: Commit**
`git commit -m "feat: drive skills from meeting analyses"`

### Task 6: API do Coach de Skills

**Files:**
- Create: `src/app/api/ai/skills-coach/route.ts`
- Create: `src/lib/ai/skills-coach.ts`
- Test: `tests/skills-coach-route-contract.mjs`

**Interfaces:**
- Consumes: pergunta do usuário + agregados + análises recentes.
- Produces: resposta do coach com recomendações ancoradas nos dados disponíveis.

- [ ] **Step 1: Write the failing test**
Cobrir pergunta vazia, contexto sem análises, contexto com competências fracas e ausência do provedor.
- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/skills-coach-route-contract.mjs`
Expected: FAIL.
- [ ] **Step 3: Write minimal implementation**
Montar contexto mínimo e instruir o modelo a não inventar reunião, nota ou evidência.
- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/skills-coach-route-contract.mjs`
Expected: PASS.
- [ ] **Step 5: Commit**
`git commit -m "feat: add skills AI coach API"`

### Task 7: Assistente flutuante digital

**Files:**
- Create: `src/components/ai/octa-skill-coach.tsx`
- Create: `src/components/ai/octa-digital-mark.tsx`
- Modify: shell/layout global usado pelas páginas autenticadas
- Modify: `src/app/globals.css`
- Test: `tests/floating-ai-coach-contract.mjs`

**Interfaces:**
- Consumes: `/api/ai/skills-coach`.
- Produces: botão inferior direito, painel conversacional, atalhos e estados loading/error/not-configured.

- [ ] **Step 1: Write the failing test**
Exigir posição inferior direita, símbolo próprio, perguntas rápidas e ausência de ícones clichê de robô/cérebro/chip.
- [ ] **Step 2: Run test to verify it fails**
Run: `node --test tests/floating-ai-coach-contract.mjs`
Expected: FAIL.
- [ ] **Step 3: Write minimal implementation**
Criar marca digital abstrata em CSS/SVG próprio e painel preto/prata com vidro, teclado Enter e histórico da sessão.
- [ ] **Step 4: Run test to verify it passes**
Run: `node --test tests/floating-ai-coach-contract.mjs`
Expected: PASS.
- [ ] **Step 5: Commit**
`git commit -m "feat: add floating digital skills coach"`

### Task 8: Verificação integrada e produção

**Files:**
- Modify: somente arquivos necessários para corrigir regressões encontradas

**Interfaces:**
- Consumes: todas as tarefas anteriores.
- Produces: fluxo verificável reunião → análise → Skills → coach.

- [ ] **Step 1: Run focused tests**
Run: `node --test tests/skills-analysis-contract.mjs tests/meeting-analysis-store-contract.mjs tests/meeting-ai-route-contract.mjs tests/meeting-ai-integration-contract.mjs tests/skills-live-data-contract.mjs tests/skills-coach-route-contract.mjs tests/floating-ai-coach-contract.mjs`
Expected: PASS.
- [ ] **Step 2: Run existing suite**
Run: `npm test`
Expected: PASS.
- [ ] **Step 3: Build**
Run: `npm run build`
Expected: Next.js build succeeds with type checking.
- [ ] **Step 4: Browser verification**
Verificar home, reunião e Skills em claro/escuro; coach não pode sobrepor controles; ausência de provedor deve ser apresentada honestamente.
- [ ] **Step 5: Deploy and verify**
Publicar via fluxo GitHub/Vercel existente e confirmar deployment READY antes de considerar concluído.