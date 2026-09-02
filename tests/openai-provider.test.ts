// @vitest-environment node
import {describe,expect,it} from 'vitest';
import {classifyProviderError} from '../src/lib/ai/openai-json';
describe('OCTA AI provider errors',()=>{it('separates exhausted quota from transient rate limit',()=>{expect(classifyProviderError(429,'{"error":{"code":"insufficient_quota"}}')).toBe('quota_exhausted');expect(classifyProviderError(429,'rate_limit_exceeded requests per minute')).toBe('rate_limited')});it('keeps non 429 as provider error',()=>expect(classifyProviderError(500,'server error')).toBe('provider_error'))});