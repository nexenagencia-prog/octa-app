# OCTA Meeting Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a fundação gratuita do OCTA Meeting Intelligence, corrigir 429 e sincronizar o nome real do perfil.

**Architecture:** Analytics determinístico calcula métricas sem custo; geração por provedor é opcional. Supabase persiste inteligência e perfil; Next.js expõe APIs e UI.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind, Supabase, Vercel, OpenAI Responses API opcional.

**Spec:** `docs/superpowers/specs/2026-09-01-octa-meeting-intelligence-design.md`

## Global Constraints
- `OCTA_AI_MODE=free` por padrão.
- Nenhuma conclusão inventada.
- Perfil oficial vem de `public.profiles`.
- Retry somente para falhas transitórias.
- Um único push para `main` nesta fase.

---

### Task 1: Analytics determinístico
**Files:** `src/lib/meeting-intelligence.ts`, `tests/meeting-intelligence.test.ts`
- [x] Criar tipos e cálculo de métricas.
- [x] Testar participação, perguntas, decisões, tarefas e evidência insuficiente.

### Task 2: Provedor resiliente
**Files:** `src/lib/ai/openai-json.ts`, `tests/openai-provider.test.ts`
- [x] Classificar 429 de quota versus rate limit.
- [x] Implementar retry limitado com `Retry-After`/backoff.
- [x] Desligar chamadas por padrão no modo gratuito.

### Task 3: Perfil oficial
**Files:** `src/app/api/profile/route.ts`, `src/app/profile/page.tsx`, `src/components/ai/global-octa-ai.tsx`
- [x] Ler e gravar `profiles` autenticado.
- [x] Atualizar cache local e evento da OCTA AI.

### Task 4: Pipeline pós-reunião
**Files:** `src/app/api/ai/analyze-meeting/route.ts`, `src/lib/skills-analysis.ts`, `src/app/api/skills/analyses/route.ts`
- [x] Aceitar transcrição, segmentos, chat, notas e metadados.
- [x] Gerar Meeting Score e compatibilidade com Skills.
- [x] Persistir intelligence/hash/versão.

### Task 5: Coach gratuito e painel
**Files:** `src/app/api/ai/skills-coach/route.ts`, `src/app/intelligence/page.tsx`
- [x] Responder sem provedor usando scores e histórico.
- [x] Exibir score, dimensões, participantes, decisões, tarefas e evolução.
- [x] Adicionar busca local inteligente e exportação por impressão/Word.

### Task 6: Verificação
- [ ] Executar build completo no Vercel.
- [ ] Confirmar testes 0 falhas e deployment `READY`.
- [ ] Verificar `/intelligence` e domínio principal.