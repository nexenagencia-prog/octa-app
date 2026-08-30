import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Adicione OPENAI_API_KEY para ativar áudio.' }, { status: 503 });
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('multipart/form-data')) {
    try {
      const form = await request.formData();
      const file = form.get('file');
      if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: 'Áudio inválido.' }, { status: 400 });
      if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: 'Áudio muito grande.' }, { status: 413 });
      const upstream = new FormData();
      upstream.append('file', file, file.name || 'audio.webm');
      upstream.append('model', process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-transcribe');
      upstream.append('language', 'pt');
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: upstream });
      if (!response.ok) return NextResponse.json({ error: 'Não consegui transcrever o áudio.' }, { status: 502 });
      const data = await response.json();
      return NextResponse.json({ text: data?.text ?? '' });
    } catch {
      return NextResponse.json({ error: 'Falha ao processar o áudio.' }, { status: 500 });
    }
  }

  try {
    const body = await request.json();
    const text = typeof body?.text === 'string' ? body.text.trim().slice(0, 4096) : '';
    if (!text) return NextResponse.json({ error: 'Texto vazio.' }, { status: 400 });
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts', voice: process.env.OPENAI_TTS_VOICE || 'cedar', input: text, instructions: 'Fale em português do Brasil, com tom calmo, objetivo, sofisticado e de coach profissional.' }),
    });
    if (!response.ok) return NextResponse.json({ error: 'Não consegui gerar a voz.' }, { status: 502 });
    const audio = await response.arrayBuffer();
    return new Response(audio, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Falha ao gerar voz.' }, { status: 500 });
  }
}
