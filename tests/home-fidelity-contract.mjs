import fs from 'node:fs';
const home=fs.readFileSync('src/app/page.tsx','utf8');
const css=fs.readFileSync('src/app/home-previous.module.css','utf8');
const dark=fs.readFileSync('src/app/octa-dark-icon-fixes.css','utf8');
const checks=[
  ['recordings use 16:9 thumbnail',home.includes('recordingThumb')&&home.includes('duration="48:12"')&&css.includes('aspect-ratio:16/9')],
  ['recordings include overflow and round play actions',home.includes('recordingMenu')&&home.includes('recordingPlay')],
  ['ai card uses dedicated orb asset',home.includes('aiOrb')&&home.includes('/octa-ai-circle.webp')],
  ['ai card keeps exact reference copy',home.includes('Sua IA de reuniões. Mais foco, mais resultados.')&&home.includes('Abrir OCTA AI')),
  ['dark mode icon contrast layer exists',dark.includes('[data-theme="dark"]')&&dark.includes('svg')),
];
const failed=checks.filter(([,ok])=>!ok);if(failed.length){console.error('FAIL');for(const [name] of failed)console.error('-',name);process.exit(1)}console.log(`home fidelity contract: PASS (${checks.length}/${checks.length})`);
