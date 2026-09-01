# OCTA Product Review Refinement Design

## Goal
Refinar a experiência atual da OCTA sem redesenhar o produto aprovado, corrigindo inconsistências remanescentes de conteúdo, navegação e utilidade percebida.

## Constraints
- Preservar o layout e a identidade já aprovados.
- Manter preto, branco e prata/cinza líquido como linguagem principal; não introduzir azul como cor de destaque.
- Não criar mockup, projeto paralelo ou reestruturação desnecessária.
- Reaproveitar componentes, stores e rotas existentes.
- Não duplicar funcionalidades que já foram implementadas recentemente.

## Scope
1. Manter a navegação consolidada atual, sem itens duplicados.
2. Transformar `/chat` em OCTA AI de verdade, com ações úteis sobre reuniões, mantendo apenas uma área de prompt/conversa.
3. Corrigir `/gravacoes` para não fabricar registros duplicados e enriquecer cada gravação com ações de replay, análise, transcrição e compartilhamento.
4. Melhorar `/contatos` com contexto de última interação e atalhos claros para reunião, agenda, e-mail e WhatsApp.
5. Expandir `/configuracoes` com categorias de conta/plano, áudio/vídeo, IA, privacidade e notificações sem criar backend falso.
6. Preservar a Lousa existente e sua toolbar avançada, ajustando apenas integração/overflow via estilos existentes se necessário.
7. Preservar Skills e suas animações atuais.
8. Manter Home com Plano Pro visível e hierarquia atual, ajustando apenas copy/atalhos inconsistentes.

## Acceptance
- Build TypeScript/Next.js sem erro.
- Nenhuma lista de gravações duplicada artificialmente.
- `/chat` identifica-se como OCTA AI e apresenta ações relacionadas a reuniões.
- Configurações expõem categorias essenciais sem prometer integrações inexistentes.
- A navegação permanece funcional e sem duplicação visual.
