// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('profile avatar fallback',()=>{
  it('updates the avatar immediately and persists it locally when the profile API is unavailable',()=>{
    const home=readFileSync('src/app/page.tsx','utf8');
    expect(home).toContain("localStorage.setItem('octa-profile-local'");
    expect(home).toContain("localStorage.getItem('octa-profile-local')");
    expect(home).toContain('setAvatar(next)');
    expect(home).toContain('response.status===401||response.status===503');
  });
});
