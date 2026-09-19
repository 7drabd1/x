import { useMemo, useState } from 'react';
import { CATEGORIES, DUAS, type AdhkarTime, type DuaCategory } from '../data/adhkar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Prefs } from '../hooks/useTasbeeh';
import { DuaCard } from './DuaCard';

type TimeFilter = AdhkarTime | 'all';

const TIME_FILTERS: { id: TimeFilter; label: string }[] = [
  { id: 'morning', label: 'الصباح' },
  { id: 'evening', label: 'المساء' },
  { id: 'all', label: 'الكل' },
];

interface DuaSectionProps {
  prefs: Prefs;
  onToast: (message: string) => void;
}

export function DuaSection({ prefs, onToast }: DuaSectionProps) {
  const [category, setCategory] = useState<DuaCategory>('deceased');
  // Morning adhkar until mid-afternoon, evening adhkar after that.
  const [time, setTime] = useState<TimeFilter>(() => (new Date().getHours() < 15 ? 'morning' : 'evening'));
  const [counts, setCounts] = useLocalStorage<Record<string, number>>('sadaqah:dua-counts:v1', {});

  const visible = useMemo(
    () =>
      DUAS.filter((d) => {
        if (d.category !== category) return false;
        if (category !== 'adhkar' || time === 'all') return true;
        return d.time === 'both' || d.time === time;
      }),
    [category, time],
  );

  const increment = (id: string) => setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const clear = (id: string) =>
    setCounts((c) => {
      const { [id]: _removed, ...rest } = c;
      return rest;
    });

  return (
    <section aria-labelledby="duas-title" className="flex flex-col gap-7">
      <h2 id="duas-title" className="font-display text-2xl text-gold-soft">
        الأدعية والأذكار
      </h2>

      <div role="tablist" aria-label="أقسام الأدعية" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {CATEGORIES.map((c) => {
          const selected = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={selected}
              aria-controls="dua-panel"
              onClick={() => setCategory(c.id)}
              className={`min-h-12 shrink-0 rounded-full border px-5 text-[0.95rem] font-medium transition-colors ${
                selected
                  ? 'border-gold/60 bg-gold/15 text-gold-soft'
                  : 'border-white/10 bg-white/[0.03] text-mute hover:text-ink'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {category === 'adhkar' && (
        <div role="radiogroup" aria-label="وقت الأذكار" className="flex gap-2">
          {TIME_FILTERS.map((f) => {
            const selected = f.id === time;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTime(f.id)}
                className={`min-h-12 min-w-20 rounded-2xl border px-4 text-sm transition-colors ${
                  selected
                    ? 'border-emerald-glow/50 bg-emerald-glow/10 text-emerald-glow'
                    : 'border-white/10 bg-white/[0.03] text-mute hover:text-ink'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}

      <div id="dua-panel" role="tabpanel" aria-labelledby={`tab-${category}`} className="flex flex-col gap-6">
        {visible.map((dua) => (
          <DuaCard
            key={dua.id}
            dua={dua}
            count={counts[dua.id] ?? 0}
            haptics={prefs.haptics}
            onCount={increment}
            onResetCount={clear}
            onToast={onToast}
          />
        ))}
      </div>
    </section>
  );
}
