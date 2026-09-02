# OCTA Meeting Intelligence — Design

## Goal
Transformar a OCTA em uma plataforma de inteligência de reuniões, com análise pós-reunião baseada em evidências, coaching contextual, histórico de evolução e modo gratuito por padrão.

## Architecture
1. **Deterministic analytics first:** métricas objetivas são calculadas em código a partir de transcrição, segmentos, chat, notas e metadados. Isso cobre participação, tempo de fala, perguntas, interrupções, decisões, tarefas, repetição, mudanças de assunto e produtividade sem custo de IA.
2. **Optional generative enrichment:** OpenAI/Vercel AI Gateway só é usado quando `OCTA_AI_MODE=generative`. O padrão é `free`, sem chamadas pagas. O enriquecimento nunca substitui evidência nem inventa fatos.
3. **Persistent intelligence:** `meeting_skill_analyses` armazena análise consolidada, hash de origem, versão e configurações do relatório. Resultados idênticos podem ser reaproveitados.
4. **Profile single source of truth:** `public.profiles.display_name` é a fonte oficial; localStorage é cache de UI.

## Meeting Score
O score 0–100 usa dimensões: comunicação, liderança, objetividade, gestão do tempo, colaboração, engajamento, persuasão, organização e produtividade. Dimensões sem evidência suficiente ficam nulas e não entram na média.

## Evidence policy
Toda conclusão deve ser suportada por métricas ou trechos da reunião. Conflito/tensão só é sinalizado como tendência linguística quando houver termos explícitos; nunca como diagnóstico emocional.

## Free mode
`OCTA_AI_MODE` ausente ou diferente de `generative` ativa modo gratuito. O coach usa respostas determinísticas baseadas nas análises salvas. A interface continua funcional quando não há crédito/chave de provedor.

## 429 strategy
Quando o modo generativo estiver ativo, erros 429 são classificados em `quota_exhausted` ou `rate_limited`. Apenas rate limit transitório é reexecutado, respeitando `Retry-After` e backoff curto. Quota esgotada não é reexecutada. 5xx tem retry limitado. Nenhum loop infinito.

## Security
RLS permanece ativo. APIs de perfil e histórico exigem usuário autenticado. Dados da reunião não são enviados ao provedor no modo gratuito. Exclusão permanente permanece compatível com o vínculo por usuário/reunião.

## Delivery constraint
Um único commit deve chegar à `main`, para gerar no máximo um deploy de produção no Vercel para esta fase.