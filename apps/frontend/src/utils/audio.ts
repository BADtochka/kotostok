let ctx: AudioContext;
const buffers = new Map();

type AudioName = keyof typeof AUDIO;

export const AUDIO = {
  makeTurn: 'turn.mp3',
  wipeDice: 'wipeDice.mp3',
};

const getCtx = () => (ctx ??= new window.AudioContext());

export const loadSound = async (name: AudioName) => {
  const res = await fetch(`/audio/${AUDIO[name]}`);
  const arr = await res.arrayBuffer();
  const buf = await getCtx().decodeAudioData(arr);
  buffers.set(name, buf);
};

export const playSound = (name: AudioName, { volume = 0.1, playbackRate = 1 } = {}) => {
  const audioCtx = getCtx();
  const buf = buffers.get(name);
  if (!buf) return;

  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = playbackRate;

  const gain = audioCtx.createGain();
  gain.gain.value = volume;

  src.connect(gain).connect(audioCtx.destination);
  src.start();
};

export const unlockAudio = async () => {
  const audioCtx = getCtx();
  if (audioCtx.state === 'suspended') await audioCtx.resume();
};
