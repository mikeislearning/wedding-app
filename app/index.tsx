import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect } from 'react';
import { colors } from '../constants/theme';
import FloatingHearts from '../components/FloatingHearts';
import PulseRing from '../components/PulseRing';

const homeImage = require('../assets/images/home_screen.jpg');

export default function HomeScreen() {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-20)).current;
  const photoScale = useRef(new Animated.Value(0.8)).current;
  const photoOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      // Title fades in
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(titleSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      // Photo pops in
      Animated.parallel([
        Animated.spring(photoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(photoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      // Buttons slide up
      Animated.parallel([
        Animated.timing(buttonsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(buttonsSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <FloatingHearts />

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: titleOpacity, transform: [{ translateY: titleSlide }] }]}>
          <View style={styles.headerInner}>
            <Text style={styles.title}>Alan & Amber</Text>
            <Text style={styles.goldDivider}>{'\u2766'}</Text>
            <Text style={styles.subtitle}>Wedding Trivia</Text>
          </View>
        </Animated.View>

        {/* Photo */}
        <Animated.View style={[styles.photoContainer, { opacity: photoOpacity, transform: [{ scale: photoScale }] }]}>
          <View style={styles.pulseWrapper}>
            <PulseRing size={220} color={colors.gold} delay={0} />
            <PulseRing size={220} color={colors.goldLight} delay={700} />
            <PulseRing size={220} color={colors.gold} delay={1400} />
          </View>
          <View style={styles.photoFrame}>
            <Image source={homeImage} style={styles.photo} resizeMode="cover" />
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonContainer, { opacity: buttonsOpacity, transform: [{ translateY: buttonsSlide }] }]}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/name')} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{'\uD83D\uDC8D'}  Test Your Alan & Amber Knowledge</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => router.push('/scores')} activeOpacity={0.85}>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>{'\uD83C\uDFC6'}  View High Scores</Text>
          </TouchableOpacity>
        </Animated.View>

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
    fontSize: 28,
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
  pulseWrapper: {
    position: 'absolute',
    width: 220,
    height: 220,
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
});
