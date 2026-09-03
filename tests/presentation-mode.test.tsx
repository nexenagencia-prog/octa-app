// @vitest-environment node
import {readFileSync} from 'node:fs';
import {describe,expect,it} from 'vitest';

const source=readFileSync(new URL('../src/features/meeting/presentation-mode.tsx',import.meta.url),'utf8');
const client=readFileSync(new URL('../src/features/meeting/instant-meeting-client.tsx',import.meta.url),'utf8');

describe('PresentationMode contract',()=>{
 it('keeps private preview and explicit broadcast support',()=>{expect(source).toContain('Só você está vendo');expect(source).toContain('Apresentar este slide');expect(source).toContain("broadcast({action:'show',slide})");expect(source).toContain("broadcast({action:'stop'})")});
 it('launches a selected slide full-screen and keeps navigation controls',()=>{expect(source).toContain('launchSlideId');expect(source).toContain('TODOS ESTÃO VENDO');expect(source).toContain('Slide anterior');expect(source).toContain('Próximo slide');expect(source).toContain('Parar apresentação');expect(source).toContain('Ocultar participantes');});
 it('preloads adjacent slides for smoother navigation',()=>{expect(source).toContain('new window.Image()');expect(source).toContain("img.decoding='async'");expect(source).toContain('fetchPriority="high"')});
 it('lets presenters add and remove slides while full-screen',()=>{expect(source).toContain('onSlidesChange');expect(source).toContain('Adicionar JPEG/PNG');expect(source).toContain('Remover slide');expect(source).toContain('removeSlide');expect(source).toContain('application/pdf,image/jpeg,image/png')});
 it('loads local saved decks into the meeting and keeps full slide imagery in the card',()=>{expect(client).toContain('Escolher apresentação salva');expect(client).toContain('listDecks');expect(client).toContain('renderSlideToDataUrl');expect(client).toContain('1920,1080');expect(client).toContain('object-contain');expect(client).toContain('Escolher outra');});
});
