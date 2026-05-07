import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

const correctPlayer = createAudioPlayer(require('../assets/sounds/correct.wav'));
const incorrectPlayer = createAudioPlayer(require('../assets/sounds/incorrect.wav'));
const tapPlayer = createAudioPlayer(require('../assets/sounds/tap.wav'));
const celebrationPlayer = createAudioPlayer(require('../assets/sounds/celebration.wav'));
const bridePlayer = createAudioPlayer(require('../assets/sounds/bride.wav'));

const allPlayers: AudioPlayer[] = [
  correctPlayer,
  incorrectPlayer,
  tapPlayer,
  celebrationPlayer,
  bridePlayer,
];

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
    player.play();
  } catch {}
}

export function stopAll() {
  for (const p of allPlayers) {
    try {
      p.pause();
    } catch {}
    try {
      p.seekTo(0);
    } catch {}
  }
}

export function playCorrect() {
  stopAll();
  if (Math.random() < 0.25) {
    play(bridePlayer);
  } else {
    play(correctPlayer);
  }
}

export function playIncorrect() {
  stopAll();
  play(incorrectPlayer);
}

export function playTap() {
  stopAll();
  play(tapPlayer);
}

export function playCelebration() {
  stopAll();
  play(celebrationPlayer);
}
