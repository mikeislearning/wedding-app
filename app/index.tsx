import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect } from 'react';
import { colors } from '../constants/theme';
import FloatingHearts from '../components/FloatingHearts';

const homeImage = require('../assets/images/home_screen.jpg');

export default function HomeScreen() {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-20)).current;
  const photoScale = useRef(new Animated.Value(0.9)).current;
  const photoOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(titleSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(photoScale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
        Animated.timing(photoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
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
          </View>
        </Animated.View>

        {/* Photo */}
        <Animated.View style={[styles.photoContainer, { opacity: photoOpacity, transform: [{ scale: photoScale }] }]}>
          <View style={styles.photoFrame}>
            <Image source={homeImage} style={styles.photo} resizeMode="cover" />
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonContainer, { opacity: buttonsOpacity, transform: [{ translateY: buttonsSlide }] }]}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/name')} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{'\uD83C\uDF38'}  Test Your Knowledge</Text>
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
    paddingTop: 36,
    paddingBottom: 28,
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
    fontSize: 48,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 2,
  },
  goldDivider: {
    color: colors.gold,
    fontSize: 24,
    marginTop: 8,
  },
  photoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  photoFrame: {
    width: '85%',
    maxWidth: 400,
    flex: 1,
    maxHeight: 300,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: colors.gold,
    overflow: 'hidden',
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 28,
    gap: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.maroon,
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
    maxWidth: 600,
  },
  buttonSecondary: {
    backgroundColor: colors.maroonLight,
  },
  buttonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  buttonTextSecondary: {
    color: colors.white,
  },
});
