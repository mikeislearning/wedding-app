import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { colors } from '../constants/theme';
import { saveScore } from '../utils/storage';
import { playCelebration } from '../utils/sounds';
import Confetti from '../components/Confetti';
import FloatingHearts from '../components/FloatingHearts';

function getResultMessage(score: number): string {

let result = "An error has occurred. Please blame one of Alan's brothers.";

switch (score) {
  case 0:
    result = "Do you even know who we are?!";
    break;
  case 1:
    result = "Did Murfy answer these questions with his paws?";
    break;
  case 2:
    result = "You need to pay more attention when we speak";
    break;
  case 3:
    result = "Embarrassing. Offensive. Borderline criminal.";
    break;
  case 4:
    result = "Well, at least you tried.";
    break;
  case 5:
    result = "Not bad. not good either. but not bad.";
    break;
  case 6:
    result = "You got all of the questions right for only one of us, didn't you?";
    break;
  case 7:
    result = "Good job! You've earned 10 minutes of Murfy love. Use it well.";
    break;
  case 8:
    result = "Have you been spying on us? Very impressive.";
    break;
  case 9:
    result = "Near perfection! you must tell us your secret, since you clearly know all of ours.";
    break;
  case 10:
    result = "Are you in this relationship? amazing!";
    break;
  }

  return result;
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = 0;
    const step = duration / target;
    const timer = setInterval(() => {
      start++;
      setValue(start);
      if (start >= target) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}

export default function ResultsScreen() {
  const { name, score: scoreParam } = useLocalSearchParams<{ name: string; score: string }>();
  const score = parseInt(scoreParam ?? '0', 10);
  const savedRef = useRef(false);
  const displayScore = useCountUp(score, 1200);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const nameScale = useRef(new Animated.Value(0.5)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const scoreScale = useRef(new Animated.Value(0.3)).current;
  const scoreOpacity = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const messageSlide = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!savedRef.current && name) {
      savedRef.current = true;
      saveScore({ name, score }).catch(console.error);
    }

    Animated.sequence([
      // Header fades in
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      // Name pops in
      Animated.parallel([
        Animated.spring(nameScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(nameOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      // Score pops in big
      Animated.parallel([
        Animated.spring(scoreScale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
        Animated.timing(scoreOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start(() => {
      // After score animation, trigger confetti for good scores
      if (score >= 7) {
        setShowConfetti(true);
        playCelebration().catch(() => {});
      }
      // Show message with slight delay
      setShowMessage(true);
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(messageOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(messageSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
        Animated.timing(buttonOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  const message = getResultMessage(score);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Confetti active={showConfetti} />
      {score >= 8 && <FloatingHearts />}

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerInner}>
          <Text style={styles.title}>Alan & Amber</Text>
          <Text style={styles.goldDivider}>{'\u2766'}</Text>
          <Text style={styles.subtitle}>Wedding Trivia</Text>
        </View>
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.scoreContainer}>
          {/* Player name */}
          <Animated.Text style={[styles.playerName, { opacity: nameOpacity, transform: [{ scale: nameScale }] }]}>
            {name}
          </Animated.Text>
          <Animated.Text style={[styles.scoredLabel, { opacity: nameOpacity }]}>
            scored
          </Animated.Text>

          {/* Big score */}
          <Animated.View style={[styles.scoreDisplay, { opacity: scoreOpacity, transform: [{ scale: scoreScale }] }]}>
            <Text style={styles.scoreNumber}>{displayScore}</Text>
            <Text style={styles.scoreDivider}>/</Text>
            <Text style={styles.scoreTotal}>10</Text>
          </Animated.View>

          {/* Message card */}
          {showMessage && (
            <Animated.View style={[styles.messageCard, { opacity: messageOpacity, transform: [{ translateY: messageSlide }] }]}>
              <Text style={styles.messageText}>{message}</Text>
            </Animated.View>
          )}

          {/* Back to home */}
          <Animated.View style={{ opacity: buttonOpacity, width: '100%' }}>
            <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/')} activeOpacity={0.85}>
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>
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
  header: {
    backgroundColor: colors.maroon,
    paddingTop: 40,
    paddingBottom: 40,
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
    fontSize: 44,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 2,
  },
  goldDivider: {
    color: colors.gold,
    fontSize: 24,
    marginVertical: 10,
    letterSpacing: 8,
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    color: colors.goldLight,
    letterSpacing: 5,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  scoreContainer: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  playerName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 36,
    color: colors.gold,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 4,
  },
  scoredLabel: {
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
    color: colors.textLight,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  scoreNumber: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 96,
    color: colors.maroon,
    lineHeight: 100,
  },
  scoreDivider: {
    fontFamily: 'Lato_400Regular',
    fontSize: 48,
    color: colors.textLight,
    marginHorizontal: 8,
    lineHeight: 80,
  },
  scoreTotal: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 64,
    color: colors.text,
    lineHeight: 80,
  },
  messageCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 36,
  },
  messageText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 34,
  },
  homeButton: {
    backgroundColor: colors.maroon,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 48,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
  },
  homeButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    color: colors.white,
    letterSpacing: 0.5,
  },
});
