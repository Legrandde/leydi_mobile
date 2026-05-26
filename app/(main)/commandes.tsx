import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import {
  FlatList, ImageProps, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

type OrderStatus = "transit" | "delivered" | "pending" | "cancelled";

type OrderItemThumb = {
  emoji: string;
  color: string;
};

type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItemThumb[] ;
  count: number;
  total: number;
  payMethod: string;
  payIcon: "bolt" | "phone-portrait" | "cash" | "card";
};

type TabFilter = "all" | OrderStatus;

// ─── Données mock ─────────────────────────────────────────────────────────────
// Dans une vraie app → fetch depuis ton API Django avec le token JWT de l'user

const ORDERS: Order[] = [
  {
    id: "LK-2024", date: "Aujourd'hui · 12h30", status: "transit",
    items: [
      { emoji: "https://i.pinimg.com/736x/05/4f/19/054f190455f5f7981b9b00a5652d09bc.jpg", color: "#fff3e0" },
      { emoji: "https://i.pinimg.com/736x/d7/7b/07/d77b0787a868f43175c3a7388f4663d2.jpg", color: "#e8f5e9" },
      { emoji: "https://i.pinimg.com/736x/ba/e3/65/bae365a8aad8b2017ae93993c897753d.jpg", color: "#ffebee" },
    ],
    count: 3, total: 3150, payMethod: "Wave", payIcon: "bolt",
  },
  {
    id: "LK-2021", date: "9 mai 2025 · 10h05", status: "delivered",
    items: [
      { emoji: "https://i.pinimg.com/736x/d7/7b/07/d77b0787a868f43175c3a7388f4663d2.jpg", color: "#fff8e1" },
      { emoji: "https://i.pinimg.com/1200x/17/83/e5/1783e56e146181775a3d0ffa04942427.jpg", color: "#fff3e0" },
    ],
    count: 2, total: 2100, payMethod: "Orange Money", payIcon: "phone-portrait",
  },
  {
    id: "LK-2019", date: "6 mai 2025 · 09h22", status: "delivered",
    items: [
      { emoji: "https://i.pinimg.com/736x/a5/29/84/a52984f3b16dc48adc55e93e6befa1a2.jpg", color: "#fce4ec" },
      { emoji: "https://i.pinimg.com/736x/a0/ca/5c/a0ca5ce90067d0321580fbc3d507f0ec.jpg", color: "#fff3e0" },
      { emoji: "https://i.pinimg.com/1200x/17/83/e5/1783e56e146181775a3d0ffa04942427.jpg", color: "#fff3e0" },
    ],
    count: 5, total: 4250, payMethod: "À la livraison", payIcon: "cash",
  },
  
];

