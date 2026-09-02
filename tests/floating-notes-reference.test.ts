// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

const source=()=>readFileSync('src/features/notes/floating-notes-card.tsx','utf8');

describe('floating notes reference card',()=>{
  it('keeps the glass notepad compact with editable subject and explicit save',()=>{
    const card=source();
    expect(card).toContain('placeholder="Assunto"');
    expect(card).toContain('Digite suas anotações aqui...');
    expect(card).toContain('Salvar');
    expect(card).toContain('Save');
    expect(card).toContain('Minimize2');
    expect(card).toContain('Maximize2');
    expect(card).not.toContain('Salvo automaticamente');
  });
  it('saves subject and text to Minhas Anotações, closes, and stays draggable',()=>{
    const card=source();
    expect(card).toContain('const handleSave=()=>');
    expect(card).toContain("title:subject.trim()||'Anotação sem assunto'");
    expect(card).toContain('subject:subject.trim()');
    expect(card).toContain('content:content.trim()');
    expect(card).toContain('localStorage.removeItem(draftKey)');
    expect(card).toContain('onClose();');
    expect(card).toContain('position:fixed');
    expect(card).toContain('z-index:240');
    expect(card).toContain("window.addEventListener('pointermove',move)");
    expect(card).toContain('resize:both');
  });
});
