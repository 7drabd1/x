import { MEMORIAL } from '../data/memorial';

/** The dedication. Quiet on purpose: one line of intent, the name in gold, one line of prayer. */
export function MemorialBanner({ onOpenIntent }: { onOpenIntent: () => void }) {
  return (
    <header className="px-4 pb-6 pt-2 text-center sm:pb-10">
      <svg
        viewBox="0 0 48 48"
        width="40"
        height="40"
        className="mx-auto mb-3 text-gold-soft"
        aria-hidden="true"
      >
        <defs>
          <mask id="crescent-cut">
            <rect width="48" height="48" fill="#fff" />
            <circle cx="29" cy="20" r="11" fill="#000" />
          </mask>
        </defs>
        <circle cx="22" cy="25" r="13" fill="currentColor" mask="url(#crescent-cut)" />
        <path d="M34 9l1.3 3.5 3.5 1.3-3.5 1.3L34 18.6l-1.3-3.5-3.5-1.3 3.5-1.3z" fill="currentColor" />
      </svg>

      <p className="text-[0.95rem] text-gold/85 sm:text-lg">{MEMORIAL.banner}</p>
      <h1 className="font-display mt-1 text-[1.9rem] font-semibold leading-[1.5] text-gold-gradient sm:text-5xl sm:leading-[1.5]">
        {MEMORIAL.name}
      </h1>
      <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-loose text-ink/80 sm:text-lg">{MEMORIAL.prayer}</p>

      <button
        type="button"
        onClick={onOpenIntent}
        className="mt-3 inline-flex min-h-12 items-center rounded-full px-5 text-sm text-mute underline decoration-white/20 underline-offset-8 transition-colors hover:text-ink"
      >
        النية والذكرى
      </button>
    </header>
  );
}