const TABS: { key: TabFilter; label: string }[] = [
  { key: "all",       label: "Toutes"     },
  { key: "delivered", label: "Livrées"    },
  { key: "transit",   label: "En cours"   },
  { key: "pending",   label: "En attente" },
  { key: "cancelled", label: "Annulées"   },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, {
  label: string; bg: string; color: string; dot: string;
}> = {
  delivered: { label: "Livré",      bg: "#EAF3DE", color: "#27500A", dot: "#3B6D11" },
  transit:   { label: "En route",   bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5" },
  pending:   { label: "En attente", bg: "#FAEEDA", color: "#633806", dot: "#854F0B" },
  cancelled: { label: "Annulé",     bg: "#FCEBEB", color: "#791F1F", dot: "#A32D2D" },
};

const GREEN = "#16A34A";

// ─── Pay icon ────────────────────────────────────────────────────────────────

function PayIcon({ name }: { name: Order["payIcon"] }) {
  const props = { size: 13, color: "#aaa" };
  switch (name) {
    case "bolt":          return <Image source={{uri: 'https://i.pinimg.com/736x/36/af/0d/36af0df12dae18c18ae511e1bcf2ade6.jpg'}} style={{width:20, height:20, borderRadius:50}} />;
    case "phone-portrait":return <Image source={{uri: 'https://i.pinimg.com/736x/d4/0a/ae/d40aaed93de5fb669b845167963c6d9f.jpg'}} style={{width:20, height:20, borderRadius:50}} />;
    case "cash":          return <Image source={{uri: 'https://i.pinimg.com/736x/f9/f7/2a/f9f72a859cc3b5c99335752592e586c9.jpg'}} style={{width:20, height:20, borderRadius:50}} />;
  }
}

// ─── Action buttons par statut ───────────────────────────────────────────────

function OrderActions({ status, orderId }: { status: OrderStatus; orderId: string }) {
  const router = useRouter();
  switch (status) {
    case "delivered":
      return (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
            <Text style={styles.actionBtnText}>Réacheter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} activeOpacity={0.75}>
            <Text style={[styles.actionBtnText, { color: "#fff" }]}>Laisser un avis</Text>
          </TouchableOpacity>
        </View>
      );
    case "transit":
      return (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={() => router.push("/(single)/traking")}
            activeOpacity={0.75}
          >
            <Text style={[styles.actionBtnText, { color: "#fff" }]}>Suivre</Text>
          </TouchableOpacity>
        </View>
      );
    case "pending":
      return (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
            <Text style={styles.actionBtnText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} activeOpacity={0.75}>
            <Text style={[styles.actionBtnText, { color: "#fff" }]}>Détails</Text>
          </TouchableOpacity>
        </View>
      );
    case "cancelled":
      return (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} activeOpacity={0.75}>
            <Text style={[styles.actionBtnText, { color: "#fff" }]}>Recommander</Text>
          </TouchableOpacity>
        </View>
      );
  }
}

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const cfg      = STATUS_CONFIG[order.status];
  const thumbs   = order.items.slice(0, 3);
  const extra    = order.count > 3 ? order.count - 3 : 0;
  const fmt      = (n: number) => n.toLocaleString("fr-FR") + " F";

  return (
    <View style={styles.card}>
      {/* En-tête */}
      <View style={styles.cardHead}>
        <View>
          <Text style={styles.orderId}>#{order.id}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />
          <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      {/* Aperçu articles */}
      <View style={styles.cardItems}>
        <View style={styles.thumbsRow}>
          {thumbs.map((item, idx) => (
            <View
              key={idx}
              style={[styles.thumb, { backgroundColor: item.color }]}
            >
              <Image source={{uri: item.emoji}} style={{ width: 40, height:40 }} />
            </View>
          ))}
          {extra > 0 && (
            <View style={styles.thumbMore}>
              <Text style={styles.thumbMoreText}>+{extra}</Text>
            </View>
          )}
        </View>
        <View style={styles.itemsSummary}>
          <Text style={styles.itemsCount}>
            {order.count} article{order.count > 1 ? "s" : ""}
          </Text>
          <Text style={styles.itemsTotal}>{fmt(order.total)}</Text>
        </View>
      </View>

      {/* Pied de carte */}
      <View style={styles.cardFoot}>
        <View style={styles.payMethod}>
          <PayIcon name={order.payIcon} />
          <Text style={styles.payMethodText}>{order.payMethod}</Text>
        </View>
        <OrderActions status={order.status} orderId={order.id} />
      </View>
    </View>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Feather name="shopping-bag" size={28} color="#bbb" />
      </View>
      <Text style={styles.emptyTitle}>Aucune commande</Text>
      <Text style={styles.emptySub}>
        Vous n'avez aucune commande{"\n"}dans cette catégorie.
      </Text>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const filtered = useMemo(() =>
    activeTab === "all"
      ? ORDERS
      : ORDERS.filter((o) => o.status === activeTab),
    [activeTab]
  );

  const totalSpent = useMemo(
    () => ORDERS.filter((o) => o.status !== "cancelled")
               .reduce((s, o) => s + o.total, 0),
    []
  );

  const inTransitCount = ORDERS.filter((o) => o.status === "transit").length;

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Top bar ── */}
      <View style={styles.topbar}>
        <View style={styles.topbarRow}>
          <View style={styles.topbarLeft}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
              <Feather name="arrow-left" size={17} color="#555" />
            </TouchableOpacity>
            <Text style={styles.topbarTitle}>Mes commandes</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.75}>
            <Feather name="sliders" size={13} color="#666" />
            <Text style={styles.filterBtnText}>Filtrer</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
          style={styles.tabsScroll}
        >
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(key)}
                activeOpacity={0.75}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {label}
                </Text>
                {key === "all" && inTransitCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{ORDERS.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Stats ── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total commandes</Text>
          <Text style={styles.statVal}>{ORDERS.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total dépensé</Text>
          <Text style={[styles.statVal, { color: GREEN }]}>
            {totalSpent.toLocaleString("fr-FR")} F
          </Text>
        </View>
      </View>

      {/* ── Liste ── */}
      <FlatList
        data={filtered}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f8fa" },

  // Topbar
  topbar: {
    backgroundColor: "#fff",
    borderBottomWidth: 0.5, borderBottomColor: "#ebebeb",
  },
  topbarRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
  },
  topbarLeft:  { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: "#f5f5f5", borderWidth: 0.5, borderColor: "#e8e8e8",
    alignItems: "center", justifyContent: "center",
  },
  topbarTitle: { fontSize: 18, fontWeight: "600", color: "#111" },
  filterBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, borderWidth: 0.5, borderColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
  },
  filterBtnText: { fontSize: 12, color: "#666", fontWeight: "500" },

  // Tabs
  tabsScroll:   { },
  tabsContent:  { paddingHorizontal: 16, gap: 0 },
  tab: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingVertical: 10, paddingHorizontal: 2,
    marginRight: 20, borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive:     { borderBottomColor: GREEN },
  tabText:       { fontSize: 13, fontWeight: "500", color: "#bbb" },
  tabTextActive: { color: GREEN },
  tabBadge: {
    backgroundColor: GREEN, borderRadius: 8,
    paddingHorizontal: 5, paddingVertical: 1,
  },
  tabBadgeText: { fontSize: 9, fontWeight: "700", color: "#fff" },

  // Stats
  statsRow: {
    flexDirection: "row", gap: 8,
    padding: 12, paddingHorizontal: 16,
  },
  statCard: {
    flex: 1, backgroundColor: "#fff",
    borderRadius: 12, borderWidth: 0.5, borderColor: "#ebebeb",
    padding: 12,
  },
  statLabel: { fontSize: 11, color: "#aaa", marginBottom: 4 },
  statVal:   { fontSize: 18, fontWeight: "600", color: "#111" },

  // List
  listContent: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 2 },

  // Card
  card: {
    backgroundColor: "#fff", borderRadius: 14,
    borderWidth: 0.5, borderColor: "#ebebeb", overflow: "hidden",
  },
  cardHead: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: "#f5f5f5",
  },
  orderId:   { fontSize: 13, fontWeight: "600", color: "#111" },
  orderDate: { fontSize: 11, color: "#aaa", marginTop: 2 },

  statusPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  statusDot:   { width: 5, height: 5, borderRadius: 3 },
  statusLabel: { fontSize: 11, fontWeight: "600" },

  // Items row
  cardItems: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: "#f5f5f5",
    gap: 8,
  },
  thumbsRow: { flexDirection: "row", gap: 6 },
  thumb: {
    width: 36, height: 36, borderRadius: 9,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  thumbMore: {
    width: 36, height: 36, borderRadius: 9,
    backgroundColor: "#f5f5f5", borderWidth: 0.5, borderColor: "#e8e8e8",
    alignItems: "center", justifyContent: "center",
  },
  thumbMoreText: { fontSize: 11, fontWeight: "600", color: "#888" },
  itemsSummary:  { marginLeft: "auto", alignItems: "flex-end" },
  itemsCount:    { fontSize: 11, color: "#aaa" },
  itemsTotal:    { fontSize: 14, fontWeight: "600", color: "#111", marginTop: 2 },

  // Card foot
  cardFoot: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 10,
  },
  payMethod:     { flexDirection: "row", alignItems: "center", gap: 5 },
  payMethodText: { fontSize: 11, color: "#aaa" },

  // Action buttons
  actionsRow: { flexDirection: "row", gap: 6 },
  actionBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, borderWidth: 0.5, borderColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
  },
  actionBtnPrimary: { backgroundColor: GREEN, borderColor: GREEN },
  actionBtnText:    { fontSize: 11, fontWeight: "600", color: "#555" },

  // Empty
  emptyWrap: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyIcon: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center",
  },
  emptyTitle: { fontSize: 15, fontWeight: "600", color: "#111" },
  emptySub:   { fontSize: 13, color: "#aaa", textAlign: "center", lineHeight: 20 },
});