import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Product } from "@/types/home.types";


interface Props {
  product: Product;
  onPress?: () => void;
  onFavorite?: () => void;
  onCompare?: () => void;
}

export const ProductCard: React.FC<Props> = ({
  product,
  onPress,
  onFavorite,
  onCompare,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    {/* Image */}
    <View style={styles.imageWrapper}>
      <Image source={{ uri: product.imageUri }} style={styles.image} />
      <TouchableOpacity style={styles.favoriteBtn} onPress={onFavorite}>
        <Ionicons name="heart-outline" size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>

    {/* Meta row */}
    <View style={styles.metaRow}>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={11} color="#F59E0B" />
        <Text style={styles.rating}>{product.rating}</Text>
        <Text style={styles.reviewCount}>({product.reviewCount})</Text>
      </View>
      <TouchableOpacity style={styles.compareBtn} onPress={onCompare}>
        <Feather name="bar-chart-2" size={11} color="#16A34A" />
        <Text style={styles.compareText}>Compare</Text>
      </TouchableOpacity>
    </View>

    {/* Name */}
    <Text style={styles.name} numberOfLines={1}>
      {product.name}
    </Text>

    {/* Price row */}
    <View style={styles.priceRow}>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>-{product.discount}%</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 3,
    overflow: "hidden",
    shadowColor: "#c9c8c8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rating: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
  reviewCount: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  compareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  compareText: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "600",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  originalPrice: {
    fontSize: 11,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "#FEF2F2",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 10,
    color: "#EF4444",
    fontWeight: "700",
  },
});