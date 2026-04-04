# Version Two: PDF Content & Two-Step Answer Flow

Source of truth: `Wedding_Trivia_2.pdf`

---

## Overview

Two changes:
1. **Two-step answer flow** — tap an option to select it, then tap a "Confirm" button to lock in. Currently, tapping an option immediately submits.
2. **Captions & images** — many questions have a caption (quotes from Amber/Alan) and/or images that should appear **after confirmation**, underneath the answer options as part of the feedback reveal.

---

## Files to Change

### 1. Rename & organize images (`assets/images/questions/`)

Extracted images live here as `img-000.jpg` through `img-017.jpg`. Rename them for clarity:

| File | Rename to | Question |
|------|-----------|----------|
| img-000.jpg | q01-earls.jpg | Q1 (first date) |
| img-001.jpg | q02-halifax.jpg | Q2 (first trip) |
| img-002.jpg | q04-lorde.jpg | Q4 (music artist) |
| img-003.jpg | q05-it-takes-two.jpg | Q5 (Halloween) |
| img-004.jpg | q05-costume.jpg | Q5 (Halloween, 2nd image) |
| img-005.jpg | q06-proposal.jpg | Q6 (proposal) |
| img-006.jpg | q11-tuesday-nooners.jpg | Q11 (hockey team) |
| img-007.jpg | q14-tex-murphy-merch.jpg | Q14 (video game) |
| img-008.jpg | q14-tex-murphy-collection.jpg | Q14 (video game, 2nd image) |
| img-009.jpg | q15-acting.jpg | Q15 (acting career) |
| img-010.jpg | SKIP (transparency mask for img-009) | -- |
| img-011.jpg | q22-horse-jumping.jpg | Q22 (horse jumping) |
| img-012.jpg | q23-alomar.jpg | Q23 (horse leased) |
| img-013.jpg | q24-falcon-lake.jpg | Q24 (camping) |
| img-014.jpg | q25-pets.jpg | Q25 (pets) |
| img-015.jpg | q27-win-heart.jpg | Q27 (win heart list) |
| img-016.jpg | q29-jobs.jpg | Q29 (jobs) |
| img-017.jpg | q30-hobbiton.jpg | Q30 (NZ trip) |

Delete `img-010.jpg` after renaming the rest.

### 2. Create image map module (`utils/questionImages.ts`)

React Native requires static `require()` calls for images. Create a map keyed by image filename:

```typescript
const questionImages: Record<string, any> = {
  'q01-earls.jpg': require('../assets/images/questions/q01-earls.jpg'),
  'q02-halifax.jpg': require('../assets/images/questions/q02-halifax.jpg'),
  // ... all images
};

export function getQuestionImage(key: string): any | undefined {
  return questionImages[key];
}
```

### 3. Update `data/questions.json`

Add optional `caption` and `images` fields to each question. Also apply text corrections from the PDF:

**Text corrections:**
- Q5: Change `"Ferris Bueller's Day Off's"` to `"Ferris Buehler's Day Off's"` (PDF spelling)
- Q27: Change question text to `"For a school assignment, which of the following was NOT on 14-year-old Amber's 'Instructions on how to win my heart: For Dummies' list?"`

**New fields (examples):**

```json
{
  "id": 1,
  "category": "couples",
  "question": "Where was Amber and Alan's first date?",
  "options": ["Earl's", "The Forks", "Across The Board", "Starbucks"],
  "correctAnswer": "Earl's",
  "caption": "Amber: \"It was at the Earl's in River Park South, which I thought was funny because it was kind of in the middle of nowhere.\"\nAlan: \"I picked Earl's because I figured you can't go wrong with a chain restaurant. Very romantic.\"",
  "images": ["q01-earls.jpg"]
}
```

Questions without captions/images simply omit those fields. Questions with two images (Q5, Q14) get both in the array.

**Complete caption/image mapping:**

