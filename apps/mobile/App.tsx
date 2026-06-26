import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import {
  ChevronLeft,
  CirclePlay,
  Crown,
  LogIn,
  QrCode,
  UsersRound,
  Vote
} from "lucide-react-native";

import { LoadingScreen } from "./src/screens/LoadingScreen";
import { colors, radii, spacing } from "./src/theme";
import type { AppScreen, IconComponent, LobbyRole } from "./src/types";

const barBackground = require("./assets/bar-table-background.png");
const playpintLogo = require("./assets/playpint-logo-cutout.png");

const samplePlayers = ["Leo", "Santi", "Marta", "Rita"];

const esTuQuestions = [
  "Quem e mais provavel que mande mensagem ao ex depois da meia-noite?",
  "Quem e mais provavel que conte uma historia e exagere metade?",
  "Quem e mais provavel que chegue atrasado e ainda culpe o transito?",
  "Quem e mais provavel que ganhe isto sem admitir que queria ganhar?"
];

type PosterButtonProps = {
  icon: IconComponent;
  label: string;
  helper: string;
  variant?: "gold" | "ember" | "ghost";
  onPress: () => void;
};

function PosterButton({ icon: Icon, label, helper, variant = "gold", onPress }: PosterButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.posterButton,
        variant === "ember" && styles.posterButtonEmber,
        variant === "ghost" && styles.posterButtonGhost,
        pressed && styles.posterButtonPressed
      ]}
    >
      <View style={[styles.posterIcon, variant === "ember" && styles.posterIconEmber]}>
        <Icon color={variant === "ghost" ? colors.gold : colors.ink} size={34} strokeWidth={3} />
      </View>
      <View style={styles.posterButtonCopy}>
        <Text style={[styles.posterButtonLabel, variant === "ghost" && styles.posterButtonLabelGhost]}>
          {label}
        </Text>
        <Text style={[styles.posterButtonHelper, variant === "ghost" && styles.posterButtonHelperGhost]}>
          {helper}
        </Text>
      </View>
    </Pressable>
  );
}

type BackButtonProps = {
  onPress: () => void;
};

function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.backButton}>
      <ChevronLeft color={colors.gold} size={22} strokeWidth={3} />
      <Text style={styles.backButtonText}>Voltar</Text>
    </Pressable>
  );
}

