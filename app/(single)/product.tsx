import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const BADGES = [
  { icon: "leaf", lib: "FontAwesome5", label: "Vegetarian" },
  { icon: "food-halal", lib: "MaterialCommunityIcons", label: "Halal Food" },
  { icon: "bread-slice-outline", lib: "MaterialCommunityIcons", label: "Gluten-free" },
];

export default function Product() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Image zone */}
      <View style={styles.imgZone}>
        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnFav}>
          <Feather name="heart" size={20} color="#ccc" />
        </TouchableOpacity>
        <Image
          style={styles.productImg}
          source={require("../../assets/images/banner1.jpg")}
          resizeMode="contain"
        />
        {/* Pagination dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title + rating */}
        <View style={styles.headerRow}>
          <Text style={styles.productName}>Organic Fresh Green Cabbage</Text>
          <View style={styles.ratingBox}>
            <Feather name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>

        {/* Shop */}
        <Text style={styles.shopText}>Shop: Alisha Mart</Text>

        {/* Badges */}
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <View style={styles.badgeIcon}>
              <FontAwesome5 name="leaf" size={18} color="#43a047" />
            </View>
            <Text style={styles.badgeLabel}>Vegetarian</Text>
          </View>
          <View style={styles.badge}>
            <View style={styles.badgeIcon}>
              <MaterialCommunityIcons name="food-halal" size={20} color="#43a047" />
            </View>
            <Text style={styles.badgeLabel}>Halal Food</Text>
          </View>
          <View style={styles.badge}>
            <View style={styles.badgeIcon}>
              <MaterialCommunityIcons name="grain" size={20} color="#43a047" />
            </View>
            <Text style={styles.badgeLabel}>Gluten-free</Text>
          </View>
        </View>

        {/* Details */}
        <Text style={styles.detailsTitle}>Details</Text>
        <Text style={styles.detailsText}>
          one commonly known as green cabbage, the cannonball cabbage is one of the most
          popular cabbage varieties. It is so named for the way its leaves wound tightly
          over one.
        </Text>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceMain}>6000 FCFA</Text>
              <Text style={styles.priceOld}>10000 FCFA</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.btnCart}>
            <Text style={styles.btnCartText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },

  // Image zone
  imgZone: {
    height: 300,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
  },
  btnBack: {
    position: "absolute", top: 14, left: 14,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "white", alignItems: "center", justifyContent: "center",
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6,
  },
  btnFav: {
    position: "absolute", top: 14, right: 14,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "white", alignItems: "center", justifyContent: "center",
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6,
  },
  productImg: { width: 220, height: 220 },
  dots: { position: "absolute", bottom: 14, flexDirection: "row", gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#ccc" },
  dotActive: { width: 18, backgroundColor: "#43a047" },

  // Content
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  productName: { fontSize: 20, fontWeight: "800", color: "#1a1a1a", flex: 1, marginRight: 12, lineHeight: 26 },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontWeight: "700", fontSize: 14, color: "#333" },
  shopText: { fontSize: 12, color: "#888", marginTop: 4, marginBottom: 14 },

  // Badges
  badgesRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  badge: {
    flex: 1, alignItems: "center", gap: 6, paddingVertical: 10,
    borderWidth: 1.5, borderColor: "#e8f5e9", borderRadius: 14, backgroundColor: "#f9fbe7",
  },
  badgeIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#e8f5e9", alignItems: "center", justifyContent: "center",
  },
  badgeLabel: { fontSize: 10, fontWeight: "600", color: "#555", textAlign: "center" },

  // Details
  detailsTitle: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
  detailsText: { fontSize: 12, color: "#777", lineHeight: 20, marginBottom: 20 },

  // Bottom bar
  bottomBar: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingBottom: 24,
  },
  priceLabel: { fontSize: 11, color: "#888", fontWeight: "600" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  priceMain: { fontSize: 24, fontWeight: "800", color: "#1a1a1a" },
  priceOld: { fontSize: 13, color: "#bbb", textDecorationLine: "line-through" },
  btnCart: {
    backgroundColor: "#43a047", borderRadius: 18,
    paddingHorizontal: 24, paddingVertical: 14,
    elevation: 4, shadowColor: "#43a047", shadowOpacity: 0.4, shadowRadius: 10,
  },
  btnCartText: { color: "white", fontWeight: "700", fontSize: 14 },
});