import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCartStore, CartItem } from "../store/cartStore";

// ─── Types & données ─────────────────────────────────────────────────────────

type Category = "all" | "legume" | "fruit" | "condiment" | "racine";

type Product = Omit<CartItem, "qty"> & { cat: Category; bio: boolean; note: number; avis: number };

const PRODUCTS: Product[] = [
  { id: 1, name: "Tomate Roma",     cat: "legume",    emoji: "🍅", emojiColor: "#fff3e0", cultivateur: "Mamadou Diallo",   localite: "Thiès",       price: 750,  unit: "kg",    bio: true,  note: 4.7, avis: 124 },
  { id: 2, name: "Mangue Kent",     cat: "fruit",     emoji: "🥭", emojiColor: "#fff8e1", cultivateur: "Fatoumata Sow",    localite: "Ziguinchor",  price: 1200, unit: "kg",    bio: false, note: 4.9, avis: 87  },
  { id: 3, name: "Oignon violet",   cat: "condiment", emoji: "🧅", emojiColor: "#fce4ec", cultivateur: "Ibrahima Ndiaye",  localite: "Saint-Louis", price: 500,  unit: "kg",    bio: false, note: 4.3, avis: 56  },
  { id: 4, name: "Gombo frais",     cat: "legume",    emoji: "🫛", emojiColor: "#e8f5e9", cultivateur: "Aïssatou Balde",   localite: "Kolda",       price: 600,  unit: "botte", bio: true,  note: 4.6, avis: 32  },
  { id: 5, name: "Carotte Nantes",  cat: "racine",    emoji: "🥕", emojiColor: "#fff3e0", cultivateur: "Ousmane Faye",     localite: "Dakar",       price: 450,  unit: "kg",    bio: false, note: 4.2, avis: 41  },
  { id: 6, name: "Piment doux",     cat: "condiment", emoji: "🫑", emojiColor: "#ffebee", cultivateur: "Rokhaya Gaye",     localite: "Kaolack",     price: 800,  unit: "kg",    bio: true,  note: 4.5, avis: 19  },
];

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "all",       label: "Tout"        },
  { key: "legume",    label: "Légumes"     },
  { key: "fruit",     label: "Fruits"      },
  { key: "condiment", label: "Condiments"  },
  { key: "racine",    label: "Racines"     },
];

const GREEN = "#2e7d32";

// ─── Stars ───────────────────────────────────────────────────────────────────

function Stars({ note }: { note: number }) {
  return (
    <View style={styles.starsRow}>
      {[1,2,3,4,5].map((i) => (
        <Feather key={i} name="star" size={10}
          color={i <= Math.round(note) ? "#f59e0b" : "#e0e0e0"}
          style={{ marginRight: 1 }}
        />
      ))}
    </View>
  );
}

// ─── ProductCard ─────────────────────────────────────────────────────────────

