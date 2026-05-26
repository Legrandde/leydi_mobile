import { SafeAreaView, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function Map() {
  return (
    <SafeAreaView style={styles.safe}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 14.716677,
          longitude: -17.467686,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{ latitude: 14.716677, longitude: -17.467686 }}
          title="Position actuelle"
          description="Vous êtes ici"
        />
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f8fa" },
  map: { flex: 1 },
});