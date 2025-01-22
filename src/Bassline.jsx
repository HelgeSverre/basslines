// noinspection SpellCheckingInspection,JSCheckFunctionSignatures

import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

const BasslineVisualizer = () => {
  const notes = [
    "C4",
    "B3",
    "A#3",
    "A3",
    "G#3",
    "G3",
    "F#3",
    "F3",
    "E3",
    "D#3",
    "D3",
    "C#3",
    "C3",
    "B2",
    "A#2",
    "A2",
    "G#2",
    "G2",
    "F#2",
    "F2",
    "E2",
    "D#2",
    "D2",
    "C#2",
    "C2",
    "C1",
    "B1",
    "A#1",
    "A1",
    "G#1",
    "G1",
    "F#1",
    "F1",
    "E1",
    "D#1",
    "D1",
  ];

  // noinspection JSCheckFunctionSignatures
  const patterns = {
    gateEighths: {
      name: "8th Gate",
      pattern: Array(16)
        .fill()
        .map((_, i) => (i % 2 === 0 ? "C3" : null)),
    },
    offBeat: {
      name: "Off-Beat",
      pattern: Array(16)
        .fill()
        .map((_, i) => (i % 2 === 1 ? "C3" : null)),
    },
    rolling: {
      name: "Rolling 16ths",
      pattern: Array(16).fill("C3"),
    },

    rank1: {
      name: "Rank1",
      pattern: Array(16)
        .fill()
        .map((_, i) => {
          if (i % 4 === 0) return "C3";
          if (i % 4 === 1) return "G3";
          return null;
        }),
    },
    veraciousTrance: {
      name: "Veracocha",
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
    pushingGate: {
      name: "Push Gate",
      pattern: Array(16)
        .fill()
        .map((_, i) => {
          if (i % 4 === 0) return "C3";
          if (i % 4 === 2) return "C3";
          return null;
        }),
    },
    gouryella: {
      name: "Gouryella",
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
    octaveJump: {
      name: "Oct Jump",
      pattern: Array(16)
        .fill()
        .map((_, i) => (i % 2 === 0 ? "C3" : "C4")),
    },
    // New patterns
    airwave: {
      name: "Airwave",
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
    silkArp: {
      name: "Silk",
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
    chicane: {
      name: "Saltwater",
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
      name: "2 Tribes",
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
      name: "OOTB",
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
      name: "ID&T",
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
    // Basic Patterns
    basic4: {
      name: "4 on Floor",
      pattern: Array(16)
        .fill()
        .map((_, i) => (i % 4 === 0 ? "C3" : null)),
    },

    // House & Techno Patterns
    houseGroove: {
      name: "House Groove",
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
      name: "Tech Walk",
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
      name: "Acid Line",
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

    // Garage & UK Bass Patterns
    garage2Step: {
      name: "2-Step",
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
      name: "UK Bass",
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

    // DnB & Breakbeat Patterns
    dnbRoller: {
      name: "DnB Roller",
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
      name: "Jump Up",
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

    // Hip Hop & Trap Patterns
    trapBoom: {
      name: "Trap Boom",
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
      pattern: Array(16)
        .fill()
        .map((_, i) => {
          if (i === 0 || i === 8) return "C3";
          if (i === 3 || i === 11) return "G3";
          if (i === 6 || i === 14) return "E3";
          return null;
        }),
    },

    // Trance Patterns (keeping some of the existing ones)
    systemF: {
      name: "System F",
      pattern: Array(16)
        .fill()
        .map((_, i) => {
          if (i % 4 === 0) return "C3";
          if (i % 4 === 1) return "C3";
          if (i % 4 === 2) return null;
          return "C3";
        }),
    },
    dutchTrance: {
      name: "Dutch",
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

    // Common Bass Patterns
    walkingBass: {
      name: "Walking",
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
    syncopated: {
      name: "Syncopated",
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
  };

  const [selectedPattern, setSelectedPattern] = useState("offBeat");
  const [hideUnused, setHideUnused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(138);
  const [currentStep, setCurrentStep] = useState(-1);

  const audioContextRef = useRef(null);
  const schedulerIntervalRef = useRef(null);
  const nextStepTimeRef = useRef(0);
  const playStartTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);
  const lastPauseTimeRef = useRef(0);

  // Note frequency mapping
  const noteToFreq = {
    C4: 261.63,
    B3: 246.94,
    "A#3": 233.08,
    A3: 220.0,
    "G#3": 207.65,
    G3: 196.0,
    "F#3": 185.0,
    F3: 174.61,
    E3: 164.81,
    "D#3": 155.56,
    D3: 146.83,
    "C#3": 138.59,
    C3: 130.81,
    B2: 123.47,
    "A#2": 116.54,
    A2: 110.0,
    "G#2": 103.83,
    G2: 98.0,
    "F#2": 92.5,
    F2: 87.31,
    E2: 82.41,
    "D#2": 77.78,
    D2: 73.42,
    "C#2": 69.3,
  };

  const scheduleNote = (time, note) => {
    if (!note) return;

    if (!noteToFreq[note]) {
      console.error(`Note frequency not found for '${note}'`);
      return;
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(noteToFreq[note], time);

    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start(time);
    oscillator.stop(time + 0.1);
  };

  const scheduler = () => {
    const secondsPerBeat = 60.0 / bpm;
    const secondsPer16th = secondsPerBeat / 4;
    const currentTime = audioContextRef.current.currentTime;

    // Calculate the effective playback time considering pauses
    const effectiveTime = currentTime - playStartTimeRef.current - totalPausedTimeRef.current;

    // Calculate the current step based on effective time
    const newStep = Math.floor(effectiveTime / secondsPer16th) % 16;

    // Schedule notes slightly ahead of time
    while (nextStepTimeRef.current < currentTime + 0.1) {
      const stepToSchedule =
        Math.floor((nextStepTimeRef.current - playStartTimeRef.current - totalPausedTimeRef.current) / secondsPer16th) %
        16;
      const noteToPlay = patterns[selectedPattern].pattern[stepToSchedule];

      if (noteToPlay) {
        scheduleNote(nextStepTimeRef.current, noteToPlay);
      }

      nextStepTimeRef.current += secondsPer16th;
    }

    // Only update the visual step if it has changed
    if (newStep !== currentStep) {
      setCurrentStep(newStep);
    }
  };

  const startPlayback = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      playStartTimeRef.current = audioContextRef.current.currentTime;
    } else if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
      // Add any paused time to the total
      if (lastPauseTimeRef.current > 0) {
        totalPausedTimeRef.current += audioContextRef.current.currentTime - lastPauseTimeRef.current;
      }
    }

    // If this is a fresh start (not resuming)
    if (!isPlaying && currentStep === -1) {
      playStartTimeRef.current = audioContextRef.current.currentTime;
      totalPausedTimeRef.current = 0;
      nextStepTimeRef.current = audioContextRef.current.currentTime;
    }

    lastPauseTimeRef.current = 0;
    schedulerIntervalRef.current = setInterval(scheduler, 25);
    setIsPlaying(true);
  };

  const stopPlayback = () => {
    if (schedulerIntervalRef.current) {
      clearInterval(schedulerIntervalRef.current);
      schedulerIntervalRef.current = null;
    }

    // Suspend the audio context to fully stop all audio
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.suspend();
      lastPauseTimeRef.current = audioContextRef.current.currentTime;
    }

    setIsPlaying(false);
    setCurrentStep(-1);
  };

  const resetPlayback = () => {
    stopPlayback();
    playStartTimeRef.current = 0;
    totalPausedTimeRef.current = 0;
    lastPauseTimeRef.current = 0;
    nextStepTimeRef.current = 0;
    setCurrentStep(-1);
  };

  useEffect(() => {
    return () => {
      if (schedulerIntervalRef.current) {
        clearInterval(schedulerIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      resetPlayback();
      startPlayback();
    }
  }, [selectedPattern, bpm]);

  const isNoteUsedInPattern = (note) => patterns[selectedPattern].pattern.some((patternNote) => patternNote === note);

  const isNoteActive = (note, step) => patterns[selectedPattern].pattern[step] === note;

  const isBlackKey = (note) => note.includes("#");
  const isWhiteKey = (note) => !isBlackKey(note);

  const getPatternString = () => {
    return patterns[selectedPattern].pattern.map((note) => (note === null ? "x" : note.toLowerCase())).join("-");
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-2 sm:p-4">
      <div className="mx-auto max-w-full">
        <h1 className="mb-4 text-xl font-bold text-gray-200 sm:text-2xl">Bass Pattern Library</h1>

          <div className="mb-4 flex items-center gap-4">
          <button
            onClick={isPlaying ? stopPlayback : startPlayback}
            className={classNames(
              "rounded px-4 py-2 font-medium",
              isPlaying ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-600 text-white hover:bg-green-700",
            )}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>
          <div>
            <label className="mb-2 block text-sm text-gray-300">Pattern</label>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="w-full rounded bg-zinc-800 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {Object.entries(patterns).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Pattern String</label>
            <input
              type="text"
              readOnly
              value={getPatternString()}
              className="w-full rounded bg-zinc-800 px-3 py-2 font-mono text-sm text-gray-200"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center text-sm text-gray-300">
            <input
              type="checkbox"
              checked={hideUnused}
              onChange={(e) => setHideUnused(e.target.checked)}
              className="form-checkbox h-3 w-3 rounded text-cyan-600"
            />
            <span className="ml-2">Hide unused notes</span>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-zinc-700">
            <thead>
              <tr className="border-b border-zinc-700 bg-zinc-800">
                <th className="px-1 py-1 text-left text-xs text-gray-400 sm:w-10"></th>
                {Array(16 / 4)
                  .fill()
                  .map((_, i) => (
                    <th key={i} className="w-6 border-l border-zinc-700 px-1 text-xs text-gray-400 sm:w-8" colSpan={4}>
                      Bar {(i % 4) + 1}
                    </th>
                  ))}
              </tr>
              <tr className="border-b border-zinc-700 bg-zinc-800">
                <th className="px-1 py-1 text-left text-xs text-gray-400 sm:w-10">Note</th>
                {Array(16)
                  .fill()
                  .map((_, i) => {
                    const currentBar = Math.floor(i / 4);
                    const isOddBar = currentBar % 2 === 1;

                    return (
                      <th
                        key={i}
                        className={classNames("w-6 border-l border-zinc-700 px-1 text-xs text-gray-400 sm:w-8", {
                          "bg-gray-800": isOddBar,
                          "bg-zinc-800": !isOddBar,
                        })}
                      >
                        {i + 1}
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => {
                if (hideUnused && !isNoteUsedInPattern(note)) return null;
                return (
                  <tr
                    key={note}
                    className={classNames({
                      "bg-zinc-800": isBlackKey(note),
                      "bg-zinc-900": isWhiteKey(note),
                    })}
                  >
                    <td className="px-1 py-1 font-mono text-xs text-gray-400">{note}</td>
                    {Array(16)
                      .fill()
                      .map((_, step) => {
                        const currentBar = Math.floor(step / 4);
                        const isBarStart = step % 4 === 0;
                        const isOddBar = currentBar % 2 === 1;

                        return (
                          <td
                            key={step}
                            className={classNames("border-b border-r border-zinc-700 border-b-zinc-800 px-1 py-1", {
                              "bg-gray-800/20": isOddBar,
                              "bg-zinc-800/5": !isOddBar,
                              "border-l-2 border-l-zinc-700": isBarStart,
                              "!border-x-gray-500/50 bg-gray-500/20": currentStep === step,
                            })}
                          >
                            {isNoteActive(note, step) && <div className="h-4 w-full rounded-sm bg-cyan-600"></div>}
                          </td>
                        );
                      })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BasslineVisualizer;
