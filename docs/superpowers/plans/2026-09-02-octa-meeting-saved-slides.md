# OCTA Saved Slides in Meeting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir miniaturas do Criar Slides e integrar decks salvos ao Criar reunião com rasterização Full HD, upload e remoção de slides.

**Architecture:** O editor continua persistindo decks/assets no IndexedDB local. Um renderer Canvas converte `SlidePage` em JPEG 1920×1080; a reunião consome esse renderer apenas quando o usuário escolhe um deck salvo. `PresentationMode` mantém arquivos manuais e sincroniza adições/remoções com o estado da reunião.

**Tech Stack:** Next.js 15, React, TypeScript, IndexedDB, Canvas 2D, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-02-octa-meeting-saved-slides-design.md`

## Global Constraints
- Não alterar módulos fora do Criar Slides e apresentação/reunião.
- Não apagar decks salvos ao remover slides da reunião.
- Decks escolhidos devem ser rasterizados em 1920×1080.
- JPEG/PNG/PDF continuam aceitos no modo de apresentação.
- Imagens em cards e tela cheia não podem ser cortadas.
- Atualizar `main` somente depois da árvore final verificada.

---

### Task 1: Renderer Full HD de decks locais

**Files:**
- Modify: `src/lib/local-slide-studio.ts`
- Test: `tests/slide-studio.test.ts`

**Interfaces:**
- Produces: `renderSlideToDataUrl(slide: SlidePage, width?: number, height?: number): Promise<string>`

- [ ] **Step 1: Write the failing test**

```ts
expect(store).toContain('renderSlideToDataUrl');
expect(store).toContain('1920');
expect(store).toContain('1080');
expect(store).toContain('canvas.toDataURL');
```

- [ ] **Step 2: Verify the contract is absent in the base tree**

Expected: static contract fails because `renderSlideToDataUrl` is not present.

- [ ] **Step 3: Implement the renderer**

```ts
export async function renderSlideToDataUrl(slide: SlidePage,width=1920,height=1080){
  const canvas=document.createElement('canvas');
  canvas.width=width;canvas.height=height;
  // draw background + visible elements + local image assets
  return canvas.toDataURL('image/jpeg',.94);
}
```

- [ ] **Step 4: Verify renderer contract passes**

Run: `vitest run tests/slide-studio.test.ts`
Expected: PASS.

### Task 2: Real slide thumbnails in Criar Slides

**Files:**
- Modify: `src/app/criar-slides/page.tsx`
- Test: `tests/slide-studio.test.ts`

**Interfaces:**
- Consumes: existing `visual(element)` renderer.
- Produces: `Mini` preview that renders all visible slide elements at scaled 16:9 size.

- [ ] **Step 1: Add regression assertions**

```ts
expect(page).toContain('miniature-stage');
expect(page).toContain('slide.elements.map');
```

- [ ] **Step 2: Replace background-only Mini**

Use a measured inner 1600×900 stage and render each visible element with position, rotation, opacity and `visual(e)`.

- [ ] **Step 3: Verify thumbnail contract**

Run: `vitest run tests/slide-studio.test.ts`
Expected: PASS.

### Task 3: Saved deck chooser in Criar reunião

**Files:**
- Modify: `src/features/meeting/instant-meeting-client.tsx`
- Test: `tests/presentation-mode.test.tsx`

**Interfaces:**
- Consumes: `listDecks`, `renderSlideToDataUrl`, `SlideDeck`.
- Produces: `meetingSlides`, `chooseSavedDeck(deckId)` and `SlideRail` deck picker.

- [ ] **Step 1: Add failing static contract**

```ts
expect(client).toContain('Escolher apresentação salva');
expect(client).toContain('listDecks');
expect(client).toContain('renderSlideToDataUrl');
expect(client).toContain('1920,1080');
```

- [ ] **Step 2: Implement deck loading and picker**

Load IndexedDB decks on mount. Generate lightweight first-slide covers for picker. On selection render all pages at 1920×1080 into `PresentationSlide[]` and replace the meeting slide set.

- [ ] **Step 3: Make the meeting slide card visual-first**

Use `object-contain`, overlay title/slide number over the bottom of the image, and keep click-to-open behavior.

- [ ] **Step 4: Verify meeting contract**

Run presentation/meeting tests. Expected: PASS.

### Task 4: Upload and remove in Full HD presentation

**Files:**
- Modify: `src/features/meeting/presentation-mode.tsx`
- Test: `tests/presentation-mode.test.tsx`

**Interfaces:**
- Adds prop: `onSlidesChange?: (slides: PresentationSlide[]) => void`.
- Produces: `removeSlide(id)` and live-mode upload button.

- [ ] **Step 1: Add failing assertions**

```ts
expect(source).toContain('onSlidesChange');
expect(source).toContain('Adicionar JPEG/PNG');
expect(source).toContain('Remover slide');
expect(source).toContain('removeSlide');
```

- [ ] **Step 2: Implement synchronized slide mutations**

Use one helper to update local slides and invoke `onSlidesChange`. Removing the current live slide presents the nearest remaining slide, or stops if none remain.

- [ ] **Step 3: Add live upload/removal controls**

Keep the existing hidden PDF/JPEG/PNG input available in live mode; use `object-contain` for all presentation images.

- [ ] **Step 4: Run focused tests**

Run: `vitest run tests/presentation-mode.test.tsx tests/slide-studio.test.ts`
Expected: PASS.

### Task 5: Final verification and atomic production promotion

**Files:**
- Verify all modified files only.

- [ ] **Step 1: Compare detached final tree with current main**
Expected modified paths only: docs spec/plan, `src/lib/local-slide-studio.ts`, `src/app/criar-slides/page.tsx`, `src/features/meeting/instant-meeting-client.tsx`, `src/features/meeting/presentation-mode.tsx`, related tests.

- [ ] **Step 2: Verify static contracts and TypeScript-sensitive strings**
Ensure no stale test assertions and no missing imports/types.

- [ ] **Step 3: Advance `refs/heads/main` once**
Use one fast-forward ref update to the verified detached commit.

- [ ] **Step 4: Monitor Vercel production build**
Require all Vitest tests, Next.js compilation, type checking, static generation and production alias completion before reporting success.
