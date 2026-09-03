import {afterEach,describe,expect,it} from 'vitest';
import {isGenerativeAIEnabled} from './openai-json';

const originalMode=process.env.OCTA_AI_MODE;
const originalKey=process.env.OPENAI_API_KEY;
const originalGateway=process.env.AI_GATEWAY_API_KEY;

afterEach(()=>{
  if(originalMode===undefined)delete process.env.OCTA_AI_MODE;else process.env.OCTA_AI_MODE=originalMode;
  if(originalKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=originalKey;
  if(originalGateway===undefined)delete process.env.AI_GATEWAY_API_KEY;else process.env.AI_GATEWAY_API_KEY=originalGateway;
});

describe('isGenerativeAIEnabled',()=>{
  it('enables generative answers automatically when an OpenAI key exists',()=>{
    delete process.env.OCTA_AI_MODE;
    process.env.OPENAI_API_KEY='test-key';
    expect(isGenerativeAIEnabled()).toBe(true);
  });

  it('allows explicit free mode to disable generative answers',()=>{
    process.env.OCTA_AI_MODE='free';
    process.env.OPENAI_API_KEY='test-key';
    expect(isGenerativeAIEnabled()).toBe(false);
  });
});
