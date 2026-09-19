import { useRef, useState } from 'react';
import { PlayIcon, SoundOnIcon } from './Icons';

interface QuranPlayerProps {
  onToast: (message: string) => void;
}

/** Main-screen Quran player: the video stays hidden and only its audio is heard. */
export function QuranPlayer({ onToast }: QuranPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      video.pause();
      setPlaying(false);
      return;
    }

    try {
      video.currentTime = 0;
      await video.play();
      setPlaying(true);
    } catch {
      onToast('أضف فيديو التلاوة المحلي إلى audio/quran.mp4');
    }
  };

  return (
    <div className="w-full max-w-md">
      <video
        ref={videoRef}
        className="hidden"
        preload="none"
        playsInline
        src="./audio/quran.mp4"
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={togglePlayback}
        aria-pressed={playing}
        aria-label={playing ? 'إيقاف تلاوة القرآن' : 'تشغيل تلاوة القرآن'}
        className="glass flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium text-gold-soft transition-colors hover:bg-white/[0.08]"
      >
        {playing ? <SoundOnIcon size={21} /> : <PlayIcon size={21} />}
        <span>{playing ? 'إيقاف تلاوة القرآن' : 'تشغيل تلاوة القرآن'}</span>
      </button>
    </div>
  );
}
