import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { colors } from '../constants/theme';
import { clearSession } from '../utils/storage';
import FloatingHearts from '../components/FloatingHearts';

export default function NameScreen() {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (name.trim()) {
      clearSession().catch(() => {});
      router.push({ pathname: '/quiz', params: { name: name.trim() } });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <FloatingHearts />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Content */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>{'\u270F\uFE0F'}</Text>
            <Text style={styles.cardTitle}>What's your name?</Text>
            <Text style={styles.cardSubtext}>So we know who to congratulate (or roast)</Text>

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
                Let's Go! {'\uD83C\uDF38'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.backButtonText}>{'\u2190'} Back</Text>
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
    backgroundColor: colors.cream,
  },
  keyboardView: {
    flex: 1,
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
    borderRadius: 24,
    padding: 36,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtext: {
    fontFamily: 'Lato_400Regular',
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: colors.creamDark,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontFamily: 'Lato_400Regular',
    fontSize: 18,
    color: colors.text,
    backgroundColor: colors.cream,
    marginBottom: 20,
  },
  inputFocused: {
    borderColor: colors.maroon,
    backgroundColor: colors.white,
  },
  submitButton: {
    backgroundColor: colors.maroon,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: colors.creamDark,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 18,
    color: colors.white,
    letterSpacing: 0.3,
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
  },
});
