import React from "react";
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Product } from "@/types/home.types";
import { useCartStore } from "../../store/cartStore";

type Props = {
  product: Product;
  onPress:    () => void;
  onFavorite: () => void;
  onCompare:  () => void;
};

const GREEN = "#16A34A";

export function ProductCard({ product, onPress, onFavorite, onCompare }: Props) {
  const { cart, add, inc, dec } = useCartStore();
  const qty = cart[product.id]?.qty ?? 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Image + badge remise */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.imageUri }} style={styles.image} />
        {product.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteBtn} onPress={onFavorite} hitSlop={{ top:6, bottom:6, left:6, right:6 }}>
          <Ionicons name="heart-outline" size={16} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Infos */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color="#f59e0b" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewText}>({product.reviewCount})</Text>
        </View>

        {/* Prix + contrôle panier */}
        <View style={styles.bottom}>
          <View>
            <Text style={styles.price}>{product.price.toFixed(2)} F</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>{product.originalPrice.toFixed(2)} F</Text>
            )}
          </View>

          {/* Bouton Ajouter ou contrôle +/- */}
          {qty === 0 ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => add(product)}
              activeOpacity={0.75}
            >
              <Feather name="plus" size={16} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyCtrl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => dec(product.id)}
                activeOpacity={0.7}
              >
                <Feather name="minus" size={12} color={GREEN} />
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => inc(product.id)}
                activeOpacity={0.7}
              >
                <Feather name="plus" size={12} color={GREEN} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#ebebeb",
    overflow: "hidden",
  },

  // Image
  imageWrap: { position: "relative" },
  image: { width: "100%", height: 130, resizeMode: "cover" },
  discountBadge: {
    position: "absolute", top: 8, left: 8,
    backgroundColor: GREEN, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  discountText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  favoriteBtn: {
    position: "absolute", top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center", justifyContent: "center",
  },

  // Infos
  info: { padding: 10, gap: 4 },
  name: { fontSize: 13, fontWeight: "600", color: "#111", lineHeight: 18 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 11, fontWeight: "600", color: "#111" },
  reviewText: { fontSize: 11, color: "#aaa" },

  // Prix + panier
  bottom: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginTop: 4,
  },
  price: { fontSize: 14, fontWeight: "700", color: "#111" },
  originalPrice: {
    fontSize: 11, color: "#bbb",
    textDecorationLine: "line-through", marginTop: 1,
  },

  // Add button
  addBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: GREEN,
    alignItems: "center", justifyContent: "center",
  },

  // Qty control
  qtyCtrl: {
    flexDirection: "row", alignItems: "center", gap: 6,
  },
  qtyBtn: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: "#f0faf0",
    borderWidth: 0.5, borderColor: "#c8e6c9",
    alignItems: "center", justifyContent: "center",
  },
  qtyNum: {
    fontSize: 13, fontWeight: "700", color: "#111",
    minWidth: 14, textAlign: "center",
  },
});