import { describe, expect, it } from 'vitest';
import { buildMonthGrid, shiftMonth, toDateKey } from '../src/lib/br-calendar';

describe('calendário brasileiro da Agenda', () => {
  it('calcula fevereiro bissexto corretamente', () => {
    const grid = buildMonthGrid(2028, 1);
    expect(grid.filter(cell => cell.currentMonth)).toHaveLength(29);
  });

  it('alinha segunda-feira como primeira coluna visual', () => {
    const grid = buildMonthGrid(2026, 8); // setembro/2026 começa em terça
    expect(grid[0].date.getDay()).toBe(1);
    const firstDay = grid.findIndex(cell => cell.currentMonth && cell.day === 1);
    expect(firstDay).toBe(1);
  });

  it('troca dezembro para janeiro avançando o ano', () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
  });

  it('gera chave de data sem depender de UTC', () => {
    expect(toDateKey(2026, 8, 1)).toBe('2026-09-01');
  });
});
