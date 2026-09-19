import { BeadsIcon, BookIcon } from './Icons';

export type View = 'tasbeeh' | 'duas';

interface BottomNavProps {
  view: View;
  onChange: (view: View) => void;
}

const ITEMS: { id: View; label: string; icon: typeof BookIcon }[] = [
  { id: 'tasbeeh', label: 'المسبحة', icon: BeadsIcon },
  { id: 'duas', label: 'الأدعية والأذكار', icon: BookIcon },
];

/** Phone-only tab bar. On large screens both panels are visible side by side. */
export function BottomNav({ view, onChange }: BottomNavProps) {
  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="glass fixed inset-x-3 bottom-3 z-30 flex gap-1 rounded-3xl p-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      {ITEMS.map(({ id, label, icon: Icon }) => {
        const active = view === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-[0.95rem] font-medium transition-colors ${
              active ? 'bg-gold/15 text-gold-soft' : 'text-mute'
            }`}
          >
            <Icon size={22} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
