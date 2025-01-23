export const noteToFreq = {
  "C2": 65.41,
  "C#2": 69.3,
  "D2": 73.42,
  "D#2": 77.78,
  "E2": 82.41,
  "F2": 87.31,
  "F#2": 92.5,
  "G2": 98.0,
  "G#2": 103.83,
  "A2": 110.0,
  "A#2": 116.54,
  "B2": 123.47,
  "C3": 130.81,
  "C#3": 138.59,
  "D3": 146.83,
  "D#3": 155.56,
  "E3": 164.81,
  "F3": 174.61,
  "F#3": 185.0,
  "G3": 196.0,
  "G#3": 207.65,
  "A3": 220.0,
  "A#3": 233.08,
  "B3": 246.94,
  "C4": 261.63,
  "C#4": 277.18,
  "D4": 293.66,
  "D#4": 311.13,
  "E4": 329.63,
  "F4": 349.23,
  "F#4": 369.99,
  "G4": 392.0,
  "G#4": 415.3,
  "A4": 440.0,
  "A#4": 466.16,
  "B4": 493.88,
  "C5": 523.25,
  "C#5": 554.37,
  "D5": 587.33,
  "D#5": 622.25,
  "E5": 659.25,
  "F5": 698.46,
  "F#5": 739.99,
  "G5": 783.99,
  "G#5": 830.61,
  "A5": 880.0,
  "A#5": 932.33,
  "B5": 987.77,
  "C6": 1046.5,
  "C#6": 1108.73,
  "D6": 1174.66,
  "D#6": 1244.51,
  "E6": 1318.51,
};

export function midiNoteToFrequency(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export function frequencyToMidiNote(frequency) {
  return Math.round(12 * Math.log2(frequency / 440) + 69);
}

export function noteLabel(midiNoteNumber) {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(midiNoteNumber / 12) - 1;
  return `${noteNames[midiNoteNumber % 12]}${octave}`;
}

// Generate full MIDI note range from C0 to G10
export const generateMidiNotes = () => {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const notes = [];

  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j < noteNames.length; j++) {
      const midiNumber = i * 12 + j;
      if (midiNumber > 127) break; // MIDI range ends at 127
      notes.push(`${noteNames[j]}${i}`);
    }
  }

  return notes;
};

const noteNameToMidi = (noteName) => {
  const noteMap = {
    "C": 0,
    "C#": 1,
    "D": 2,
    "D#": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "G": 7,
    "G#": 8,
    "A": 9,
    "A#": 10,
    "B": 11,
  };
  const match = noteName.match(/^([A-G]#?)(\d)$/);

  if (!match) {
    throw new Error(`Invalid note format: ${noteName}`);
  }

  const [, pitch, octave] = match;
  const midiNumber = noteMap[pitch] + parseInt(octave, 10) * 12;

  if (midiNumber < 0 || midiNumber > 127) {
    throw new Error(`Note out of MIDI range: ${noteName}`);
  }

  return midiNumber;
};

export const notes = generateMidiNotes().reverse();
