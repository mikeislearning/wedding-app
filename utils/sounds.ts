import { AudioContext, AudioBuffer, AudioBufferSourceNode, GainNode } from 'react-native-audio-api';

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

type ActiveVoice = { source: AudioBufferSourceNode; gain: GainNode };
const activeSources: Set<ActiveVoice> = new Set();

const FADE_SECONDS = 0.08;

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

export function stopAll() {
  if (!ctx) return;
  const now = ctx.currentTime;
  activeSources.forEach(({ gain }) => {
    try {
      // Fade to silence and let the buffer play out naturally.
      // Calling source.stop() mid-buffer crashes AVAudioEngine on physical iOS devices.
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
    } catch {}
  });
  // Don't clear activeSources here — the per-voice setTimeout in playBuffer
  // removes each entry once its buffer naturally ends.
}

function playBuffer(buffer: AudioBuffer | null) {
  if (!ctx || !buffer) return;
  try {
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(ctx.destination);
    const voice: ActiveVoice = { source, gain };
    activeSources.add(voice);
    source.start();
    const duration = buffer.duration;
    setTimeout(() => {
      activeSources.delete(voice);
    }, (duration + 0.5) * 1000);
  } catch {}
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
