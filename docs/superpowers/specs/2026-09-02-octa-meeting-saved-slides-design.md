# OCTA Meeting Saved Slides Integration — Design

## Goal
Integrar os decks salvos em Criar Slides à aba Criar reunião sem acoplar o editor ao modo de reunião, corrigir as miniaturas do editor e tornar a apresentação Full HD prática para adicionar ou remover slides.

## Approved UX
- Criar Slides volta a mostrar miniaturas reais: background, texto, formas, fotos e degradês.
- Criar reunião exibe um card de slides com imagem 16:9 inteira (`object-contain`) e título sobreposto.
- O card oferece `Escolher apresentação salva`, listando decks locais com capa real, título e quantidade de slides.
- Ao escolher um deck, cada página é rasterizada localmente em 1920×1080 e convertida em `PresentationSlide`.
- O modo de apresentação continua aceitando PDF/JPEG/PNG e ganha ações para adicionar arquivos e remover slides, inclusive durante a apresentação em tela cheia.
- Remover um slide afeta somente a reunião atual; o deck original permanece intacto.

## Architecture
O IndexedDB `octa-slide-studio` continua sendo a única fonte persistente dos decks. `local-slide-studio.ts` passa a oferecer um renderer Canvas de `SlidePage` para data URL, incluindo imagens, texto, formas, degradês e opacidade. `InstantMeetingClient` lê `listDecks()`, renderiza decks escolhidos para Full HD e mantém os slides atuais da reunião em estado local. `PresentationMode` recebe e devolve alterações via `onSlidesChange`.

## Scope
Modificar apenas Criar Slides, renderer/modelo local de slides, InstantMeetingClient, PresentationMode e testes relacionados. Não alterar Home, Agenda, Skills, gravações, sidebar ou demais módulos.

## Deployment constraint
Montar e verificar tudo em commits Git destacados sem atualizar refs públicas. Atualizar `main` uma única vez após verificação para produzir um único deploy final de produção.
