import { Brain, Camera, Drama, Fingerprint, ListChecks, MessageCircleQuestion } from "lucide-react-native";

import type { GameMode } from "../types";

export const gameModes: GameMode[] = [
  {
    id: "would-you-rather",
    title: "Voce Prefere",
    description: "Duas opcoes sarcasticas, votos em 15 segundos e percentagens no fim.",
    meta: "votacao",
    tone: "lime",
    Icon: MessageCircleQuestion
  },
  {
    id: "impostor",
    title: "Impostor",
    description: "Todos recebem uma palavra, menos um jogador que tem de disfarcar.",
    meta: "deducao",
    tone: "pink",
    Icon: Fingerprint
  },
  {
    id: "never-have-i-ever",
    title: "Quem Nunca",
    description: "Perguntas diretas para aquecer o grupo sem quebrar o ritmo.",
    meta: "grupo",
    tone: "cyan",
    Icon: Drama
  },
  {
    id: "truth-or-dare",
    title: "Verdade ou Consequencia",
    description: "Escolhas rapidas com consequencias definidas pela sala.",
    meta: "desafio",
    tone: "orange",
    Icon: Brain
  },
  {
    id: "stop",
    title: "Stop",
    description: "Categorias, tempo curto e comparacao de respostas no final.",
    meta: "rapidez",
    tone: "lime",
    Icon: ListChecks
  },
  {
    id: "image-draw",
    title: "Imagem",
    description: "Desenha uma pessoa do grupo numa situacao absurda e votem no melhor.",
    meta: "criativo",
    tone: "pink",
    Icon: Camera
  }
];
