import { useMemo } from 'react';
import { fmt } from '../lib/format';

interface TasbeehRingProps {
  count: number;
  /** 0 = unlimited */
  goal: number;
  /** changes on every tap; restarts the ripple and the bead pulse */
  tapKey: number;
  onTap: () => void;
}

const SIZE = 320;
const CENTER = SIZE / 2;
const ARC_RADIUS = 128;
const BEAD_RADIUS = 149;
const CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;

/**
 * The tasbeeh: a ring of beads that light up one by one, a gold arc that fills with the round,
 * and one large button in the middle. In unlimited mode the ring turns once every 33.
 */
export function TasbeehRing({ count, goal, tapKey, onTap }: TasbeehRingProps) {
  const beadsInRing = goal > 0 ? goal : 33;
  const complete = goal > 0 && count >= goal;
  const lit = goal > 0 ? Math.min(count, goal) : count % beadsInRing;
  const progress = lit / beadsInRing;

  const beads = useMemo(
    () =>
      Array.from({ length: beadsInRing }, (_, i) => {
        const angle = (i / beadsInRing) * Math.PI * 2 - Math.PI / 2;
        return { x: CENTER + BEAD_RADIUS * Math.cos(angle), y: CENTER + BEAD_RADIUS * Math.sin(angle) };
      }),
    [beadsInRing],
  );
  const beadSize = beadsInRing > 40 ? 1.7 : 3.1;
  const current = lit > 0 ? beads[lit - 1] : null;

  return (
    <div className="relative mx-auto aspect-square w-[min(84vw,21.5rem)]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={`absolute inset-0 h-full w-full ${complete ? 'ring-complete' : ''}`} aria-hidden="true">
        <defs>
          <linearGradient id="arc-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F3DC8B" />
            <stop offset="0.55" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={ARC_RADIUS} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={ARC_RADIUS}
          fill="none"
          stroke="url(#arc-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
          opacity={progress > 0 ? 1 : 0}
          style={{ transition: 'stroke-dashoffset 0.35s cubic-bezier(.22,1,.36,1), opacity 0.2s' }}
        />

        {beads.map((b, i) => (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r={beadSize}
            fill={i < lit ? '#E2C044' : 'rgba(255,255,255,0.16)'}
            style={{ transition: 'fill 0.25s' }}
          />
        ))}

        {current && tapKey > 0 && (
          <circle key={tapKey} className="bead-pulse" cx={current.x} cy={current.y} r={beadSize} fill="#F6E3A1" />
        )}
      </svg>

      <button
        type="button"
        onClick={onTap}
        className="count-button absolute inset-[16%] flex flex-col items-center justify-center rounded-full"
        aria-label={`سبّح، العدد الحالي ${fmt(count)}`}
      >
        {tapKey > 0 && <span key={tapKey} className="ripple" />}
        <span className="font-display text-[4.6rem] font-semibold leading-none text-ink [font-variant-numeric:tabular-nums]">
          {fmt(count)}
        </span>
        <span className="mt-3 text-sm text-mute">
          {complete ? 'تمّت الجولة' : goal > 0 ? `من ${fmt(goal)}` : 'بلا حدّ'}
        </span>
      </button>
    </div>
  );
}
