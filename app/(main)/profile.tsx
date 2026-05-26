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
  { icon: <Ionicons name="gift-outline" size={20} color="#555" />, label: "Points de fidélité" },
  { icon: <Feather name="credit-card" size={20} color="#555" />, label: "Méthodes de paiement" },
];

const SETTINGS_ITEMS = [
  { icon: <MaterialCommunityIcons name="translate" size={20} color="#555" />, label: "Langue", value: "Français" },
  { icon: <Ionicons name="color-palette-outline" size={20} color="#555" />, label: "Thème", value: "Clair" },
  { icon: <Feather name="bell" size={20} color="#555" />, label: "Notifications", value: "Activées" },
  { icon: <Feather name="headphones" size={20} color="#555" />, label: "Contacter le support" },
];

const MANAGE_ITEMS = [
  { icon: <Feather name="home" size={20} color="#555" />, label: "Ajouter votre propriété" },
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
  { icon: "home", label: "Accueil", lib: "Feather" },
  { icon: "compass", label: "Découvrir", lib: "Feather" },
  { icon: "clipboard", label: "Réservations", lib: "Feather" },
  { icon: "heart", label: "Favoris", lib: "Feather" },
  { icon: "user", label: "Profil", lib: "Feather", active: true },
];

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header avatar + info */}
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={require('@/assets/images/testProfile.jpeg')}
        />
        <Text style={styles.userName}>Alhassane</Text>
        <Text style={styles.userEmail}>barry@gmail.com</Text>
        <TouchableOpacity style={styles.btnEdit}>
          <Text style={styles.btnEditText}>Modifier le profil</Text>
        </TouchableOpacity>
      </View>

      {/* Sections scrollables */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title="Informations de paiement" items={PAYMENT_ITEMS} />
        <SectionCard title="Paramètres" items={SETTINGS_ITEMS} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },

  header: { alignItems: "center", paddingTop: 24, paddingBottom: 16, gap: 4 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: "#e8f5e9" },
  userName: { fontSize: 22, fontWeight: "800", color: "#1a1a1a", marginTop: 6 },
  userEmail: { fontSize: 13, color: "#888" },
  btnEdit: {
    marginTop: 8, borderWidth: 1.5, borderColor: "#43a047",
    borderRadius: 20, paddingHorizontal: 28, paddingVertical: 7,
  },
  btnEditText: { color: "#43a047", fontSize: 13, fontWeight: "700" },

  scroll: { flex: 1, paddingHorizontal: 16 },

  card: { backgroundColor: "#f5f5f5", borderRadius: 18, padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#1a1a1a", marginBottom: 10 },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#ebebeb" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowLabel: { fontSize: 13, fontWeight: "600", color: "#222" },
  rowValue: { fontSize: 13, color: "#aaa", fontWeight: "600" },
});