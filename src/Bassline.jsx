// noinspection SpellCheckingInspection,JSCheckFunctionSignatures,JSUnusedLocalSymbols

import { useEffect, useRef, useState } from "react";
import { notes, noteToFreq } from "./utils.js";
import { allPatterns } from "./patterns.js";
import { Play, Square } from "lucide-react";
import classNames from "classnames";

const BasslineVisualizer = () => {
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

  const scheduleNote = (time, note) => {
    if (!note) return;

    if (!noteToFreq[note]) {
      console.error(`Note frequency not found for '${note}'`);
      return;
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = selectedWaveform;
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
  }, [selectedPattern, selectedWaveform, bpm]);

  const isNoteUsedInPattern = (note) => {
    return allPatterns[selectedPattern].pattern.some((patternNote) => patternNote === note);
  };

  const isNoteActive = (note, step) => {
    return allPatterns[selectedPattern].pattern[step] === note;
  };

  const isBlackKey = (note) => note.includes("#");

  const isWhiteKey = (note) => !isBlackKey(note);

  const getPatternString = () => {
    return allPatterns[selectedPattern].pattern.map((note) => (note === null ? "x" : note.toLowerCase())).join("-");
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 text-gray-100">
      {/* Controls Container */}
      <div className="mb-6 w-full">
        {/* Controls Layout */}
        <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {/* Play Button Group */}
          <div className="col-span-full flex items-center justify-center sm:justify-start">
            <button
              onClick={isPlaying ? stopPlayback : startPlayback}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-white transition-colors hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              {isPlaying ? <Square size={20} /> : <Play size={20} />}
            </button>
          </div>

          {/* BPM Group */}
          <div className="flex flex-col items-center sm:items-start">
            <label className="mb-1 text-xs font-medium text-gray-400">BPM</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              min="60"
              max="200"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-gray-200 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:w-24"
            />
          </div>

          {/* Waveform Selector Group */}
          <div className="flex flex-col items-center sm:items-start">
            <label className="mb-1 text-xs font-medium text-gray-400">Waveform</label>
            <select
              value={selectedWaveform}
              onChange={(e) => setSelectedWaveform(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-gray-200 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:max-w-[200px]"
            >
              <option value="sawtooth">Sawtooth</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle</option>
              <option value="sine">Sine</option>
            </select>
          </div>
          {/* Pattern Selector Group */}
          <div className="flex flex-col items-center sm:items-start">
            <label className="mb-1 text-xs font-medium text-gray-400">Pattern</label>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-gray-200 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:max-w-[200px]"
            >
              {Object.entries(allPatterns).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pattern String Group */}
          <div className="flex flex-1 flex-col items-center sm:items-start">
            <label className="mb-1 text-xs font-medium text-gray-400">Pattern String</label>
            <input
              type="text"
              readOnly
              value={getPatternString()}
              className="w-full max-w-xl rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-sm uppercase text-gray-200 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="flex-1 overflow-auto rounded-md border border-zinc-700 bg-zinc-900/50">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="border-b border-zinc-700 bg-zinc-800">
              <th className="top-0 border-b border-b-zinc-800 bg-zinc-900 px-2 py-2 text-left text-xs font-medium text-gray-400">
                <label className="flex items-center space-x-3">
                  <button className="text-gray-300 hover:text-cyan-500" onClick={() => setHideUnused((prev) => !prev)}>
                    {hideUnused ? "Show All" : "Hide Unused"}
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
              <th className="sticky top-0 bg-zinc-900 px-2 py-2 text-left text-xs font-medium text-gray-400">Note</th>
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
            {notes.map((note) => {
              if (hideUnused && !isNoteUsedInPattern(note)) return null;
              return (
                <tr key={note} className="border-b border-zinc-800/30">
                  <td className="border-t border-zinc-800 px-2 py-1 font-mono text-xs text-gray-400">{note}</td>
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
        </table>
      </div>
    </div>
  );
};

export default BasslineVisualizer;
