export const GAME_MODE_IDS = [
  "would_you_rather",
  "impostor",
  "quiz",
  "never_have_i_ever",
  "truth_or_dare",
  "stop",
  "most_likely",
  "draw_the_player",
  "memory_pose",
] as const;

export type GameModeId = (typeof GAME_MODE_IDS)[number];

export type GameModeCategory =
  | "choice"
  | "deduction"
  | "quiz"
  | "confession"
  | "creative"
  | "sensor";

export type RoundStatus = "preparing" | "active" | "voting" | "result";

export type GameModePhase =
  | "intro"
  | "prompt"
  | "answer"
  | "discussion"
  | "vote"
  | "result";

export interface GameModeRules {
  minPlayers: number;
  maxPlayers?: number;
  defaultRoundSeconds: number;
  votingSeconds?: number;
  requiresHostModeration: boolean;
}

export interface GameModeDefinition {
  id: GameModeId;
  title: string;
  shortTitle: string;
  category: GameModeCategory;
  description: string;
  rules: GameModeRules;
  phases: GameModePhase[];
  usesCamera: boolean;
  usesDrawing: boolean;
  usesSensors: boolean;
  enabledForMvp: boolean;
}

export interface RoundClock {
  startsAt: string;
  endsAt: string;
}

export interface GameRoundState {
  id: string;
  gameSessionId: string;
  gameMode: GameModeId;
  status: RoundStatus;
  prompt: string;
  subjectPlayerId?: string;
  clock: RoundClock;
}
