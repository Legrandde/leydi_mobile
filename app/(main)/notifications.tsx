import {
  Feather, Ionicons, MaterialCommunityIcons, FontAwesome5
} from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView, StyleSheet, Text,
  TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// ─── Types ───────────────────────────────────────────────────────────────────

type IconConfig = {
  lib: "Feather" | "Ionicons" | "MaterialCommunityIcons" | "FontAwesome5";
  name: string;
  color: string;
  bg: string;
};

type Notif = {
  id: string;
  icon: IconConfig;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
  section: "today" | "yesterday" | "week";
};

// ─── Données ─────────────────────────────────────────────────────────────────

const NOTIFS: Notif[] = [
  {
    id: "1",
    icon: { lib: "Feather", name: "check-circle", color: "#43a047", bg: "#e8f5e9" },
    title: "Réservation confirmée !",
    desc: "Votre réservation à Villa Sunset pour le 12 juin a été confirmée.",
    time: "Il y a 2 min", unread: true, section: "today",
  },
  {
    id: "2",
    icon: { lib: "Feather", name: "message-circle", color: "#f57c00", bg: "#fff3e0" },
    title: "Nouveau message de l’hôte",
    desc: 'Alisha Mart : "Bienvenue ! L’enregistrement est à 15h, les clés sont à la réception."',
    time: "Il y a 18 min", unread: true, section: "today",
  },
  {
    id: "3",
    icon: { lib: "MaterialCommunityIcons", name: "star-circle-outline", color: "#1976d2", bg: "#e3f2fd" },
    title: "Vous avez gagné 120 points de fidélité",
    desc: "Les points ont été ajoutés après votre dernière réservation. Utilisez-les lors de votre prochain voyage !",
    time: "Il y a 1h", unread: true, section: "today",
  },
  {
    id: "4",
    icon: { lib: "Feather", name: "star", color: "#8e24aa", bg: "#f3e5f5" },
    title: "Évaluez votre dernier séjour",
    desc: "Comment s’est passée votre expérience à Ocean View Apartment ? Partagez votre avis.",
    time: "Il y a 3h", section: "today",
  },
  {
    id: "5",
    icon: { lib: "Feather", name: "heart", color: "#e91e63", bg: "#fce4ec" },
    title: "Nouvelle propriété ajoutée aux favoris",
    desc: "Beachfront Bungalow est toujours disponible. Ne le manquez pas !",
    time: "Hier, 18:45", section: "yesterday",
  },
  {
    id: "6",
    icon: { lib: "Feather", name: "credit-card", color: "#43a047", bg: "#e8f5e9" },
    title: "Paiement réussi",
    desc: "340,00 $ facturés pour la réservation #FF-2948. Facture envoyée à votre e-mail.",
    time: "Hier, 14:12", section: "yesterday",
  },
  {
    id: "7",
    icon: { lib: "Feather", name: "trending-down", color: "#00897b", bg: "#e0f2f1" },
    title: "Alerte baisse de prix !",
    desc: "Mountain Chalet est passé de 210 $ à 149 $/nuit. Réservez maintenant !",
    time: "Hier, 10:00", section: "yesterday",
  },
  {
    id: "8",
    icon: { lib: "Feather", name: "shield", color: "#1976d2", bg: "#e3f2fd" },
    title: "Mise à jour de sécurité du compte",
    desc: "Un nouvel appareil s’est connecté à votre compte. Si ce n’était pas vous, contactez le support.",
    time: "5 mai, 09:30", section: "week",
  },
];

const TABS = ["Tous", "Non lus", "Mentions"];
const SECTIONS = [
  { key: "today",     label: "Aujourd’hui" },
  { key: "yesterday", label: "Hier" },
  { key: "week",      label: "Cette semaine" },
] as const;

// ─── Icon renderer ───────────────────────────────────────────────────────────

