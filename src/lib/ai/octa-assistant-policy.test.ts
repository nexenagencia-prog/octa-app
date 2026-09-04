import {describe,expect,it} from 'vitest';
import {buildOctaAssistantInput,OCTA_AI_SYSTEM_PROMPT} from './octa-assistant-policy';

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

  it('includes recent conversation history before the current question',()=>{
    const input=buildOctaAssistantInput({
      question:'E como eu aplico isso amanhã?',
      history:[{role:'user',text:'Me ensine SPIN Selling'},{role:'assistant',text:'SPIN usa situação, problema, implicação e necessidade.'}],
      context:{profileName:'Sandro',skills:[],recent:[{meetingTitle:'Venda',summary:'Cliente avaliou a proposta.',overallScore:82,transcript:'Cliente: o preço ainda está alto para mim.'}]}
    });
    expect(input).toContain('Me ensine SPIN Selling');
    expect(input).toContain('SPIN usa situação');
    expect(input).toContain('E como eu aplico isso amanhã?');
    expect(input).toContain('o preço ainda está alto');
    expect(input.indexOf('Me ensine SPIN Selling')).toBeLessThan(input.indexOf('E como eu aplico isso amanhã?'));
  });
});
