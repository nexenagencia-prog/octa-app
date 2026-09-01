# OCTA Live Strategic AI — Design

## Objetivo
Transformar a reunião em uma experiência assistida em tempo real para o dono da conta, com transcrição estratégica, alertas privados automáticos, assistente inteligente e indicadores visuais de engajamento, alimentando o Skills após a chamada.

## Regras de privacidade
- Insights, notas, alertas e recomendações aparecem somente para o usuário dono da conta.
- Participantes não veem os alertas privados do usuário.
- Leitura visual só é ativada quando houver consentimento explícito dos participantes.
- O sistema não afirma emoções nem “desinteresse” como fato; usa termos como “queda provável de engajamento visual”.
- Nenhuma identificação biométrica é criada; sinais visuais são usados como indicadores transitórios da reunião.

## Fluxo ao vivo
1. Capturar transcrição contínua no navegador quando disponível.
2. Gerar sinais locais de comunicação (fala longa, baixa objetividade, ausência de perguntas, boa estrutura, chamadas para ação).
3. Exibir cards privados automáticos e temporários durante a reunião.
4. Quando a leitura visual estiver autorizada, analisar elementos de vídeo disponíveis no cliente com APIs do navegador, sem reconhecimento de identidade.
5. Cruzar transcrição e sinais visuais em uma rota de IA para gerar recomendações estratégicas.
6. Ao finalizar/analisar, salvar evidências e métricas para o Skills.

## Competências Skills
Comunicação, Clareza, Escuta, Objetividade, Perguntas, Argumentação e Condução.

## Experiência do usuário
- Um ícone flutuante “OCTA AI” permanece dentro da reunião.
- Cards surgem automaticamente acima do dock sem exigir clique.
- O painel do ícone mostra transcrição recente, insights, status de consentimento visual e ações sugeridas.
- Depois da reunião, Skills mostra pontos fortes, pontos fracos, exemplos/evidências, recomendações e evolução.

## Limites técnicos do MVP
- SpeechRecognition depende do navegador; quando indisponível, o usuário pode colar texto.
- Indicadores visuais dependem de elementos de vídeo e da disponibilidade de FaceDetector. Sem suporte, a funcionalidade é desativada de forma transparente.
- O MVP mede presença/consistência visual, não emoções, intenção ou estado mental.
