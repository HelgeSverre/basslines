// Basic Rhythmic Patterns
export const basicPatterns = {
  basic4: {
    name: "Four-to-the-Floor",
    category: "Basic",
    description: "Classic four beat pattern, fundamental to electronic dance music",
    pattern: Array(16)
      .fill()
      .map((_, i) => (i % 4 === 0 ? "C3" : null)),
  },
  gateEighths: {
    name: "8th Note Gate",
    category: "Basic",
    description: "Rhythmic eighth note pattern commonly used in dance music basics",
    pattern: Array(16)
      .fill()
      .map((_, i) => (i % 2 === 0 ? "C3" : null)),
  },
  offBeat: {
    name: "Off-Beat Groove",
    category: "Basic",
    description: "Emphasizes the off-beats, creating a bouncy, syncopated feel",
    pattern: Array(16)
      .fill()
      .map((_, i) => (i % 2 === 1 ? "C3" : null)),
  },
  rolling: {
    name: "16th Note Roll",
    category: "Basic",
    description: "Continuous 16th notes, creates intense, driving energy",
    pattern: Array(16).fill("C3"),
  },
  walkingBass: {
    name: "Walking Bass",
    category: "Common",
    description: "Classic ascending pattern using scale degrees 1-3-5-6",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i % 4 === 0) return "C3";
        if (i % 4 === 1) return "E3";
        if (i % 4 === 2) return "G3";
        if (i % 4 === 3) return "A3";
        return null;
      }),
  },
  octaveJump: {
    name: "Octave Jump",
    category: "Common",
    description: "Alternates between two octaves for a dynamic, jumping feel",
    pattern: Array(16)
      .fill()
      .map((_, i) => (i % 2 === 0 ? "C3" : "C4")),
  },
  syncopated: {
    name: "Syncopated Groove",
    category: "Common",
    description: "Emphasizes off-beats and weak beats for groove",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 3) return "C3";
        if (i === 6) return "C3";
        if (i === 10) return "C3";
        if (i === 13) return "C3";
        return null;
      }),
  },
  octaveGroove: {
    name: "Oct Groove",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i % 8 === 0) return "C3";
        if (i % 8 === 2) return "C4";
        if (i % 8 === 4) return "G3";
        if (i % 8 === 6) return "C3";
        return null;
      }),
  },
};

