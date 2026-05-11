import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated, Easing, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCartStore } from "../store/cartStore";

// ─── Types ───────────────────────────────────────────────────────────────────

type StepStatus = "done" | "active" | "idle";

type TimelineStep = {
  id: number;
  label: string;
  sub: string;
  status: StepStatus;
  icon: string;
};

// ─── Données statiques ───────────────────────────────────────────────────────

const STEPS: TimelineStep[] = [
  { id: 1, label: "Commande confirmée",           sub: "Aujourd'hui · 11h32",         status: "done",   icon: "check"    },
  { id: 2, label: "Produits récoltés et préparés", sub: "Aujourd'hui · 12h05",         status: "done",   icon: "check"    },
  { id: 3, label: "En cours de livraison",          sub: "Modou est à 2,3 km · ~14 min",status: "active", icon: "package"  },
  { id: 4, label: "Livré",                          sub: "Prévu entre 14h00 – 14h30",  status: "idle",   icon: "home"     },
];

const GREEN      = "#2e7d32";
const GREEN_LIGHT= "#e8f5e9";
const GREEN_DARK = "#1b5e20";

// ─── Sous-composants ─────────────────────────────────────────────────────────

/** Point pulsant sur la step active */
function PulseDot() {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.3, duration: 700, useNativeDriver: true, easing: Easing.ease }),
        Animated.timing(anim, { toValue: 1,   duration: 700, useNativeDriver: true, easing: Easing.ease }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.activeDotWrap}>
      <Animated.View style={[styles.activeDotRing, { opacity: anim }]} />
      <View style={styles.activeDotCore} />
    </View>
  );
}

/** Icône de step */
function StepDot({ step }: { step: TimelineStep }) {
  if (step.status === "active") return <PulseDot />;
  if (step.status === "done") {
    return (
      <View style={[styles.stepDot, styles.stepDotDone]}>
        <Feather name="check" size={10} color="#fff" />
      </View>
    );
  }
  return <View style={[styles.stepDot, styles.stepDotIdle]} />;
}

