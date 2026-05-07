import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Level Up Your Style',
    description:
      'Shop smarter, dress bolder, and embrace your individuality to inspire and empower every fashion-forward individual.',
    image: require('@/assets/images/onboarding1.jpg'),
    bg: '#f2c4c4',
  },
  {
    id: '2',
    title: 'Build Your Wishlist',
    description:
      'Start building your dream wardrobe! Save your favorite items to your wishlist so you can easily access them later.',
    image: require('@/assets/images/onboarding2.jpg'),
    bg: '#b2e0e0',
  },
  {
    id: '3',
    title: 'Welcome to JULISHOP',
    description:
      'Ready to shop? Browse with easy filtering options and intuitive navigation.',
    image: require('@/assets/images/onboarding3.jpg'),
    bg: '#f5f0e8',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const finish = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/login');
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      finish();
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header buttons */}
      <View style={styles.header}>
        {!isFirst ? (
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}

        {!isLast && (
          <TouchableOpacity onPress={finish}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} />
          </View>
        )}
      />

      {/* Bottom card */}
      <View style={styles.card}>
        <Text style={styles.title}>{slides[currentIndex].title}</Text>
        <Text style={styles.description}>{slides[currentIndex].description}</Text>

        {isLast ? (
          <TouchableOpacity style={styles.startBtn} onPress={finish}>
            <Text style={styles.startText}>Start shopping</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bottomRow}>
            {/* Dots */}
            <View style={styles.dots}>
              {slides.map((_, i) => {
                const dotWidth = scrollX.interpolate({
                  inputRange: [
                    (i - 1) * width,
                    i * width,
                    (i + 1) * width,
                  ],
                  outputRange: [8, 22, 8],
                  extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                  inputRange: [
                    (i - 1) * width,
                    i * width,
                    (i + 1) * width,
                  ],
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                });
                return (
                  <Animated.View
                    key={i}
                    style={[styles.dot, { width: dotWidth, opacity }]}
                  />
                );
              })}
            </View>

            {/* Next button */}
            <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
              <Text style={styles.nextArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 52,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: '#fff',
    lineHeight: 30,
    marginTop: -2,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  slide: {
    width,
    height: height * 0.62,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -28,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 32,
    marginBottom:100
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#888',
    lineHeight: 21,
    marginBottom: 24,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8365C',
  },
  nextBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8365C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextArrow: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 32,
    marginTop: -2,
  },
  startBtn: {
    backgroundColor: '#E8365C',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});