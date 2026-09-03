import fs from 'node:fs';
const read=(path)=>fs.readFileSync(path,'utf8');
const ctx=read('src/components/tool-overlay-context.tsx');
const overlay=read('src/components/tool-overlay.tsx');
const board=read('src/features/whiteboard/whiteboard-panel.tsx');
function assert(ok,message){if(!ok)throw new Error(message)}
assert(ctx.includes("'whiteboard'")&&ctx.includes('a[href="/lousa"]')&&ctx.includes("setTool('whiteboard')"),'Lousa link must open the floating whiteboard instead of navigating');
assert(overlay.includes('WhiteboardPanel')&&overlay.includes("tool==='whiteboard'"),'tool overlay must render the whiteboard');
assert(board.includes('backdrop-filter')||board.includes('backdropFilter'),'whiteboard must use blurred glass');
assert(board.includes('Mostrar aos participantes'),'whiteboard must expose participant visibility control');
assert(board.includes('(window.innerWidth-w)/2')&&board.includes('(window.innerHeight-h)/2'),'whiteboard must open centered');
