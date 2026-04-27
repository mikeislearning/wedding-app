import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { colors } from '../constants/theme';
import { getScores, ScoreEntry } from '../utils/storage';

const MEDALS = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];

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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backButtonText}>{'\u2190'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{'\uD83C\uDFC6'} Leaderboard</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listWrapper}>
          {loaded && scores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>{'\uD83C\uDF38'}</Text>
              <Text style={styles.emptyText}>No scores yet!</Text>
              <Text style={styles.emptySubtext}>Be the first to play.</Text>
            </View>
          ) : (
            scores.map((entry, index) => (
              <View key={index} style={[styles.row, index === 0 && styles.rowFirst]}>
                <View style={styles.rankContainer}>
                  {index < 3 ? (
                    <Text style={styles.medal}>{MEDALS[index]}</Text>
                  ) : (
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  )}
                </View>
                <Text style={styles.playerName} numberOfLines={1}>{entry.name}</Text>
                <View style={styles.scoreBadge}>
                  <Text style={styles.playerScore}>{entry.score}/10</Text>
                </View>
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
    backgroundColor: colors.cream,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    marginBottom: 8,
  },
  backButtonText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: colors.textLight,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: colors.text,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  listWrapper: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  rowFirst: {
    backgroundColor: colors.creamDark,
  },
  rankContainer: {
    width: 44,
    alignItems: 'center',
    marginRight: 12,
  },
  medal: {
    fontSize: 24,
  },
  rankNumber: {
    fontFamily: 'Lato_700Bold',
    fontSize: 16,
    color: colors.textLight,
  },
  playerName: {
    flex: 1,
    fontFamily: 'Lato_400Regular',
    fontSize: 17,
    color: colors.text,
  },
  scoreBadge: {
    backgroundColor: colors.maroon,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 12,
  },
  playerScore: {
    fontFamily: 'Lato_700Bold',
    fontSize: 14,
    color: colors.white,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});
