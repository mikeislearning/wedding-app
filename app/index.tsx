import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

const homeImage = require('../assets/images/home_screen.jpg');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text style={styles.title}>Alan & Amber</Text>
            <Text style={styles.goldDivider}>✦ ✦ ✦</Text>
            <Text style={styles.subtitle}>Wedding Trivia</Text>
          </View>
        </View>

        {/* Photo */}
        <View style={styles.photoContainer}>
          <View style={styles.photoFrame}>
            <Image source={homeImage} style={styles.photo} resizeMode="cover" />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/name')} activeOpacity={0.85}>
            <Text style={styles.buttonText}>💍  Test Your Alan & Amber Knowledge</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => router.push('/scores')} activeOpacity={0.85}>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>🏆  View High Scores</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.maroon,
  },
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.maroon,
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerInner: {
    width: '100%',
    maxWidth: 700,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 52,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 2,
  },
  goldDivider: {
    color: colors.gold,
    fontSize: 20,
    marginVertical: 12,
    letterSpacing: 8,
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 24,
    color: colors.goldLight,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  photoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  photoFrame: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.gold,
    overflow: 'hidden',
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 60,
    paddingBottom: 24,
    gap: 24,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.maroon,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
    maxWidth: 600,
  },
  buttonSecondary: {
    backgroundColor: colors.maroonLight,
    borderColor: colors.gold,
  },
  buttonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    color: colors.white,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  buttonTextSecondary: {
    color: colors.goldLight,
  },
  footer: {
    textAlign: 'center',
    paddingBottom: 40,
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: colors.textLight,
    letterSpacing: 2,
  },
});
