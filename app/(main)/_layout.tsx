import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";

// Bouton Map central surélevé
function MapTabButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.mapButtonWrapper}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.mapButtonOuter}>
        <View style={styles.mapButtonInner}>{children}</View>
      </View>
    </TouchableOpacity>
  );
}

export default function () {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="commandes"
        options={{
          title: "Commandes",
          tabBarIcon: ({ color }) => (
            <AntDesign name="audit" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Carte",
          tabBarButton: (props) => (
            <MapTabButton onPress={props.onPress}>
              <Feather name="map-pin" size={26} color="#fff" />
            </MapTabButton>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alertes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <SimpleLineIcons name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    height: Platform.OS === "ios" ? 88 : 68,
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...(Platform.OS === "android"? {marginBottom: 40}: null)
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  mapButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    top: -22,
    width: 72,
  },
  mapButtonOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF0EA",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "green",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  mapButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
});