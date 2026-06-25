import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../theme";

type PlayerPillProps = {
  name: string;
  status: string;
};

export function PlayerPill({ name, status }: PlayerPillProps) {
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <View style={styles.pill}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.cyan,
    borderRadius: radii.full,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  initials: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  copy: {
    paddingRight: spacing.sm
  },
  name: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  status: {
    color: colors.textSoft,
    fontSize: 12,
    marginTop: 1
  }
});
