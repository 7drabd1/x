import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_DHIKR_ID } from '../data/dhikr';
import { playChime, playTick, vibrate } from '../lib/feedback';

export interface Prefs {
  sound: boolean;
  haptics: boolean;
  theme: 'emerald' | 'slate';
}

interface State {
  dhikrId: string;
  /** 0 = unlimited */
  goal: number;
  /** current count toward the selected goal, per dhikr */
  counts: Record<string, number>;
  /** every tap ever counted, per dhikr */
  totals: Record<string, number>;
}

const INITIAL: State = { dhikrId: DEFAULT_DHIKR_ID, goal: 33, counts: {}, totals: {} };

/** How long the ring stays full after the selected goal is completed. */
const CELEBRATE_MS = 900;

export function useTasbeeh(prefs: Pick<Prefs, 'sound' | 'haptics'>) {
  const [state, setState] = useLocalStorage<State>('sadaqah:tasbeeh:v1', INITIAL);
  const [completionGoal, setCompletionGoal] = useState<number | null>(null);

  // Taps can arrive faster than React renders, so the latest state also lives in a ref.
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);

  const commit = useCallback(
    (next: State) => {
      latest.current = next;
      setState(next);
    },
    [setState],
  );

  const { dhikrId, goal } = state;
  const count = state.counts[dhikrId] ?? 0;
  const total = state.totals[dhikrId] ?? 0;
  const lifetime = Object.values(state.totals).reduce((a, b) => a + b, 0);

  // After the selected goal is completed the ring stays full for a moment, then starts over.
  useEffect(() => {
    if (goal > 0 && count >= goal) {
      const timer = window.setTimeout(() => {
        const s = latest.current;
        commit({ ...s, counts: { ...s.counts, [s.dhikrId]: 0 } });
      }, CELEBRATE_MS);
      return () => window.clearTimeout(timer);
    }
  }, [goal, count, dhikrId, commit]);

  useEffect(() => {
    if (completionGoal === null) return;
    const timer = window.setTimeout(() => setCompletionGoal(null), 2600);
    return () => window.clearTimeout(timer);
  }, [completionGoal]);

  const tap = useCallback(() => {
    const s = latest.current;
    const id = s.dhikrId;
    const previous = s.counts[id] ?? 0;
    // Tapping while the ring is still full simply begins the next count cycle.
    const base = s.goal > 0 && previous >= s.goal ? 0 : previous;
    const next = base + 1;
    const completed = s.goal > 0 && next >= s.goal;
    const milestone = s.goal === 0 && next % 33 === 0;

    commit({
      ...s,
      counts: { ...s.counts, [id]: next },
      totals: { ...s.totals, [id]: (s.totals[id] ?? 0) + 1 },
    });

    if (completed || milestone) {
      if (completed) setCompletionGoal(s.goal);
      if (prefs.haptics) vibrate([30, 50, 30, 50, 90]);
      if (prefs.sound) playChime();
    } else {
      if (prefs.haptics) vibrate(20);
      if (prefs.sound) playTick();
    }
  }, [commit, prefs.haptics, prefs.sound]);

  const undo = useCallback(() => {
    const s = latest.current;
    const id = s.dhikrId;
    const current = s.counts[id] ?? 0;
    if (current <= 0) return;
    commit({
      ...s,
      counts: { ...s.counts, [id]: current - 1 },
      totals: { ...s.totals, [id]: Math.max(0, (s.totals[id] ?? 0) - 1) },
    });
    if (prefs.haptics) vibrate(10);
  }, [commit, prefs.haptics]);

  /** Starts the current count cycle over. Lifetime totals are kept. */
  const reset = useCallback(() => {
    const s = latest.current;
    commit({ ...s, counts: { ...s.counts, [s.dhikrId]: 0 } });
  }, [commit]);

  const setGoal = useCallback(
    (nextGoal: number) => {
      const s = latest.current;
      const counts = Object.fromEntries(
        Object.entries(s.counts).map(([id, c]) => [id, nextGoal > 0 && c >= nextGoal ? c % nextGoal : c]),
      );
      commit({ ...s, goal: nextGoal, counts });
    },
    [commit],
  );

  const setDhikr = useCallback(
    (id: string) => {
      commit({ ...latest.current, dhikrId: id });
    },
    [commit],
  );

  return { state, dhikrId, goal, count, completionGoal, total, lifetime, tap, undo, reset, setGoal, setDhikr };
}
