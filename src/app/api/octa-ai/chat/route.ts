import { NextResponse } from 'next/server';
import { getOctaCoachContext, rememberCoachExchange } from '@/lib/octa-ai-context';

export const runtime = 'nodejs';
const MAX_MESSAGE = 4000;

function demoReply(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes('objetiv')) return 'Seu ponto com maior espaço de evolução agora é Objetividade (76/100). Tente responder em três etapas: conclusão, evidência e pergunta. Posso treinar uma resposta com você.';
  if (lower.includes('melhor') || lower.includes('forte')) return 'Sua maior força hoje é Clareza (91/100), seguida de Perguntas (89) e Comunicação (88). O próximo ganho vem de manter essa clareza com respostas mais curtas.';
  return 'Pelos seus Skills, você está em 82/100 e evoluiu 6,4% nesta semana. Seu melhor caminho agora é manter sua força em Clareza e Perguntas enquanto trabalha Objetividade. Posso te ajudar a montar um treino rápido para isso.';
}

function extractOutputText(payload: any) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) return payload.output_text.trim();
  const parts = Array.isArray(payload?.output) ? payload.output.flatMap((item: any) => Array.isArray(item?.content) ? item.content : []) : [];
  const text = parts.map((part: any) => part?.text ?? '').filter(Boolean).join('\n').trim();
  return text;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body?.history) ? body.history.slice(-8) : [];
    if (!message) return NextResponse.json({ error: 'Escreva uma pergunta para o OCTA AI.' }, { status: 400 });
    if (message.length > MAX_MESSAGE) return NextResponse.json({ error: 'Mensagem muito longa.' }, { status: 400 });

    const context = await getOctaCoachContext();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ reply: demoReply(message), demo: true, context: context.skills });

    const instructions = `Você é o OCTA AI Coach. Seu único escopo é performance profissional: comunicação, clareza, escuta, objetividade, perguntas, argumentação, condução, preparação e evolução em reuniões. Use os dados do OCTA Skills como evidência, nunca invente pontuações. Seja direto, útil e prático em português do Brasil. Não aja como chatbot genérico. Quando faltar evidência, diga isso. Preserve privacidade e não exponha dados de terceiros.\n\nContexto permitido do usuário:\n${JSON.stringify(context).slice(0, 12000)}`;
    const input = [
      ...history.map((item: any) => ({ role: item?.role === 'assistant' ? 'assistant' : 'user', content: String(item?.content ?? '').slice(0, 2000) })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_CHAT_MODEL || 'gpt-5.6-terra', instructions, input, max_output_tokens: 700 }),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error('OCTA AI OpenAI error', response.status, detail.slice(0, 500));
      return NextResponse.json({ error: 'A IA não conseguiu responder agora.' }, { status: 502 });
    }
    const data = await response.json();
    const reply = extractOutputText(data) || 'Não consegui gerar uma resposta útil com evidência suficiente.';
    await rememberCoachExchange(message, reply);
    return NextResponse.json({ reply, demo: false });
  } catch {
    return NextResponse.json({ error: 'Não foi possível processar sua pergunta.' }, { status: 500 });
  }
}
