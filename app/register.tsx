import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const { height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    // ta logique d'inscription ici
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.container}>

          {/* Header vert (plus petit) */}
          <View style={styles.header}>
            <View style={styles.leafBig} />
            <View style={styles.leafSmall} />
          </View>

          {/* Card blanche */}
          <View style={styles.card}>

            {/* Back */}
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => router.back()}
            >
              <Text style={styles.backArrow}>← </Text>
              <Text style={styles.backText}>connexion</Text>
            </TouchableOpacity>

            <Text style={styles.cardTitle}>Sign Up</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>
                <SimpleLineIcons name="envelope" size={24} color="black" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>
                <SimpleLineIcons name="lock" size={24} color="black" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="mot de passe"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>
                <SimpleLineIcons name="lock" size={24} color="black" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de pass"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>
                <SimpleLineIcons name="phone" size={24} color="black" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Phone"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
              <Text style={styles.btnText}>Inscription</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B5943',
  },
  header: {
    height: height * 0.18,
    backgroundColor: '#4B5943',
    overflow: 'hidden',
  },
  leafBig: {
    position: 'absolute',
    top: -10,
    right: 30,
    width: 55,
    height: 100,
    backgroundColor: '#4DB89E',
    borderRadius: 50,
    transform: [{ rotate: '20deg' }],
  },
  leafSmall: {
    position: 'absolute',
    top: 5,
    right: 65,
    width: 32,
    height: 70,
    backgroundColor: '#5ECFB5',
    borderRadius: 40,
    transform: [{ rotate: '-15deg' }],
  },
  card: {
    flex: 1,
    backgroundColor: '#F0F7F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -24,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 32,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 16,
    color: '#4B5943',
    fontWeight: '600',
  },
  backText: {
    fontSize: 13,
    color: '#4B5943',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4B5943',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 50,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 15,
    marginRight: 10,
    color: '#aaa',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  btn: {
    backgroundColor: '#4B5943',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});