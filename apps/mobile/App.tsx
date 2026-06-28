import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
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
  Check,
  ChevronLeft,
  CirclePlay,
  LogIn,
  QrCode,
  SlidersHorizontal,
  UsersRound,
  Vote,
  X
} from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";

import { LoadingScreen } from "./src/screens/LoadingScreen";
import { colors, radii, spacing } from "./src/theme";
import type { AppScreen, IconComponent, LobbyRole } from "./src/types";

const barBackground = require("./assets/bar-table-background.png");
const playpintLogo = require("./assets/playpint-logo-cutout.png");

const roundDemoPlayers = ["Leo", "Santi", "Marta", "Rita"];

const esTuQuestions = [
  "Quem e mais provavel que mande mensagem ao ex depois da meia-noite?",
  "Quem e mais provavel que conte uma historia e exagere metade?",
  "Quem e mais provavel que chegue atrasado e ainda culpe o transito?",
  "Quem e mais provavel que ganhe isto sem admitir que queria ganhar?"
];

const esTuModeOptions = [
  { id: "quem-e-quem", title: "Quem e quem", detail: "A frase escolhe uma pessoa da mesa" },
  { id: "mais-provavel", title: "Mais provavel", detail: "Todos votam em quem encaixa melhor" },
  { id: "quem-nunca", title: "Quem nunca", detail: "Perguntas de confissao para o grupo" },
  { id: "voto-relampago", title: "Voto relampago", detail: "Rondas rapidas com pouca conversa" },
  { id: "duelo", title: "Duelo", detail: "Dois jogadores frente a frente" },
  { id: "ranking", title: "Ranking", detail: "Ordena a mesa do mais ao menos" },
  { id: "historias", title: "Historias", detail: "Alguem tem de contar uma historia" },
  { id: "verdade-ou-mito", title: "Verdade ou mito", detail: "Descobre se a frase e real ou inventada" }
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
  const [voteSeconds, setVoteSeconds] = useState(15);
  const [playerLimit, setPlayerLimit] = useState(8);
  const [selectedEsTuModes, setSelectedEsTuModes] = useState<string[]>([
    "quem-e-quem",
    "mais-provavel"
  ]);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const currentQuestion = useMemo(
    () => esTuQuestions[roundIndex % esTuQuestions.length],
    [roundIndex]
  );
  const selectedModePreview = useMemo(() => {
    const selected = esTuModeOptions.filter((mode) => selectedEsTuModes.includes(mode.id));

    if (selected.length <= 2) {
      return selected.map((mode) => mode.title).join(" + ");
    }

    const firstMode = selected[0]?.title ?? "Modo";
    const secondMode = selected[1]?.title ?? "modo";

    return `${firstMode} + ${secondMode} +${selected.length - 2}`;
  }, [selectedEsTuModes]);
  const invitePayload = useMemo(
    () =>
      `playpint://join?code=${encodeURIComponent(roomCode)}&room=${encodeURIComponent(
        roomName || "Sala Playpint"
      )}`,
    [roomCode, roomName]
  );
  const lobbyPlayers = useMemo(() => {
    if (lobbyRole === "client") {
      return [{ id: "you", name: nickname || "Tu", status: "pronto" }];
    }

    return [{ id: "host", name: "Leo", status: "host" }];
  }, [lobbyRole, nickname]);

  const finishBoot = useCallback(() => {
    setBootComplete(true);
  }, []);

  const canScroll = screen === "join" || screen === "round";
  const canEditModes = screen === "host" || lobbyRole === "host";
  const visibleModeOptions = canEditModes
    ? esTuModeOptions
    : esTuModeOptions.filter((mode) => selectedEsTuModes.includes(mode.id));

  function openLobby(role: LobbyRole) {
    setLobbyRole(role);
    setScreen("lobby");
  }

  function toggleEsTuMode(modeId: string) {
    if (!canEditModes) {
      return;
    }

    setSelectedEsTuModes((current) => {
      if (!current.includes(modeId)) {
        return [...current, modeId];
      }

      return current.length === 1 ? current : current.filter((id) => id !== modeId);
    });
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
            bounces={canScroll}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={canScroll}
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
              <View style={styles.hostScreen}>
                <View style={styles.hostHero}>
                  <Image source={playpintLogo} resizeMode="contain" style={styles.hostLogoImage} />
                  <Text style={styles.sectionLabel}>Menu do host</Text>
                  <Text style={styles.hostHeading}>Prepara a mesa</Text>
                </View>

                <View style={styles.hostCard}>
                  <Text style={styles.hostCardLabel}>Nome da sala</Text>
                  <TextInput
                    value={roomName}
                    onChangeText={setRoomName}
                    placeholder="Ex: Mesa 7"
                    placeholderTextColor={colors.muted}
                    style={styles.hostInput}
                  />
                </View>

                <View style={styles.hostSettingsGrid}>
                  <View style={styles.hostControlPanel}>
                    <View style={styles.hostControlHeader}>
                      <Text style={styles.hostCardLabel}>Tempo</Text>
                      <Text style={styles.hostControlValue}>{voteSeconds}s</Text>
                    </View>
                    <View style={styles.hostSegmentRow}>
                      {[10, 15, 20].map((seconds) => (
                        <Pressable
                          accessibilityRole="button"
                          key={seconds}
                          onPress={() => setVoteSeconds(seconds)}
                          style={[
                            styles.hostSegment,
                            voteSeconds === seconds && styles.hostSegmentActive
                          ]}
                        >
                          <Text
                            style={[
                              styles.hostSegmentText,
                              voteSeconds === seconds && styles.hostSegmentTextActive
                            ]}
                          >
                            {seconds}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.hostControlPanel}>
                    <View style={styles.hostControlHeader}>
                      <Text style={styles.hostCardLabel}>Jogadores</Text>
                      <Text style={styles.hostControlValue}>{playerLimit}</Text>
                    </View>
                    <View style={styles.hostSegmentRow}>
                      {[6, 8, 10].map((limit) => (
                        <Pressable
                          accessibilityRole="button"
                          key={limit}
                          onPress={() => setPlayerLimit(limit)}
                          style={[
                            styles.hostSegment,
                            playerLimit === limit && styles.hostSegmentActive
                          ]}
                        >
                          <Text
                            style={[
                              styles.hostSegmentText,
                              playerLimit === limit && styles.hostSegmentTextActive
                            ]}
                          >
                            {limit}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.hostModesPanel}>
                  <View style={styles.hostControlHeader}>
                    <Text style={styles.hostCardLabel}>Modos de jogo</Text>
                    <Text style={styles.hostModesCount}>{selectedEsTuModes.length} ativos</Text>
                  </View>
                  <Text numberOfLines={1} style={styles.hostModesPreview}>
                    {selectedModePreview}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setModeMenuOpen(true)}
                    style={styles.hostModeMenuButton}
                  >
                    <SlidersHorizontal color={colors.ink} size={22} strokeWidth={3} />
                    <Text style={styles.hostModeMenuButtonText}>Escolher modos</Text>
                  </Pressable>
                </View>

                <PosterButton
                  icon={QrCode}
                  label="ABRIR LOBBY"
                  helper={`${voteSeconds}s - ${playerLimit} jogadores - ${selectedEsTuModes.length} modos`}
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
              <View style={styles.lobbyScreen}>
                <View style={styles.lobbyHero}>
                  <Image source={playpintLogo} resizeMode="contain" style={styles.lobbyLogoImage} />
                  <Text style={styles.sectionLabel}>
                    {lobbyRole === "host" ? "Lobby do host" : "Lobby do jogador"}
                  </Text>
                  <Text style={styles.lobbyHeading}>{roomName || "Sala Playpint"}</Text>
                </View>

                <View style={styles.roomCodeStage}>
                  <Text style={styles.roomCodeEyebrow}>Codigo da sala</Text>
                  <Text style={styles.roomCodeHero}>{roomCode}</Text>
                  <View style={styles.roomCodeRule} />
                  <Text style={styles.roomCodeHint}>Mostra este codigo a quem vai entrar.</Text>
                </View>

                <View style={styles.lobbyInfoRow}>
                  <View style={styles.lobbyMiniCard}>
                    <UsersRound color={colors.gold} size={25} strokeWidth={3} />
                    <View style={styles.lobbyMiniCopy}>
                      <Text style={styles.lobbyMiniValue}>{lobbyPlayers.length}/{playerLimit}</Text>
                      <Text style={styles.lobbyMiniLabel}>na mesa</Text>
                    </View>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setQrModalOpen(true)}
                    style={({ pressed }) => [
                      styles.lobbyMiniCard,
                      styles.lobbyQrCard,
                      pressed && styles.lobbyMiniCardPressed
                    ]}
                  >
                    <QrCode color={colors.gold} size={25} strokeWidth={3} />
                    <View style={styles.lobbyMiniCopy}>
                      <Text style={styles.lobbyMiniValue}>QR</Text>
                      <Text style={styles.lobbyMiniLabel}>abrir convite</Text>
                    </View>
                  </Pressable>
                </View>

                <View style={styles.playersPanel}>
                  <View style={styles.playersHeader}>
                    <View>
                      <Text style={styles.inputLabel}>Mesa</Text>
                      <Text style={styles.playersHint}>
                        So aparece quem entrar na sala
                      </Text>
                    </View>
                    <View style={styles.playerCountBadge}>
                      <Text style={styles.playerCount}>{lobbyPlayers.length}/{playerLimit}</Text>
                    </View>
                  </View>
                  <View style={styles.playerList}>
                    {lobbyPlayers.map((player) => (
                      <View key={player.id} style={styles.playerCard}>
                        <Text style={styles.playerAvatar}>{player.name.slice(0, 1)}</Text>
                        <View style={styles.playerCopy}>
                          <Text style={styles.playerName}>{player.name}</Text>
                          <View style={styles.playerStatusPill}>
                            <Text style={styles.playerStatus}>{player.status}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                    <View style={styles.waitingPlayerCard}>
                      <View style={styles.waitingIcon}>
                        <UsersRound color={colors.gold} size={22} strokeWidth={3} />
                      </View>
                      <View style={styles.playerCopy}>
                        <Text style={styles.waitingTitle}>Ainda ninguem entrou</Text>
                        <Text style={styles.waitingText}>Mostra o QR ou partilha o codigo {roomCode}.</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.seatRail}>
                    {Array.from({ length: Math.min(playerLimit, 10) }).map((_, index) => (
                      <View
                        key={`seat-${index}`}
                        style={[
                          styles.seatDot,
                          index < lobbyPlayers.length && styles.seatDotTaken
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.lobbyModesPanel}>
                  <View style={styles.lobbyModesCopy}>
                    <Text style={styles.lobbyModesLabel}>Modos do jogo</Text>
                    <Text numberOfLines={1} style={styles.lobbyModesText}>
                      {selectedEsTuModes.length} ativos
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setModeMenuOpen(true)}
                    style={({ pressed }) => [
                      styles.lobbyModesButton,
                      pressed && styles.lobbyModesButtonPressed
                    ]}
                  >
                    <Text style={styles.lobbyModesButtonText}>Ver modos</Text>
                  </Pressable>
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
                    {roundDemoPlayers.map((player) => {
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

      <Modal
        animationType="fade"
        onRequestClose={() => setModeMenuOpen(false)}
        transparent
        visible={modeMenuOpen}
      >
        <View style={styles.modeModalBackdrop}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setModeMenuOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView style={styles.modeModalSafeArea}>
            <View style={styles.modeSheet}>
              <View style={styles.modeSheetHeader}>
                <View>
                  <Text style={styles.sectionLabel}>Modos de jogo</Text>
                  <Text style={styles.modeSheetTitle}>
                    {canEditModes ? "Escolhe as rondas" : "Modos da sala"}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setModeMenuOpen(false)}
                  style={styles.modeCloseButton}
                >
                  <X color={colors.cream} size={22} strokeWidth={3} />
                </Pressable>
              </View>

              <Text style={styles.modeSheetText}>
                {canEditModes
                  ? "So o host pode meter ou tirar modos. O jogo alterna entre os escolhidos."
                  : "So o host pode alterar estes modos. Tu so consegues ver o que esta ativo."}
              </Text>

              <ScrollView
                contentContainerStyle={styles.modeListContent}
                showsVerticalScrollIndicator={false}
                style={styles.modeList}
              >
                {visibleModeOptions.map((mode) => {
                  const active = selectedEsTuModes.includes(mode.id);

                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={mode.id}
                      disabled={!canEditModes}
                      onPress={() => toggleEsTuMode(mode.id)}
                      style={[styles.modeRow, active && styles.modeRowActive]}
                    >
                      <View style={styles.modeRowCopy}>
                        <Text style={[styles.modeRowTitle, active && styles.modeRowTitleActive]}>
                          {mode.title}
                        </Text>
                        <Text style={[styles.modeRowDetail, active && styles.modeRowDetailActive]}>
                          {mode.detail}
                        </Text>
                      </View>
                      <View style={[styles.modeCheck, active && styles.modeCheckActive]}>
                        {active ? <Check color={colors.ink} size={18} strokeWidth={4} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Pressable
                accessibilityRole="button"
                onPress={() => setModeMenuOpen(false)}
                style={styles.modeDoneButton}
              >
                <Text style={styles.modeDoneButtonText}>
                  {canEditModes ? "Guardar modos" : "Fechar modos"}
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        onRequestClose={() => setQrModalOpen(false)}
        transparent
        visible={qrModalOpen}
      >
        <View style={styles.qrModalBackdrop}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setQrModalOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView style={styles.qrModalSafeArea}>
            <View style={styles.qrSheet}>
              <View style={styles.qrSheetHeader}>
                <View>
                  <Text style={styles.sectionLabel}>Convite da sala</Text>
                  <Text style={styles.qrSheetTitle}>Mostra este QR</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setQrModalOpen(false)}
                  style={styles.modeCloseButton}
                >
                  <X color={colors.cream} size={22} strokeWidth={3} />
                </Pressable>
              </View>

              <View style={styles.qrFrame}>
                <QRCode
                  backgroundColor={colors.cream}
                  color={colors.ink}
                  quietZone={10}
                  size={214}
                  value={invitePayload}
                />
              </View>

              <View style={styles.qrCodeStrip}>
                <Text style={styles.qrCodeLabel}>Codigo</Text>
                <Text style={styles.qrCodeValue}>{roomCode}</Text>
              </View>

              <Text style={styles.qrHint}>
                Quem estiver contigo pode ler o QR ou escrever o codigo para entrar.
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => setQrModalOpen(false)}
                style={styles.qrDoneButton}
              >
                <Text style={styles.modeDoneButtonText}>Fechar QR</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
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
    paddingBottom: spacing.md,
    paddingTop: spacing.sm
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
    minHeight: 100,
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
    height: 56,
    justifyContent: "center",
    width: 56
  },
  posterIconEmber: {
    backgroundColor: "rgba(255, 242, 200, 0.18)"
  },
  posterButtonCopy: {
    flex: 1
  },
  posterButtonLabel: {
    color: colors.ink,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 33
  },
  posterButtonLabelGhost: {
    color: colors.gold,
    fontSize: 20,
    lineHeight: 24
  },
  posterButtonHelper: {
    color: colors.inkSoft,
    fontSize: 12,
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
    marginBottom: spacing.sm,
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
  hostScreen: {
    gap: spacing.md,
    paddingBottom: spacing.sm
  },
  hostHero: {
    alignItems: "center",
    gap: 2
  },
  hostLogoImage: {
    alignSelf: "center",
    height: 82,
    marginBottom: -10,
    width: "72%"
  },
  hostHeading: {
    color: colors.cream,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 38,
    textAlign: "center"
  },
  hostCard: {
    backgroundColor: "rgba(16, 11, 5, 0.76)",
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  hostCardLabel: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  hostInput: {
    color: colors.cream,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
    minHeight: 42,
    padding: 0
  },
  hostSettingsGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  hostControlPanel: {
    backgroundColor: "rgba(16, 11, 5, 0.62)",
    borderColor: colors.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    gap: spacing.sm,
    minHeight: 86,
    padding: spacing.md
  },
  hostControlHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  hostControlValue: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0
  },
  hostSegmentRow: {
    flexDirection: "row",
    gap: spacing.xs
  },
  hostSegment: {
    alignItems: "center",
    backgroundColor: "rgba(255, 245, 221, 0.08)",
    borderColor: colors.borderSoft,
    borderRadius: radii.full,
    borderWidth: 1,
    flex: 1,
    minHeight: 40,
    justifyContent: "center"
  },
  hostSegmentActive: {
    backgroundColor: colors.gold,
    borderColor: colors.cream
  },
  hostSegmentText: {
    color: colors.cream,
    fontSize: 15,
    fontWeight: "900"
  },
  hostSegmentTextActive: {
    color: colors.ink
  },
  hostModesPanel: {
    backgroundColor: "rgba(16, 11, 5, 0.72)",
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  hostModesCount: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  hostModesPreview: {
    color: colors.cream,
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 24
  },
  hostModeMenuButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.gold,
    borderColor: colors.cream,
    borderRadius: radii.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 48
  },
  hostModeMenuButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  hostModeDetailActive: {
    color: colors.inkSoft
  },
  hostRulePanel: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.72)",
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  hostRuleCopy: {
    flex: 1,
    gap: spacing.xs
  },
  hostRuleTitle: {
    color: colors.cream,
    fontSize: 17,
    fontWeight: "900"
  },
  hostRuleText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16
  },
  lobbyScreen: {
    gap: spacing.sm,
    paddingBottom: spacing.sm
  },
  lobbyHero: {
    alignItems: "center",
    gap: 2
  },
  lobbyLogoImage: {
    alignSelf: "center",
    height: 66,
    marginBottom: -10,
    width: "66%"
  },
  lobbyHeading: {
    color: colors.cream,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 32,
    textAlign: "center"
  },
  roomCodeStage: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.76)",
    borderColor: colors.gold,
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  roomCodeEyebrow: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  roomCodeHero: {
    color: colors.gold,
    fontSize: 58,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 62
  },
  roomCodeRule: {
    backgroundColor: colors.orange,
    borderRadius: radii.full,
    height: 3,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
    width: 72
  },
  roomCodeHint: {
    color: colors.cream,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 16,
    textAlign: "center"
  },
  lobbyInfoRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  lobbyMiniCard: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.7)",
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 56,
    padding: spacing.sm
  },
  lobbyQrCard: {
    borderColor: colors.gold
  },
  lobbyMiniCardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }]
  },
  lobbyMiniCopy: {
    flex: 1
  },
  lobbyMiniValue: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  lobbyMiniLabel: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  playersPanel: {
    backgroundColor: "rgba(16, 11, 5, 0.62)",
    borderColor: colors.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md
  },
  playersHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playersHint: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 15,
    marginTop: 2
  },
  playerCountBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255, 194, 58, 0.12)",
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    minWidth: 52,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5
  },
  playerCount: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "900"
  },
  playerList: {
    gap: spacing.sm
  },
  playerCard: {
    alignItems: "center",
    backgroundColor: "rgba(255, 245, 221, 0.08)",
    borderColor: colors.gold,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 56,
    padding: spacing.sm
  },
  playerAvatar: {
    color: colors.ink,
    backgroundColor: colors.gold,
    borderRadius: radii.full,
    fontSize: 22,
    fontWeight: "900",
    height: 38,
    lineHeight: 38,
    overflow: "hidden",
    textAlign: "center",
    width: 38
  },
  playerCopy: {
    flex: 1,
    gap: 2
  },
  playerName: {
    color: colors.cream,
    fontSize: 17,
    fontWeight: "900"
  },
  playerStatusPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 194, 58, 0.14)",
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2
  },
  playerStatus: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  waitingPlayerCard: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.72)",
    borderColor: colors.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 58,
    padding: spacing.sm
  },
  waitingIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255, 194, 58, 0.12)",
    borderRadius: radii.full,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  waitingTitle: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 18
  },
  waitingText: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 15
  },
  seatRail: {
    flexDirection: "row",
    gap: spacing.xs
  },
  seatDot: {
    backgroundColor: "rgba(255, 245, 221, 0.18)",
    borderRadius: radii.full,
    flex: 1,
    height: 5
  },
  seatDotTaken: {
    backgroundColor: colors.gold
  },
  lobbyModesPanel: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.62)",
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  lobbyModesCopy: {
    flex: 1,
    gap: 2
  },
  lobbyModesLabel: {
    color: colors.textSoft,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  lobbyModesText: {
    color: colors.cream,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 18
  },
  lobbyModesButton: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderColor: colors.cream,
    borderRadius: radii.full,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  lobbyModesButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }]
  },
  lobbyModesButtonText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  modeModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 4, 3, 0.72)",
    justifyContent: "flex-end"
  },
  modeModalSafeArea: {
    flex: 1,
    justifyContent: "flex-end"
  },
  modeSheet: {
    backgroundColor: "rgba(16, 11, 5, 0.98)",
    borderColor: colors.border,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    maxHeight: "86%",
    padding: spacing.lg
  },
  modeSheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modeSheetTitle: {
    color: colors.cream,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 34
  },
  modeCloseButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 245, 221, 0.09)",
    borderColor: colors.borderSoft,
    borderRadius: radii.full,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  modeSheetText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18
  },
  modeList: {
    maxHeight: 430
  },
  modeListContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xs
  },
  modeRow: {
    alignItems: "center",
    backgroundColor: "rgba(255, 245, 221, 0.07)",
    borderColor: colors.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 74,
    padding: spacing.md
  },
  modeRowActive: {
    backgroundColor: "rgba(255, 194, 58, 0.96)",
    borderColor: colors.cream
  },
  modeRowCopy: {
    flex: 1,
    gap: spacing.xs
  },
  modeRowTitle: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22
  },
  modeRowTitleActive: {
    color: colors.ink
  },
  modeRowDetail: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16
  },
  modeRowDetailActive: {
    color: colors.inkSoft
  },
  modeCheck: {
    alignItems: "center",
    backgroundColor: "rgba(255, 245, 221, 0.08)",
    borderColor: colors.borderSoft,
    borderRadius: radii.full,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  modeCheckActive: {
    backgroundColor: colors.cream,
    borderColor: colors.ink
  },
  modeDoneButton: {
    alignItems: "center",
    backgroundColor: colors.gold,
    borderColor: colors.cream,
    borderRadius: radii.full,
    borderWidth: 1,
    minHeight: 54,
    justifyContent: "center"
  },
  modeDoneButtonText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  qrModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 4, 3, 0.78)",
    justifyContent: "center"
  },
  qrModalSafeArea: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg
  },
  qrSheet: {
    alignItems: "center",
    backgroundColor: "rgba(16, 11, 5, 0.98)",
    borderColor: colors.gold,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  qrSheetHeader: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  qrSheetTitle: {
    color: colors.cream,
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 32
  },
  qrFrame: {
    alignItems: "center",
    backgroundColor: colors.cream,
    borderColor: "#FFE079",
    borderRadius: radii.lg,
    borderWidth: 5,
    justifyContent: "center",
    padding: spacing.sm
  },
  qrCodeStrip: {
    alignItems: "center",
    backgroundColor: "rgba(255, 194, 58, 0.12)",
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: 2,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm
  },
  qrCodeLabel: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  qrCodeValue: {
    color: colors.gold,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 46
  },
  qrHint: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
    maxWidth: 280,
    textAlign: "center"
  },
  qrDoneButton: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.gold,
    borderColor: colors.cream,
    borderRadius: radii.full,
    borderWidth: 1,
    minHeight: 54,
    justifyContent: "center"
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
