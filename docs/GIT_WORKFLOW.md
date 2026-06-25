# Playpint Git Workflow

Este ficheiro define como duas pessoas trabalham no Playpint ao mesmo tempo, em PCs diferentes, sem estragar a `main`.

## Ideia principal

A `main` e sempre a versao estavel e integrada do projeto.

Ninguem trabalha diretamente na `main`. Cada tarefa nasce numa branch propria, e so entra na `main` atraves de Pull Request.

## Responsabilidades

O Codex comanda as operacoes Git:

- ver estado do repositorio;
- atualizar branches;
- criar branches de tarefa;
- rever ficheiros alterados;
- correr lint, testes e build quando existirem;
- criar commits;
- resolver conflitos;
- preparar Pull Requests;
- limpar branches depois do merge.

Os programadores decidem o comportamento do produto quando houver duvida funcional.

## Primeira configuracao em cada PC

Cada pessoa deve ter Git instalado e acesso ao mesmo repositorio no GitHub.

Configuracao local uma vez por PC:

```bash
git config --global user.name "Nome Apelido"
git config --global user.email "email@example.com"
```

Depois de o repositorio existir no GitHub:

```bash
git clone URL_DO_REPOSITORIO
cd playpint
```

## Comecar uma tarefa

Antes de desenvolver, pedir ao Codex:

```text
Codex, comeca a tarefa feat/mobile/join-room
```

O Codex deve fazer:

```bash
git status
git checkout main
git pull origin main
git checkout -b feat/mobile/join-room
```

Exemplos de nomes:

```text
feat/mobile/join-room
feat/backend/create-room
fix/mobile/qr-permission
fix/backend/duplicate-vote
docs/game-design
chore/ci-mobile
```

## Trabalhar ao mesmo tempo

O ideal e cada pessoa trabalhar numa area diferente:

- pessoa A: `apps/mobile`;
- pessoa B: `apps/backend`;
- ambos combinam antes de alterar `packages/contracts`.

Se duas pessoas precisarem de mexer no mesmo ficheiro, devem dividir a tarefa ou avisar o Codex antes de continuar.

Regra pratica: uma branch tem uma tarefa e um dono principal.

## Guardar alteracoes

Quando uma parte estiver pronta, pedir ao Codex:

```text
Codex, mostra o que mudou e faz commit se estiver tudo certo
```

O Codex deve fazer:

```bash
git status
git diff
```

Depois valida e cria commit:

```bash
git add FICHEIROS
git commit -m "feat(mobile): add join room screen"
```

## Atualizar com o trabalho da outra pessoa

Antes de abrir Pull Request, pedir:

```text
Codex, atualiza a minha branch com a main
```

O Codex deve fazer:

```bash
git fetch origin
git rebase origin/main
```

Se houver conflitos, o Codex resolve e pede validacao humana quando a decisao afetar comportamento do produto.

## Pull Request

Quando a tarefa estiver pronta:

```text
Codex, prepara o Pull Request desta branch
```

O Pull Request deve incluir:

- o que foi alterado;
- como foi testado;
- screenshots quando for interface;
- riscos ou pontos por validar.

So fazer merge quando:

- a branch esta atualizada com `main`;
- lint, testes e build aplicaveis passam;
- a outra pessoa reviu;
- o comportamento esta aprovado.

## Depois do merge

Depois do Pull Request entrar na `main`:

```bash
git checkout main
git pull origin main
git branch -d NOME_DA_BRANCH
```

Se a branch tambem existir no GitHub, apagar a branch remota depois do merge.

## Comandos que voces devem pedir ao Codex

```text
Codex, ve o estado do Git
Codex, cria uma branch para esta tarefa
Codex, mostra o diff
Codex, faz commit das alteracoes
Codex, atualiza a branch com a main
Codex, resolve este conflito
Codex, prepara o Pull Request
Codex, limpa a branch depois do merge
```

## O que evitar

- Nao trabalhar diretamente na `main`.
- Nao misturar mobile, backend e documentacao no mesmo commit sem necessidade.
- Nao fazer `git push --force` manualmente.
- Nao resolver conflitos sem perceber o comportamento final.
- Nao guardar segredos reais em `.env`; usar `.env.example`.