// Classic Trance Patterns
export const trancePatterns = {
  tranceRoller: {
    name: "Trance Roll",
    category: "Trance",
    description: "Classic rolling trance bassline with three-note groups (xxx-xxx-xxx-xxx)",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        // Create groups of three notes with a gap
        const groupPosition = i % 4; // Position within each group of 4 sixteenths
        if (groupPosition > 0) {
          // First three positions in each group are notes
          return "C3";
        }
        return null; // Fourth position is a rest
      }),
  },
  tranceRollerOct: {
    name: "Trance Roll Oct",
    category: "Trance",
    description: "Rolling trance bassline with alternating octaves (high-low-high rest)",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        // Create groups of three notes with a gap
        const groupPosition = i % 4; // Position within each group of 4 sixteenths
        if (groupPosition === 1) return "C4"; // First note high
        if (groupPosition === 2) return "C3"; // Second note low
        if (groupPosition === 3) return "C4"; // Third note high
        return null; // Fourth position is a rest
      }),
  },
  tranceRollerOctAlt: {
    name: "Trance Roll Oct Alternating",
    category: "Trance",
    description: "Rolling trance bassline with continuous octave alternation",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        // Create groups of three notes with a gap
        const groupPosition = i % 4; // Position within each group
        if (groupPosition > 0) {
          // Skip every 4th position
          // Count the actual note number (1-based) across the entire pattern
          const noteNumber = Math.floor(i / 4) * 3 + (groupPosition - 1);
          // Alternate between C3 and C4 based on the note number
          return noteNumber % 2 === 0 ? "C3" : "C4";
        }
        return null; // Rest on every 4th position
      }),
  },
  ayla: {
    name: "Ayla",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0 || i === 8) return "C3";
        if (i === 4 || i === 12) return "G2";
        if (i === 2 || i === 10) return "E2";
        if (i === 6 || i === 14) return "F2";
        return null;
      }),
  },
  rank1: {
    name: "Rank 1 Style",
    category: "Trance",
    description: "Inspired by classic Dutch trance, alternating root and fifth",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i % 4 === 0) return "C3";
        if (i % 4 === 1) return "G3";
        return null;
      }),
  },
  veracocha: {
    name: "Veracocha Pattern",
    category: "Trance",
    description: "Melodic sequence inspired by 'Carte Blanche', using chord tones",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 3) return "E3";
        if (i === 6) return "G3";
        if (i === 9) return "E3";
        if (i === 12) return "F3";
        if (i === 15) return "G3";
        return null;
      }),
  },
  systemF: {
    name: "System F Pulse",
    category: "Trance",
    description: "Driving pulse pattern with quick double hits, signature Ferry Corsten style",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i % 4 === 0) return "C3";
        if (i % 4 === 1) return "C3";
        if (i % 4 === 2) return null;
        return "C3";
      }),
  },
  airwave: {
    name: "Airwave Pattern",
    category: "Trance",
    description: "Melodic sequence inspired by Rank 1's 'Airwave', using dominant seventh",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 3) return "G3";
        if (i === 6) return "A#3";
        if (i === 9) return "G3";
        if (i === 12) return "F3";
        if (i === 15) return "G3";
        return null;
      }),
  },
  gouryella: {
    name: "Gouryella Hook",
    category: "Trance",
    description: "Iconic pattern from Ferry Corsten & Tiësto collaboration",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i % 8 === 0) return "C3";
        if (i % 8 === 2) return "C3";
        if (i % 8 === 4) return "G3";
        if (i % 8 === 6) return "E3";
        return null;
      }),
  },
  dutchTrance: {
    name: "Dutch Trance Gate",
    category: "Trance",
    description: "Gated pattern with chord progression, typical of Dutch trance style",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0 || i === 6) return "C3";
        if (i === 2 || i === 8) return "G3";
        if (i === 4) return "F3";
        if (i === 10) return "A3";
        return null;
      }),
  },
};

// House & Techno Patterns
export const houseTechnoPatterns = {
  houseGroove: {
    name: "Classic House",
    category: "House",
    description: "Traditional house music bassline with emphasis on upbeats",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 3) return "C3";
        if (i === 6) return "C3";
        if (i === 9) return "C3";
        if (i === 12) return "C3";
        return null;
      }),
  },
  techWalk: {
    name: "Techno Walk",
    category: "Techno",
    description: "Walking techno bassline with chromatic movement",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 4) return "D#3";
        if (i === 8) return "D3";
        if (i === 12) return "C3";
        return null;
      }),
  },
  acidLine: {
    name: "303 Acid Line",
    category: "Acid",
    description: "Classic acid house pattern inspired by the Roland TB-303",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 2) return "C3";
        if (i === 3) return "C#3";
        if (i === 6) return "D3";
        if (i === 8) return "D#3";
        if (i === 10) return "D3";
        if (i === 12) return "C#3";
        if (i === 14) return "C3";
        return null;
      }),
  },
  pushingGate: {
    name: "Push Gate",
    category: "Techno",
    description: "Gated pattern with pushed timing, common in modern techno",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i % 4 === 0) return "C3";
        if (i % 4 === 2) return "C3";
        return null;
      }),
  },
};

