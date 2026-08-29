import fs from 'node:fs';
import assert from 'node:assert/strict';

const nav = fs.readFileSync('src/components/nav.tsx','utf8');
const meeting = fs.readFileSync('src/features/meeting/meeting-client.tsx','utf8');

assert.match(nav,/href:\s*'\/room\/strategy-room'\s*,\s*label:\s*'Entrar em reunião'/,'second recordings link must become Entrar em reunião');
assert.match(nav,/href:\s*'\/feed'\s*,\s*label:\s*'Feed'/,'sidebar must expose Feed');
assert.ok(fs.existsSync('src/app/feed/page.tsx'),'Feed page must exist');
assert.match(meeting,/meeting-social-stage/,'meeting must use the social vertical stage styling');
assert.match(meeting,/meeting-reaction-rail/,'meeting must include reaction rail styling');
assert.match(meeting,/meeting-participant-strip/,'meeting must keep participant strip in the new visual treatment');

console.log('menu-feed-meeting-contract: PASS');
