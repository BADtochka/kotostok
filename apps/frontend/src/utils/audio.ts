let ctx: AudioContext;
const buffers = new Map<string, AudioBuffer>();

const AUDIO = {
  makeTurn: "turn.mp3",
  wipeDice: "wipeDice.mp3",
} as const;

type AudioName = keyof typeof AUDIO;

let masterGain: GainNode | null = null;
const activeSounds = new Map<string, number>();

const getCtx = () => (ctx ??= new window.AudioContext());

const getMaster = () => {
  const audioCtx = getCtx();
  if (!masterGain) {
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.1, audioCtx.currentTime); // дефолт сразу
    masterGain.connect(audioCtx.destination);
  }
  return masterGain;
};

export const loadSound = async (name: AudioName) => {
  const res = await fetch(`/audio/${AUDIO[name]}`);
  const arr = await res.arrayBuffer();
  const buf = await getCtx().decodeAudioData(arr);
  buffers.set(name, buf);
};

export const playSound = (
  name: AudioName,
  { volume = 0.1, playbackRate = 1, dedupMs = 50 } = {},
) => {
  const audioCtx = getCtx();
  const buf = buffers.get(name);
  if (!buf) return;

  const lastPlayed = activeSounds.get(name) ?? 0;
  if (performance.now() - lastPlayed < dedupMs) return;
  activeSounds.set(name, performance.now());

  const master = getMaster();

  // Gain на уровне источника — не трогает мастер
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.connect(master);

  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.setValueAtTime(playbackRate, audioCtx.currentTime);
  src.connect(gainNode);
  src.start();
};
