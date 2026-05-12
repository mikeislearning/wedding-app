import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

const correctPlayer = createAudioPlayer(require('../assets/sounds/correct.wav'));
// const incorrectPlayer = createAudioPlayer(require('../assets/sounds/incorrect.wav'));
// const tapPlayer = createAudioPlayer(require('../assets/sounds/tap.wav'));
// const celebrationPlayer = createAudioPlayer(require('../assets/sounds/celebration.wav'));

const allPlayers: AudioPlayer[] = [
  correctPlayer,
  // incorrectPlayer,
  // tapPlayer,
  // celebrationPlayer,
];

const CORRECT_HOLD_MS = 5000;
const CORRECT_FADE_MS = 600;
const FADE_STEPS = 12;

let fadeHoldTimer: ReturnType<typeof setTimeout> | null = null;
let fadeStepTimer: ReturnType<typeof setInterval> | null = null;

function clearFade() {
  if (fadeHoldTimer) {
    clearTimeout(fadeHoldTimer);
    fadeHoldTimer = null;
  }
  if (fadeStepTimer) {
    clearInterval(fadeStepTimer);
    fadeStepTimer = null;
  }
}

// Pause first to bring the player to a clean state before re-seeking and
// re-playing. Avoids re-entrant play() races that have crashed AVAudioEngine
// on TestFlight builds.
function play(player: AudioPlayer) {
  try {
    player.pause();
  } catch {}
  try {
    player.seekTo(0);
  } catch {}
  try {
    player.volume = 1;
  } catch {}
  try {
    player.play();
  } catch {}
}

function fadeOutAndPause(player: AudioPlayer) {
  let step = 0;
  fadeStepTimer = setInterval(() => {
    step++;
    const v = Math.max(0, 1 - step / FADE_STEPS);
    try {
      player.volume = v;
    } catch {}
    if (step >= FADE_STEPS) {
      if (fadeStepTimer) clearInterval(fadeStepTimer);
      fadeStepTimer = null;
      try {
        player.pause();
      } catch {}
      try {
        player.volume = 1;
      } catch {}
    }
  }, CORRECT_FADE_MS / FADE_STEPS);
}

export function stopAll() {
  clearFade();
  for (const p of allPlayers) {
    try {
      p.pause();
    } catch {}
    try {
      p.seekTo(0);
    } catch {}
    try {
      p.volume = 1;
    } catch {}
  }
}

export function playCorrect() {
  stopAll();
  play(correctPlayer);
  fadeHoldTimer = setTimeout(() => {
    fadeHoldTimer = null;
    fadeOutAndPause(correctPlayer);
  }, CORRECT_HOLD_MS);
}

export function playIncorrect() {
  // stopAll();
  // play(incorrectPlayer);
}

export function playTap() {
  // stopAll();
  // play(tapPlayer);
}

export function playCelebration() {
  // stopAll();
  // play(celebrationPlayer);
}
