const customSynths = {
  mono: {
    volume: -8,
    detune: 0,
    portamento: 0,
    envelope: {
      attack: 1.2,
      attackCurve: "linear",
      decay: 0.3,
      decayCurve: "exponential",
      release: 1.2,
      releaseCurve: "exponential",
      sustain: 0.4,
    },
    filter: {
      Q: 1,
      detune: 0,
      frequency: 0,
      gain: 0,
      rolloff: -12,
      type: "lowpass",
    },
    filterEnvelope: {
      attack: 0.001,
      attackCurve: "linear",
      decay: 0.7,
      decayCurve: "exponential",
      release: 0.8,
      releaseCurve: "exponential",
      sustain: 0.1,
      baseFrequency: 300,
      exponent: 2,
      octaves: 4,
    },
    oscillator: {
      detune: 0,
      frequency: 440,
      partialCount: 8,
      partials: [
        1.2732395447351628, 0, 0.4244131815783876, 0, 0.25464790894703254, 0,
        0.18189136353359467, 0,
      ],
      phase: 0,
      type: "square8",
    },
  },
};

const scales = {
  e: {
    // minorBlues: ["E3", "G3", "A3", "A#3", "B3", "D4"],
    dorianMode: ["E3", "F#3", "G3", "A3", "B3", "C#4", "D4"],
    // naturalMinor: ["E3", "F#3", "G3", "A3", "B3", "C4", "D4"],
    // majorPentatonic: ["E3", "F#3", "G#3", "B3", "C#4"],
  },
  a: {
    // minorPentatonic: ["A3", "C4", "D4", "E4", "G4"],
    dorianMode: ["A3", "B3", "C4", "D4", "E4", "F#4", "G4"],
    // naturalMinor: ["A3", "B3", "C4", "D4", "E4", "F4", "G4"],
    // majorPentatonic: ["A3", "B3", "C#4", "E4", "F#4"],
  },
};

let scale = scales.a.dorianMode;

const startSound = async () => {
  await Tone.start();
};

const getChannel = (life) => {
  let i = Math.floor(Math.random() * scale.length);
  const note = scale[i];
  const t = new Tone.MonoSynth(customSynths.mono);
  // const fx = new Tone.Tremolo({
  //   frequency: 10,
  //   type: "sine",
  //   depth: 0.5,
  //   spread: 180,
  // }).toDestination();
  // t.connect(fx);
  t.toDestination();

  return {
    play: () => {
      t.triggerAttackRelease(note, life);
    },
    kill: () => {
      t.triggerRelease();
      // t.triggerAttackRelease(note_dead, "8n");
    },
    bounce: () => {
      i++;
      t.triggerAttackRelease(scale[scale.length % i], life);
    },
  };
};
