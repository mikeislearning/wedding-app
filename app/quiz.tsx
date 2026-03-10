import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { colors } from '../constants/theme';
import { getRandomQuestions, Question } from '../utils/quiz';

export default function QuizScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setQuestions(getRandomQuestions(10));
  }, []);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = (currentIndex + 1) / questions.length;

  const handleAnswer = (option: string) => {
    if (answered) return;
    setSelectedAnswer(option);
    setAnswered(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // score state may not yet reflect the last answer (setState is async),
      // so compute the final score from current score + whether last answer was correct
      const lastAnswerBonus = selectedAnswer === currentQuestion.correctAnswer ? 1 : 0;
      const finalScore = score + lastAnswerBonus;
      router.replace({
        pathname: '/results',
        params: { name, score: finalScore.toString() },
      });
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!answered) return styles.option;
    if (option === currentQuestion.correctAnswer) {
      return [styles.option, styles.optionCorrect];
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return [styles.option, styles.optionIncorrect];
    }
    return [styles.option, styles.optionDimmed];
  };

  const getOptionTextStyle = (option: string) => {
    if (!answered) return styles.optionText;
    if (option === currentQuestion.correctAnswer) {
      return [styles.optionText, styles.optionTextCorrect];
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return [styles.optionText, styles.optionTextIncorrect];
    }
    return [styles.optionText, styles.optionTextDimmed];
  };

  const categoryLabel = {
    couples: '💍 Couples',
    alan: '🎮 Alan',
    amber: '🐴 Amber',
  }[currentQuestion.category] ?? currentQuestion.category;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Text style={styles.categoryBadge}>{categoryLabel}</Text>
          <Text style={styles.questionCounter}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.playerName}>{name}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` as any }]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Question Card */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={getOptionStyle(option)}
                onPress={() => handleAnswer(option)}
                disabled={answered}
                activeOpacity={0.8}
              >
                <Text style={getOptionTextStyle(option)}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback */}
          {answered && (
            <View style={[
              styles.feedbackContainer,
              selectedAnswer === currentQuestion.correctAnswer
                ? styles.feedbackCorrect
                : styles.feedbackIncorrect,
            ]}>
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <Text style={[styles.feedbackText, styles.feedbackTextCorrect]}>
                  ✓ Correct!
                </Text>
              ) : (
                <Text style={[styles.feedbackText, styles.feedbackTextIncorrect]}>
                  ✗ Incorrect — The answer was: {currentQuestion.correctAnswer}
                </Text>
              )}
            </View>
          )}

          {/* Next Button */}
          {answered && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextButtonText}>
                {isLastQuestion ? 'See Results 🎉' : 'Next Question →'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerInner: {
    width: '100%',
    maxWidth: 700,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    fontFamily: 'Lato_700Bold',
    fontSize: 13,
    color: colors.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  questionCounter: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.5,
  },
  playerName: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: colors.goldLight,
    maxWidth: 100,
    textAlign: 'right',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.maroonDark,
    width: '100%',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: colors.gold,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 700,
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 28,
    marginBottom: 20,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  questionText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 22,
    color: colors.text,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  option: {
    backgroundColor: colors.creamDark,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: colors.maroon,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCorrect: {
    backgroundColor: colors.correctLight,
    borderColor: colors.correct,
  },
  optionIncorrect: {
    backgroundColor: colors.incorrectLight,
    borderColor: colors.incorrect,
  },
  optionDimmed: {
    backgroundColor: colors.cream,
    borderColor: colors.creamDark,
    opacity: 0.6,
  },
  optionText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 17,
    color: colors.maroon,
    lineHeight: 24,
  },
  optionTextCorrect: {
    fontFamily: 'Lato_700Bold',
    color: colors.correct,
  },
  optionTextIncorrect: {
    fontFamily: 'Lato_700Bold',
    color: colors.incorrect,
  },
  optionTextDimmed: {
    color: colors.textLight,
  },
  feedbackContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  feedbackCorrect: {
    backgroundColor: colors.correctLight,
    borderWidth: 1.5,
    borderColor: colors.correct,
  },
  feedbackIncorrect: {
    backgroundColor: colors.incorrectLight,
    borderWidth: 1.5,
    borderColor: colors.incorrect,
  },
  feedbackText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    lineHeight: 24,
  },
  feedbackTextCorrect: {
    color: colors.correct,
  },
  feedbackTextIncorrect: {
    color: colors.incorrect,
  },
  nextButton: {
    backgroundColor: colors.maroon,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  nextButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    color: colors.white,
    letterSpacing: 0.5,
  },
});
