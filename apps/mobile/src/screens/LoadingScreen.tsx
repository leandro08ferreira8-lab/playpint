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

import { colors, radii, spacing } from "../theme";

const barBackground = require("../../assets/bar-table-background.png");
const playpintLogo = require("../../assets/playpint-logo-cutout.png");

type LoadingScreenProps = {
  onDone: () => void;
};

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
      duration: 6000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    });

    pulseLoop.start();
    bootAnimation.start(({ finished }) => {
      if (finished) {
        doneTimer.current = setTimeout(onDone, 600);
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

  return (
    <ImageBackground source={barBackground} resizeMode="cover" style={styles.background}>
      <StatusBar style="light" />
      <View pointerEvents="none" style={styles.scrim} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.brandBlock}>
            <Animated.Image
              source={playpintLogo}
              resizeMode="contain"
              style={[styles.logoImage, { transform: [{ scale: logoScale }] }]}
            />
            <Text style={styles.title}>A preparar a mesa</Text>
            <Text style={styles.subtitle}>So falta aquecer a sala.</Text>
          </View>

          <View style={styles.loadingBarWrap}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
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
    textAlign: "center"
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
  loadingBarWrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  progressTrack: {
    backgroundColor: "rgba(255, 245, 221, 0.16)",
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    height: 16,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: colors.gold,
    borderRadius: radii.full,
    height: "100%"
  },
});
