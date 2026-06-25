import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Animated, Easing, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Gamepad2, QrCode, Sparkles, UsersRound } from "lucide-react-native";

import { colors, radii, spacing } from "../theme";

type LoadingScreenProps = {
  onDone: () => void;
};

const loadingSteps = [
  { label: "Mesa pronta", Icon: UsersRound, color: colors.cyan },
  { label: "QR Code armado", Icon: QrCode, color: colors.lime },
  { label: "Jogos carregados", Icon: Sparkles, color: colors.pink }
];

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const doneTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true
        })
      ])
    );

    const bootAnimation = Animated.timing(progress, {
      toValue: 1,
      duration: 2800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    });

    pulseLoop.start();
    bootAnimation.start(({ finished }) => {
      if (finished) {
        doneTimer.current = setTimeout(onDone, 250);
      }
    });

    return () => {
      if (doneTimer.current) {
        clearTimeout(doneTimer.current);
      }
      pulseLoop.stop();
      bootAnimation.stop();
    };
  }, [doneTimer, onDone, progress, pulse]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["8%", "100%"]
  });

  const logoScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06]
  });

  const haloOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.5]
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.brandBlock}>
          <Animated.View style={[styles.halo, { opacity: haloOpacity, transform: [{ scale: logoScale }] }]} />
          <Animated.View style={[styles.logoMark, { transform: [{ scale: logoScale }] }]}>
            <Gamepad2 color={colors.ink} size={38} strokeWidth={2.8} />
          </Animated.View>
          <Text style={styles.kicker}>Playpint</Text>
          <Text style={styles.title}>A preparar a mesa</Text>
          <Text style={styles.subtitle}>
            A ligar amigos, sala e jogos para a primeira ronda.
          </Text>
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <View style={styles.loadingMeta}>
            <Text style={styles.loadingLabel}>A carregar experiencia</Text>
            <Text style={styles.loadingPercent}>rondas 15s</Text>
          </View>
        </View>

        <View style={styles.stepList}>
          {loadingSteps.map(({ label, Icon, color }) => (
            <View key={label} style={styles.stepItem}>
              <View style={[styles.stepIcon, { backgroundColor: color }]}>
                <Icon color={colors.ink} size={18} strokeWidth={2.6} />
              </View>
              <Text style={styles.stepText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl
  },
  brandBlock: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  halo: {
    backgroundColor: colors.pink,
    borderRadius: radii.full,
    height: 154,
    position: "absolute",
    top: "28%",
    width: 154
  },
  logoMark: {
    alignItems: "center",
    backgroundColor: colors.lime,
    borderRadius: radii.full,
    height: 92,
    justifyContent: "center",
    marginBottom: spacing.xl,
    width: 92
  },
  kicker: {
    color: colors.cyan,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 43,
    marginTop: spacing.sm,
    textAlign: "center"
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.md,
    maxWidth: 310,
    textAlign: "center"
  },
  progressBlock: {
    gap: spacing.sm
  },
  progressTrack: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    height: 16,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: colors.lime,
    borderRadius: radii.full,
    height: "100%"
  },
  loadingMeta: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  loadingLabel: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "800"
  },
  loadingPercent: {
    color: colors.cyan,
    fontSize: 13,
    fontWeight: "900"
  },
  stepList: {
    gap: spacing.sm,
    marginTop: spacing.lg
  },
  stepItem: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 54,
    paddingHorizontal: spacing.md
  },
  stepIcon: {
    alignItems: "center",
    borderRadius: radii.full,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  stepText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "800"
  }
});