function NotifIcon({ icon }: { icon: IconConfig }) {
  const props = { name: icon.name as any, size: 20, color: icon.color };
  switch (icon.lib) {
    case "Feather":                 return <Feather {...props} />;
    case "Ionicons":                return <Ionicons {...props} />;
    case "MaterialCommunityIcons":  return <MaterialCommunityIcons {...props} />;
    case "FontAwesome5":            return <FontAwesome5 {...props} />;
  }
}

// ─── Card ────────────────────────────────────────────────────────────────────

function NotifCard({ item, onRead }: { item: Notif; onRead: (id: string) => void }) {
  return (
    <TouchableOpacity
      style={[styles.card, item.unread && styles.cardUnread]}
      onPress={() => onRead(item.id)}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, { backgroundColor: item.icon.bg }]}>
        <NotifIcon icon={item.icon} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [notifs, setNotifs] = useState(NOTIFS);

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  const unreadCount = notifs.filter((n) => n.unread).length;

  const filtered =
    activeTab === 1 ? notifs.filter((n) => n.unread)
    : activeTab === 2 ? []
    : notifs;

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
            <Feather name="chevron-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity onPress={markAllRead} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.btnReadAll}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabs}>
        {TABS.map((tab, i) => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(i)}>
            <View style={styles.tabInner}>
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {tab}
              </Text>
              {i === 1 && unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            {activeTab === i && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── List ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map(({ key, label }) => {
          const items = filtered.filter((n) => n.section === key);
          if (!items.length) return null;
          return (
            <View key={key}>
              <Text style={styles.sectionLabel}>{label}</Text>
              {items.map((item) => (
                <NotifCard key={item.id} item={item} onRead={markRead} />
              ))}
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Feather name="bell-off" size={28} color="#ccc" />
            </View>
            <Text style={styles.emptyText}>Aucune notification ici</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f8fa" },

  // Header
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  headerLeft:  { flexDirection: "row", alignItems: "center", gap: 12 },
  btnBack: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: "#f5f5f5",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111", letterSpacing: -0.3 },
  btnReadAll:  { fontSize: 12, fontWeight: "600", color: "#43a047" },

  // Tabs
  tabs: {
    flexDirection: "row", backgroundColor: "#fff",
    paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  tab:          { marginRight: 24, paddingVertical: 12 },
  tabInner:     { flexDirection: "row", alignItems: "center", gap: 6 },
  tabText:      { fontSize: 13, fontWeight: "600", color: "#bbb" },
  tabTextActive:{ color: "#43a047" },
  tabIndicator: { height: 2, backgroundColor: "#43a047", borderRadius: 2, marginTop: 4 },
  badge:        { backgroundColor: "#43a047", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  badgeText:    { color: "#fff", fontSize: 10, fontWeight: "700" },

  // Scroll
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 4 },

  // Section
  sectionLabel: {
    fontSize: 10, fontWeight: "700", color: "#bbb",
    textTransform: "uppercase", letterSpacing: 1.2,
    marginTop: 16, marginBottom: 8,
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent:"center",
    padding: 14,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  cardUnread: { backgroundColor: "#f3faf3" },
  iconWrap: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  cardBody:  { flex: 1 },
  cardTitle: { fontSize: 13, fontWeight: "700", color: "#111", lineHeight: 18 },
  cardDesc:  { fontSize: 12, color: "#999", marginTop: 3, lineHeight: 18 },
  cardTime:  { fontSize: 10, color: "#ccc", marginTop: 6, fontWeight: "600" },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "#43a047", marginTop: 6, flexShrink: 0,
  },

  // Empty
  empty:{ 
    alignItems: "center", 
    marginTop: 80, 
    gap: 12 
  },
  emptyIconWrap:{
    width: 64, height: 64, borderRadius: 20, backgroundColor: "#f5f5f5",
    alignItems: "center", justifyContent: "center",
  },
  emptyText: { fontSize: 14, color: "#bbb", fontWeight: "600" },
});