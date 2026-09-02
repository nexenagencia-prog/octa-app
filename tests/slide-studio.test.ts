// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {createDeck,createSlide,SLIDE_HEIGHT,SLIDE_WIDTH} from '../src/lib/local-slide-studio';

describe('OCTA local slide studio',()=>{
  it('creates editable 16:9 decks locally with Apple-style starter layouts',()=>{
    const deck=createDeck('Pitch');
    expect(deck.title).toBe('Pitch');
    expect(deck.slides).toHaveLength(1);
    expect(deck.slides[0].elements.some(element=>element.type==='text')).toBe(true);
    expect(SLIDE_WIDTH/SLIDE_HEIGHT).toBeCloseTo(16/9,5);
    const columns=createSlide('columns');
    expect(columns.elements.filter(element=>element.type==='shape')).toHaveLength(2);
  });

  it('exposes local persistence, PDF/JPEG import, drag-resize editing and saved library actions',()=>{
    const store=readFileSync('src/lib/local-slide-studio.ts','utf8');
    const page=readFileSync('src/app/criar-slides/page.tsx','utf8');
    const sidebar=readFileSync('src/components/global-legacy-sidebar.tsx','utf8');
    expect(store).toContain("const DB_NAME = 'octa-slide-studio'");
    expect(store).toContain('indexedDB.open');
    expect(page).toContain('loadPresentationFiles');
    expect(page).toContain('PDF/JPEG');
    expect(page).toContain("mode:'move'|'resize'");
    expect(page).toContain('Renomear');
    expect(page).toContain('Salvo neste computador');
    expect(sidebar).toContain("['Criar slides','/criar-slides',FileImage]");
    expect(sidebar).toContain('octa-hero-brand-lock');
    expect(sidebar).toContain('octa-hero-profile-lock');
  });
});
