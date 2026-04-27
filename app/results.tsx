import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { colors } from '../constants/theme';
import { saveScore } from '../utils/storage';

function getResultMessage(score: number): string {

let result = "An error has occurred. Please blame one of Alan's brothers.";

switch (score) {
  // fill in the blank for 0-10, with funny messages that roast the player for low scores and praise them for high scores
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
    result = "You got all of the questions right for only one of us, didn’t you?";
    break;
  case 7:
    result = "Good job! You’ve earned 10 minutes of Murfy love. Use it well.";
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

export default function ResultsScreen() {
  const { name, score: scoreParam } = useLocalSearchParams<{ name: string; score: string }>();
  const score = parseInt(scoreParam ?? '0', 10);
  const savedRef = useRef(false);

  useEffect(() => {
    if (!savedRef.current && name) {
      savedRef.current = true;
      saveScore({ name, score }).catch(console.error);
    }
  }, []);

  const message = getResultMessage(score);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Text style={styles.title}>Alan & Amber</Text>
          <Text style={styles.goldDivider}>✦ ✦ ✦</Text>
          <Text style={styles.subtitle}>Wedding Trivia</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.scoreContainer}>
          {/* Player name */}
          <Text style={styles.playerName}>{name}</Text>
          <Text style={styles.scoredLabel}>scored</Text>

          {/* Big score */}
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.scoreDivider}>/</Text>
            <Text style={styles.scoreTotal}>10</Text>
          </View>

          {/* Message card */}
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          {/* Back to home */}
          <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/')} activeOpacity={0.85}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
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
    fontSize: 18,
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
