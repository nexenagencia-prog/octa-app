# Agenda e Palco Inteligente Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar calendário brasileiro funcional e palco de participantes com anfitrião fixo e destaque persistente pelo próximo falante.

**Architecture:** Extrair lógica pura de calendário e seleção de palco para módulos testáveis. A UI da Agenda consome a grade real; a Reunião Instantânea mantém host fixo e delega a segunda área a um componente de palco que aceita seleção manual e active speaker real quando LiveKit estiver disponível.

**Tech Stack:** Next.js 15, React, TypeScript, Vitest, LiveKit, Tailwind/CSS existente.

**Spec:** `docs/superpowers/specs/2026-09-01-agenda-participant-stage-design.md`

**Status:** implementação aplicada ao `main`; aguardando validação completa do pipeline Vercel antes de considerar concluída.

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

- [x] Escrever testes para fevereiro bissexto, alinhamento do primeiro dia, dezembro→janeiro e seleção de data.
- [x] Implementar helpers puros para dias do mês e células do calendário.
- [x] Trocar a grade fixa da Agenda pela grade calculada e sincronizar formulário com a data selecionada.
- [x] Aplicar estado `is-selected` prata líquido.
- [ ] Validar testes no pipeline Vercel.

### Task 2: Estado do palco
**Files:**
- Create: `src/lib/participant-stage.ts`
- Test: `tests/participant-stage.test.ts`

- [x] Escrever testes: host nunca entra no palco dinâmico; active speaker substitui o anterior; silêncio mantém último falante; participante bloqueado não é substituído; desbloqueio libera próxima troca.
- [x] Implementar reducer/helpers puros do palco.
- [ ] Validar testes no pipeline Vercel.

### Task 3: UI do palco de participantes
**Files:**
- Create: `src/features/meeting/participant-stage.tsx`
- Modify: `src/features/meeting/instant-meeting-client.tsx`
- Modify: `src/app/octa-agenda-stage.css`

- [x] Adicionar teste contratual da composição: host fixo + segundo palco.
- [x] Renderizar host fixo no vídeo esquerdo e palco à direita.
- [x] Implementar mosaico com rolagem vertical, seleção manual, expandir/recolher, modo mosaico e bloqueio.
- [x] Preservar chat, controles, filtros, notas, lousa e recursos existentes da chamada.
- [ ] Validar testes no pipeline Vercel.

### Task 4: Active speaker LiveKit
**Files:**
- Modify: `src/features/meeting/livekit-stage.tsx`
- Modify: `src/features/meeting/instant-meeting-client.tsx`

- [x] Criar teste/contrato para callback de active speaker sem simulação no fallback.
- [x] Encaminhar active speaker real do LiveKit para o estado do palco.
- [x] Garantir que o último falante permaneça até o próximo evento válido.
- [ ] Validar testes no pipeline Vercel.

### Task 5: Verificação e produção
- [ ] Rodar `npm run build` pelo pipeline (Vitest + Next build).
- [ ] Verificar ausência de regressões nas rotas Agenda e Reunião Instantânea.
- [x] Publicar mudanças no `main` para acionar o pipeline de produção.
- [ ] Confirmar deployment Vercel `READY` antes de declarar conclusão.