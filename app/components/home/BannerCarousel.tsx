import { Banner } from "@/types/home.types";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;

interface Props {
  banners: Banner[];
  onCtaPress?: (banner: Banner) => void;
}

const BannerCard: React.FC<{ banner: Banner; onPress?: () => void }> = ({
  banner,
  onPress,
}) => (
  <ImageBackground
    source={banner.imageUri}
    style={[styles.card, { width: CARD_WIDTH }]}
    contentFit="cover" //
  >
    {/* Dégradé : transparent en haut → noir opaque en bas */}
    <LinearGradient
      colors={["gray", "rgba(2, 49, 9, 0.45)", "rgba(26, 63, 14, 0.85)"]}
      locations={[0, 0.4, 1]}
      style={styles.gradient}
    >
      <Text style={styles.title}>{banner.title}</Text>
      <Text style={styles.subtitle}>{banner.subtitle}</Text>
      <TouchableOpacity style={styles.cta} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.ctaText}>{banner.cta}</Text>
      </TouchableOpacity>
    </LinearGradient>
  </ImageBackground>
);

const PaginationDots: React.FC<{ total: number; active: number }> = ({
  total,
  active,
}) => (
  <View style={styles.dots}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
    ))}
  </View>
);

export const BannerCarousel: React.FC<Props> = ({ banners, onCtaPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(idx);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
      >
        {banners.map((b) => (
          <BannerCard key={b.id} banner={b} onPress={() => onCtaPress?.(b)} />
        ))}
      </ScrollView>
      <PaginationDots total={banners.length} active={activeIndex} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    minHeight: 160,
    overflow: "hidden", // 👈 indispensable pour que borderRadius s'applique à l'image
  },
  gradient: {
    flex: 1,
    minHeight: 160,
    padding: 20,
    justifyContent: "flex-end",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: 4,
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 17,
  },
  cta: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ctaText: {
    color: "#166534",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1FAE5",
  },
  dotActive: {
    width: 18,
    backgroundColor: "#16A34A",
  },
});