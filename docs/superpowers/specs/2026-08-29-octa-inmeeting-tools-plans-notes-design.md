# OCTA — Ferramentas em reunião, perfil, planos e anotações

## Objetivo

Evoluir a versão funcional atual da OCTA sem redesenhar o dashboard aprovado. A atualização deve preservar cores, hierarquia, estrutura da home, rotas existentes e comportamento já funcional, alterando apenas os pontos aprovados nesta etapa.

## Escopo aprovado

1. **Reuniões 100% em português**
   - Traduzir textos residuais da interface de reunião, inclusive controles do host e estados de participante.
   - Preservar layout vertical 9:16 e controles existentes.

2. **Calculadora flutuante global**
   - O item `Calculadora` da sidebar deixa de navegar para `/calculadora`.
   - Ao clicar, abre um painel flutuante sobre a tela atual, inclusive dentro de uma reunião.
   - O painel usa a calculadora funcional existente, pode ser fechado sem mudar de rota e deve manter atalhos de teclado enquanto aberto.
   - Não interromper áudio, vídeo, chat ou estado da reunião.
   - A rota `/calculadora` pode continuar existindo por compatibilidade, mas deixa de ser o fluxo principal.

3. **Filtros de vídeo durante a reunião**
   - O item `Filtros` deixa de exigir navegação para uma página separada.
   - Dentro da reunião, um botão abre um painel compacto sobre a chamada.
   - Presets próprios da OCTA: `Natural`, `Pele Suave`, `Luz de Estúdio`, `Quente`, `Frio`, `P&B`, `Cinema`.
   - Permitir controle de intensidade.
   - Nesta etapa, aplicar filtros visuais de forma local ao elemento/camada de vídeo disponível no cliente. Não copiar, importar ou depender de filtros proprietários do Instagram.
   - Se LiveKit/câmera real não estiver disponível, manter um estado de prévia local sem quebrar a reunião.

4. **Edição do próprio perfil**
   - Adicionar ícone de lápis junto ao perfil da sidebar.
   - O próprio usuário pode alterar nome e foto.
   - Sem autenticação obrigatória nesta etapa.
   - Persistir localmente no navegador como fallback; se Supabase estiver configurado e houver sessão, sincronização pode ser adicionada sem bloquear o fluxo local.

5. **Planos e preços em reais**
   - Novo item de menu `Planos e preços` e nova rota `/planos`.
   - Três níveis: `Grátis — R$ 0`, `Pro — R$ 69,90/mês`, `Business — R$ 109,90/mês`.
   - Visual consistente com os cards e componentes atuais da OCTA, sem redesenhar a aplicação.
   - Sem checkout, Stripe, Mercado Pago ou cobrança real nesta etapa.
   - CTA pode indicar escolha/upgrade, mas não deve fingir que uma compra foi concluída.

6. **Anotar + Minhas Anotações**
   - `Anotar` continua sendo acesso rápido durante a reunião.
   - Criar `Minhas Anotações` na sidebar e rota própria `/minhas-anotacoes`.
   - Biblioteca em cards compactos com título, data, reunião relacionada, busca e abertura do conteúdo completo.
   - Notas rápidas da reunião devem poder ser salvas com um título e aparecer nessa biblioteca.
   - Persistência local nesta etapa; manter estrutura simples para futura migração ao Supabase.

7. **Contatos mais compactos**
   - Reduzir altura, padding e espaços vazios dos cards.
   - Mostrar mais contatos na mesma área sem alterar a identidade visual.
   - Manter busca e ações de reunião/chat.

8. **Correções de imagem**
   - Corrigir apenas o enquadramento da imagem que está cortando no canto inferior direito.
   - Substituir o astronauta atual por uma versão em maior resolução mantendo composição, posição e linguagem visual atuais.
   - Não alterar a estrutura da sessão nem criar novo layout.

## Arquitetura

### Overlay global de ferramentas

Criar um pequeno contexto/controlador de ferramentas no `AppShell` para abrir e fechar painéis globais sem trocar de rota. A sidebar dispara eventos para `calculator` e `filters`; o shell renderiza o overlay correspondente acima do conteúdo atual. O mesmo controlador pode ser usado dentro da reunião para abrir a calculadora e filtros sem perder estado da chamada.

### Ferramentas da reunião

`MeetingClient` recebe controles adicionais para calculadora e filtros. O estado da reunião permanece no componente atual; overlays são renderizados por cima. Os filtros não devem recriar a sala nem desmontar a árvore LiveKit.

### Perfil

Criar um pequeno editor modal/painel para nome e foto. Os dados são centralizados em um hook/store leve baseado em `localStorage` para que sidebar e telas que exibem o usuário reflitam a alteração imediatamente.

### Anotações

Introduzir um módulo de persistência local com uma estrutura única:

```ts
export type SavedNote = {
  id: string;
  title: string;
  content: string;
  roomSlug?: string;
  meetingTitle?: string;
  createdAt: string;
  updatedAt: string;
};
```

O painel rápido da reunião escreve nesse armazenamento e a página `/minhas-anotacoes` lê, busca e abre os registros.

### Planos

Dados de planos ficam em um módulo estático único para evitar divergência de preço entre menu, cards e futuros CTAs.

## Arquivos esperados

- Modificar `src/components/app-shell.tsx`
- Modificar `src/components/nav.tsx`
- Modificar `src/components/calculator-panel.tsx`
- Modificar `src/features/meeting/meeting-client.tsx`
- Modificar `src/features/notes/notes-panel.tsx`
- Modificar `src/app/contatos/page.tsx`
- Modificar `src/app/globals.css`
- Criar `src/components/tool-overlay.tsx`
- Criar `src/components/video-filter-panel.tsx`
- Criar `src/components/profile-editor.tsx`
- Criar `src/lib/profile-store.ts`
- Criar `src/lib/notes-store.ts`
- Criar `src/lib/plans.ts`
- Criar `src/app/minhas-anotacoes/page.tsx`
- Criar `src/app/planos/page.tsx`
- Atualizar testes de contrato e criar testes unitários para stores/dados.

## Estados de erro e compatibilidade

- Navegadores sem APIs de mídia continuam carregando a interface; filtros ficam em prévia visual quando não houver stream utilizável.
- Falha em `localStorage` não pode derrubar a página; usar estado em memória como fallback.
- Painéis flutuantes devem ter botão claro de fechar e não capturar permanentemente o teclado quando fechados.
- Não remover as rotas existentes nem quebrar URLs já usadas.
- Nenhuma alteração desta etapa pode tornar login obrigatório.

## Testes e verificação

- Teste de contrato: `Calculadora` e `Filtros` da sidebar não navegam como fluxo principal e abrem overlays.
- Teste de calculadora existente continua passando.
- Teste de presets valida os sete nomes e valores estáveis.
- Teste de planos valida preços `0`, `69.90` e `109.90` em BRL.
- Teste de notas valida criar, atualizar, listar e buscar.
- Teste de perfil valida persistência de nome e foto no fallback local.
- Teste de rotas valida `/planos` e `/minhas-anotacoes`.
- Teste de reunião verifica ausência dos rótulos residuais em inglês.
- `git diff --check` e build de produção quando dependências estiverem disponíveis.

## Fora do escopo

- Autenticação obrigatória.
- Cobrança real.
- Importação de filtros do Instagram ou terceiros proprietários.
- IA de beleza/retouching avançado.
- Mudança de design da home.
- Redesenho de cores, tipografia, sidebar ou layout já aprovado.
