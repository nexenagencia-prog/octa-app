import type { RoomRole } from '@/types/domain';

export const canModerateRoom = (role: RoomRole) => role === 'host' || role === 'cohost';
export const canPromoteToCohost = (role: RoomRole) => role === 'host';
export const canEndRoom = (role: RoomRole) => role === 'host';
