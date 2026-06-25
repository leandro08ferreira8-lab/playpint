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

## Fluxo no GitKraken

O GitKraken e apenas a interface visual para o mesmo Git. A regra continua igual: `main` e estavel, trabalho novo acontece em branches, e a integracao acontece por Pull Request.

### Abrir o projeto certo

Cada pessoa deve abrir ou clonar o mesmo repositorio:

```text
https://github.com/leandro08ferreira8-lab/playpint.git
```

No PC do Santiago, a pasta correta neste momento e:

```text
C:\Users\Santiago\Desktop\Playpint\playpint
```

Nao abrir a pasta de fora `C:\Users\Santiago\Desktop\Playpint`, porque ela ficou como repositorio local separado durante a configuracao inicial.

### Comecar uma tarefa

1. Selecionar a branch `main`.
2. Clicar em `Pull`.
3. Criar uma branch nova a partir da `main`.
4. Usar nomes como `feat/mobile/join-room` ou `feat/backend/create-room`.
5. Trabalhar sempre nessa branch.

### Fazer commit

1. Ver os ficheiros em `Unstaged Files`.
2. Abrir o diff de cada ficheiro alterado.
3. Passar para `Staged Files` apenas os ficheiros daquela tarefa.
4. Escrever uma mensagem objetiva, por exemplo `feat(mobile): add join room screen`.
5. Clicar em `Commit changes`.

### Partilhar trabalho

1. Clicar em `Push`.
2. Publicar a branch remota quando o GitKraken pedir.
3. Abrir Pull Request no GitHub.
4. O outro programador faz review antes do merge.

### Ver trabalho da outra pessoa

1. Clicar em `Fetch`.
2. Ver as branches remotas novas no grafo.
3. Para trazer alteracoes ja aprovadas, selecionar `main` e clicar em `Pull`.

O GitKraken nao mostra edicao em tempo real como um documento partilhado. O trabalho do outro aparece quando ele faz `Push`, abre branch, ou cria Pull Request.

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
