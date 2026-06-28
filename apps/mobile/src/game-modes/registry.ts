import type {
  GameModeDefinition,
  GameModeId,
} from "../../../../packages/contracts/src";

export const GAME_MODE_CATALOG: readonly GameModeDefinition[] = [
  {
    id: "would_you_rather",
    title: "Voce Prefere",
    shortTitle: "Prefere",
    category: "choice",
    description:
      "Perguntas com duas opcoes sarcasticas, voto rapido e resultados por percentagem.",
    rules: {
      minPlayers: 2,
      defaultRoundSeconds: 30,
      votingSeconds: 15,
      requiresHostModeration: false,
    },
    phases: ["intro", "prompt", "answer", "vote", "result"],
    usesCamera: false,
    usesDrawing: false,
    usesSensors: false,
    enabledForMvp: true,
  },
  {
    id: "impostor",
    title: "Impostor",
    shortTitle: "Impostor",
    category: "deduction",
    description:
      "Todos recebem uma palavra menos o impostor, que tenta descobrir e disfarcar.",
    rules: {
      minPlayers: 4,
      defaultRoundSeconds: 120,
      votingSeconds: 30,
      requiresHostModeration: true,
    },
    phases: ["intro", "prompt", "discussion", "vote", "result"],
    usesCamera: false,
    usesDrawing: false,
    usesSensors: false,
    enabledForMvp: true,
  },
  {
    id: "quiz",
    title: "Quiz",
    shortTitle: "Quiz",
    category: "quiz",
    description:
      "Perguntas polemicas e rapidas para gerar conversa depois da resposta.",
    rules: {
      minPlayers: 2,
      defaultRoundSeconds: 25,
      votingSeconds: 15,
      requiresHostModeration: false,
    },
    phases: ["intro", "prompt", "answer", "result"],
    usesCamera: false,
    usesDrawing: false,
    usesSensors: false,
    enabledForMvp: false,
  },
  {
    id: "never_have_i_ever",
    title: "Quem Nunca",
    shortTitle: "Quem Nunca",
    category: "confession",
    description:
      "Ronda social de revelacoes leves, com resultado mostrado ao grupo.",
    rules: {
      minPlayers: 3,
      defaultRoundSeconds: 30,
      votingSeconds: 15,
      requiresHostModeration: true,
    },
    phases: ["intro", "prompt", "answer", "result"],
    usesCamera: false,
    usesDrawing: false,
    usesSensors: false,
    enabledForMvp: false,
  },
  {
    id: "truth_or_dare",
    title: "Verdade ou Consequencia",
    shortTitle: "Verdade",
    category: "confession",
    description:
      "Um jogador recebe uma pergunta ou desafio aprovado para ambiente de grupo.",
    rules: {
      minPlayers: 3,
      defaultRoundSeconds: 60,
      requiresHostModeration: true,
    },
    phases: ["intro", "prompt", "discussion", "result"],
    usesCamera: false,
    usesDrawing: false,
    usesSensors: false,
    enabledForMvp: false,
  },
  {
    id: "stop",
    title: "Stop",
    shortTitle: "Stop",
    category: "quiz",
    description:
      "Categorias e letra sorteada; os jogadores respondem contra o tempo.",
    rules: {
      minPlayers: 2,
      defaultRoundSeconds: 60,
      votingSeconds: 20,
      requiresHostModeration: true,
    },
    phases: ["intro", "prompt", "answer", "vote", "result"],
    usesCamera: false,
    usesDrawing: false,
    usesSensors: false,
    enabledForMvp: false,
  },
  {
    id: "most_likely",
    title: "Es Tu?",
    shortTitle: "Es Tu?",
    category: "choice",
    description:
      "O grupo vota em quem e mais provavel fazer a situacao apresentada.",
    rules: {
      minPlayers: 3,
      defaultRoundSeconds: 30,
      votingSeconds: 15,
      requiresHostModeration: false,
    },
    phases: ["intro", "prompt", "vote", "result"],
    usesCamera: false,
    usesDrawing: false,
    usesSensors: false,
    enabledForMvp: true,
  },
  {
    id: "draw_the_player",
    title: "Desenha o Jogador",
    shortTitle: "Desenho",
    category: "creative",
    description:
      "Aparece um jogador e um tema; todos desenham e depois votam no melhor.",
    rules: {
      minPlayers: 3,
      defaultRoundSeconds: 60,
      votingSeconds: 20,
      requiresHostModeration: false,
    },
    phases: ["intro", "prompt", "answer", "vote", "result"],
    usesCamera: true,
    usesDrawing: true,
    usesSensors: false,
    enabledForMvp: false,
  },
  {
    id: "memory_pose",
    title: "Imita a Imagem",
    shortTitle: "Imita",
    category: "sensor",
    description:
      "Os jogadores imitam uma imagem ou pose e o grupo vota na melhor tentativa.",
    rules: {
      minPlayers: 3,
      defaultRoundSeconds: 45,
      votingSeconds: 20,
      requiresHostModeration: true,
    },
    phases: ["intro", "prompt", "answer", "vote", "result"],
    usesCamera: true,
    usesDrawing: false,
    usesSensors: true,
    enabledForMvp: false,
  },
] as const;

export const MVP_GAME_MODE_IDS = GAME_MODE_CATALOG.filter(
  (mode) => mode.enabledForMvp,
).map((mode) => mode.id);

export function getGameModeDefinition(
  gameModeId: GameModeId,
): GameModeDefinition | undefined {
  return GAME_MODE_CATALOG.find((mode) => mode.id === gameModeId);
}

export function getEnabledGameModes(): GameModeDefinition[] {
  return GAME_MODE_CATALOG.filter((mode) => mode.enabledForMvp);
}
