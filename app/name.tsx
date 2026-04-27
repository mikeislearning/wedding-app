import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { colors } from '../constants/theme';

export default function NameScreen() {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (name.trim()) {
      router.push({ pathname: '/quiz', params: { name: name.trim() } });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text style={styles.headerTitle}>Alan & Amber</Text>
            <Text style={styles.goldDivider}>{'\u2766'}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What's your name?</Text>
            <Text style={styles.cardSubtext}>We'll save your score to the leaderboard</Text>

            <TextInput
              style={[styles.input, focused && styles.inputFocused, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
              placeholder="Enter your name"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={handleSubmit}
              returnKeyType="go"
              autoCapitalize="words"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[styles.submitButton, !name.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!name.trim()}
              activeOpacity={0.85}
            >
              <Text style={[styles.submitButtonText, !name.trim() && styles.submitButtonTextDisabled]}>
                Start Quiz
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.maroon,
  },
  keyboardView: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.maroon,
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerInner: {
    width: '100%',
    maxWidth: 700,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 36,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 2,
  },
  goldDivider: {
    color: colors.gold,
    fontSize: 18,
    marginTop: 10,
    letterSpacing: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 36,
    width: '100%',
    maxWidth: 580,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardSubtext: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: colors.creamDark,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
    color: colors.text,
    backgroundColor: colors.cream,
    marginBottom: 24,
  },
  inputFocused: {
    borderColor: colors.maroon,
    backgroundColor: colors.white,
  },
  submitButton: {
    backgroundColor: colors.maroon,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
    shadowColor: colors.maroonDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: colors.creamDark,
    borderColor: colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 20,
    color: colors.white,
    letterSpacing: 0.5,
  },
  submitButtonTextDisabled: {
    color: colors.textLight,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: colors.textLight,
    letterSpacing: 0.5,
  },
});
