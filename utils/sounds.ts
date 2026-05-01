import { AudioContext, AudioBuffer } from 'react-native-audio-api';

const correctAsset = require('../assets/sounds/correct.wav');
const incorrectAsset = require('../assets/sounds/incorrect.wav');
const tapAsset = require('../assets/sounds/tap.wav');
const celebrationAsset = require('../assets/sounds/celebration.wav');
const brideAsset = require('../assets/sounds/bride.wav');

let ctx: AudioContext | null = null;
let correctBuffer: AudioBuffer | null = null;
let incorrectBuffer: AudioBuffer | null = null;
let tapBuffer: AudioBuffer | null = null;
let celebrationBuffer: AudioBuffer | null = null;
let brideBuffer: AudioBuffer | null = null;

let loadPromise: Promise<void> | null = null;

function ensureLoaded(): Promise<void> {
  if (!loadPromise) {
    loadPromise = (async () => {
      ctx = new AudioContext();
      const [c, i, t, cel, b] = await Promise.all([
        ctx.decodeAudioData(correctAsset),
        ctx.decodeAudioData(incorrectAsset),
        ctx.decodeAudioData(tapAsset),
        ctx.decodeAudioData(celebrationAsset),
        ctx.decodeAudioData(brideAsset),
      ]);
      correctBuffer = c;
      incorrectBuffer = i;
      tapBuffer = t;
      celebrationBuffer = cel;
      brideBuffer = b;
    })();
  }
  return loadPromise;
}

function playBuffer(buffer: AudioBuffer | null) {
  if (!ctx || !buffer) return;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
}

export async function playCorrect() {
  await ensureLoaded();
  if (Math.random() < 0.25) {
    playBuffer(brideBuffer);
  } else {
    playBuffer(correctBuffer);
  }
}

export async function playIncorrect() {
  await ensureLoaded();
  playBuffer(incorrectBuffer);
}

export async function playTap() {
  await ensureLoaded();
  playBuffer(tapBuffer);
}

export async function playCelebration() {
  await ensureLoaded();
  playBuffer(celebrationBuffer);
}
