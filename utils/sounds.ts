import { AudioContext, AudioBuffer } from 'react-native-audio-api';

const correctAsset = require('../assets/sounds/correct.wav');
const incorrectAsset = require('../assets/sounds/incorrect.wav');

let ctx: AudioContext | null = null;
let correctBuffer: AudioBuffer | null = null;
let incorrectBuffer: AudioBuffer | null = null;

let loadPromise: Promise<void> | null = null;

function ensureLoaded(): Promise<void> {
  if (!loadPromise) {
    loadPromise = (async () => {
      ctx = new AudioContext();
      const [c, i] = await Promise.all([
        ctx.decodeAudioData(correctAsset),
        ctx.decodeAudioData(incorrectAsset),
      ]);
      correctBuffer = c;
      incorrectBuffer = i;
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
  playBuffer(correctBuffer);
}

export async function playIncorrect() {
  await ensureLoaded();
  playBuffer(incorrectBuffer);
}
