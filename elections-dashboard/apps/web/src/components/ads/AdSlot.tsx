import { useEffect, useRef, useState } from 'react';

interface Props {
  slotId: string;
  directLink?: string;
  width?: number;
  height?: number;
  label?: string;
}

/**
 * Privacy-first Monetag ad slot.
 * - No network request until slot enters viewport (IntersectionObserver)
 * - sandboxed iframe: no scripts, no same-origin, no fingerprinting
 * - referrerPolicy no-referrer suppresses URL leakage
 * - Per-slot dismiss persisted in localStorage
 * - Respects global "ads-disabled" toggle from Header
 */
export function AdSlot({ slotId, directLink, width = 300, height = 250, label = 'Advertisement' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(`ad-dismissed-${slotId}`) === 'true'
      || localStorage.getItem('ads-disabled') === 'true'
  );

  useEffect(() => {
    if (dismissed) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { rootMargin: '200px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [dismissed]);

  if (dismissed) return null;

  const zoneId = import.meta.env.VITE_MONETAG_ZONE_ID;
  const domain = import.meta.env.VITE_MONETAG_DOMAIN;
  const iframeSrc = directLink ?? `https://${domain}/400/${zoneId}`;

  return (
    <div
      ref={ref}
      className="relative border border-gray-100 rounded-lg overflow-hidden bg-gray-50"
      style={{ width, minHeight: height }}
      aria-label={label}
    >
      <button
        className="absolute top-1 right-1 z-10 text-gray-300 hover:text-gray-500 text-xs leading-none w-4 h-4 flex items-center justify-center"
        onClick={() => {
          setDismissed(true);
          localStorage.setItem(`ad-dismissed-${slotId}`, 'true');
        }}
        aria-label="Dismiss ad"
      >
        ✕
      </button>
      <p className="text-[10px] text-gray-400 px-2 pt-1">{label}</p>
      {visible ? (
        <iframe
          src={iframeSrc}
          title={label}
          width={width}
          height={height - 18}
          loading="lazy"
          sandbox="allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
          className="border-0 block"
        />
      ) : (
        <div
          className="bg-gray-100 animate-pulse"
          style={{ width, height: height - 18 }}
        />
      )}
    </div>
  );
}
