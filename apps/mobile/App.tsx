import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import {
  Camera,
  ChevronLeft,
  CirclePlay,
  Crown,
  Dice5,
  Gamepad2,
  LogIn,
  QrCode,
  UsersRound,
  Vote
} from "lucide-react-native";

import { ActionButton } from "./src/components/ActionButton";
import { GameModeRow } from "./src/components/GameModeRow";
import { PlayerPill } from "./src/components/PlayerPill";
import { gameModes } from "./src/data/gameModes";
import { colors, radii, spacing } from "./src/theme";
import type { AppScreen, LobbyRole } from "./src/types";

const samplePlayers = [
  { name: "Leo", status: "Host" },
  { name: "Santi", status: "Ready" },
  { name: "Marta", status: "Avatar" },
  { name: "Rita", status: "Ready" }
];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [roomName, setRoomName] = useState("Mesa 7");
  const [roomCode, setRoomCode] = useState("4829");
  const [nickname, setNickname] = useState("");
  const [punishment, setPunishment] = useState("Ultimo paga a proxima ronda");
  const [selectedMode, setSelectedMode] = useState(gameModes[0]?.id ?? "would-you-rather");
  const [lobbyRole, setLobbyRole] = useState<LobbyRole>("host");

  const selectedGame = useMemo(
    () => gameModes.find((mode) => mode.id === selectedMode) ?? gameModes[0],
    [selectedMode]
  );

  function openLobby(role: LobbyRole) {
    setLobbyRole(role);
    setScreen("lobby");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {screen !== "home" ? (
            <ActionButton
              icon={ChevronLeft}
              label="Voltar"
              tone="ghost"
              compact
              onPress={() => setScreen("home")}
            />
          ) : null}

          {screen === "home" ? (
            <View style={styles.screenGap}>
              <View style={styles.hero}>
                <View style={styles.logoMark}>
                  <Gamepad2 color={colors.ink} size={28} strokeWidth={2.6} />
                </View>
                <Text style={styles.kicker}>Jogos locais para grupos</Text>
                <Text style={styles.title}>Playpint</Text>
                <Text style={styles.subtitle}>
                  Cria uma sala, junta os amigos por QR Code e troca de jogo entre rondas.
                </Text>
              </View>

              <View style={styles.actionStack}>
                <ActionButton
                  icon={Crown}
                  label="Criar sala"
                  helper="Host controla rondas e jogadores"
                  onPress={() => setScreen("host")}
                />
                <ActionButton
                  icon={LogIn}
                  label="Entrar numa sala"
                  helper="Codigo, QR Code e nickname"
                  tone="secondary"
                  onPress={() => setScreen("join")}
                />
                <ActionButton
                  icon={Dice5}
                  label="Ver modos de jogo"
                  tone="quiet"
                  onPress={() => setScreen("modes")}
                />
              </View>

              <View style={styles.statusStrip}>
                <Text style={styles.statusNumber}>15s</Text>
                <Text style={styles.statusCopy}>votacao entre rondas</Text>
                <View style={styles.statusDivider} />
                <Text style={styles.statusNumber}>4</Text>
                <Text style={styles.statusCopy}>jogos no MVP</Text>
              </View>
            </View>
          ) : null}

          {screen === "host" ? (
            <View style={styles.screenGap}>
              <View>
                <Text style={styles.sectionLabel}>Host</Text>
                <Text style={styles.heading}>Prepara a sala</Text>
                <Text style={styles.bodyText}>
                  Define o nome da sala, escolhe o primeiro jogo e combina a consequencia.
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

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Primeiro modo</Text>
                <View style={styles.modeList}>
                  {gameModes.slice(0, 4).map((mode) => (
                    <GameModeRow
                      key={mode.id}
                      mode={mode}
                      selected={mode.id === selectedMode}
                      onPress={() => setSelectedMode(mode.id)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Consequencia do ultimo</Text>
                <TextInput
                  value={punishment}
                  onChangeText={setPunishment}
                  placeholder="Ex: escolhe a musica da vergonha"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, styles.textArea]}
                  multiline
                />
              </View>

              <ActionButton
                icon={QrCode}
                label="Gerar codigo e lobby"
                helper={`Sala ${roomName || "sem nome"} com ${selectedGame?.title}`}
                onPress={() => openLobby("host")}
              />
            </View>
          ) : null}

          {screen === "join" ? (
            <View style={styles.screenGap}>
              <View>
                <Text style={styles.sectionLabel}>Join</Text>
                <Text style={styles.heading}>Entra na sala</Text>
                <Text style={styles.bodyText}>
                  Usa o codigo do host ou le o QR Code quando a camera ficar ligada.
                </Text>
              </View>

              <View style={styles.joinGrid}>
                <View style={styles.codeBox}>
                  <QrCode color={colors.cyan} size={46} strokeWidth={2.4} />
                  <Text style={styles.codeCaption}>QR Code em breve</Text>
                </View>
                <View style={styles.codeBox}>
                  <Camera color={colors.pink} size={46} strokeWidth={2.4} />
                  <Text style={styles.codeCaption}>Avatar depois de entrar</Text>
                </View>
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
                  style={styles.input}
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

              <ActionButton
                icon={LogIn}
                label="Entrar no lobby"
                helper={nickname ? `A entrar como ${nickname}` : "Podes escolher nickname depois"}
                onPress={() => openLobby("client")}
              />
            </View>
          ) : null}

          {screen === "lobby" ? (
            <View style={styles.screenGap}>
              <View style={styles.lobbyHeader}>
                <View>
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
                <QrCode color={colors.ink} size={70} strokeWidth={2.8} />
                <View style={styles.qrCopy}>
                  <Text style={styles.qrTitle}>Mostra isto aos jogadores</Text>
                  <Text style={styles.qrSubtitle}>
                    O QR Code real entra quando ligarmos camera e backend.
                  </Text>
                </View>
              </View>

              <View style={styles.playersHeader}>
                <Text style={styles.inputLabel}>Jogadores</Text>
                <Text style={styles.playerCount}>{samplePlayers.length}/8</Text>
              </View>

              <View style={styles.playerList}>
                {samplePlayers.map((player) => (
                  <PlayerPill key={player.name} name={player.name} status={player.status} />
                ))}
              </View>

              <View style={styles.nextGamePanel}>
                <Vote color={colors.lime} size={28} strokeWidth={2.6} />
                <View style={styles.nextGameCopy}>
                  <Text style={styles.nextGameTitle}>{selectedGame?.title}</Text>
                  <Text style={styles.nextGameSubtitle}>
                    Depois de cada ronda, 15 segundos para votar no proximo jogo.
                  </Text>
                </View>
              </View>

              {lobbyRole === "host" ? (
                <ActionButton
                  icon={CirclePlay}
                  label="Comecar partida"
                  helper="Host inicia quando todos estiverem prontos"
                  onPress={() => setScreen("modes")}
                />
              ) : (
                <ActionButton
                  icon={UsersRound}
                  label="Aguardar host"
                  helper="O host controla o inicio da ronda"
                  tone="secondary"
                  onPress={() => setScreen("modes")}
                />
              )}
            </View>
          ) : null}

          {screen === "modes" ? (
            <View style={styles.screenGap}>
              <View>
                <Text style={styles.sectionLabel}>Modos</Text>
                <Text style={styles.heading}>Escolhe o proximo jogo</Text>
                <Text style={styles.bodyText}>
                  Esta lista e o primeiro sitio ideal para o Santi trabalhar no frontend.
                </Text>
              </View>

              <View style={styles.modeList}>
                {gameModes.map((mode) => (
                  <GameModeRow
                    key={mode.id}
                    mode={mode}
                    selected={mode.id === selectedMode}
                    onPress={() => setSelectedMode(mode.id)}
                  />
                ))}
              </View>

              <View style={styles.votePreview}>
                <Text style={styles.voteTimer}>15</Text>
                <View style={styles.voteCopy}>
                  <Text style={styles.voteTitle}>Votacao rapida</Text>
                  <Text style={styles.voteSubtitle}>
                    Percentagens e nomes dos votos entram no jogo Voce Prefere.
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  keyboard: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg
  },
  screenGap: {
    gap: spacing.xl
  },
  hero: {
    gap: spacing.md,
    paddingTop: spacing.xl
  },
  logoMark: {
    alignItems: "center",
    backgroundColor: colors.lime,
    borderRadius: radii.full,
    height: 58,
    justifyContent: "center",
    width: 58
  },
  kicker: {
    color: colors.lime,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 54,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 58
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 17,
    lineHeight: 25,
    maxWidth: 330
  },
  actionStack: {
    gap: spacing.md
  },
  statusStrip: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  statusNumber: {
    color: colors.cyan,
    fontSize: 23,
    fontWeight: "900"
  },
  statusCopy: {
    color: colors.textSoft,
    flex: 1,
    fontSize: 13,
    lineHeight: 18
  },
  statusDivider: {
    backgroundColor: colors.border,
    height: 34,
    width: 1
  },
  sectionLabel: {
    color: colors.pink,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: spacing.xs,
    textTransform: "uppercase"
  },
  heading: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 39
  },
  bodyText: {
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.sm
  },
  formGroup: {
    gap: spacing.sm
  },
  inputLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 17,
    minHeight: 54,
    paddingHorizontal: spacing.md
  },
  textArea: {
    minHeight: 94,
    paddingTop: spacing.md,
    textAlignVertical: "top"
  },
  modeList: {
    gap: spacing.sm
  },
  joinGrid: {
    flexDirection: "row",
    gap: spacing.md
  },
  codeBox: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.sm,
    minHeight: 132,
    justifyContent: "center",
    padding: spacing.md
  },
  codeCaption: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center"
  },
  lobbyHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  roomCodePill: {
    alignItems: "center",
    borderColor: colors.cyan,
    borderRadius: radii.md,
    borderWidth: 1,
    minWidth: 92,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  roomCodeLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  roomCodeValue: {
    color: colors.cyan,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0
  },
  qrPanel: {
    alignItems: "center",
    backgroundColor: colors.lime,
    borderRadius: radii.md,
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
    fontSize: 17,
    fontWeight: "900"
  },
  qrSubtitle: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 18
  },
  playersHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playerCount: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: "900"
  },
  playerList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  nextGamePanel: {
    alignItems: "center",
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
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  nextGameSubtitle: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18
  },
  votePreview: {
    alignItems: "center",
    backgroundColor: colors.surfaceHot,
    borderColor: colors.pink,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.lg,
    padding: spacing.lg
  },
  voteTimer: {
    color: colors.pink,
    fontSize: 54,
    fontWeight: "900",
    minWidth: 72,
    textAlign: "center"
  },
  voteCopy: {
    flex: 1,
    gap: spacing.xs
  },
  voteTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900"
  },
  voteSubtitle: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18
  }
});
