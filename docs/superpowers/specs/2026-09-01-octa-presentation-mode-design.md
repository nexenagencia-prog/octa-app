# OCTA — Modo de Apresentação dentro da reunião

## Objetivo
Transformar o atual fluxo de “Compartilhar tela” em um modo de apresentação integrado à reunião, permitindo apresentar arquivos PDF, JPEG e PNG com prévia privada, aprovação explícita e exibição sincronizada para todos os participantes.

## Escopo
- Disponível apenas dentro de uma reunião.
- O botão “Compartilhar tela” abre um seletor com duas opções:
  1. **Apresentação** — PDF, JPEG e PNG.
  2. **Tela ou janela** — compartilhamento tradicional do navegador/sistema.
- Não será criada biblioteca persistente de apresentações nesta fase.

## Fluxo de apresentação
1. O apresentador clica em **Compartilhar tela**.
2. Seleciona **Apresentação**.
3. Abre uma barra lateral direita com upload de PDF, JPEG ou PNG.
4. Após carregar, todos os slides/páginas aparecem empilhados verticalmente em miniaturas.
5. Ao clicar em uma miniatura, o item abre em uma prévia privada em meia tela, visível apenas para o apresentador.
6. A prévia exibe indicação clara de **“Só você está vendo”** e um botão principal **“Apresentar este slide”**.
7. Somente após essa aprovação o slide/página entra no modo público da reunião.

## Modo público
- O conteúdo aprovado ocupa a área principal da reunião em formato de apresentação.
- Todos os participantes visualizam o mesmo slide/página atual.
- Uma barra lateral de participantes fica disponível com miniaturas de vídeo empilhadas verticalmente.
- O apresentador pode mostrar ou ocultar essa barra sem interromper a apresentação.
- O apresentador mantém controles discretos de anterior, próximo, número da página e **Parar apresentação**.
- Participantes não recebem controles de navegação do apresentador.

## PDF e imagens
- **PDF:** cada página é tratada como um slide independente para miniatura, prévia e apresentação.
- **JPEG/PNG:** cada arquivo é tratado como um slide independente.
- O usuário pode carregar múltiplas imagens na mesma apresentação.
- A ordem inicial segue a ordem do upload; reordenação não faz parte desta primeira versão.

## Estados da interface
A experiência terá três estados explícitos:
1. **Biblioteca temporária da reunião** — miniaturas carregadas na lateral direita.
2. **Prévia privada** — meia tela, só o apresentador vê.
3. **Apresentação pública** — conteúdo sincronizado para toda a sala.

## Comportamentos e segurança de UX
- Nunca publicar automaticamente um arquivo ao clicar na miniatura.
- Sempre exigir ação explícita em **“Apresentar este slide”**.
- Exibir feedback visual quando o conteúdo estiver ao vivo.
- Permitir navegação por botões e teclas ← e → para o apresentador.
- ESC sai da prévia privada; não deve encerrar a reunião.
- **Parar apresentação** retorna a reunião ao layout normal.
- Fechar a barra lateral durante a prévia não publica o conteúdo.

## Integração técnica
- O fluxo deve ser incorporado aos componentes de reunião existentes em `src/features/meeting/`.
- Evitar navegação para a rota isolada `src/app/compartilhar-tela/page.tsx` quando o usuário já estiver em uma reunião.
- Integrar com `meeting-client.tsx`, `instant-meeting-client.tsx`, `livekit-stage.tsx` e `participant-stage.tsx` conforme necessário.
- Estado local cobre a prévia privada; estado sincronizado da sala cobre apenas o slide/página publicado.
- A funcionalidade deve degradar com segurança caso a camada de sincronização em tempo real esteja indisponível, sem expor conteúdo privado por engano.

## Testes mínimos
- Upload aceita PDF, JPEG e PNG e rejeita formatos não suportados.
- PDF gera uma entrada por página.
- Clique em miniatura abre prévia privada e não publica.
- “Apresentar este slide” altera o estado público.
- Próximo/anterior sincronizam a página exibida.
- Barra de participantes pode ser mostrada/ocultada.
- Parar apresentação retorna ao layout normal.
- Fluxo funciona tanto em reunião instantânea quanto em sala normal.
- Build e testes existentes devem continuar passando antes da publicação.

## Fora de escopo desta versão
- Biblioteca persistente de apresentações.
- PPT/PPTX.
- Edição de slides.
- Anotações colaborativas sobre o slide.
- Reordenação drag-and-drop.
