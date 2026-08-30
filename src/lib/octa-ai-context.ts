import { supabaseServer } from '@/lib/supabase/server';

export const octaSkillsSnapshot = {
  score: 82,
  target: 90,
  weeklyChange: '+6,4%',
  competencies: {
    'Comunicação': 88,
    'Clareza': 91,
    'Escuta': 84,
    'Objetividade': 76,
    'Perguntas': 89,
    'Argumentação': 81,
    'Condução': 85,
  },
  strengths: ['Clareza', 'Perguntas de diagnóstico', 'Escuta'],
  opportunities: ['Objetividade nas objeções', 'Respostas mais curtas e diretas'],
};

type CoachContext = {
  skills: typeof octaSkillsSnapshot;
  profile?: { displayName?: string | null; objective?: string | null };
  recentNotes?: string[];
  memories?: string[];
};

export async function getOctaCoachContext(): Promise<CoachContext> {
  const base: CoachContext = { skills: octaSkillsSnapshot, recentNotes: [], memories: [] };
  try {
    const supabase = await supabaseServer();
    if (!supabase) return base;
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return base;

    let memories: { summary?: string }[] = [];
    let notes: { content?: string }[] = [];
    try {
      const result = await supabase.from('octa_ai_memories').select('summary,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(8);
      memories = result.data ?? [];
    } catch {}
    try {
      const result = await supabase.from('meeting_notes').select('content,updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(4);
      notes = result.data ?? [];
    } catch {}

    return {
      ...base,
      profile: { displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? null },
      recentNotes: notes.map(item => (item.content ?? '').replace(/<[^>]+>/g, ' ').slice(0, 700)).filter(Boolean),
      memories: memories.map(item => item.summary ?? '').filter(Boolean),
    };
  } catch {
    return base;
  }
}

export async function rememberCoachExchange(userMessage: string, assistantMessage: string) {
  try {
    const supabase = await supabaseServer();
    if (!supabase) return;
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const summary = `Usuário: ${userMessage.slice(0, 500)}\nOCTA AI: ${assistantMessage.slice(0, 900)}`;
    await supabase.from('octa_ai_memories').insert({ user_id: auth.user.id, summary, kind: 'coach_exchange' });
  } catch {}
}
