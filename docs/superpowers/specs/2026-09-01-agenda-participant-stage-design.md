# Agenda e Palco Inteligente de Participantes — Design

## Objetivo
Corrigir a Agenda para calendário brasileiro real e evoluir a Reunião Instantânea para manter o vídeo do anfitrião fixo à esquerda e uma segunda área dinâmica de participantes à direita.

## Agenda
- Calendário real em pt-BR, com segunda-feira como primeiro dia útil visual e cálculo correto de 28/29/30/31 dias.
- Navegação de mês também altera o ano ao atravessar janeiro/dezembro.
- Data selecionada usa acabamento prata líquido/cromado, sem azul.
- Nova reunião herda a data selecionada.
- Reuniões criadas aparecem somente na data correspondente.

## Reunião instantânea
- O vídeo do anfitrião permanece fixo à esquerda, 9:16, independentemente de quem fala ou de quem é selecionado.
- A segunda área à direita é o palco de participantes e pode ser expandida ou encolhida pelo anfitrião.
- Modo mosaico exibe vários participantes em composição visual inspirada no anexo fornecido, com rolagem vertical para revelar mais pessoas.
- Clicar em um participante coloca somente esse participante em destaque na segunda área; o vídeo do anfitrião não muda.

## Destaque por voz
- Com destaque automático ligado, o participante que começar a falar assume a segunda área principal.
- Ao parar de falar, ele continua em destaque; não há retorno automático ao mosaico.
- O destaque só muda quando outro participante começa a falar.
- O anfitrião pode desligar/ligar o destaque automático por voz.
- O anfitrião pode bloquear manualmente um participante em destaque. Enquanto bloqueado, outros falantes não substituem essa pessoa. Ao desbloquear, a automação volta a poder escolher o próximo falante.

## Integração técnica
- Quando LiveKit estiver disponível, o estado de active speaker deve ser derivado dos eventos/estado do LiveKit, não de temporizadores simulados.
- No fallback demo, a interface deve continuar funcional para seleção manual, mosaico, expansão/recolhimento e bloqueio, sem fingir detecção real de voz.
- Preservar chat integrado, controles, filtros, notas, lousa, OCTA AI e demais recursos existentes.

## Validação
- Testes de calendário cobrem fevereiro bissexto, início do mês, mudança de ano e data selecionada.
- Testes de palco cobrem anfitrião fixo, troca pelo próximo active speaker, persistência do último falante e bloqueio/desbloqueio.
- Build completo deve passar antes da publicação em produção.