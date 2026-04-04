import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { colors } from '../constants/theme';
import { getRandomQuestions, Question } from '../utils/quiz';
import { getQuestionImage } from '../utils/questionImages';

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

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelectedAnswer(option);
  };

  const handleConfirm = () => {
    if (!selectedAnswer || answered) return;
    setAnswered(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      router.replace({
        pathname: '/results',
        params: { name, score: score.toString() },
      });
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const getOptionStyle = (option: string) => {
    if (!answered) {
      if (option === selectedAnswer) {
        return [styles.option, styles.optionSelected];
      }
      return styles.option;
    }
    if (option === currentQuestion.correctAnswer) {
      return [styles.option, styles.optionCorrect];
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return [styles.option, styles.optionIncorrect];
    }
    return [styles.option, styles.optionDimmed];
  };

  const getOptionTextStyle = (option: string) => {
    if (!answered) {
      if (option === selectedAnswer) {
        return [styles.optionText, styles.optionTextSelected];
      }
      return styles.optionText;
    }
    if (option === currentQuestion.correctAnswer) {
      return [styles.optionText, styles.optionTextCorrect];
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return [styles.optionText, styles.optionTextIncorrect];
    }
    return [styles.optionText, styles.optionTextDimmed];
  };

  const categoryLabel = {
    couples: '\u{1F48D} Couples',
    alan: '\u{1F3AE} Alan',
    amber: '\u{1F434} Amber',
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
                onPress={() => handleSelect(option)}
                disabled={answered}
                activeOpacity={0.8}
              >
                <Text style={getOptionTextStyle(option)}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirm Button */}
          {selectedAnswer && !answered && (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.85}>
              <Text style={styles.confirmButtonText}>Lock In Answer</Text>
            </TouchableOpacity>
          )}

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
                  {'\u2713'} Correct!
                </Text>
              ) : (
                <Text style={[styles.feedbackText, styles.feedbackTextIncorrect]}>
                  {'\u2717'} Incorrect {'\u2014'} The answer was: {currentQuestion.correctAnswer}
                </Text>
              )}
            </View>
          )}

          {/* Caption */}
          {answered && currentQuestion.caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>{currentQuestion.caption}</Text>
            </View>
          )}

          {/* Images */}
          {answered && currentQuestion.images && currentQuestion.images.map((img, i) => {
            const source = getQuestionImage(img);
            if (!source) return null;
            return (
              <Image
                key={i}
                source={source}
                style={styles.revealImage}
                resizeMode="contain"
              />
            );
          })}

          {/* Next Button */}
          {answered && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextButtonText}>
                {isLastQuestion ? 'See Results \u{1F389}' : 'Next Question \u2192'}
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
  optionSelected: {
    backgroundColor: '#FDF6E3',
    borderColor: colors.gold,
    borderWidth: 2.5,
    shadowColor: colors.gold,
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
  optionTextSelected: {
    fontFamily: 'Lato_700Bold',
    color: colors.maroon,
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
  confirmButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: colors.maroon,
    letterSpacing: 0.5,
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
  captionContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  captionText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  revealImage: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: colors.creamDark,
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