function ProductCard({ item }: { item: Product }) {
  const { cart, add, inc, dec } = useCartStore();
  const qty = cart[item.id]?.qty ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.imgBox, { backgroundColor: item.emojiColor }]}>
          <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.prodName} numberOfLines={1}>{item.name}</Text>
            {item.bio && (
              <View style={styles.bioBadge}>
                <Text style={styles.bioBadgeText}>Bio</Text>
              </View>
            )}
          </View>
          <View style={styles.cultivateurRow}>
            <MaterialCommunityIcons name="sprout-outline" size={12} color="#9e9e9e" />
            <Text style={styles.cultivateurText}>{item.cultivateur} · {item.localite}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Stars note={item.note} />
            <Text style={styles.ratingVal}>{item.note}</Text>
            <Text style={styles.avisCount}>({item.avis} avis)</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBot}>
        <View style={styles.priceBlock}>
          <Text style={styles.price}>{item.price.toLocaleString("fr-FR")} F</Text>
          <Text style={styles.priceUnit}>/ {item.unit}</Text>
        </View>

        {qty === 0 ? (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => add(item)}
            activeOpacity={0.75}
          >
            <Feather name="plus" size={13} color="white" />
            <Text style={styles.addBtnText}>Ajouter</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyCtrl}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => dec(item.id)} activeOpacity={0.7}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNum}>{qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => inc(item.id)} activeOpacity={0.7}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function ProductListScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState<Category>("all");
  const { totalItems, totalPrice } = useCartStore();

  const items    = totalItems();
  const total    = totalPrice();
  const filtered = activeCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === activeCat);

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Top bar ── */}
      <View style={styles.topbar}>
        <View style={styles.topbarRow}>
          <Text style={styles.topbarTitle}>Marché frais</Text>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => items > 0 && router.push("/confirm")}
            activeOpacity={0.8}
          >
            <Feather name="shopping-bag" size={18} color="#555" />
            {items > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{items}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={14} color="#bbb" />
          <Text style={styles.searchPlaceholder}>Rechercher un produit…</Text>
        </View>

        {/* Catégories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catsContent}
          style={styles.catsScroll}
        >
          {CATEGORIES.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.cat, activeCat === key && styles.catActive]}
              onPress={() => setActiveCat(key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.catText, activeCat === key && styles.catTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Résultats ── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsCount}>
          {filtered.length} produit{filtered.length > 1 ? "s" : ""}
        </Text>
        <TouchableOpacity style={styles.sortBtn}>
          <Feather name="sliders" size={13} color="#888" />
          <Text style={styles.sortText}>Trier</Text>
        </TouchableOpacity>
      </View>

      {/* ── Liste ── */}
      <FlatList
        data={filtered}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => <ProductCard item={item} />}
      />

      {/* ── Floating cart CTA ── */}
      {items > 0 && (
        <View style={styles.floatingBar}>
          <View>
            <Text style={styles.floatingCount}>{items} article{items > 1 ? "s" : ""}</Text>
            <Text style={styles.floatingTotal}>{total.toLocaleString("fr-FR")} F</Text>
          </View>
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={() => router.push("/confirm")}
            activeOpacity={0.85}
          >
            <Text style={styles.floatingBtnText}>Voir mon panier</Text>
            <Feather name="arrow-right" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f8fa" },

  topbar: {
    backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 14,
    borderBottomWidth: 0.5, borderBottomColor: "#e8e8e8",
  },
  topbarRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  topbarTitle: { fontSize: 20, fontWeight: "600", color: "#111", letterSpacing: -0.3 },
  cartBtn: {
    position: "relative", width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center",
  },
  cartBadge: {
    position: "absolute", top: -4, right: -4, width: 16, height: 16,
    borderRadius: 8, backgroundColor: GREEN, alignItems: "center", justifyContent: "center",
  },
  cartBadgeText: { fontSize: 9, fontWeight: "700", color: "#fff" },

  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#f5f5f5", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9, marginBottom: 12,
  },
  searchPlaceholder: { fontSize: 13, color: "#bbb" },

  catsScroll: {},
  catsContent: { paddingBottom: 12, gap: 8 },
  cat: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 0.5, borderColor: "#e0e0e0", backgroundColor: "#fff" },
  catActive: { backgroundColor: GREEN, borderColor: GREEN },
  catText: { fontSize: 12, fontWeight: "500", color: "#888" },
  catTextActive: { color: "#fff" },

  resultsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  resultsCount: { fontSize: 12, color: "#aaa" },
  sortBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  sortText: { fontSize: 12, color: "#888" },

  listContent: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 2 },

  card: { backgroundColor: "#fff", borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: "#ebebeb" },
  cardTop: { flexDirection: "row", gap: 12 },
  imgBox: { width: 64, height: 64, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  prodName: { fontSize: 14, fontWeight: "600", color: "#111", flex: 1 },
  bioBadge: { backgroundColor: "#e8f5e9", borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
  bioBadgeText: { fontSize: 10, fontWeight: "600", color: GREEN },
  cultivateurRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  cultivateurText: { fontSize: 11, color: "#aaa" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  starsRow: { flexDirection: "row" },
  ratingVal: { fontSize: 11, fontWeight: "600", color: "#111" },
  avisCount: { fontSize: 11, color: "#bbb" },
  divider: { height: 0.5, backgroundColor: "#f0f0f0", marginVertical: 10 },
  cardBot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceBlock: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  price: { fontSize: 16, fontWeight: "600", color: "#111" },
  priceUnit: { fontSize: 11, color: "#aaa" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: GREEN, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 8 },
  addBtnText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  qtyCtrl: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center" },
  qtyBtnText: { fontSize: 16, color: "#333", lineHeight: 20 },
  qtyNum: { fontSize: 14, fontWeight: "600", color: "#111", minWidth: 16, textAlign: "center" },

  // Floating bar
  floatingBar: {
    position: "absolute", bottom: 16, left: 16, right: 16,
    backgroundColor: "#1b5e20", borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  floatingCount: { fontSize: 11, color: "rgba(255,255,255,0.7)" },
  floatingTotal: { fontSize: 16, fontWeight: "700", color: "#fff", marginTop: 1 },
  floatingBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: GREEN, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  floatingBtnText: { fontSize: 13, fontWeight: "600", color: "#fff" },
});