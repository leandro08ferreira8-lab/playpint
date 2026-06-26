import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Sparkles, UsersRound, Vote } from "lucide-react-native";

import { colors, radii, spacing } from "../theme";

const barBackground = require("../../assets/bar-table-background.png");
const playpintLogo = require("../../assets/playpint-logo-cutout.png");

type LoadingScreenProps = {
  onDone: () => void;
};

const loadingSteps = [
  { label: "Mesa", Icon: UsersRound },
  { label: "Votos", Icon: Vote },
  { label: "Ronda", Icon: Sparkles }
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
          duration: 1050,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1050,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true
        })
      ])
    );

    const bootAnimation = Animated.timing(progress, {
      toValue: 1,
      duration: 2600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    });

    pulseLoop.start();
    bootAnimation.start(({ finished }) => {
      if (finished) {
        doneTimer.current = setTimeout(onDone, 260);
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
    outputRange: ["12%", "100%"]
  });

  const logoScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.03]
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.42, 0.82]
  });

  return (
    <ImageBackground source={barBackground} resizeMode="cover" style={styles.background}>
      <StatusBar style="light" />
      <View pointerEvents="none" style={styles.scrim} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.brandBlock}>
            <Animated.View style={[styles.logoGlow, { opacity: glowOpacity }]} />
            <Animated.Image
              source={playpintLogo}
              resizeMode="contain"
              style={[styles.logoImage, { transform: [{ scale: logoScale }] }]}
            />
            <Text style={styles.title}>A preparar a mesa</Text>
            <Text style={styles.subtitle}>Perguntas, votos e ronda quase prontos.</Text>
          </View>

          <View style={styles.loadingPanel}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <View style={styles.loadingMeta}>
              <Text style={styles.loadingLabel}>A aquecer o Es Tu?</Text>
              <Text style={styles.loadingPercent}>Playpint</Text>
            </View>
            <View style={styles.stepRow}>
              {loadingSteps.map(({ label, Icon }) => (
                <View key={label} style={styles.stepChip}>
                  <Icon color={colors.gold} size={17} strokeWidth={3} />
                  <Text style={styles.stepText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 4, 3, 0.56)"
  },
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.xxl
  },
  brandBlock: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: spacing.xl
  },
  logoGlow: {
    backgroundColor: colors.orange,
    borderRadius: radii.full,
    height: 180,
    position: "absolute",
    top: "29%",
    width: 250
  },
  logoImage: {
    height: 220,
    marginBottom: spacing.lg,
    width: "112%"
  },
  title: {
    color: colors.cream,
    fontSize: 39,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 44,
    textAlign: "center",
    textShadowColor: colors.ink,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 0
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 24,
    marginTop: spacing.sm,
    maxWidth: 310,
    textAlign: "center"
  },
  loadingPanel: {
    backgroundColor: "rgba(16, 11, 5, 0.82)",
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  progressTrack: {
    backgroundColor: "rgba(255, 245, 221, 0.16)",
    borderColor: colors.borderSoft,
    borderRadius: radii.full,
    borderWidth: 1,
    height: 18,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: colors.gold,
    borderRadius: radii.full,
    height: "100%"
  },
  loadingMeta: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  loadingLabel: {
    color: colors.cream,
    flex: 1,
    fontSize: 14,
    fontWeight: "900"
  },
  loadingPercent: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  stepRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  stepChip: {
    alignItems: "center",
    backgroundColor: "rgba(255, 194, 58, 0.1)",
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: spacing.sm
  },
  stepText: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: "900"
  }
});
