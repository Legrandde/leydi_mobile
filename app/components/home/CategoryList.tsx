import { Category } from "@/types/home.types";
import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";


interface Props {
  categories: Category[];
  onSelect?: (id: string) => void;
}

const CategoryItem: React.FC<{ item: Category; onPress?: () => void }> = ({
  item,
  onPress,
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
    <View style={[styles.iconWrapper, { backgroundColor: item.color }]}>
      <Image source={item.icon} style={[styles.icon,{borderRadius: 50}]} />
    </View>
    <Text style={styles.label}>{item.label}</Text>
  </TouchableOpacity>
);

export const CategoryList: React.FC<Props> = ({ categories, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.container}
  >
    {categories.map((cat) => (
      <CategoryItem
        key={cat.id}
        item={cat}
        onPress={() => onSelect?.(cat.id)}
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent:"center",
    alignContent:"center",
    width: "100%",
    gap: 16,
  },
  item: {
    alignItems: "center",
    justifyContent:"center",
    gap: 6,
  },
  icon:{
    width:70,
    height:70,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
});