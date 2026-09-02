// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

const source=()=>readFileSync('src/features/notes/floating-notes-card.tsx','utf8');

describe('floating notes reference card',()=>{
  it('matches the supplied glass notepad instead of the old title-and-save modal',()=>{
    const card=source();
    expect(card).toContain('Bloco de notas');
    expect(card).toContain('Digite suas anotações aqui...');
    expect(card).toContain('Salvo automaticamente');
    expect(card).toContain('Minimize2');
    expect(card).toContain('Maximize2');
    expect(card).not.toContain('Título da anotação');
    expect(card).not.toContain('Salvar anotação');
  });
  it('stays draggable above the rest of the app and autosaves the same note',()=>{
    const card=source();
    expect(card).toContain('position:fixed');
    expect(card).toContain('z-index:240');
    expect(card).toContain("window.addEventListener('pointermove',move)");
    expect(card).toContain('saveNote({id:noteIdRef.current');
    expect(card).toContain('resize:both');
  });
});
