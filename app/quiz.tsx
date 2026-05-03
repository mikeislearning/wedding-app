import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef, useCallback } from 'react';
import { colors } from '../constants/theme';
import { getRandomQuestions, Question } from '../utils/quiz';
import { getQuestionImage } from '../utils/questionImages';
import { playCorrect, playIncorrect, playTap, stopAll } from '../utils/sounds';
import Confetti from '../components/Confetti';

const REVEAL_DURATION_MS = 3000;

function useTypewriter(text: string) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(!text);
    if (!text) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / REVEAL_DURATION_MS, 1);
      const chars = Math.ceil(progress * text.length);
      setDisplayed(text.slice(0, chars));
      if (progress >= 1) {
        clearInterval(timer);
        setDone(true);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [text]);

  return { displayed, done };
}

function FadeInImage({ source, style }: { source: any; style: any }) {
  const opacity = useRef(new Animated.Value(0)).current;

  const onLoad = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.Image
      source={source}
      style={[style, { opacity }]}
      resizeMode="contain"
      onLoad={onLoad}
    />
  );
}

export default function QuizScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();
    setQuestions(getRandomQuestions());
  }, []);

  const currentQuestion = questions.length > 0 ? questions[currentIndex] : null;
  const captionSource = answered && currentQuestion?.caption ? currentQuestion.caption : '';
  const { displayed: typedCaption, done: captionDone } = useTypewriter(captionSource);
  const nextButtonOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (answered && captionDone) {
      nextButtonOpacity.setValue(0);
      Animated.timing(nextButtonOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [answered, captionDone]);

  // Animate question card entrance on each new question
  useEffect(() => {
    if (!currentQuestion) return;
    cardOpacity.setValue(0);
    cardSlide.setValue(30);
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(cardSlide, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [currentIndex, questions.length > 0]);

  // Smooth progress bar
  useEffect(() => {
    if (questions.length === 0) return;
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / questions.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, questions.length]);

  if (!currentQuestion) return null;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelectedAnswer(option);
    playTap().catch(() => {});
  };

  const handleConfirm = () => {
    if (!selectedAnswer || answered) return;
    setAnswered(true);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      playCorrect().catch(() => {});
    } else {
      playIncorrect().catch(() => {});
    }
  };

  const handleNext = () => {
    stopAll();
    if (isLastQuestion) {
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      router.replace({
        pathname: '/results',
        params: { name, score: score.toString(), time: elapsed.toString() },
      });
    } else {
      nextButtonOpacity.setValue(0);
      setShowConfetti(false);
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
      <Confetti active={showConfetti} />
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
        <Animated.View style={[styles.progressBarFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.contentWrapper, { opacity: cardOpacity, transform: [{ translateY: cardSlide }] }]}>
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

          {/* Feedback
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
          )} */}

          {/* Caption */}
          {answered && currentQuestion.caption && (() => {
            const fullLines = currentQuestion.caption!.split('\n');
            const lineColors = fullLines.map((line) => {
              const lower = line.toLowerCase().trimEnd();
              if (lower.endsWith('- alan')) return '#2D8B5E';
              if (lower.endsWith('- amber') || lower.endsWith('-amber')) return '#7B5EA7';
              return colors.textLight;
            });
            const displayedLines = typedCaption.split('\n');
            return (
              <View style={styles.captionContainer}>
                <Text style={styles.captionText}>
                  {displayedLines.map((line, i, arr) => (
                    <Text key={i} style={{ color: lineColors[i] ?? colors.textLight }}>
                      {line}{i < arr.length - 1 ? '\n' : ''}
                    </Text>
                  ))}
                </Text>
              </View>
            );
          })()}

          {/* Images */}
          {answered && currentQuestion.images && currentQuestion.images.map((img, i) => {
            const source = getQuestionImage(img);
            if (!source) return null;
            return (
              <FadeInImage
                key={i}
                source={source}
                style={styles.revealImage}
              />
            );
          })}

          {/* Next Button */}
          {answered && captionDone && (
            <Animated.View style={{ opacity: nextButtonOpacity }}>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
                <Text style={styles.nextButtonText}>
                  {isLastQuestion ? 'See Results \u{1F389}' : 'Next Question \u2192'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.cream,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
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
    color: colors.maroon,
    letterSpacing: 1,
    textTransform: 'uppercase',
    backgroundColor: colors.creamDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  questionCounter: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: colors.text,
    letterSpacing: 0.5,
  },
  playerName: {
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    color: colors.textLight,
    maxWidth: 100,
    textAlign: 'right',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.creamDark,
    width: '100%',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: colors.gold,
    borderRadius: 4,
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
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: colors.creamDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: colors.text,
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
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
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
