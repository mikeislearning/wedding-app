import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect, useState, useCallback } from 'react';
import { colors } from '../constants/theme';
import { getSession, QuizSession } from '../utils/storage';
import FloatingHearts from '../components/FloatingHearts';
import Confetti from '../components/Confetti';

const homeImage = require('../assets/images/home_screen.jpg');

export default function HomeScreen() {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.85)).current;
  const photoScale = useRef(new Animated.Value(0.9)).current;
  const photoOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsSlide = useRef(new Animated.Value(30)).current;
  const [showConfetti, setShowConfetti] = useState(false);
  const [resumable, setResumable] = useState<QuizSession | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getSession().then((s) => {
        if (!cancelled) setResumable(s);
      });
      return () => { cancelled = true; };
    }, [])
  );

  const handleResume = () => {
    if (!resumable) return;
    router.push({ pathname: '/quiz', params: { name: resumable.name, resume: '1' } });
  };

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.parallel(
        [
          Animated.spring(titleScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
          Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        ],
        { stopTogether: false },
      ),
      Animated.parallel(
        [
          Animated.spring(photoScale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
          Animated.timing(photoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ],
        { stopTogether: false },
      ),
      Animated.parallel(
        [
          Animated.timing(buttonsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(buttonsSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
        ],
        { stopTogether: false },
      ),
    ]);
    anim.start(({ finished }) => {
      // `finished` is false when stop() is called during cleanup. Don't run
      // the post-animation effect on a torn-down component.
      if (finished) setShowConfetti(true);
    });
    return () => anim.stop();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <FloatingHearts />
        <Confetti active={showConfetti} />

        {/* Title */}
        <Animated.View style={[styles.titleArea, { opacity: titleOpacity, transform: [{ scale: titleScale }] }]}>
          <Text style={styles.emoji}>{'\uD83D\uDC90'}</Text>
          <Text style={styles.title}>Alan & Amber</Text>
          <Text style={styles.dividerRow}>{'\u2022'} {'\u2764\uFE0F'} {'\u2022'}</Text>
        </Animated.View>

        {/* Photo */}
        <Animated.View style={[styles.photoContainer, { opacity: photoOpacity, transform: [{ scale: photoScale }] }]}>
          <View style={styles.photoFrame}>
            <Image source={homeImage} style={styles.photo} resizeMode="cover" />
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonContainer, { opacity: buttonsOpacity, transform: [{ translateY: buttonsSlide }] }]}>
          {resumable && (
            <TouchableOpacity style={styles.resumeButton} onPress={handleResume} activeOpacity={0.85}>
              <Text style={styles.resumeButtonTitle}>
                {'\uD83D\uDD01'}  Resume quiz for {resumable.name}
              </Text>
              <Text style={styles.resumeButtonSubtitle}>
                Question {resumable.currentIndex + 1} of {resumable.questions.length}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button} onPress={() => router.push('/name')} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{'\uD83C\uDF38'}  How well do you know us?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOutline} onPress={() => router.push('/scores')} activeOpacity={0.85}>
            <Text style={styles.buttonOutlineText}>{'\uD83C\uDFC6'}  High Scores</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  titleArea: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 42,
    color: colors.maroon,
    textAlign: 'center',
    letterSpacing: 1,
  },
  dividerRow: {
    fontSize: 16,
    color: colors.gold,
    marginTop: 6,
    letterSpacing: 6,
  },
  photoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  photoFrame: {
    width: '85%',
    maxWidth: 400,
    flex: 1,
    maxHeight: 300,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: colors.gold,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    paddingHorizontal: 36,
    paddingBottom: 28,
    gap: 12,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.maroon,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
    maxWidth: 500,
  },
  buttonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  buttonOutline: {
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.maroon,
    width: '100%',
    maxWidth: 500,
  },
  buttonOutlineText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: colors.maroon,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  resumeButton: {
    backgroundColor: colors.gold,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  resumeButtonTitle: {
    fontFamily: 'Lato_700Bold',
    fontSize: 17,
    color: colors.text,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  resumeButtonSubtitle: {
    fontFamily: 'Lato_400Regular',
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
    textAlign: 'center',
    opacity: 0.8,
  },
});
