import fs from 'node:fs';

const css = fs.readFileSync('src/app/globals.css', 'utf8');
const required = [
  '[data-theme="dark"] .octa-plan-card',
  '[data-theme="dark"] .octa-note-card',
  '[data-theme="dark"] .settings-row',
  '[data-theme="dark"] .home-left>h1',
  '[data-theme="dark"] .home-left h2',
  '[data-theme="dark"] .octa-secondary-button',
  '[data-theme="dark"] .home-left .bg-white\\/58',
  '[data-theme="dark"] .octa-note-card:hover'
];
for (const selector of required) {
  if (!css.includes(selector)) {
    console.error(`Missing dark-theme selector: ${selector}`);
    process.exit(1);
  }
}
console.log('dark theme contrast contract: ok');
