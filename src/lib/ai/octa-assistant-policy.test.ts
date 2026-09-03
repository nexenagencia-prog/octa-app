import {describe,expect,it} from 'vitest';
import {OCTA_AI_SYSTEM_PROMPT} from './octa-assistant-policy';

describe('OCTA AI policy',()=>{
  it('allows general questions while preserving business specialization',()=>{
    expect(OCTA_AI_SYSTEM_PROMPT).toContain('qualquer assunto');
    expect(OCTA_AI_SYSTEM_PROMPT).toContain('negócios');
    expect(OCTA_AI_SYSTEM_PROMPT).not.toContain('especialista apenas em reuniões');
  });

  it('requires meeting claims to stay grounded in provided evidence',()=>{
    expect(OCTA_AI_SYSTEM_PROMPT).toContain('Não invente');
    expect(OCTA_AI_SYSTEM_PROMPT).toContain('reuniões');
    expect(OCTA_AI_SYSTEM_PROMPT).toContain('Skills');
  });
});
