// deploy retry marker 2026-09-03
// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {createDeck,createSlide,SLIDE_HEIGHT,SLIDE_WIDTH} from '../src/lib/local-slide-studio';

describe('OCTA local slide studio',()=>{
  it('creates editable 16:9 decks with progressive element animation defaults',()=>{
    const deck=createDeck('Pitch');
    expect(deck.title).toBe('Pitch');
    expect(deck.slides).toHaveLength(1);
    expect(deck.slides[0].elements.some(element=>element.type==='text')).toBe(true);
    expect(deck.slides[0].elements.every((element,index)=>(element.animationOrder??0)===index+1)).toBe(true);
    expect(deck.slides[0].elements.every(element=>Boolean(element.enterAnimation))).toBe(true);
    expect(SLIDE_WIDTH/SLIDE_HEIGHT).toBeCloseTo(16/9,5);
    const columns=createSlide('columns');
    expect(columns.elements.filter(element=>element.type==='shape')).toHaveLength(2);
  });

  it('keeps the editor local with frames, fonts, manual save and presentation animation',()=>{
    const store=readFileSync('src/lib/local-slide-studio.ts','utf8');
    const page=readFileSync('src/app/criar-slides/page.tsx','utf8');
    const sidebar=readFileSync('src/components/global-legacy-sidebar.tsx','utf8');
    expect(store).toContain("const DB_NAME = 'octa-slide-studio'");
    expect(store).toContain('indexedDB.open');
    expect(store).toContain('listAssets');
    expect(store).toContain('enterAnimation');
    expect(store).toContain('animationOrder');
    expect(page).toContain('loadPresentationFiles');
    expect(page).toContain('application/pdf,image/jpeg,image/png');
    expect(page).toContain("type ResizeMode='se'|'sw'|'ne'|'nw'|'e'|'w'|'n'|'s'");
    expect(page).toContain('Cantos da foto');
    expect(page).toContain("borderRadius:'inherit'");
    expect(page).toContain('Helvetica');
    expect(page).toContain('Noto Sans');
    expect(page).toContain('Bebas Neue');
    expect(page).toContain('Bank Gothic');
    expect(page).toContain('Bender');
    expect(page).toContain('Salvar agora');
    expect(page).toContain('Montagem item por item');
    expect(page).toContain('Salvo neste computador');
    expect(sidebar).toContain("['Criar slides','/criar-slides',FileImage]");
    expect(sidebar).toContain('octa-hero-brand-lock');
    expect(sidebar).toContain('octa-hero-profile-lock');
  });

  it('offers photoshop-like layers, top tools, additive photos and editable gradients',()=>{
    const store=readFileSync('src/lib/local-slide-studio.ts','utf8');
    const page=readFileSync('src/app/criar-slides/page.tsx','utf8');
    expect(store).toContain("type: 'text' | 'image' | 'shape' | 'gradient'");
    expect(store).toContain('gradientFrom');
    expect(store).toContain('gradientTo');
    expect(store).toContain('gradientAngle');
    expect(store).toContain('locked?: boolean');
    expect(store).toContain('hidden?: boolean');
    expect(store).toContain('name?: string');
    expect(page).toContain('Camadas');
    expect(page).toContain('Barra de ferramentas');
    expect(page).toContain('Adicionar foto');
    expect(page).toContain('Substituir imagem');
    expect(page).toContain('Adicionar degradê');
    expect(page).toContain('Cor inicial');
    expect(page).toContain('Cor final');
    expect(page).toContain('Ângulo');
    expect(page).toContain('Bloquear camada');
    expect(page).toContain('Ocultar camada');
    expect(page).toContain('Agrupar');
    expect(page).toContain('Distribuir');
    expect(page).toContain('Ajustar à tela');
    expect(page).toContain('Organizar automaticamente');
    expect(page).toContain('Cmd/Ctrl + C');
  });
});
