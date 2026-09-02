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

  it('keeps the editor local while exposing intelligent frames, fonts, manual save and animations',()=>{
    const store=readFileSync('src/lib/local-slide-studio.ts','utf8');
    const page=readFileSync('src/app/criar-slides/page.tsx','utf8');
    const sidebar=readFileSync('src/components/global-legacy-sidebar.tsx','utf8');
    expect(store).toContain("const DB_NAME = 'octa-slide-studio'");
    expect(store).toContain('indexedDB.open');
    expect(store).toContain('listAssets');
    expect(store).toContain('enterAnimation');
    expect(store).toContain('animationOrder');
    expect(page).toContain('loadPresentationFiles');
    expect(page).toContain('PDF/JPEG');
    expect(page).toContain("type ResizeMode='se'|'sw'|'ne'|'nw'|'e'|'w'|'n'|'s'");
    expect(page).toContain('Cantos da foto');
    expect(page).toContain("borderRadius:'inherit'");
    expect(page).toContain('Molduras de foto');
    expect(page).toContain('Colocar foto na moldura');
    expect(page).toContain('Helvetica');
    expect(page).toContain('Noto Sans');
    expect(page).toContain('Bebas Neue');
    expect(page).toContain('Bank Gothic');
    expect(page).toContain('Bender');
    expect(page).toContain('Salvar agora');
    expect(page).toContain('Salvar uma cópia');
    expect(page).toContain('showSaveFilePicker');
    expect(page).toContain('Montagem item por item');
    expect(page).toContain('advancePresentation');
    expect(page).toContain('Ordem de entrada');
    expect(page).toContain('Desfazer');
    expect(page).toContain('Frente');
    expect(page).toContain('Fundo');
    expect(page).toContain('Renomear');
    expect(page).toContain('Salvo neste computador');
    expect(sidebar).toContain("['Criar slides','/criar-slides',FileImage]");
    expect(sidebar).toContain('octa-hero-brand-lock');
    expect(sidebar).toContain('octa-hero-profile-lock');
  });
});
