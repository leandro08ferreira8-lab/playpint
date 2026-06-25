import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../theme";
import type { IconComponent } from "../types";

type Tone = "primary" | "secondary" | "quiet" | "ghost";

type ActionButtonProps = {
  icon: IconComponent;
  label: string;
  helper?: string;
  tone?: Tone;
  compact?: boolean;
  onPress: () => void;
};

const toneStyles = {
  primary: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
    iconColor: colors.ink,
    labelColor: colors.ink,
    helperColor: colors.inkSoft
  },
  secondary: {
    backgroundColor: colors.surfaceLift,
    borderColor: colors.cyan,
    iconColor: colors.cyan,
    labelColor: colors.text,
    helperColor: colors.textSoft
  },
  quiet: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    iconColor: colors.pink,
    labelColor: colors.text,
    helperColor: colors.textSoft
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: colors.border,
    iconColor: colors.text,
    labelColor: colors.text,
    helperColor: colors.textSoft
  }
} as const;

export function ActionButton({
  icon: Icon,
  label,
  helper,
  tone = "primary",
  compact = false,
  onPress
}: ActionButtonProps) {
  const palette = toneStyles[tone];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact ? styles.compact : null,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          opacity: pressed ? 0.82 : 1
        }
      ]}
    >
      <View style={styles.iconSlot}>
        <Icon color={palette.iconColor} size={compact ? 18 : 24} strokeWidth={2.6} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.label, compact ? styles.compactLabel : null, { color: palette.labelColor }]}>
          {label}
        </Text>
        {helper ? <Text style={[styles.helper, { color: palette.helperColor }]}>{helper}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 74,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  compact: {
    alignSelf: "flex-start",
    minHeight: 42,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm
  },
  iconSlot: {
    alignItems: "center",
    height: 30,
    justifyContent: "center",
    width: 30
  },
  copy: {
    flex: 1,
    gap: spacing.xs
  },
  label: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  compactLabel: {
    fontSize: 14
  },
  helper: {
    fontSize: 13,
    lineHeight: 18
  }
});
