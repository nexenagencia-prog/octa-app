# OCTA — Functional Meeting App

OCTA is a vertical-first meeting application with a fixed desktop workspace, collapsible sidebar, functional navigation, meeting room, agenda, contacts, recordings, browser tools and a LiveKit/Supabase-ready foundation.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase-ready Auth/Postgres/Realtime/Storage schema
- LiveKit-ready video/audio routes
- Vercel deployment

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Without environment variables the app opens in demo mode. Authentication is **not required in this phase**; the existing `/login` route remains available for the later Supabase Auth phase.

## Functional navigation

- `/` — Início / dashboard
- `/agenda` — visual agenda + local scheduling flow
- `/reunioes` — meeting list/search + join/create actions
- `/contatos` — searchable contacts + instant meeting/chat actions
- `/gravacoes` — recording/replay dashboard
- `/calculadora` — working calculator with keyboard support
- `/filtros` — local visual filter preview
- `/compartilhar-tela` — browser screen sharing
- `/gravar` — local camera/microphone recording when supported
- `/mutar` — microphone permission and mute control
- `/chat` — chat enable/disable + functional local preview messages
- `/printar-tela` — browser capture/print workflow
- `/anotacoes` — notes with local persistence
- `/configuracoes` — local interface preferences
- `/library` — existing replay library
- `/profile` — existing profile editor
- `/room/strategy-room` — existing meeting room

## Sidebar

The desktop sidebar expands and collapses without changing the approved design. Its state is stored in `localStorage` under `octa-sidebar-collapsed`, so the chosen width persists after refresh.

## Desktop viewport behavior

The main application shell uses `100dvh` and avoids document-level vertical scrolling on desktop. The home layout and functional pages use bounded panels/grids so the interface stays inside the browser viewport. Smaller screens switch back to normal responsive document flow for usability.

## Connect Supabase later

1. Create a Supabase project.
2. Run `supabase/migrations/202608290001_okta_mvp.sql` in SQL Editor.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
4. Configure the desired Auth providers when the login phase starts.

## Connect LiveKit later

1. Create a LiveKit Cloud project.
2. Add `NEXT_PUBLIC_LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` in Vercel.
3. `/api/livekit/token` provides room tokens and `/api/livekit/moderate` keeps the existing moderation integration point.

## Deploy with the existing GitHub + Vercel project

Replace the files in the existing GitHub repository and commit them. Vercel will detect the new commit and deploy automatically. Do not create another Vercel project.


## OCTA Visual CMS

O painel visual fica em `/admin` e usa a mesma autenticação Supabase do app. Para liberar somente a conta administradora, depois de criar/entrar com a conta, adicione o UUID desse usuário à tabela `public.cms_admins`:

```sql
insert into public.cms_admins(user_id) values ('UUID_DO_ADMIN') on conflict do nothing;
```

O CMS salva rascunhos e versões publicadas em `public.cms_revisions` e envia fotos/vídeos para o bucket `cms-assets`. Usuários normais leem somente a última versão publicada e não têm permissão para criar ou publicar revisões.

## OCTA AI Coach
O coach global usa OpenAI exclusivamente pelo servidor. Configure `OPENAI_API_KEY` na Vercel para ativar respostas reais, transcrição e voz. Sem a chave, a interface entra em modo demonstração com os resultados atuais do OCTA Skills. Variáveis opcionais: `OPENAI_CHAT_MODEL`, `OPENAI_TRANSCRIBE_MODEL`, `OPENAI_TTS_MODEL` e `OPENAI_TTS_VOICE`.
