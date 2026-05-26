import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,

  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchBar } from "../components/home/SearchBar";
import { CategoryList } from "../components/home/CategoryList";
import { BannerCarousel } from "../components/home/BannerCarousel";
import { ProductCard } from "../components/home/ProductCard";
import { SectionHeader } from "../components/home/SectionHeader";

import { Category, Banner, Product } from "@/types/home.types";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

// ─── Mock data ────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: "dairy",   label: "Fruits",   icon: require('@/assets/icons/fruits.png'), color: "#B67332" },
  { id: "meat",    label: "Legumes",    icon: require('@/assets/icons/legumes.png'), color: "#A4BD01" },
  { id: "condi",    label: "Condiments",    icon: require('@/assets/icons/condiments.jpg'), color: "#A4BD01" },
  { id: "root",    label: "Racines",    icon: require('@/assets/icons/racine.jpg'), color: "#A4BD01" },
];

const BANNERS: Banner[] = [
  {
    id: "b1",
    title: "De bonnes promos et des produits frais !",
    subtitle: "Jusqu’à 50 % de réduction sur vos produits essentiels préférés. Achetez maintenant et économisez beaucoup",
    cta: "PROFITE DES OFFRES",
    bgColor: "#15803D",
    imageUri: require("../../assets/images/banner01.jpg")
  },
  {
    id: "b2",
    title: "De belles économies d’été !",
    subtitle: "Profitez de réductions sur les fruits de saison. Des choix sains à de très bons prix.",
    cta: "EXPLORE MAINTENANT",
    bgColor: "#7C2D12",
    imageUri: require("../../assets/images/banner1.jpg")
  },
];

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Pomme de terre",
    price: 1500,
    originalPrice: 2000,
    discount: 25,
    rating: 4.8,
    reviewCount: 645,
    imageUri: "https://i.pinimg.com/1200x/02/9d/89/029d89a543761c9cb1826b0015654ee2.jpg",
  },
  {
    id: "p2",
    name: "Carrotte frais",
    price: 1890,
    originalPrice: 2500,
    discount: 25,
    rating: 4.8,
    reviewCount: 645, 
    imageUri: "https://i.pinimg.com/736x/e3/cd/47/e3cd4768842b98d478e5d4b755ec7daf.jpg",
  },
  {
    id: "p3",
    name: "Organic Avoca",
    price: 990,
    originalPrice: 1500,
    discount: 34,
    rating: 4.6,
    reviewCount: 312,
    imageUri: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400",
  },
  {
    id: "p4",
    name: "Mail",
    price: 990,
    originalPrice: 1550,
    discount: 34,
    rating: 4.6,
    reviewCount: 312,
    imageUri: "https://i.pinimg.com/736x/64/85/78/6485782a2277787f6c567391d4e1c92e.jpg",
  },
];

// ─── Screen ───────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter()
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#4B5943" barStyle="light-content" />

      {/* Header vert */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationRow}>
          <Ionicons name="location-sharp" size={14} color="#a2a4a2" />
        <Text onPress={()=> router.push('/(main)/profile')} style={styles.locationText}>Ajouter votre localisation</Text>
          <Ionicons name="chevron-forward" size={14} color="#a2a4a2" />
        </TouchableOpacity>
        <SearchBar cartCount={12} notifCount={1} />
      </View>

      {/* Scroll content */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Bannières */}
        <BannerCarousel
          banners={BANNERS}
          onCtaPress={(b) => console.log("CTA pressed:", b.id)}
        />

        {/* Catégories */}
        <View style={styles.section}>
          <CategoryList
            categories={CATEGORIES}
            onSelect={(id) => console.log("Category:", id)}
          />
        </View>

        {/* Top Picks */}
        <View style={styles.section}>
          <SectionHeader
            title="Meuilleurs produits pour vous"
            onSeeAll={() => router.push('/(single)/ProductsList')}
          />
          <FlatList
            horizontal
            data={PRODUCTS}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => router.push('/(single)/product')}
                onFavorite={() => console.log("Favorite:", item.id)}
                onCompare={() => console.log("Compare:", item.id)}
              />
            )}
          />
        </View>
      </ScrollView>      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#fff",
    paddingBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
  },
  locationText: {
    color: "#333",
    fontSize: 13,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 0,
  },
  section: {
    marginTop: 20,
  },
  productList: {
    paddingHorizontal: 16,
    alignContent:"center",
    gap: 12,
  },
});