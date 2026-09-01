# OCTA Product Review Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir os pontos pendentes da revisão de produto da OCTA sem redesenhar o que já está aprovado.

**Architecture:** Manter o App Router e os componentes existentes, fazendo alterações localizadas nas páginas de OCTA AI, gravações, contatos, configurações e pequenos ajustes de Home. O estado local continuará usando os stores/localStorage já existentes, sem introduzir backend fictício.

**Tech Stack:** Next.js App Router, React, TypeScript, lucide-react, CSS existente.

**Spec:** `docs/superpowers/specs/2026-08-31-octa-product-review-refinement-design.md`

## Global Constraints
- Preservar layout aprovado.
- Não introduzir azul como cor de destaque.
- Não criar mockup ou novo projeto.
- Reaproveitar rotas e componentes existentes.

---

### Task 1: OCTA AI
**Files:** Modify `src/app/chat/page.tsx`
- [ ] Trocar identidade de Chat para OCTA AI.
- [ ] Adicionar atalhos de ações sobre reuniões.
- [ ] Manter conversa funcional e estado local.
- [ ] Remover lógica de ativar/desativar chat desta página.

### Task 2: Gravações
**Files:** Modify `src/app/gravacoes/page.tsx`
- [ ] Remover geração artificial de duplicatas.
- [ ] Adicionar metadados e ações úteis sem inventar dados externos.
- [ ] Manter destaque e shelf funcional.

### Task 3: Contatos
**Files:** Modify `src/app/contatos/page.tsx`
- [ ] Manter adicionar por e-mail/WhatsApp.
- [ ] Melhorar hierarquia dos cards e atalhos.
- [ ] Adicionar ação de agendar e contexto de contato.

### Task 4: Configurações
**Files:** Modify `src/app/configuracoes/page.tsx`
- [ ] Organizar preferências em categorias.
- [ ] Expor conta/plano, reunião, IA e privacidade com controles locais onde aplicável.
- [ ] Preservar restaurar preferências.

### Task 5: Home consistency
**Files:** Modify `src/app/page.tsx`
- [ ] Corrigir atalhos/copy que apontem para ações erradas.
- [ ] Preservar hero, Plano Pro e layout aprovado.

### Task 6: Verification
- [ ] Revisar TypeScript/JSX das páginas alteradas.
- [ ] Verificar deploy/CI associado ao commit final.
- [ ] Corrigir qualquer erro antes de integrar.