export default function App() {
  const [bootComplete, setBootComplete] = useState(false);
  const [screen, setScreen] = useState<AppScreen>("home");
  const [roomName, setRoomName] = useState("Mesa 7");
  const [roomCode, setRoomCode] = useState("4829");
  const [nickname, setNickname] = useState("");
  const [lobbyRole, setLobbyRole] = useState<LobbyRole>("host");
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const currentQuestion = useMemo(
    () => esTuQuestions[roundIndex % esTuQuestions.length],
    [roundIndex]
  );

  const finishBoot = useCallback(() => {
    setBootComplete(true);
  }, []);

  function openLobby(role: LobbyRole) {
    setLobbyRole(role);
    setScreen("lobby");
  }

  function startRound() {
    setSelectedPlayer(null);
    setScreen("round");
  }

  function nextRound() {
    setSelectedPlayer(null);
    setRoundIndex((value) => value + 1);
  }

  if (!bootComplete) {
    return <LoadingScreen onDone={finishBoot} />;
  }

  return (
    <ImageBackground source={barBackground} resizeMode="cover" style={styles.background}>
      <StatusBar style="light" />
      <View pointerEvents="none" style={styles.scrim} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboard}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={screen !== "home"}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={screen !== "home"}
            showsVerticalScrollIndicator={false}
          >
            {screen !== "home" ? <BackButton onPress={() => setScreen("home")} /> : null}

            {screen === "home" ? (
              <View style={styles.homeScreen}>
                <View style={styles.brandArea}>
                  <Image source={playpintLogo} resizeMode="contain" style={styles.logoImage} />
                  <Text style={styles.heroHeadline}>
                    Junta <Text style={styles.heroHot}>a mesa</Text>
                  </Text>
                  <Text style={styles.heroTagline}>Desafios, votos e rondas sem pausa</Text>
                </View>

                <View style={styles.actionStack}>
                  <PosterButton
                    icon={UsersRound}
                    label="CRIAR SALA"
                    helper="abre o lobby e mostra o codigo"
                    onPress={() => setScreen("host")}
                  />
                  <PosterButton
                    icon={LogIn}
                    label="ENTRAR NUMA SALA"
                    helper="usa codigo ou QR do host"
                    variant="ember"
                    onPress={() => setScreen("join")}
                  />
                </View>
              </View>
            ) : null}

            {screen === "host" ? (
              <View style={styles.screenGap}>
                <View style={styles.sectionIntro}>
                  <Text style={styles.sectionLabel}>Criar sala</Text>
                  <Text style={styles.heading}>Prepara o Es Tu?</Text>
                  <Text style={styles.bodyText}>
                    Mete o nome da mesa e gera o codigo para os teus amigos entrarem.
                  </Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Nome da sala</Text>
                  <TextInput
                    value={roomName}
                    onChangeText={setRoomName}
                    placeholder="Ex: Mesa 7"
                    placeholderTextColor={colors.muted}
                    style={styles.input}
                  />
                </View>

                <View style={styles.rulePanel}>
                  <View style={styles.ruleIcon}>
                    <Vote color={colors.ink} size={26} strokeWidth={3} />
                  </View>
                  <View style={styles.ruleCopy}>
                    <Text style={styles.ruleTitle}>Regra base</Text>
                    <Text style={styles.ruleText}>
                      O host le a pergunta, todos votam numa pessoa e a mesa decide a consequencia.
                    </Text>
                  </View>
                </View>

                <PosterButton
                  icon={QrCode}
                  label="GERAR CODIGO"
                  helper={`sala ${roomName || "sem nome"} pronta para jogar`}
                  onPress={() => openLobby("host")}
                />
              </View>
            ) : null}

            {screen === "join" ? (
              <View style={styles.screenGap}>
                <View style={styles.sectionIntro}>
                  <Text style={styles.sectionLabel}>Entrar</Text>
                  <Text style={styles.heading}>Junta-te a mesa</Text>
                  <Text style={styles.bodyText}>
                    Escreve o codigo da sala e o nome que vai aparecer nas votacoes.
                  </Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Codigo da sala</Text>
                  <TextInput
                    value={roomCode}
                    onChangeText={setRoomCode}
                    keyboardType="number-pad"
                    maxLength={4}
                    placeholder="4829"
                    placeholderTextColor={colors.muted}
                    style={styles.inputBig}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Nickname</Text>
                  <TextInput
                    value={nickname}
                    onChangeText={setNickname}
                    placeholder="Como te chamas?"
                    placeholderTextColor={colors.muted}
                    style={styles.input}
                  />
                </View>

                <PosterButton
                  icon={LogIn}
                  label="ENTRAR"
                  helper={nickname ? `vais aparecer como ${nickname}` : "nickname pode ficar para depois"}
                  variant="ember"
                  onPress={() => openLobby("client")}
                />
              </View>
            ) : null}

            {screen === "lobby" ? (
              <View style={styles.screenGap}>
                <View style={styles.lobbyHeader}>
                  <View style={styles.lobbyTitleBlock}>
                    <Text style={styles.sectionLabel}>
                      {lobbyRole === "host" ? "Lobby do host" : "Lobby do jogador"}
                    </Text>
                    <Text style={styles.heading}>{roomName || "Sala Playpint"}</Text>
                  </View>
                  <View style={styles.roomCodePill}>
                    <Text style={styles.roomCodeLabel}>Codigo</Text>
                    <Text style={styles.roomCodeValue}>{roomCode}</Text>
                  </View>
                </View>

                <View style={styles.qrPanel}>
                  <QrCode color={colors.ink} size={70} strokeWidth={3} />
                  <View style={styles.qrCopy}>
                    <Text style={styles.qrTitle}>Mostra isto aos jogadores</Text>
                    <Text style={styles.qrSubtitle}>
                      O QR real entra quando ligarmos backend. Para ja, o codigo manda.
                    </Text>
                  </View>
                </View>

                <View style={styles.playersPanel}>
                  <View style={styles.playersHeader}>
                    <Text style={styles.inputLabel}>Jogadores</Text>
                    <Text style={styles.playerCount}>{samplePlayers.length}/8</Text>
                  </View>
                  <View style={styles.playerGrid}>
                    {samplePlayers.map((player, index) => (
                      <View key={player} style={styles.playerCard}>
                        <Text style={styles.playerAvatar}>{player.slice(0, 1)}</Text>
                        <Text style={styles.playerName}>{player}</Text>
                        <Text style={styles.playerStatus}>{index === 0 ? "host" : "pronto"}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.nextGamePanel}>
                  <Crown color={colors.gold} size={30} strokeWidth={3} />
                  <View style={styles.nextGameCopy}>
                    <Text style={styles.nextGameTitle}>Es Tu?</Text>
                    <Text style={styles.nextGameSubtitle}>
                      Perguntas de acusacao amigavel, votos rapidos e discussao garantida.
                    </Text>
                  </View>
                </View>

                <PosterButton
                  icon={CirclePlay}
                  label={lobbyRole === "host" ? "COMECAR RONDA" : "TESTAR RONDA"}
                  helper={lobbyRole === "host" ? "host inicia quando todos estiverem prontos" : "mock local ate ligarmos multiplayer"}
                  onPress={startRound}
                />
              </View>
            ) : null}

            {screen === "round" ? (
              <View style={styles.screenGap}>
                <View style={styles.roundHeader}>
                  <View>
                    <Text style={styles.sectionLabel}>Ronda {roundIndex + 1}</Text>
                    <Text style={styles.heading}>Es Tu?</Text>
                  </View>
                  <View style={styles.timerPill}>
                    <Text style={styles.timerValue}>15</Text>
                    <Text style={styles.timerLabel}>seg</Text>
                  </View>
                </View>

                <View style={styles.questionCard}>
                  <Text style={styles.questionEyebrow}>A mesa responde</Text>
                  <Text style={styles.questionText}>{currentQuestion}</Text>
                </View>

                <View style={styles.votePanel}>
                  <Text style={styles.inputLabel}>Escolhe uma pessoa</Text>
                  <View style={styles.voteGrid}>
                    {samplePlayers.map((player) => {
                      const selected = selectedPlayer === player;
                      return (
                        <Pressable
                          accessibilityRole="button"
                          key={player}
                          onPress={() => setSelectedPlayer(player)}
                          style={[styles.voteCard, selected && styles.voteCardSelected]}
                        >
                          <Text style={[styles.voteAvatar, selected && styles.voteAvatarSelected]}>
                            {player.slice(0, 1)}
                          </Text>
                          <Text style={[styles.voteName, selected && styles.voteNameSelected]}>
                            {player}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.resultPanel}>
                  <Text style={styles.resultTitle}>
                    {selectedPlayer ? `${selectedPlayer} esta marcado` : "Votos ainda escondidos"}
                  </Text>
                  <Text style={styles.resultText}>
                    {selectedPlayer
                      ? "Depois mostramos percentagens, empate e animacao de resultado."
                      : "Toca num nome para simular como a votacao vai funcionar."}
                  </Text>
                </View>

                <PosterButton
                  icon={Vote}
                  label="NOVA PERGUNTA"
                  helper="avanca para a proxima ronda"
                  variant="ember"
                  onPress={nextRound}
                />
              </View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
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
    backgroundColor: "rgba(5, 4, 3, 0.48)"
  },
  safeArea: {
    flex: 1
  },
  keyboard: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md
  },
  homeScreen: {
    flexGrow: 1,
    gap: spacing.lg,
    justifyContent: "flex-start",
    minHeight: 700,
    paddingBottom: spacing.md,
    paddingTop: spacing.lg
  },
  brandArea: {
    alignItems: "center",
    gap: spacing.xs
  },
  logoImage: {
    alignSelf: "center",
    height: 238,
    marginBottom: -8,
    width: "112%"
  },
  bottleCap: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderColor: colors.gold,
    borderRadius: radii.full,
    borderWidth: 4,
    height: 92,
    justifyContent: "center",
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    width: 92
  },
  bottleCapText: {
    color: colors.gold,
    fontSize: 54,
    fontWeight: "900",
    lineHeight: 62,
    textShadowColor: colors.orange,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0
  },
  logoText: {
    color: colors.gold,
    fontSize: 64,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 70,
    textShadowColor: colors.ink,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 0
  },
  heroHeadline: {
    color: colors.cream,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 54,
    textAlign: "center",
    textShadowColor: colors.ink,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 0
  },
  heroHot: {
    color: colors.orange
  },
  heroSubtitle: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 25,
    maxWidth: 330,
    textAlign: "center"
  },
  heroTagline: {
    color: colors.cream,
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 25,
    marginTop: spacing.sm,
    maxWidth: 330,
    textAlign: "center"
  },
  infoRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  infoChip: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.78)",
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 78,
    padding: spacing.md
  },
  infoChipTeal: {
    borderColor: colors.teal
  },
  infoChipCopy: {
    flex: 1
  },
  infoNumber: {
    color: colors.cream,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0
  },
  infoLabel: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 17
  },
  actionStack: {
    gap: spacing.md,
    marginTop: 54
  },
  posterButton: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderColor: "#FFE079",
    borderRadius: radii.lg,
    borderWidth: 2,
    elevation: 8,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 104,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10
  },
  posterButtonEmber: {
    backgroundColor: colors.ember,
    borderColor: colors.orange,
    shadowColor: colors.ember
  },
  posterButtonGhost: {
    backgroundColor: "rgba(16, 11, 5, 0.82)",
    borderColor: colors.border,
    minHeight: 62
  },
  posterButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }]
  },
  posterIcon: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.16)",
    borderRadius: radii.md,
    height: 58,
    justifyContent: "center",
    width: 58
  },
  posterIconEmber: {
    backgroundColor: "rgba(255, 242, 200, 0.18)"
  },
  posterButtonCopy: {
    flex: 1
  },
  posterButtonLabel: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 34
  },
  posterButtonLabelGhost: {
    color: colors.gold,
    fontSize: 20,
    lineHeight: 24
  },
  posterButtonHelper: {
    color: colors.inkSoft,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 17,
    marginTop: spacing.xs,
    textTransform: "uppercase"
  },
  posterButtonHelperGhost: {
    color: colors.textSoft
  },
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(16, 11, 5, 0.82)",
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  backButtonText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "900"
  },
  screenGap: {
    gap: spacing.xl
  },
  sectionIntro: {
    gap: spacing.sm
  },
  sectionLabel: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  heading: {
    color: colors.cream,
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 43,
    textShadowColor: colors.ink,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0
  },
  bodyText: {
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 24
  },
  formGroup: {
    gap: spacing.sm
  },
  inputLabel: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: "900"
  },
  input: {
    backgroundColor: "rgba(16, 11, 5, 0.86)",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 17,
    minHeight: 58,
    paddingHorizontal: spacing.md
  },
  inputBig: {
    backgroundColor: "rgba(16, 11, 5, 0.86)",
    borderColor: colors.gold,
    borderRadius: radii.md,
    borderWidth: 2,
    color: colors.gold,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
    minHeight: 76,
    paddingHorizontal: spacing.md,
    textAlign: "center"
  },
  rulePanel: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.84)",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  ruleIcon: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    height: 52,
    justifyContent: "center",
    width: 52
  },
  ruleCopy: {
    flex: 1,
    gap: spacing.xs
  },
  ruleTitle: {
    color: colors.cream,
    fontSize: 17,
    fontWeight: "900"
  },
  ruleText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18
  },
  lobbyHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  lobbyTitleBlock: {
    flex: 1,
    gap: spacing.xs
  },
  roomCodePill: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.82)",
    borderColor: colors.teal,
    borderRadius: radii.md,
    borderWidth: 1,
    minWidth: 94,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  roomCodeLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  roomCodeValue: {
    color: colors.teal,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0
  },
  qrPanel: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderColor: colors.cream,
    borderRadius: radii.md,
    borderWidth: 2,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg
  },
  qrCopy: {
    flex: 1,
    gap: spacing.xs
  },
  qrTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  qrSubtitle: {
    color: colors.inkSoft,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18
  },
  playersPanel: {
    gap: spacing.md
  },
  playersHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playerCount: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: "900"
  },
  playerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  playerCard: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.84)",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: 3,
    minWidth: "47%",
    padding: spacing.md
  },
  playerAvatar: {
    color: colors.gold,
    fontSize: 28,
    fontWeight: "900"
  },
  playerName: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "900"
  },
  playerStatus: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  nextGamePanel: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.86)",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  nextGameCopy: {
    flex: 1,
    gap: spacing.xs
  },
  nextGameTitle: {
    color: colors.cream,
    fontSize: 19,
    fontWeight: "900"
  },
  nextGameSubtitle: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18
  },
  roundHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  timerPill: {
    alignItems: "center",
    backgroundColor: colors.ember,
    borderColor: colors.orange,
    borderRadius: radii.full,
    borderWidth: 2,
    height: 76,
    justifyContent: "center",
    width: 76
  },
  timerValue: {
    color: colors.cream,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 34
  },
  timerLabel: {
    color: colors.cream,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  questionCard: {
    backgroundColor: "rgba(255, 194, 58, 0.95)",
    borderColor: colors.cream,
    borderRadius: radii.lg,
    borderWidth: 2,
    gap: spacing.sm,
    padding: spacing.xl
  },
  questionEyebrow: {
    color: colors.inkSoft,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  questionText: {
    color: colors.ink,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 36
  },
  votePanel: {
    gap: spacing.md
  },
  voteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  voteCard: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.84)",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 66,
    minWidth: "47%",
    padding: spacing.md
  },
  voteCardSelected: {
    backgroundColor: colors.teal,
    borderColor: colors.cream
  },
  voteAvatar: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: "900",
    minWidth: 24,
    textAlign: "center"
  },
  voteAvatarSelected: {
    color: colors.ink
  },
  voteName: {
    color: colors.cream,
    flex: 1,
    fontSize: 16,
    fontWeight: "900"
  },
  voteNameSelected: {
    color: colors.ink
  },
  resultPanel: {
    backgroundColor: "rgba(16, 11, 5, 0.86)",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg
  },
  resultTitle: {
    color: colors.cream,
    fontSize: 20,
    fontWeight: "900"
  },
  resultText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20
  }
});
