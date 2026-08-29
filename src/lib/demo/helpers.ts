import type { Meeting } from '@/types/domain';

export function createMeetingSlug(title: string, suffix = Math.random().toString(36).slice(2, 7)) {
  const base = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 42) || 'meeting';
  return `${base}-${suffix}`;
}

export function groupMeetingsByDay(meetings: Meeting[]) {
  return meetings.reduce<Record<string, Meeting[]>>((acc, meeting) => {
    const key = meeting.scheduledAt.slice(0, 10);
    (acc[key] ||= []).push(meeting);
    acc[key].sort((a,b) => a.scheduledAt.localeCompare(b.scheduledAt));
    return acc;
  }, {});
}
