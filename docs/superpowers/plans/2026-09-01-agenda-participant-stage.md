# Agenda e Palco Inteligente Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar calendário brasileiro funcional e palco de participantes com anfitrião fixo e destaque persistente pelo próximo falante.

**Architecture:** Extrair lógica pura de calendário e seleção de palco para módulos testáveis. A UI da Agenda consome a grade real; a Reunião Instantânea mantém host fixo e delega a segunda área a um componente de palco que aceita seleção manual e active speaker real quando LiveKit estiver disponível.

**Tech Stack:** Next.js 15, React, TypeScript, Vitest, LiveKit, Tailwind/CSS existente.

**Spec:** `docs/superpowers/specs/2026-09-01-agenda-participant-stage-design.md`

## Global Constraints
- Interface pt-BR.
- Sem azul; seleção de data em prata líquido/cromado.
- Vídeo do anfitrião sempre fixo à esquerda em 9:16.
- Último falante permanece em destaque até o próximo falar.
- Bloqueio manual do anfitrião tem prioridade sobre active speaker.
- Não simular detecção de voz quando LiveKit não estiver disponível.

---

### Task 1: Calendário brasileiro
**Files:**
- Create: `src/lib/br-calendar.ts`
- Modify: `src/app/agenda/page.tsx`
- Test: `tests/br-calendar.test.ts`

- [ ] Escrever testes para fevereiro bissexto, alinhamento do primeiro dia, dezembro→janeiro e seleção de data.
- [ ] Executar Vitest e confirmar falha.
- [ ] Implementar helpers puros para dias do mês e células do calendário.
- [ ] Trocar a grade fixa da Agenda pela grade calculada e sincronizar formulário com a data selecionada.
- [ ] Aplicar estado `is-selected` prata líquido.
- [ ] Executar testes e confirmar aprovação.

### Task 2: Estado do palco
**Files:**
- Create: `src/lib/participant-stage.ts`
- Test: `tests/participant-stage.test.ts`

- [ ] Escrever testes: host nunca entra no palco dinâmico; active speaker substitui o anterior; silêncio mantém último falante; participante bloqueado não é substituído; desbloqueio libera próxima troca.
- [ ] Executar Vitest e confirmar falha.
- [ ] Implementar reducer/helpers puros do palco.
- [ ] Executar testes e confirmar aprovação.

### Task 3: UI do palco de participantes
**Files:**
- Create: `src/features/meeting/participant-stage.tsx`
- Modify: `src/features/meeting/instant-meeting-client.tsx`
- Modify: CSS de refinamentos existente usado pela reunião instantânea.

- [ ] Adicionar teste contratual da composição: host fixo + segundo palco.
- [ ] Confirmar falha.
- [ ] Renderizar host fixo no vídeo esquerdo e palco à direita.
- [ ] Implementar mosaico com rolagem vertical, seleção manual, expandir/recolher, modo mosaico e bloqueio.
- [ ] Preservar chat, controles, filtros, notas, lousa e OCTA AI.
- [ ] Confirmar testes.

### Task 4: Active speaker LiveKit
**Files:**
- Modify: `src/features/meeting/livekit-stage.tsx`
- Modify: `src/features/meeting/instant-meeting-client.tsx`

- [ ] Criar teste/contrato para callback de active speaker sem simulação no fallback.
- [ ] Confirmar falha.
- [ ] Encaminhar active speaker real do LiveKit para o estado do palco.
- [ ] Garantir que o último falante permaneça até o próximo evento válido.
- [ ] Confirmar testes.

### Task 5: Verificação e produção
- [ ] Rodar `npm run build` (Vitest + Next build).
- [ ] Verificar ausência de regressões nas rotas Agenda e Reunião Instantânea.
- [ ] Publicar no `main` somente após build verde.
- [ ] Confirmar deployment Vercel `READY` antes de declarar conclusão.