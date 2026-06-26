import type { WouldYouRatherQuestion } from "../../../../../packages/contracts/src";

export const WOULD_YOU_RATHER_QUESTIONS: readonly WouldYouRatherQuestion[] = [
  {
    id: "wyr_001",
    prompt: "Preferias controlar a musica da noite ou escolher todos os jogos?",
    optionA: "Controlar a musica e ser julgado em silencio",
    optionB: "Escolher os jogos e ser culpado por tudo",
    intensity: "light",
    tags: ["party", "host"],
  },
  {
    id: "wyr_002",
    prompt: "Preferias ganhar sempre mas explicar as regras, ou perder sempre sem stress?",
    optionA: "Ganhar e virar professor substituto",
    optionB: "Perder e fingir que era estrategia",
    intensity: "light",
    tags: ["games", "ego"],
  },
  {
    id: "wyr_003",
    prompt: "Preferias mostrar o teu historico de pesquisa ou as ultimas 20 mensagens?",
    optionA: "Historico de pesquisa em ecra gigante",
    optionB: "Mensagens lidas em voz alta",
    intensity: "spicy",
    tags: ["social", "awkward"],
  },
  {
    id: "wyr_004",
    prompt: "Preferias ser sempre o primeiro a responder ou nunca saber quando e a tua vez?",
    optionA: "Primeiro, com confianca injustificada",
    optionB: "Perdido, mas com misterio",
    intensity: "medium",
    tags: ["timing", "group"],
  },
  {
    id: "wyr_005",
    prompt: "Preferias que o teu avatar fosse sempre perfeito ou sempre demasiado honesto?",
    optionA: "Perfeito e suspeito",
    optionB: "Honesto e perigoso",
    intensity: "medium",
    tags: ["avatar", "camera"],
  },
  {
    id: "wyr_006",
    prompt: "Preferias escolher a consequencia do ultimo lugar ou nunca poder fugir dela?",
    optionA: "Escolher e criar inimigos",
    optionB: "Aceitar e sofrer com dignidade",
    intensity: "medium",
    tags: ["punishment", "final"],
  },
];