/** Timeline de suivi */
function Timeline() {
  return (
    <View>
      {STEPS.map((step, idx) => {
        const isLast   = idx === STEPS.length - 1;
        const lineDone = step.status === "done";
        return (
          <View key={step.id} style={styles.tlRow}>
            {/* Colonne gauche : dot + ligne */}
            <View style={styles.tlLeft}>
              <StepDot step={step} />
              {!isLast && (
                <View style={[styles.tlLine, lineDone && styles.tlLineDone]} />
              )}
            </View>
            {/* Contenu */}
            <View style={[styles.tlContent, isLast && { paddingBottom: 0 }]}>
              <Text style={[
                styles.tlLabel,
                step.status === "idle" && styles.tlLabelIdle,
              ]}>
                {step.label}
              </Text>
              <Text style={styles.tlSub}>{step.sub}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

/** Carte fausse map */
function MapArea({ eta }: { eta: number }) {
  const bikeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bikeAnim, { toValue: 1, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(bikeAnim, { toValue: 0, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, []);

  const bikeX = bikeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 28] });
  const bikeY = bikeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });

  return (
    <View style={styles.mapArea}>
      {/* Grille */}
      {[33, 66].map((t) => (
        <View key={`h${t}`} style={[styles.mapGridH, { top: `${t}%` as any }]} />
      ))}
      {[25, 50, 75].map((l) => (
        <View key={`v${l}`} style={[styles.mapGridV, { left: `${l}%` as any }]} />
      ))}

      {/* Trait de route */}
      <View style={styles.mapRoute} />

      {/* Bulle livreur */}
      <Animated.View
        style={[styles.bikeWrap, { transform: [{ translateX: bikeX }, { translateY: bikeY }] }]}
      >
        <View style={styles.bikeBubble}>
          <MaterialCommunityIcons name="bicycle" size={14} color={GREEN} />
          <Text style={styles.bikeBubbleText}>En route</Text>
        </View>
      </Animated.View>

      {/* Pin destination */}
      <View style={styles.destPin}>
        <View style={styles.destPinDot} />
        <View style={styles.destPinLine} />
      </View>

      {/* ETA chip */}
      <View style={styles.etaChip}>
        <Feather name="clock" size={13} color={GREEN} />
        <View>
          <Text style={styles.etaTime}>{eta} min</Text>
          <Text style={styles.etaLabel}>Arrivée estimée</Text>
        </View>
      </View>
    </View>
  );
}

/** Carte livreur */
function DriverCard() {
  return (
    <View style={styles.card}>
      <View style={styles.driverHead}>
        {/* Avatar */}
        <View style={styles.driverAvatar}>
          <Text style={styles.driverAvatarText}>MD</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.driverName}>Modou Diagne</Text>
          <Text style={styles.driverSub}>Livreur · Dakar Plateau</Text>
          {/* Rating */}
          <View style={styles.ratingRow}>
            {[1,2,3,4,5].map((i) => (
              <Feather key={i} name="star" size={10} color="#f59e0b" />
            ))}
            <Text style={styles.ratingText}>4.9 · 248 livraisons</Text>
          </View>
        </View>
        <View style={styles.driverBikeIcon}>
          <MaterialCommunityIcons name="bicycle" size={18} color={GREEN} />
        </View>
      </View>

      <View style={styles.driverDivider} />

      <View style={styles.driverActions}>
        <TouchableOpacity style={styles.driverBtn} activeOpacity={0.75}>
          <Feather name="message-circle" size={15} color="#555" />
          <Text style={styles.driverBtnText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.driverBtn, styles.driverBtnPrimary]} activeOpacity={0.75}>
          <Feather name="phone" size={15} color="#fff" />
          <Text style={[styles.driverBtnText, { color: "#fff" }]}>Appeler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function TrackingScreen() {
  const router = useRouter();

  // Récupère les articles depuis le store (optionnel — pour afficher le recap)
  // Si le panier est déjà vidé par confirm.tsx, on affiche les données de la commande passée
  // Dans une vraie app, on récupèrerait la commande depuis une API
  const ORDER_ITEMS = [
    { id: 1, name: "Tomate Roma",   emoji: "🍅", emojiColor: "#fff3e0", qty: 2, unit: "kg",    price: 750  },
    { id: 4, name: "Gombo frais",   emoji: "🫛", emojiColor: "#e8f5e9", qty: 2, unit: "botte", price: 600  },
    { id: 6, name: "Piment doux",   emoji: "🫑", emojiColor: "#ffebee", qty: 1, unit: "kg",    price: 800  },
  ];

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * 0.1);
  const total    = subtotal - discount;
  const fmt      = (n: number) => n.toLocaleString("fr-FR") + " F";

  // Compte à rebours ETA
  const [eta, setEta] = useState(14);
  useEffect(() => {
    if (eta <= 0) return;
    const t = setInterval(() => setEta((e) => Math.max(0, e - 1)), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Top bar ── */}
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(single)/ProductsList')} activeOpacity={0.75}>
            <Feather name="arrow-left" size={17} color="#555" />
          </TouchableOpacity>
          <View>
            <Text style={styles.topbarTitle}>Suivi commande</Text>
            <Text style={styles.orderId}>#LK-2024</Text>
          </View>
        </View>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="more-vertical" size={18} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* ── Map ── */}
      <MapArea eta={eta} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

        {/* ── Statut + timeline ── */}
        <View style={styles.card}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Statut de la livraison</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>En route</Text>
            </View>
          </View>
          <Timeline />
        </View>

        {/* ── Livreur ── */}
        <DriverCard />

        {/* ── Récap commande ── */}
        <View style={[styles.card, { paddingHorizontal: 0, paddingVertical: 0 }]}>
          <View style={styles.recapHead}>
            <Feather name="shopping-bag" size={14} color={GREEN} />
            <Text style={styles.sectionTitle}>
              Articles ({ORDER_ITEMS.length})
            </Text>
          </View>

          {ORDER_ITEMS.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.recapRow,
                idx === ORDER_ITEMS.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.recapEmoji, { backgroundColor: item.emojiColor }]}>
                <Text style={{ fontSize: 16 }}>{item.emoji}</Text>
              </View>
              <Text style={styles.recapName}>{item.name}</Text>
              <Text style={styles.recapQty}>×{item.qty} {item.unit}</Text>
              <Text style={styles.recapPrice}>{fmt(item.price * item.qty)}</Text>
            </View>
          ))}

          {/* Total */}
          <View style={styles.recapTotal}>
            <Text style={styles.recapTotalLabel}>Total payé</Text>
            <Text style={styles.recapTotalVal}>{fmt(total)}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f8fa" },

  // Topbar
  topbar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: "#ebebeb",
  },
  topbarLeft:  { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: "#f5f5f5", borderWidth: 0.5, borderColor: "#e8e8e8",
    alignItems: "center", justifyContent: "center",
  },
  topbarTitle: { fontSize: 17, fontWeight: "600", color: "#111" },
  orderId:     { fontSize: 11, color: "#aaa", marginTop: 1 },

  // Map
  mapArea: {
    height: 200, backgroundColor: "#e8f0e8",
    overflow: "hidden", position: "relative",
  },
  mapGridH: { position: "absolute", left: 0, right: 0, height: 0.5, backgroundColor: "rgba(0,0,0,0.06)" },
  mapGridV: { position: "absolute", top: 0, bottom: 0, width: 0.5, backgroundColor: "rgba(0,0,0,0.06)" },
  mapRoute: {
    position: "absolute",
    top: 80, left: "30%", right: "25%",
    height: 2.5, backgroundColor: GREEN,
    opacity: 0.35, borderRadius: 2,
    transform: [{ rotate: "-18deg" }],
  },
  bikeWrap: { position: "absolute", top: 70, left: "28%" },
  bikeBubble: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#fff", borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 0.5, borderColor: "#ddd",
  },
  bikeBubbleText: { fontSize: 11, fontWeight: "600", color: "#111" },
  destPin: {
    position: "absolute", bottom: 36, left: "50%",
    alignItems: "center", marginLeft: -7,
  },
  destPinDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: GREEN, borderWidth: 2.5, borderColor: "#fff",
  },
  destPinLine: { width: 2, height: 10, backgroundColor: GREEN, opacity: 0.4 },
  etaChip: {
    position: "absolute", top: 12, right: 12,
    flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: "#fff", borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 7,
    borderWidth: 0.5, borderColor: "#ddd",
  },
  etaTime:  { fontSize: 13, fontWeight: "700", color: "#111" },
  etaLabel: { fontSize: 10, color: "#aaa" },

  // Body
  body: { padding: 12, gap: 10, paddingBottom: 32 },

  // Card générique
  card: {
    backgroundColor: "#fff", borderRadius: 14,
    borderWidth: 0.5, borderColor: "#ebebeb",
    padding: 14, overflow: "hidden",
  },
  sectionHead: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 16,
  },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#111" },

  // Badge statut
  statusBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: GREEN_LIGHT, borderRadius: 8,
    paddingHorizontal: 9, paddingVertical: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN },
  statusText: { fontSize: 11, fontWeight: "600", color: GREEN_DARK },

  // Timeline
  tlRow:     { flexDirection: "row", gap: 12 },
  tlLeft:    { alignItems: "center", width: 20 },
  tlLine:    { width: 1, flex: 1, backgroundColor: "#e8e8e8", marginVertical: 3, minHeight: 16 },
  tlLineDone:{ backgroundColor: GREEN },
  tlContent: { flex: 1, paddingBottom: 18 },
  tlLabel:   { fontSize: 13, fontWeight: "600", color: "#111" },
  tlLabelIdle:{ color: "#bbb", fontWeight: "400" },
  tlSub:     { fontSize: 11, color: "#aaa", marginTop: 2 },

  // Step dot
  stepDot: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  stepDotDone: { backgroundColor: GREEN },
  stepDotIdle: { backgroundColor: "#f0f0f0", borderWidth: 0.5, borderColor: "#ddd" },

  // Pulse dot
  activeDotWrap: { width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  activeDotRing: {
    position: "absolute", width: 20, height: 20, borderRadius: 10,
    borderWidth: 3, borderColor: "#c8e6c9",
  },
  activeDotCore: { width: 12, height: 12, borderRadius: 6, backgroundColor: GREEN },

  // Driver card
  driverHead:   { flexDirection: "row", alignItems: "center", gap: 12 },
  driverAvatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: GREEN_LIGHT, alignItems: "center", justifyContent: "center",
  },
  driverAvatarText: { fontSize: 14, fontWeight: "600", color: GREEN_DARK },
  driverName:       { fontSize: 14, fontWeight: "600", color: "#111" },
  driverSub:        { fontSize: 12, color: "#aaa", marginTop: 2 },
  ratingRow:        { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 4 },
  ratingText:       { fontSize: 11, color: "#888", marginLeft: 4 },
  driverBikeIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: GREEN_LIGHT, alignItems: "center", justifyContent: "center",
  },
  driverDivider: { height: 0.5, backgroundColor: "#f0f0f0", marginVertical: 12 },
  driverActions: { flexDirection: "row", gap: 8 },
  driverBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 9, borderRadius: 10,
    backgroundColor: "#f5f5f5", borderWidth: 0.5, borderColor: "#e8e8e8",
  },
  driverBtnPrimary: { backgroundColor: GREEN, borderColor: GREEN },
  driverBtnText:    { fontSize: 12, fontWeight: "600", color: "#333" },

  // Recap commande
  recapHead: {
    flexDirection: "row", alignItems: "center", gap: 7,
    padding: 12, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0",
  },
  recapRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: "#f5f5f5",
  },
  recapEmoji: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  recapName:  { flex: 1, fontSize: 13, fontWeight: "600", color: "#111" },
  recapQty:   { fontSize: 12, color: "#aaa" },
  recapPrice: { fontSize: 13, fontWeight: "600", color: "#111", minWidth: 60, textAlign: "right" },
  recapTotal: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 10,
    borderTopWidth: 0.5, borderTopColor: "#f0f0f0",
  },
  recapTotalLabel: { fontSize: 13, fontWeight: "600", color: "#111" },
  recapTotalVal:   { fontSize: 14, fontWeight: "700", color: GREEN },
});