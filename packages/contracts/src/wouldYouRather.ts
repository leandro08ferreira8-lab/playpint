export type WouldYouRatherOptionId = "A" | "B";

export interface WouldYouRatherQuestion {
  id: string;
  prompt: string;
  optionA: string;
  optionB: string;
  intensity: "light" | "medium" | "spicy";
  tags: string[];
}

export interface WouldYouRatherVoteRequest {
  roomId: string;
  roundId: string;
  playerId: string;
  optionId: WouldYouRatherOptionId;
}

export interface WouldYouRatherRoundStartedEvent {
  type: "game:would_you_rather_round_started";
  roomId: string;
  roundId: string;
  question: WouldYouRatherQuestion;
  startsAt: string;
  endsAt: string;
}

export interface WouldYouRatherOptionResult {
  optionId: WouldYouRatherOptionId;
  voteCount: number;
  percentage: number;
  nicknames: string[];
}

export interface WouldYouRatherRoundResultEvent {
  type: "game:would_you_rather_round_result";
  roomId: string;
  roundId: string;
  results: WouldYouRatherOptionResult[];
  pointsByPlayerId: Record<string, number>;
}
