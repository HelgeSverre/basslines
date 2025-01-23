// noinspection SpellCheckingInspection,JSCheckFunctionSignatures,JSUnusedLocalSymbols,JSValidateTypes

import { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";
import { frequencyToMidiNote, notes, noteToFreq } from "./utils.js";
import { allPatterns } from "./patterns.js";
import { HardDriveDownload, Play, Square } from "lucide-react";
import classNames from "classnames";

const App = () => {
  const [selectedPattern, setSelectedPattern] = useState("offBeat");
  const [selectedWaveform, setSelectedWaveform] = useState("sawtooth");
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

  const getActiveOctaves = () => {
    const usedNotes = allPatterns[selectedPattern].pattern.filter((note) => note !== null);
    const usedOctaves = new Set(usedNotes.map((note) => parseInt(note.slice(-1), 10))); // Extract octaves from note names
    return Array.from(usedOctaves).sort((a, b) => a - b); // Return sorted array of active octaves
  };

  const scheduleNote = (time, note) => {
    if (!note) return;

    if (!noteToFreq[note]) {
      console.error(`Note frequency not found for '${note}'`);
      return;
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = selectedWaveform || "sawtooth";
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
      const noteToPlay = allPatterns[selectedPattern].pattern[stepToSchedule];

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
      // noinspection JSUnresolvedReference
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

  const downloadPatternAsMidi = () => {
    const midi = new Midi();
    const track = midi.addTrack();
    const secondsPerBeat = 60.0 / bpm;

    allPatterns[selectedPattern].pattern.forEach((note, index) => {
      if (note) {
        track.addNote({
          midi: frequencyToMidiNote(noteToFreq[note]),
          time: index * (secondsPerBeat / 4),
          duration: secondsPerBeat / 4,
        });
      }
    });

    const midiBlob = new Blob([midi.toArray()], { type: "audio/midi" });
    const url = URL.createObjectURL(midiBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPattern}.midi`;
    a.click();
    URL.revokeObjectURL(url);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPattern, selectedWaveform, bpm, isPlaying]);

  const isNoteUsedInPattern = (note) => {
    return allPatterns[selectedPattern].pattern.some((patternNote) => patternNote === note);
  };

  const isNoteActive = (note, step) => {
    return allPatterns[selectedPattern].pattern[step] === note;
  };

  const isBlackKey = (note) => note.includes("#");

  const isWhiteKey = (note) => !isBlackKey(note);

  // Generates a string based on the current pattern
  // ex: "x-C3-x-C3-x-C3-x-C3-x-C3-x-C3-x-C3-x-C3"
  const getPatternString = () => {
    return allPatterns[selectedPattern].pattern.map((note) => (note === null ? "x" : note.toUpperCase())).join("-");
  };

  return (
    <div className="flex h-screen flex-col gap-6 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 text-gray-100">
      <div className="w-full">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center lg:grid-cols-8">
          {/* Play/Pause Button */}
          <div className="flex items-center justify-start">
            <button
              onClick={isPlaying ? stopPlayback : startPlayback}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {isPlaying ? <Square size={20} /> : <Play size={20} />}
            </button>
          </div>

          {/* BPM Control */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-400">BPM</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              min="60"
              max="200"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Waveform Selector */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-400">Waveform</label>
            <select
              value={selectedWaveform}
              onChange={(e) => setSelectedWaveform(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              <option value="sawtooth">Sawtooth</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle</option>
              <option value="sine">Sine</option>
            </select>
          </div>

          {/* Pattern Selector */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-400">Pattern</label>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              {Object.entries(allPatterns).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pattern String Display */}
          <div className="col-span-full flex flex-col sm:col-span-2 lg:col-span-3">
            <label className="mb-1 text-sm font-medium text-gray-400">Pattern String</label>
            <input
              type="text"
              readOnly
              value={getPatternString()}
              className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-sm text-gray-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 lg:w-96"
            />
          </div>

          {/* Download MIDI Button */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-400">Export MIDI</label>
            <button
              title="Download Pattern as MIDI"
              onClick={downloadPatternAsMidi}
              className="flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-gray-200 transition hover:bg-cyan-700/20 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <HardDriveDownload className="mr-2" size={16} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="flex-1 overflow-auto rounded-md border border-zinc-700 bg-zinc-900/50">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="border-b border-zinc-700 bg-zinc-800">
              <th className="top-0 border-b border-b-zinc-800 bg-zinc-900 px-2 py-2 text-left text-xs font-medium text-gray-400 max-w-10">
                <label className="flex items-center space-x-3">
                  <button className="text-gray-300 hover:text-cyan-500" onClick={() => setHideUnused((prev) => !prev)}>
                    {hideUnused ? "Unfold" : "Fold"}
                  </button>
                </label>
              </th>
              {Array(16 / 4)
                .fill()
                .map((_, i) => (
                  <th
                    key={i}
                    colSpan={4}
                    className="top-0 border-b border-b-zinc-800 bg-zinc-900 px-2 py-2 text-left text-xs font-medium text-gray-400"
                  >
                    Bar {(i % 4) + 1}
                  </th>
                ))}
            </tr>
            <tr>
              <th className="sticky top-0 bg-zinc-900 px-2 py-2 text-left text-xs font-medium text-gray-400">
                <div className={"max-w-10"}>Note</div>
              </th>
              {Array(16)
                .fill()
                .map((_, i) => (
                  <th
                    key={i}
                    className={classNames(
                      "sticky top-0 border-l border-zinc-800 bg-zinc-900 px-2 py-2 text-xs font-medium text-gray-400",
                      {
                        "bg-gray-700/20": i % 8 >= 4,
                      },
                    )}
                  >
                    {i + 1}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {notes
              .filter((note) => getActiveOctaves().includes(parseInt(note.slice(-1), 10)))
              .map((note) => {
                if (hideUnused && !isNoteUsedInPattern(note)) return null;
                return (
                  <tr key={note} className="border-b border-zinc-800/30 duration-100 ease-in-out hover:bg-cyan-600/10">
                    <td className={"border-t border-zinc-800 px-2 py-1 font-mono text-xs max-w-10 text-gray-400"}>
                      <div className={"max-w-10"}>{note}</div>
                    </td>
                    {Array(16)
                      .fill()
                      .map((_, step) => (
                        <td
                          key={step}
                          className={classNames("border-t border-zinc-800 px-1 py-1", {
                            "border-l-2": step % 4 === 0,
                            "border-l": step % 4 !== 0,
                            "bg-cyan-500/10": currentStep === step,
                            "bg-zinc-900/30": step % 8 < 4 && currentStep !== step,
                            "bg-gray-800/20": step % 8 >= 4 && currentStep !== step,
                          })}
                        >
                          {isNoteActive(note, step) && (
                            <div className="flex h-6 items-center justify-center rounded-sm bg-cyan-600 px-1 text-xs font-medium text-white shadow-lg">
                              {note}
                            </div>
                          )}
                        </td>
                      ))}
                  </tr>
                );
              })}
          </tbody>
          <tfoot>
            <tr>
              <td className="max-w-10 border-t border-zinc-800"></td>
              <td className="border-t border-zinc-800" colSpan={16}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default App;
