import { useEffect } from 'react';
import { useWSStore } from '../../store/wsStore';
import { PARTIES } from '@elections/shared';

export function LiveAlerts() {
  const { swingAlerts, connected, connect, clearAlerts } = useWSStore();

  useEffect(() => {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const base = import.meta.env.VITE_API_URL?.replace(/^https?/, proto) ?? `${proto}://${location.host}`;
    connect(`${base}/ws/national`);
    return () => clearAlerts();
  }, [connect, clearAlerts]);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-72 pointer-events-none"
      aria-live="polite"
      aria-label="Live swing alerts"
    >
      {!connected && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1.5 rounded-full text-center pointer-events-auto">
          Reconnecting to live feed...
        </div>
      )}
      {swingAlerts.slice(0, 4).map((alert, i) => {
        const party = PARTIES[alert.leadingParty];
        return (
          <div
            key={`${alert.constituencyId}-${i}`}
            className="bg-white shadow-lg border-l-4 px-3 py-2 rounded-lg text-sm animate-slide-in pointer-events-auto"
            style={{ borderLeftColor: party?.color ?? '#FF6B00' }}
          >
            <p className="font-semibold text-gray-800 text-xs">Swing Alert</p>
            <p className="text-gray-700 text-sm">{alert.name}</p>
            <p className="text-xs text-gray-400">
              {party?.abbr ?? alert.leadingParty} &middot; {alert.margin.toLocaleString()} lead &middot; {Math.round(alert.winProbability * 100)}% win
            </p>
          </div>
        );
      })}
    </div>
  );
}
