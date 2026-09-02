import type { ChatMessage, Meeting, Participant, Profile } from '@/types/domain';

export const currentUser: Profile = {
  id: 'u-host',
  displayName: 'Sandro',
  username: 'sandro',
  headline: 'Marketing Digital',
  company: 'OCTA',
  status: 'Disponível',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
};

export const demoParticipants: Participant[] = [
  { ...currentUser, role: 'host', canSpeak: true, isPinned: true, isCameraOn: true },
  { id: 'u-2', displayName: 'Marcus Lee', headline: 'Diretor de Vendas', company: 'Northstar', role: 'participant', canSpeak: true, isCameraOn: true, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80' },
  { id: 'u-3', displayName: 'Amanda Smith', headline: 'Parceira de Crescimento', company: 'Atlas', role: 'participant', canSpeak: false, isCameraOn: true, avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80' },
  { id: 'u-4', displayName: 'James Miller', headline: 'Investidor', company: 'Miller Ventures', role: 'participant', canSpeak: false, isCameraOn: true, avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80' },
  { id: 'u-5', displayName: 'Sofia Clark', headline: 'CMO', company: 'Nexa', role: 'participant', canSpeak: true, isCameraOn: true, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80' },
  { id: 'u-6', displayName: 'Daniel Ortiz', headline: 'Líder de Produto', company: 'Onda', role: 'participant', canSpeak: false, isCameraOn: true, avatarUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=240&q=80' },
];

const today = new Date();
const dateAt = (dayOffset: number, hour: number, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const demoMeetings: Meeting[] = [
  { id: 'm-1', slug: 'strategy-room', title: 'Estratégia e Crescimento', ownerId: 'u-host', status: 'live', scheduledAt: dateAt(0, 10, 30), durationLabel: '50 min', participantIds: ['u-host','u-2','u-3','u-4'], tags: ['Vendas','Estratégia'] },
  { id: 'm-2', slug: 'board-room', title: 'Reunião Semanal da Diretoria', ownerId: 'u-host', status: 'scheduled', scheduledAt: dateAt(0, 15), durationLabel: '45 min', participantIds: ['u-host','u-4','u-5'] },
  { id: 'm-3', slug: 'brand-lab', title: 'Laboratório de Marca', ownerId: 'u-host', status: 'scheduled', scheduledAt: dateAt(1, 9), durationLabel: '60 min', participantIds: ['u-host','u-3','u-5','u-6'] },
  { id: 'm-4', slug: 'sales-replay', title: 'Sessão de Fechamento de Vendas', ownerId: 'u-host', status: 'ended', scheduledAt: dateAt(-1, 16), durationLabel: '52 min', participantIds: ['u-host','u-2','u-3'], tags: ['Replay','Vendas'], thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80' },
  { id: 'm-5', slug: 'mentor-replay', title: 'Mentoria de Liderança', ownerId: 'u-host', status: 'ended', scheduledAt: dateAt(-3, 11), durationLabel: '1h 12min', participantIds: ['u-host','u-5'], tags: ['Mentoria'], thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80' },
];

export const demoMessages: ChatMessage[] = [
  { id: 'c1', roomId: 'm-1', userId: 'u-3', userName: 'Amanda', body: 'Esse ponto é muito forte.', createdAt: new Date(Date.now()-90000).toISOString() },
  { id: 'c2', roomId: 'm-1', userId: 'u-2', userName: 'Marcus', body: 'Vou colocar os números no chat.', createdAt: new Date(Date.now()-50000).toISOString() },
  { id: 'c3', roomId: 'm-1', userId: 'u-5', userName: 'Sofia', body: '🔥', createdAt: new Date(Date.now()-12000).toISOString() },
];
