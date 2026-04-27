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
    result = "Either Murfy tried to answer these questions with his paws, or you’re at the wrong wedding!";
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
    result = "Not bad. not good either. But not bad.";
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
    result = "Are you in this relationship? Amazing!";
    break;
  }

  return result;
}

function getResultEmoji(score: number): string {
  if (score <= 2) return '\uD83D\uDE48';
  if (score <= 4) return '\uD83E\uDD37';
  if (score <= 6) return '\uD83D\uDE0F';
  if (score <= 8) return '\uD83C\uDF89';
  return '\uD83E\uDD29';
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
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(nameScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(nameOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(scoreScale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
        Animated.timing(scoreOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start(() => {
      // Always show confetti — it's a celebration!
      setShowConfetti(true);
      if (score >= 7) {
        playCelebration().catch(() => {});
      }
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
  const emoji = getResultEmoji(score);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Confetti active={showConfetti} />
      <FloatingHearts />

      <View style={styles.content}>
        <View style={styles.scoreContainer}>
          {/* Emoji */}
          <Animated.Text style={[styles.bigEmoji, { opacity: headerOpacity }]}>
            {emoji}
          </Animated.Text>

          {/* Player name */}
          <Animated.Text style={[styles.playerName, { opacity: nameOpacity, transform: [{ scale: nameScale }] }]}>
            {name}
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

          {/* Buttons */}
          <Animated.View style={[styles.buttonRow, { opacity: buttonOpacity }]}>
            <TouchableOpacity style={styles.playAgainButton} onPress={() => router.replace('/name')} activeOpacity={0.85}>
              <Text style={styles.playAgainText}>{'\uD83C\uDF38'} Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/')} activeOpacity={0.85}>
              <Text style={styles.homeButtonText}>Home</Text>
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
    backgroundColor: colors.cream,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  scoreContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  bigEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  playerName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    color: colors.maroon,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 28,
  },
  scoreNumber: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 88,
    color: colors.maroon,
    lineHeight: 92,
  },
  scoreDivider: {
    fontFamily: 'Lato_400Regular',
    fontSize: 44,
    color: colors.textLight,
    marginHorizontal: 6,
    lineHeight: 72,
  },
  scoreTotal: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 56,
    color: colors.text,
    lineHeight: 72,
  },
  messageCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 28,
  },
  messageText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 22,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  playAgainButton: {
    flex: 1,
    backgroundColor: colors.maroon,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  playAgainText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 17,
    color: colors.white,
  },
  homeButton: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.maroon,
  },
  homeButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 17,
    color: colors.maroon,
  },
});
