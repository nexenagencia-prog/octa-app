import { describe, expect, it } from 'vitest';
import { createMeetingSlug, groupMeetingsByDay } from '@/lib/demo/helpers';
import { canModerateRoom, canPromoteToCohost } from '@/lib/permissions/room';
import type { Meeting } from '@/types/domain';

describe('meeting domain', () => {
  it('creates a readable unique room slug', () => {
    expect(createMeetingSlug('Reunião Estratégia 2026', 'abc12')).toBe('reuniao-estrategia-2026-abc12');
  });

  it('groups agenda meetings by ISO day and sorts by time', () => {
    const meetings = [
      { id:'2', slug:'b', title:'B', ownerId:'u', status:'scheduled', scheduledAt:'2026-08-29T15:00:00.000Z', participantIds:[] },
      { id:'1', slug:'a', title:'A', ownerId:'u', status:'scheduled', scheduledAt:'2026-08-29T09:00:00.000Z', participantIds:[] },
    ] satisfies Meeting[];
    expect(groupMeetingsByDay(meetings)['2026-08-29'].map(m => m.id)).toEqual(['1','2']);
  });

  it('limits moderation and cohost promotion by role', () => {
    expect(canModerateRoom('cohost')).toBe(true);
    expect(canModerateRoom('participant')).toBe(false);
    expect(canPromoteToCohost('host')).toBe(true);
    expect(canPromoteToCohost('cohost')).toBe(false);
  });
});
