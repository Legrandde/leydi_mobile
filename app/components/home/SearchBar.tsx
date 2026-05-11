import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCartStore } from "../../store/cartStore";

type Props = {
  cartCount?:  number; // ignoré — on lit le store
  notifCount?: number;
};

export function SearchBar({ notifCount = 0 }: Props) {
  const router     = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <View style={styles.row}>
      {/* Champ recherche */}
      <View style={styles.inputWrap}>
        <Feather name="search" size={16} color="#aaa" />
        <TextInput
          placeholder="Rechercher un produit…"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
      </View>

      {/* Icône notifs */}
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75}>
        <Ionicons name="notifications-outline" size={20} color="#555" />
        {notifCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Icône panier — badge depuis le store */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => totalItems > 0 && router.push("/(single)/confirm")}
        activeOpacity={0.75}
      >
        <Ionicons name="bag-outline" size={20} color="#555" />
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center",
    gap: 8, paddingHorizontal: 16, paddingTop: 8,
  },
  inputWrap: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#f5f5f5", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9,
    borderWidth: 0.5, borderColor: "#ebebeb",
  },
  input: { flex: 1, fontSize: 13, color: "#111" },
  iconBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: "#f5f5f5", borderWidth: 0.5, borderColor: "#ebebeb",
    alignItems: "center", justifyContent: "center", position: "relative",
  },
  badge: {
    position: "absolute", top: -4, right: -4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center",
  },
  badgeText: { fontSize: 9, fontWeight: "700", color: "#fff" },
});