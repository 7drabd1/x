import { MEMORIAL_SIGNATURE } from '../data/memorial';
import type { Dua } from '../data/adhkar';

export function formatDua(dua: Dua): string {
  const body = dua.quran ? `﴿ ${dua.text} ﴾` : dua.text;
  const parts = [body];
  if (dua.source) parts.push(`— ${dua.source}`);
  parts.push(MEMORIAL_SIGNATURE);
  parts.push(window.location.href.split('#')[0]);
  return parts.join('\n\n');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Uses the native share sheet when there is one, otherwise opens WhatsApp. */
export async function shareText(text: string): Promise<'shared' | 'whatsapp' | 'cancelled'> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
      /* any other failure: use the WhatsApp fallback below */
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  return 'whatsapp';
}
