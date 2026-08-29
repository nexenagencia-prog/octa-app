import fs from 'node:fs';

const page = fs.readFileSync(new URL('../src/app/agenda/page.tsx', import.meta.url), 'utf8');

if (!page.includes("import { Suspense")) {
  throw new Error('Agenda page must import Suspense from react');
}
if (!page.includes('<Suspense')) {
  throw new Error('Agenda page must wrap search-param consumer in Suspense');
}
if (!page.includes('function AgendaContent')) {
  throw new Error('Agenda page must isolate useSearchParams inside AgendaContent');
}

console.log('agenda suspense contract passed');
