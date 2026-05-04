import { Link } from 'react-router-dom';
import type { SwingSeat } from '@elections/shared';
import { PARTIES } from '@elections/shared';

interface Props {
  seats: SwingSeat[];
}

export function SwingLeaderboard({ seats }: Props) {
  if (!seats.length) {
    return <div className="text-sm text-gray-400 py-6 text-center">No swing seats detected yet</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">Top Swing Seats</h3>
        <p className="text-xs text-gray-400">Win probability 40–65% — most contested</p>
      </div>
      <div className="divide-y divide-gray-50">
        {seats.slice(0, 50).map((seat, i) => {
          const party = PARTIES[seat.leadingParty];
          const pct = Math.round(seat.winProbability * 100);
          return (
            <Link
              key={seat.constituencyId}
              to={`/constituency/${seat.constituencyId}`}
              className="flex items-center px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <span className="w-6 text-xs text-gray-400 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{seat.name}</p>
                <p className="text-xs text-gray-400">{seat.state}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: party?.color ?? '#6B7280' }}
                >
                  {party?.abbr ?? seat.leadingParty}
                </span>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-700">{pct}%</p>
                  <p className="text-xs text-gray-400">{seat.margin.toLocaleString()} lead</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
