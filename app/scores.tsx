import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { colors } from '../constants/theme';
import { getScores, ScoreEntry } from '../utils/storage';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function ScoresScreen() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getScores()
      .then(data => {
        const sorted = [...data].sort((a, b) => b.score - a.score);
        setScores(sorted);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Alan & Amber</Text>
          <Text style={styles.goldDivider}>✦ ✦ ✦</Text>
          <Text style={styles.subtitle}>High Scores</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listWrapper}>
          {loaded && scores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No scores yet!</Text>
              <Text style={styles.emptySubtext}>Be the first to play.</Text>
            </View>
          ) : (
            scores.map((entry, index) => (
              <View key={index} style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                <View style={styles.rankContainer}>
                  {index < 3 ? (
                    <Text style={styles.medal}>{MEDALS[index]}</Text>
                  ) : (
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  )}
                </View>
                <Text style={styles.playerName} numberOfLines={1}>{entry.name}</Text>
                <Text style={styles.playerScore}>{entry.score} / 10</Text>
              </View>
            ))
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
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerInner: {
    width: '100%',
    maxWidth: 700,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  backButtonText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: colors.goldLight,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 40,
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
    fontSize: 22,
    color: colors.goldLight,
    letterSpacing: 5,
    textTransform: 'uppercase',
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
  listWrapper: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldLight,
  },
  rowEven: {
    backgroundColor: colors.cream,
  },
  rowOdd: {
    backgroundColor: colors.creamDark,
  },
  rankContainer: {
    width: 44,
    alignItems: 'center',
    marginRight: 16,
  },
  medal: {
    fontSize: 24,
  },
  rankNumber: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: colors.gold,
    letterSpacing: 0.5,
  },
  playerName: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    color: colors.text,
    letterSpacing: 0.3,
  },
  playerScore: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: colors.maroon,
    letterSpacing: 0.5,
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
    color: colors.textLight,
    textAlign: 'center',
  },
});
