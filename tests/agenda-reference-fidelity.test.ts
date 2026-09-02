// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('agenda supplied-reference fidelity',()=>{
 it('uses the supplied sunset photo and the two-column glass agenda structure',()=>{const page=readFileSync('src/app/agenda/page.tsx','utf8');expect(page).toContain('/agenda-background.webp');expect(page).toContain('agenda-reference-grid');expect(page).toContain('agenda-reference-calendar');expect(page).toContain('agenda-reference-day');expect(page).toContain('backdrop-filter:blur(26px)');expect(page).toContain('Buscar reunião, pessoa ou gravação');expect(page).toContain('Agendar reunião')});
 it('keeps the desktop sidebar fixed across app pages',()=>{const shell=readFileSync('src/components/app-shell.tsx','utf8');expect(shell).toContain('position:fixed!important');expect(shell).toContain('height:100dvh!important');expect(shell).toContain('margin-left:250px!important')});
 it('matches the reference sidebar hierarchy',()=>{const nav=readFileSync('src/components/nav.tsx','utf8');for(const label of ['Início','Reuniões','Agenda','Contatos','Gravações','Calculadora','Filtros','Anotar','Lousa','Minhas Anotações','Skill','Plano Pro'])expect(nav).toContain(label)});
});
