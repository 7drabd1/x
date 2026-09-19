import { MEMORIAL } from '../data/memorial';
import { Sheet } from './Sheet';

interface IntentSheetProps {
  open: boolean;
  onClose: () => void;
}

export function IntentSheet({ open, onClose }: IntentSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="النية والذكرى">
      <div className="flex flex-col gap-6 pb-2">
        <p className="leading-loose text-ink/85">
          هذا الموقع {MEMORIAL.banner}: <strong className="font-semibold text-gold-soft">{MEMORIAL.name}</strong>.
          كل تسبيحة وكل دعاء هنا رجاءٌ أن يرحمه الله ويغفر له.
        </p>

        <figure className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <blockquote className="text-lg leading-[2.1] font-medium">
            «إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ»
          </blockquote>
          <figcaption className="mt-3 text-sm text-gold/80">رواه مسلم</figcaption>
        </figure>

        <div>
          <p className="mb-2 text-sm text-mute">دعاء النية</p>
          <p className="text-lg leading-[2.1] font-medium">
            اللَّهُمَّ اغْفِرْ لِ{MEMORIAL.fullGenitive} وَارْحَمْهُ، وَاجْعَلْ هَذَا الْعَمَلَ صَدَقَةً جَارِيَةً لَهُ، وَتَقَبَّلْهُ مِنَّا، وَاجْمَعْنَا بِهِ فِي جَنَّاتِ النَّعِيمِ
          </p>
        </div>

        <p className="border-t border-white/10 pt-4 text-sm leading-loose text-mute">
          لا إعلانات في هذا الموقع، ولا تتبّع، ولا حسابات. عدّاداتك محفوظة على جهازك وحده، ويعمل الموقع دون اتصال بعد فتحه أول مرة.
        </p>
      </div>
    </Sheet>
  );
}
