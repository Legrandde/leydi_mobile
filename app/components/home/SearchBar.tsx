import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

interface Props {
  onPress?: () => void;
  cartCount?: number;
  notifCount?: number;
}

export const SearchBar: React.FC<Props> = ({
  onPress,
  cartCount = 0,
  notifCount = 0,
}) => (
  <View style={styles.container}>
    <View style={styles.searchBox} >
      <Feather name="search" size={18} color="#333" />
      <TextInput style={styles.placeholder}
        placeholder="Que voulez vous acheter ?"
      />
      <Feather name="camera" size={18} color="#333" style={{ marginLeft: "auto" }} />
    </View>

    <View style={styles.actions}>
      <TouchableOpacity style={styles.iconBtn}>
        <Ionicons name="chatbubble-outline" size={20} color="#333" />
        {notifCount > 0 && <Badge count={notifCount} color="#EF4444" />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn}>
        <Feather name="shopping-cart" size={20} color="#333" />
        {cartCount > 0 && <Badge count={cartCount} color="#EF4444" />}
      </TouchableOpacity>
    </View>
  </View>
);

const Badge: React.FC<{ count: number; color: string }> = ({ count, color }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  placeholder: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "400",
    
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
});