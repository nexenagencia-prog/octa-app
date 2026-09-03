import {describe,expect,it} from 'vitest';
import {filterCss,videoFilterPresets} from '@/lib/video-filters';

describe('intelligent meeting video filters',()=>{
  it('replaces legacy color looks with professional appearance presets',()=>{
    const ids=videoFilterPresets.map(p=>p.id);
    expect(ids).toEqual(['auto-face','natural-pro','studio-light','skin-balance','executive','low-light-rescue','camera-clean','soft-focus']);
    expect(ids).not.toContain('warm');
    expect(ids).not.toContain('cool');
    expect(ids).not.toContain('mono');
    expect(ids).not.toContain('cinema');
  });

  it('keeps the existing natural selection compatible with Auto Face',()=>{
    expect(filterCss('natural',60)).toBe(filterCss('auto-face',60));
    expect(filterCss('auto-face',60)).not.toBe('none');
  });

  it('keeps retouching intentionally subtle and adjustable',()=>{
    expect(filterCss('natural-pro',0)).toBe('none');
    expect(filterCss('natural-pro',60)).toContain('blur(');
    expect(filterCss('skin-balance',60)).toContain('saturate(');
    expect(filterCss('low-light-rescue',60)).toContain('brightness(');
  });
});
