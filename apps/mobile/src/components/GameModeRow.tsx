import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../theme";
import type { GameMode, GameModeTone } from "../types";

type GameModeRowProps = {
  mode: GameMode;
  selected: boolean;
  onPress: () => void;
};

const toneColors: Record<GameModeTone, string> = {
  lime: colors.lime,
  cyan: colors.cyan,
  pink: colors.pink,
  orange: colors.orange
};

export function GameModeRow({ mode, selected, onPress }: GameModeRowProps) {
  const accent = toneColors[mode.tone];
  const Icon = mode.Icon;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected ? { borderColor: accent, backgroundColor: colors.surfaceLift } : null,
        { opacity: pressed ? 0.84 : 1 }
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: accent }]}>
        <Icon color={colors.ink} size={22} strokeWidth={2.6} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleLine}>
          <Text style={styles.title}>{mode.title}</Text>
          <Text style={[styles.meta, { color: accent }]}>{mode.meta}</Text>
        </View>
        <Text style={styles.description}>{mode.description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 92,
    padding: spacing.md
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: radii.full,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  content: {
    flex: 1,
    gap: spacing.xs
  },
  titleLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: "900"
  },
  meta: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  description: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18
  }
});