// UK Bass & Garage Patterns
export const ukPatterns = {
  garage2Step: {
    name: "2-Step Garage",
    category: "UK Garage",
    description: "Classic two-step garage rhythm with swung feeling",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0 || i === 8) return "C3";
        if (i === 3 || i === 11) return "C3";
        if (i === 6 || i === 14) return "C3";
        return null;
      }),
  },
  ukBass: {
    name: "UK Bass Pattern",
    category: "UK Bass",
    description: "Heavy sub bass movement typical of UK bass music",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C2";
        if (i === 4) return "G2";
        if (i === 7) return "F2";
        if (i === 8) return "C2";
        if (i === 12) return "G2";
        if (i === 15) return "F2";
        return null;
      }),
  },
  silkArp: {
    name: "Silk Arp",
    category: "UK Garage",
    description: "Arpeggiated garage pattern with melodic movement",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 2) return "E3";
        if (i === 4) return "G3";
        if (i === 6) return "C4";
        if (i === 8) return "G3";
        if (i === 10) return "E3";
        if (i === 12) return "C3";
        if (i === 14) return "E3";
        return null;
      }),
  },
};

// Drum & Bass Patterns
export const dnbPatterns = {
  dnbRoller: {
    name: "DnB Roller",
    category: "Drum & Bass",
    description: "Rolling bassline with descending melodic movement",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 4) return "C3";
        if (i === 7) return "G3";
        if (i === 8) return "F3";
        if (i === 10) return "E3";
        if (i === 12) return "D3";
        if (i === 14) return "C3";
        return null;
      }),
  },
  jumpUp: {
    name: "Jump Up Bass",
    category: "Drum & Bass",
    description: "Aggressive jump-up DnB style with octave drops",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0 || i === 8) return "C3";
        if (i === 2 || i === 10) return "G2";
        if (i === 4 || i === 12) return "E2";
        if (i === 6 || i === 14) return "C2";
        return null;
      }),
  },
};

// Hip Hop & Trap Patterns
export const urbanPatterns = {
  trapBoom: {
    name: "Trap 808",
    category: "Trap",
    description: "Modern trap pattern with booming 808 placement",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0 || i === 7) return "C2";
        if (i === 3 || i === 11) return "C2";
        if (i === 14) return "C2";
        return null;
      }),
  },
  boombap: {
    name: "Boom Bap",
    category: "Hip Hop",
    description: "Classic hip-hop style with melodic movement",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0 || i === 8) return "C3";
        if (i === 3 || i === 11) return "G3";
        if (i === 6 || i === 14) return "E3";
        return null;
      }),
  },
};

// Iconic Track Patterns
export const iconicPatterns = {
  chicane: {
    name: "Saltwater",
    category: "Progressive",
    description: "Inspired by Chicane's 'Saltwater', melodic progressive pattern",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 2) return "G2";
        if (i === 4) return "A#2";
        if (i === 6) return "F3";
        if (i === 8) return "G3";
        if (i === 10) return "F3";
        if (i === 12) return "D#3";
        if (i === 14) return "C3";
        return null;
      }),
  },
  twoTribes: {
    name: "Two Tribes",
    category: "Classic Dance",
    description: "Inspired by FGTH's 'Two Tribes', iconic dance pattern",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i % 8 === 0) return "C3";
        if (i % 8 === 2) return "C3";
        if (i % 8 === 4) return "A#2";
        if (i % 8 === 6) return "G2";
        return null;
      }),
  },
  outOfTheBlue: {
    name: "Out of the Blue",
    category: "Progressive Trance",
    description: "System F/Ferry Corsten's iconic rising progression",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0 || i === 8) return "C3";
        if (i === 2 || i === 10) return "E3";
        if (i === 4 || i === 12) return "F3";
        if (i === 6 || i === 14) return "G3";
        return null;
      }),
  },
  spacemanid: {
    name: "ID&T Pattern",
    category: "Hard Trance",
    description: "Hard trance pattern inspired by Spaceman's 'Magic Fly'",
    pattern: Array(16)
      .fill()
      .map((_, i) => {
        if (i === 0) return "C3";
        if (i === 4) return "C3";
        if (i === 8) return "A#2";
        if (i === 12) return "G2";
        return null;
      }),
  },
};

export const allPatterns = {
  ...basicPatterns,
  ...trancePatterns,
  ...houseTechnoPatterns,
  ...ukPatterns,
  ...dnbPatterns,
  ...urbanPatterns,
  ...iconicPatterns,
};
