# OCTA AI Skills Coach — Design

## Objetivo
Interligar reunião, transcrição, análise de performance, pontuação de Skills, evolução e um coach conversacional de IA em uma única experiência funcional.

## Experiência
- Um assistente flutuante permanece no canto inferior direito da aplicação.
- O símbolo é abstrato, digital e fluido; sem robô, cérebro, chip ou estética tech clichê.
- O painel usa preto, prata/cromado, vidro e branco, seguindo a identidade atual da OCTA.
- O coach responde perguntas sobre Skills, reuniões, evolução e como melhorar competências.
- Dentro da reunião, a IA pode mostrar insights discretos, sem cobrir o vídeo ou competir com controles.
- A análise completa é consolidada depois da reunião e alimenta Skills.

## Competências avaliadas
Comunicação, Clareza, Escuta, Objetividade, Perguntas, Argumentação e Condução.

## Modelo de análise
Cada análise contém nota 0–100, confiança/evidência, explicação curta, evidências de trechos da transcrição e recomendação prática. Se não houver evidência suficiente, a competência não recebe nota inventada.

## Fluxo de dados
Reunião → transcrição → análise IA → notas por competência → nota geral → histórico Skills → evolução → coach IA → treino sugerido.

## Persistência
A análise deve ser persistida por reunião e usuário. Skills deve consumir análises persistidas, mantendo fallback demonstrativo somente quando ainda não houver análises reais. O coach deve usar apenas contexto autorizado do usuário.

## IA
A integração de modelo fica atrás de uma rota server-side. Chaves e segredos nunca são enviados ao cliente. A rota recebe a pergunta, contexto de Skills e análises relevantes, e retorna resposta estruturada. Sem configuração de provedor, a UI deve continuar funcional com estado explicativo, sem fingir que uma resposta simulada veio de IA real.

## Reunião
Ao encerrar/processar uma reunião, a transcrição disponível é enviada para análise. A análise calcula as competências somente quando houver evidência e gera recomendações. Insights durante a chamada são opcionais e discretos; a pontuação definitiva vem da análise consolidada.

## Skills
Skills deixa de depender exclusivamente de números hardcoded. Visão geral, Transcrição, Treino e Evolução passam a poder ler a mesma fonte de análise. Cada reunião pode abrir sua leitura detalhada e explicar por que recebeu determinada pontuação.

## Coach flutuante
O coach deve aceitar perguntas livres e atalhos como “o que devo melhorar?”, “por que minha objetividade caiu?”, “compare minhas últimas reuniões” e “me dê um treino para argumentação”. O contexto enviado inclui médias, tendências, competências fracas/fortes e análises recentes.

## Privacidade e robustez
- Não avaliar competência sem evidência suficiente.
- Não expor chaves de IA no navegador.
- Não inventar transcrição ou análise quando não houver dados.
- Falha da IA não impede navegação, reunião ou visualização de Skills já salvos.
- Exibir claramente quando dados forem demonstrativos ou quando a integração de IA não estiver configurada.

## Testes
Cobrir cálculo/agregação de Skills, rejeição de evidência insuficiente, contrato das rotas de IA, montagem de contexto do coach, persistência por reunião e renderização/abertura do assistente flutuante.