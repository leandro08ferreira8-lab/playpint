import type { ComponentType } from "react";

export type AppScreen = "home" | "host" | "join" | "lobby" | "modes";

export type LobbyRole = "host" | "client";

export type IconComponent = ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

export type GameModeTone = "lime" | "cyan" | "pink" | "orange";

export type GameMode = {
  id: string;
  title: string;
  description: string;
  meta: string;
  tone: GameModeTone;
  Icon: IconComponent;
};
