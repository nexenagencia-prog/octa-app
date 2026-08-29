import fs from 'node:fs';
const src = fs.readFileSync('src/components/nav.tsx','utf8');
const sidebar = src.slice(src.indexOf('export function DashboardSidebar'), src.indexOf('export function TopNav'));
if (!/const\s+router\s*=\s*useRouter\(\)/.test(sidebar)) {
  throw new Error('DashboardSidebar usa router.push sem inicializar router com useRouter()');
}
console.log('sidebar router regression: PASS');
