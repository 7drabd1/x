import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Bottom drawer on phones (drag the handle down to dismiss), side panel on wider screens.
 */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const panel = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      opener?.focus?.();
    };
  }, [open, onClose]);

  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    setDragY(Math.max(0, e.clientY - dragStart.current));
  };
  const onDragEnd = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (dragY > 90) onClose();
    setDragY(0);
  };

  const dragging = dragY > 0;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        inert={!open}
        style={dragging ? { transform: `translateY(${dragY}px)` } : undefined}
        className={`sheet fixed z-50 flex flex-col outline-none
          inset-x-0 bottom-0 max-h-[86dvh] rounded-t-[1.75rem]
          md:inset-y-0 md:start-auto md:end-0 md:bottom-auto md:max-h-none md:w-[26rem] md:rounded-none md:rounded-s-[1.75rem]
          ${dragging ? '' : 'transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]'}
          ${open ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:-translate-x-full'}`}
      >
        <div
          className="flex h-8 shrink-0 cursor-grab touch-none items-center justify-center md:hidden"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
        >
          <span className="h-1.5 w-11 rounded-full bg-white/25" />
        </div>
        <div className="flex items-center justify-between gap-3 px-6 pb-3 md:pt-6">
          <h2 className="font-display text-xl text-gold-soft">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="icon-btn -me-2"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </>
  );
}
