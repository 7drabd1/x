import { useCallback, useEffect, useRef, useState } from 'react';
import { Background } from './components/Background';
import { BottomNav, type View } from './components/BottomNav';
import { DuaSection } from './components/DuaSection';
import { DownloadIcon, ThemeIcon } from './components/Icons';
import { IntentSheet } from './components/IntentSheet';
import { MemorialBanner } from './components/MemorialBanner';
import { Tasbeeh } from './components/Tasbeeh';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Prefs } from './hooks/useTasbeeh';

const DEFAULT_PREFS: Prefs = { sound: false, haptics: true, theme: 'emerald' };
const THEME_COLOR: Record<Prefs['theme'], string> = { emerald: '#061A14', slate: '#0A0F1D' };

export default function App() {
  const [prefs, setPrefs] = useLocalStorage<Prefs>('sadaqah:prefs:v1', DEFAULT_PREFS);
  const [view, setView] = useState<View>('tasbeeh');
  const [intentOpen, setIntentOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef(0);
  const { canInstall, install } = useInstallPrompt();

  const patchPrefs = useCallback((patch: Partial<Prefs>) => setPrefs((p) => ({ ...p, ...patch })), [setPrefs]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  // Apply the theme to the document and the browser chrome.
  useEffect(() => {
    document.documentElement.dataset.theme = prefs.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[prefs.theme]);
  }, [prefs.theme]);

  const changeView = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <Background />

      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-32 pt-[max(0.5rem,env(safe-area-inset-top))] lg:pb-14">
        <div className="flex items-center justify-end">
          {canInstall && (
            <button type="button" className="icon-btn" onClick={install} aria-label="تثبيت التطبيق على الجهاز">
              <DownloadIcon />
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            onClick={() => patchPrefs({ theme: prefs.theme === 'emerald' ? 'slate' : 'emerald' })}
            aria-label={prefs.theme === 'emerald' ? 'التبديل إلى المظهر الليلي الأزرق' : 'التبديل إلى المظهر الزمردي'}
          >
            <ThemeIcon />
          </button>
        </div>

        <MemorialBanner onOpenIntent={() => setIntentOpen(true)} />

        <main className="grid flex-1 gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-14">
          <div className={`${view === 'tasbeeh' ? 'block' : 'hidden'} lg:sticky lg:top-6 lg:block`}>
            <Tasbeeh prefs={prefs} onPrefsChange={patchPrefs} />
          </div>
          <div className={`${view === 'duas' ? 'block' : 'hidden'} lg:block`}>
            <DuaSection prefs={prefs} onToast={showToast} />
          </div>
        </main>

        <footer className="mt-12 hidden text-center text-sm leading-loose text-mute lg:block">
          بلا إعلانات ولا تتبّع. عدّاداتك محفوظة على جهازك وحده.
        </footer>
      </div>

      <BottomNav view={view} onChange={changeView} />
      <IntentSheet open={intentOpen} onClose={() => setIntentOpen(false)} />

      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 lg:bottom-8" aria-live="polite">
        {toast && (
          <div className="toast-in glass rounded-full bg-[color:var(--surface-strong)] px-5 py-3 text-sm text-ink shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
