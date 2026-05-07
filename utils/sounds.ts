import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

const correctPlayers: AudioPlayer[] = [
  createAudioPlayer(require('../assets/sounds/correct-1.wav')),
  createAudioPlayer(require('../assets/sounds/correct-2.wav')),
  createAudioPlayer(require('../assets/sounds/correct-3.wav')),
  createAudioPlayer(require('../assets/sounds/correct-4.wav')),
];
const incorrectPlayer = createAudioPlayer(require('../assets/sounds/incorrect.wav'));
const tapPlayer = createAudioPlayer(require('../assets/sounds/tap.wav'));
const celebrationPlayer = createAudioPlayer(require('../assets/sounds/celebration.wav'));

const allPlayers: AudioPlayer[] = [
  ...correctPlayers,
  incorrectPlayer,
  tapPlayer,
  celebrationPlayer,
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
  const player = correctPlayers[Math.floor(Math.random() * correctPlayers.length)];
  play(player);
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
