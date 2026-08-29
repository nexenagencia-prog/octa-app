export type RoomRole = 'host' | 'cohost' | 'participant';
export type RoomStatus = 'scheduled' | 'live' | 'ended';

export interface Profile {
  id: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  headline?: string;
  company?: string;
  status?: string;
}

export interface Participant extends Profile {
  role: RoomRole;
  canSpeak: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isCameraOn?: boolean;
}

export interface Meeting {
  id: string;
  slug: string;
  title: string;
  ownerId: string;
  status: RoomStatus;
  scheduledAt: string;
  durationLabel?: string;
  participantIds: string[];
  tags?: string[];
  thumbnailUrl?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  body: string;
  createdAt: string;
}

export interface WhiteboardStroke {
  id: string;
  color: string;
  width: number;
  points: Array<{ x: number; y: number }>;
}
