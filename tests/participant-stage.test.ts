import { describe, expect, it } from 'vitest';
import { createStageState, stageReducer } from '../src/lib/participant-stage';

describe('palco inteligente de participantes', () => {
  it('mantém o anfitrião fora do palco dinâmico', () => {
    const state = createStageState('u-host', ['u-host','u-2','u-3']);
    expect(state.participantIds).toEqual(['u-2','u-3']);
  });

  it('mantém o último falante até outro participante falar', () => {
    let state = createStageState('u-host', ['u-host','u-2','u-3']);
    state = stageReducer(state, { type: 'active-speaker', participantId: 'u-2' });
    expect(state.focusedId).toBe('u-2');
    state = stageReducer(state, { type: 'silence' });
    expect(state.focusedId).toBe('u-2');
    state = stageReducer(state, { type: 'active-speaker', participantId: 'u-3' });
    expect(state.focusedId).toBe('u-3');
  });

  it('não troca o participante quando o anfitrião bloqueia o destaque', () => {
    let state = createStageState('u-host', ['u-host','u-2','u-3']);
    state = stageReducer(state, { type: 'manual-focus', participantId: 'u-2' });
    state = stageReducer(state, { type: 'lock', participantId: 'u-2' });
    state = stageReducer(state, { type: 'active-speaker', participantId: 'u-3' });
    expect(state.focusedId).toBe('u-2');
    state = stageReducer(state, { type: 'unlock' });
    state = stageReducer(state, { type: 'active-speaker', participantId: 'u-3' });
    expect(state.focusedId).toBe('u-3');
  });

  it('ignora active speaker quando automação está desligada', () => {
    let state = createStageState('u-host', ['u-host','u-2','u-3']);
    state = stageReducer(state, { type: 'set-auto-speaker', enabled: false });
    state = stageReducer(state, { type: 'active-speaker', participantId: 'u-3' });
    expect(state.focusedId).toBeNull();
  });
});
