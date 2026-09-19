import { useEffect, useState, type ReactNode } from 'react';
import { DHIKR_LIST, GOALS } from '../data/dhikr';
import { useTasbeeh, type Prefs } from '../hooks/useTasbeeh';
import { fmt } from '../lib/format';
import { TasbeehRing } from './TasbeehRing';
import { Sheet } from './Sheet';
import {
  CheckIcon,
  ChevronDownIcon,
  ResetIcon,
  SoundOffIcon,
  SoundOnIcon,
  UndoIcon,
  VibrateIcon,
} from './Icons';

interface TasbeehProps {
  prefs: Prefs;
  onPrefsChange: (patch: Partial<Prefs>) => void;
}

function Control({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="icon-btn min-h-14 min-w-16 flex-col gap-1 px-3 py-2 text-xs"
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

export function Tasbeeh({ prefs, onPrefsChange }: TasbeehProps) {
  const t = useTasbeeh(prefs);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);

  const dhikr = DHIKR_LIST.find((d) => d.id === t.dhikrId) ?? DHIKR_LIST[0];

  // The reset button asks for a second tap, then relaxes after three seconds.
  useEffect(() => {
    if (!resetArmed) return;
    const timer = window.setTimeout(() => setResetArmed(false), 3000);
    return () => window.clearTimeout(timer);
  }, [resetArmed]);

  const onReset = () => {
    if (resetArmed) {
      t.reset();
      setResetArmed(false);
    } else {
      setResetArmed(true);
    }
  };

  return (
    <section aria-labelledby="tasbeeh-title" className="flex flex-col items-center gap-8">
      <h2 id="tasbeeh-title" className="sr-only">
        المسبحة
      </h2>

      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="glass flex min-h-16 w-full max-w-md items-center justify-between gap-4 rounded-2xl px-6 py-4 text-start transition-colors hover:bg-white/8"
        aria-haspopup="dialog"
      >
        <span className="text-[1.05rem] font-medium leading-relaxed">{dhikr.text}</span>
        <ChevronDownIcon className="shrink-0 text-gold-soft" />
      </button>

      <TasbeehRing count={t.count} goal={t.goal} tapKey={t.total} onTap={t.tap} />
      <span className="sr-only" role="status" aria-live="polite">
        {fmt(t.count)}
      </span>

      <div className="min-h-10 text-center" aria-live="polite" role="status">
        {t.completionGoal && (
          <p className="rounded-full border border-emerald-glow/30 bg-emerald-glow/10 px-5 py-2 text-sm font-medium text-emerald-glow">
            {dhikr.id === 'istighfar' ? 'تمّ الاستغفار' : 'تمّ الذكر'} {fmt(t.completionGoal)} مرة
          </p>
        )}
      </div>

      <dl className="flex w-full max-w-md justify-center gap-12 text-center">
        <div>
          <dt className="text-xs text-mute">مجموع هذا الذكر</dt>
          <dd className="mt-1 font-display text-lg">{fmt(t.total)}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-center gap-3">
        <Control label="تراجع" onClick={t.undo}>
          <UndoIcon />
        </Control>
        <Control label={resetArmed ? 'تأكيد التصفير' : 'تصفير'} onClick={onReset} pressed={resetArmed}>
          <ResetIcon />
        </Control>
        <Control
          label={prefs.sound ? 'الصوت مفعّل' : 'الصوت'}
          onClick={() => onPrefsChange({ sound: !prefs.sound })}
          pressed={prefs.sound}
        >
          {prefs.sound ? <SoundOnIcon /> : <SoundOffIcon />}
        </Control>
        <Control
          label={prefs.haptics ? 'الاهتزاز مفعّل' : 'الاهتزاز'}
          onClick={() => onPrefsChange({ haptics: !prefs.haptics })}
          pressed={prefs.haptics}
        >
          <VibrateIcon />
        </Control>
      </div>

      <div role="radiogroup" aria-label="هدف التسبيح" className="grid w-full max-w-md grid-cols-3 gap-3 sm:grid-cols-5">
        {GOALS.map((g) => {
          const selected = t.goal === g;
          return (
            <button
              key={g}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => t.setGoal(g)}
              className={`min-h-12 rounded-2xl border text-base font-medium transition-colors ${
                selected
                  ? 'border-gold/60 bg-gold/15 text-gold-soft'
                  : 'border-white/10 bg-white/[0.03] text-mute hover:text-ink'
              }`}
            >
              {g === 0 ? '∞' : fmt(g)}
            </button>
          );
        })}
      </div>

      <Sheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="اختر الذكر">
        <ul className="flex flex-col gap-2 pb-2">
          {DHIKR_LIST.map((d) => {
            const selected = d.id === t.dhikrId;
            const done = t.state.totals[d.id] ?? 0;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => {
                    t.setDhikr(d.id);
                    setPickerOpen(false);
                  }}
                  className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-start transition-colors ${
                    selected ? 'border-gold/60 bg-gold/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
                  }`}
                >
                  <span>
                    <span className="block text-[1.05rem] leading-relaxed">{d.text}</span>
                    {done > 0 && <span className="mt-0.5 block text-xs text-mute">سبّحتَ {fmt(done)}</span>}
                  </span>
                  {selected && <CheckIcon className="shrink-0 text-gold-soft" />}
                </button>
              </li>
            );
          })}
        </ul>
        {t.lifetime > 0 && (
          <p className="mt-4 text-center text-sm text-mute">مجموع كل الأذكار على هذا الجهاز: {fmt(t.lifetime)}</p>
        )}
      </Sheet>
    </section>
  );
}
