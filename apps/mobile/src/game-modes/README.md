# Game modes

Esta pasta contem a configuracao e os dados usados pela app mobile para mostrar e organizar os modos de jogo.

## Regras desta area

- O mobile pode decidir como mostrar o jogo, mas nao decide o resultado oficial.
- IDs de jogos e eventos partilhados devem vir de `packages/contracts`.
- Perguntas locais podem existir aqui enquanto o backend ainda nao fornece conteudo.
- Cada jogo deve ter uma pasta propria quando precisar de dados, componentes ou fluxo especifico.

## Primeiro foco

O primeiro jogo integrado do MVP e `would_you_rather`.

Fluxo esperado no mobile:

1. Mostrar pergunta e duas opcoes.
2. Enviar voto para o backend.
3. Bloquear segundo voto.
4. Mostrar estado de voto enviado.
5. Receber resultado oficial.
6. Mostrar percentagens e nicknames por opcao.

## Modos registados

- `would_you_rather`
- `impostor`
- `quiz`
- `never_have_i_ever`
- `truth_or_dare`
- `stop`
- `most_likely`
- `draw_the_player`
- `memory_pose`
