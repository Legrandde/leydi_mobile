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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // ta logique JWT ici
    router.replace('/(main)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.container}>

          {/* Header vert */}
          <View style={styles.header}>
            {/* Décoration feuille */}
            <Text style={styles.hello}>Bonjour!</Text>
            <Text style={styles.subtitle}>Bienvenu sur leydi </Text>
          </View>

          {/* Card blanche */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connexion</Text>

            {/* Email */}
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

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>
                <SimpleLineIcons name="lock" size={24} color="black" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.forgotWrap}>
              <Text style={styles.forgot}>Mot de pass oublié?</Text>
            </TouchableOpacity>

            {/* Bouton Login */}
            <TouchableOpacity style={styles.btn} onPress={handleLogin}>
              <Text style={styles.btnText}>Connexion</Text>
            </TouchableOpacity>

            {/* Séparateur */}
            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.orText}>Ou</Text>
              <View style={styles.line} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialIcon}>
                    <Image style={{width:24, height:24}} source={require('@/assets/icons/facebook.png')} />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={[styles.socialIcon, { color: '#EA4335' }]}>
                     <Image style={{width:24, height:24}} source={require('@/assets/icons/google.png')} />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialIcon}>
                    <AntDesign name="apple" size={24} color="black" />
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign up link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Vous n'avez pas de compte? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.signupLink}>inscription</Text>
              </TouchableOpacity>
            </View>
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
    height: height * 0.32,
    backgroundColor: '#4B5943',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingLeft: 30,
    overflow: 'hidden',
  },
  hello: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },

  // Déco plante (CSS shapes)
  leafBig: {
    position: 'absolute',
    top: -10,
    right: 40,
    width: 60,
    height: 110,
    backgroundColor: '#4DB89E',
    borderRadius: 50,
    transform: [{ rotate: '20deg' }],
  },
  leafSmall: {
    position: 'absolute',
    top: 10,
    right: 70,
    width: 35,
    height: 75,
    backgroundColor: '#5ECFB5',
    borderRadius: 40,
    transform: [{ rotate: '-15deg' }],
  },
  pot: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    width: 50,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: '#F0F7F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -24,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4B5943',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Inputs
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

  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 22,
  },
  forgot: {
    fontSize: 13,
    color: '#4B5943',
    fontWeight: '500',
  },

  btn: {
    backgroundColor: '#4B5943',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    fontSize: 12,
    color: '#aaa',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b5998',
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 13,
    color: '#888',
  },
  signupLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5943',
  },
});