import {
  Feather, FontAwesome5, MaterialCommunityIcons, Ionicons
} from "@expo/vector-icons";
import {
  Image, ScrollView, StyleSheet, Text,
  TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Données des sections ───────────────────────────────────────────────────

const PAYMENT_ITEMS = [
  { icon: <Ionicons name="gift-outline" size={20} color="#555" />, label: "Loyalty points" },
  { icon: <Feather name="credit-card" size={20} color="#555" />, label: "Payment methods" },
];

const SETTINGS_ITEMS = [
  { icon: <MaterialCommunityIcons name="translate" size={20} color="#555" />, label: "Language", value: "English" },
  { icon: <Ionicons name="color-palette-outline" size={20} color="#555" />, label: "Theme", value: "Light" },
  { icon: <Feather name="bell" size={20} color="#555" />, label: "Notifications", value: "Enabled" },
  { icon: <Feather name="headphones" size={20} color="#555" />, label: "Contact support" },
];

const MANAGE_ITEMS = [
  { icon: <Feather name="home" size={20} color="#555" />, label: "List your property" },
];

// ─── Composants utilitaires ─────────────────────────────────────────────────

function SectionCard({ title, items }: { title: string; items: any[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.map((item, i) => (
        <View key={i} style={[styles.row, i < items.length - 1 && styles.rowBorder]}>
          <View style={styles.rowLeft}>
            {item.icon}
            <Text style={styles.rowLabel}>{item.label}</Text>
          </View>
          {item.value
            ? <Text style={styles.rowValue}>{item.value}</Text>
            : <Feather name="chevron-right" size={16} color="#ccc" />
          }
        </View>
      ))}
    </View>
  );
}

// ─── Tab bar items ──────────────────────────────────────────────────────────

const TABS = [
  { icon: "home", label: "Home", lib: "Feather" },
  { icon: "compass", label: "Stories", lib: "Feather" },
  { icon: "clipboard", label: "Booking", lib: "Feather" },
  { icon: "heart", label: "Favorite", lib: "Feather" },
  { icon: "user", label: "Profile", lib: "Feather", active: true },
];

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header avatar + info */}
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
          // ou : source={require("../../assets/images/avatar.jpg")}
        />
        <Text style={styles.userName}>Mohamed</Text>
        <Text style={styles.userEmail}>Mohamed@gmail.com</Text>
        <TouchableOpacity style={styles.btnEdit}>
          <Text style={styles.btnEditText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      {/* Sections scrollables */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title="Payment info" items={PAYMENT_ITEMS} />
        <SectionCard title="Settings" items={SETTINGS_ITEMS} />
        <SectionCard title="Manage your Property" items={MANAGE_ITEMS} />
      </ScrollView>

      {/* Tab bar */}
      
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },

  // Header
  header: { alignItems: "center", paddingTop: 24, paddingBottom: 16, gap: 4 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: "#e8f5e9" },
  userName: { fontSize: 22, fontWeight: "800", color: "#1a1a1a", marginTop: 6 },
  userEmail: { fontSize: 13, color: "#888" },
  btnEdit: {
    marginTop: 8, borderWidth: 1.5, borderColor: "#43a047",
    borderRadius: 20, paddingHorizontal: 28, paddingVertical: 7,
  },
  btnEditText: { color: "#43a047", fontSize: 13, fontWeight: "700" },

  // Scroll
  scroll: { flex: 1, paddingHorizontal: 16 },

  // Card
  card: { backgroundColor: "#f5f5f5", borderRadius: 18, padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#1a1a1a", marginBottom: 10 },

  // Row
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#ebebeb" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowLabel: { fontSize: 13, fontWeight: "600", color: "#222" },
  rowValue: { fontSize: 13, color: "#aaa", fontWeight: "600" },

  // Tab bar
  tabBar: {
    flexDirection: "row", justifyContent: "space-around",
    paddingTop: 10, paddingBottom: 16,
    borderTopWidth: 1, borderTopColor: "#f0f0f0",
  },
  tab: { alignItems: "center", gap: 3 },
  tabLabel: { fontSize: 10, fontWeight: "600", color: "#aaa" },
  tabLabelActive: { color: "#43a047" },
});