| Q | Caption | Images |
|---|---------|--------|
| 1 | Amber + Alan quotes about Earl's/River Park South | [q01-earls.jpg] |
| 2 | Amber + Alan quotes about PEI/New Brunswick | [q02-halifax.jpg] |
| 3 | none | none |
| 4 | none | [q04-lorde.jpg] |
| 5 | none | [q05-it-takes-two.jpg, q05-costume.jpg] |
| 6 | none | [q06-proposal.jpg] |
| 7 | none | none |
| 8 | none | none |
| 9 | Amber + Alan quotes about blue heron | none |
| 10 | Amber quote about foot massager | none |
| 11 | Alan + Amber quotes | [q11-tuesday-nooners.jpg] |
| 12 | Amber + Alan quotes about D&D | none |
| 13 | Alan quote about fantasy hockey | none |
| 14 | none | [q14-tex-murphy-merch.jpg, q14-tex-murphy-collection.jpg] |
| 15 | Alan quote about acting | [q15-acting.jpg] |
| 16 | Alan quote about Laura Dern | none |
| 17 | Alan quote about The Brick | none |
| 18 | Alan quote about Latvia | none |
| 19 | none | none |
| 20 | none | none |
| 21 | Amber + Alan multi-line exchange | none |
| 22 | Amber quote | [q22-horse-jumping.jpg] |
| 23 | Amber quote about Alomar | [q23-alomar.jpg] |
| 24 | Amber quote about Falcon Lake | [q24-falcon-lake.jpg] |
| 25 | Amber + Alan quotes about pets | [q25-pets.jpg] |
| 26 | Amber + Alan quotes about music | none |
| 27 | Amber + Alan quotes | [q27-win-heart.jpg] |
| 28 | none | none |
| 29 | none | [q29-jobs.jpg] |
| 30 | Amber quote about Hobbiton | [q30-hobbiton.jpg] |

### 4. Update `utils/quiz.ts`

Update the `Question` interface:

```typescript
export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  caption?: string;
  images?: string[];
}
```

No other changes needed here -- `getRandomQuestions()` spreads properties so new fields carry through automatically.

### 5. Refactor `app/quiz.tsx`

This is the main UI change. Two things:

#### A. Two-step answer flow

Current state machine: `idle -> answered` (single tap)
New state machine: `idle -> selected -> confirmed`

```
State: idle
  - No option highlighted
  - Tap option -> set selectedAnswer, move to "selected"

State: selected
  - Selected option has highlight (gold border or similar)
  - "Confirm" button visible below options
  - Can tap a different option to change selection
  - Tap "Confirm" -> set answered=true, check correctness, move to "confirmed"

State: confirmed
  - Options show correct/incorrect coloring (existing logic)
  - Caption + images revealed below
  - "Next Question" / "See Results" button visible
```

Key changes to the component:
- `handleAnswer(option)` becomes `handleSelect(option)` -- only sets `selectedAnswer`, does NOT set `answered`
- New `handleConfirm()` -- sets `answered=true`, calculates score
- Options are NOT disabled until confirmed (allow changing selection)
- Add a "Confirm" button that appears when `selectedAnswer !== null && !answered`

**Styling the selected state:**
- Add a `optionSelected` style (e.g., gold border, slightly different background) distinct from correct/incorrect styles
- Update `getOptionStyle()` to handle the new selected-but-not-confirmed state

#### B. Caption & image display

After confirmation (`answered === true`), if the question has a `caption` or `images`, render them below the feedback container:

```tsx
{answered && currentQuestion.caption && (
  <View style={styles.captionContainer}>
    <Text style={styles.captionText}>{currentQuestion.caption}</Text>
  </View>
)}

{answered && currentQuestion.images && currentQuestion.images.map((img, i) => (
  <Image
    key={i}
    source={getQuestionImage(img)}
    style={styles.revealImage}
    resizeMode="contain"
  />
))}
```

New styles needed:
- `captionContainer` -- rounded card, light background, italic text feel for quotes
- `captionText` -- readable font, appropriate size
- `revealImage` -- full width of content area, auto height, rounded corners
- `optionSelected` -- gold/highlighted border for pre-confirmation selection

---

## Implementation Order

1. Rename images and delete the transparency mask
2. Create `utils/questionImages.ts` (static require map)
3. Update `data/questions.json` (captions, images, text fixes)
4. Update `Question` interface in `utils/quiz.ts`
5. Refactor `app/quiz.tsx` (two-step flow + caption/image reveal)

Steps 1-4 are data/setup. Step 5 is the only complex UI change.

---

## Notes

- The PDF captions need to be transcribed exactly from `Wedding_Trivia_2.pdf` using `pdftotext`. The summary above paraphrases them; the actual implementation should use the exact quote text.
- Some captions are multi-line dialogues between Amber and Alan -- preserve the speaker labels (e.g., "Amber:", "Alan:") and line breaks.
- `img-010.jpg` is a transparency/soft-mask artifact from PDF extraction, not a real image. Delete it.
- Two questions (Q5, Q14) have multiple images. Display them stacked vertically.
