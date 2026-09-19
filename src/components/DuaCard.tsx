import { useRef } from 'react';
import type { Dua } from '../data/adhkar';
import { fmt } from '../lib/format';
import { vibrate } from '../lib/feedback';
import { copyText, formatDua, shareText } from '../lib/share';
import { CheckIcon, CopyIcon, PlayIcon, ResetIcon, ShareIcon } from './Icons';

interface DuaCardProps {
  dua: Dua;
  count: number;
  haptics: boolean;
  onCount: (id: string) => void;
  onResetCount: (id: string) => void;
  onToast: (message: string) => void;
}

function repeatLabel(n: number): string {
  if (n === 1) return 'تُقال مرة واحدة';
  return `كرّر ${fmt(n)} ${n <= 10 ? 'مرات' : 'مرة'}`;
}

export function DuaCard({ dua, count, haptics, onCount, onResetCount, onToast }: DuaCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const target = dua.repeat ?? 0;
  const done = target > 0 && count >= target;
  const progress = target > 0 ? Math.min(count / target, 1) : 0;

  const tap = () => {
    if (haptics) vibrate(20);
    onCount(dua.id);
  };

  const copy = async () => {
    onToast((await copyText(formatDua(dua))) ? 'تم نسخ الدعاء' : 'تعذّر النسخ');
  };

  const share = async () => {
    const result = await shareText(formatDua(dua));
    if (result === 'whatsapp') onToast('فُتح واتساب للمشاركة');
  };

  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      await audio.play();
    } catch {
      onToast('أضف ملف التلاوة المحلي إلى audio/sound.mp3');
    }
  };

  return (
    <article className="glass rounded-3xl p-6 sm:p-8">
      {dua.quran && <audio ref={audioRef} className="hidden" preload="none" src="./audio/sound.mp3" />}
      <p className={`dua-text ${dua.quran ? 'text-gold-soft' : 'text-ink'}`}>
        {dua.quran ? `﴿ ${dua.text} ﴾` : dua.text}
      </p>

      {dua.note && <p className="mt-5 text-sm leading-loose text-mute">{dua.note}</p>}
      {dua.source && <p className="mt-5 text-sm leading-relaxed text-gold/80">{dua.source}</p>}

      <div className="mt-7 flex flex-wrap items-stretch gap-3">
        <button
          type="button"
          onClick={tap}
          aria-label={`عدّاد الدعاء، العدد ${fmt(count)}${target ? ` من ${fmt(target)}` : ''}`}
          className={`relative flex min-h-12 flex-1 items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 text-start transition-colors ${
            done ? 'border-emerald-glow/50 bg-emerald-glow/10' : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          {target > 0 && (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 start-0 bg-gold/10 transition-[width] duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          )}
          <span className="relative text-sm text-mute">
            {done ? (
              <span className="flex items-center gap-1.5 text-emerald-glow">
                <CheckIcon size={18} /> تمّ العدد
              </span>
            ) : target > 0 ? (
              repeatLabel(target)
            ) : (
              'اضغط للعدّ'
            )}
          </span>
          <span className="relative font-display text-lg text-ink">
            {fmt(count)}
            {target > 0 && <span className="text-sm text-mute"> / {fmt(target)}</span>}
          </span>
        </button>

        {count > 0 && (
          <button type="button" onClick={() => onResetCount(dua.id)} aria-label="تصفير عدّاد الدعاء" className="icon-btn">
            <ResetIcon size={20} />
          </button>
        )}
        {dua.quran && (
          <button type="button" onClick={playAudio} aria-label="تشغيل تلاوة الآية" className="icon-btn">
            <PlayIcon size={20} />
          </button>
        )}
        <button type="button" onClick={copy} aria-label="نسخ الدعاء" className="icon-btn">
          <CopyIcon size={20} />
        </button>
        <button type="button" onClick={share} aria-label="مشاركة الدعاء" className="icon-btn">
          <ShareIcon size={20} />
        </button>
      </div>
    </article>
  );
}
