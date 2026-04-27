# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm start` - Start Expo dev server
- `pnpm ios` - Run on iOS simulator
- `pnpm ios:device` - Run on physical iOS device
- `pnpm android` - Run on Android emulator
- `pnpm web` - Run web version
- No test runner or linter is configured

## Architecture

Wedding trivia app built with Expo SDK 55, Expo Router (file-based routing), React Native, and TypeScript (strict mode).

**Flow:** Home (`index`) -> Enter name (`name`) -> Quiz (`quiz`) -> Results (`results`). Scores screen (`scores`) accessible from home.

**Quiz mechanics:** `utils/quiz.ts` shuffles all 30 questions from `data/questions.json` and picks 10, also shuffling each question's answer options. Questions have three categories: `couples`, `alan`, `amber`. Some questions include post-answer captions and images.

**Question images:** Static images in `assets/images/questions/` are mapped through `utils/questionImages.ts` using `require()` calls (React Native requirement for static assets). The `images` field in questions.json references filenames that must have a corresponding entry in this map.

**Scores:** `utils/storage.ts` persists scores as `{name, score}[]` in AsyncStorage under key `wedding_trivia_scores`. Scores append-only, no deletion.

**Navigation:** Uses `router.replace()` for quiz->results (prevents back-navigation into a completed quiz) and `router.push()` elsewhere.

## Styling

- iPad-optimized with `maxWidth: 700` on content containers
- Fonts loaded in `_layout.tsx`: Playfair Display (headers), Lato (body)
- Color palette in `constants/theme.ts`: maroon/gold/cream scheme
- All screens use `SafeAreaView` with explicit edge configuration
