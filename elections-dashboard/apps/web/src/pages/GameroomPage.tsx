import { SwingLeaderboard } from '../components/feed/SwingLeaderboard';
import { LiveAlerts } from '../components/feed/LiveAlerts';
import { useNationalPrediction } from '../api/hooks/usePredictions';
import { useWSStore } from '../store/wsStore';
import { ALLIANCE_COLORS, MAJORITY } from '@elections/shared';

export function GameroomPage() {
  const { data: prediction, isLoading } = useNationalPrediction();
  const swingAlerts = useWSStore(s => s.swingAlerts);
  const connected = useWSStore(s => s.connected);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Game Room</h1>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${connected ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {connected ? 'Live' : 'Reconnecting…'}
        </span>
      </div>

      {prediction && (
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(prediction.allianceTallies).map(([name, tally]) => (
            <div
              key={name}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center"
            >
              <div
                className="text-3xl font-bold mb-0.5"
                style={{ color: ALLIANCE_COLORS[name] ?? '#6B7280' }}
              >
                {tally.medianSeats}
              </div>
              <div className="text-xs text-gray-500">{name}</div>
              <div className="text-xs text-gray-400">{tally.minSeats}–{tally.maxSeats}</div>
            </div>
          ))}
        </div>
      )}

      {prediction && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Majority mark: {MAJORITY}</span>
            <span>{prediction.predictions.length} constituencies reporting</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden flex">
            {Object.entries(prediction.allianceTallies).map(([name, tally]) => (
              <div
                key={name}
                style={{
                  width: `${(tally.medianSeats / 543) * 100}%`,
                  backgroundColor: ALLIANCE_COLORS[name] ?? '#6B7280',
                }}
                title={`${name}: ${tally.medianSeats}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {isLoading && <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />}
          {prediction && <SwingLeaderboard seats={prediction.swingSeats} />}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Recent Swing Alerts</h3>
          {swingAlerts.length === 0 ? (
            <p className="text-sm text-gray-400">Alerts will appear here when swing seats shift</p>
          ) : (
            swingAlerts.slice(0, 10).map((alert, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 px-3 py-2 text-sm shadow-sm">
                <p className="font-medium text-gray-800">{alert.name}</p>
                <p className="text-xs text-gray-400">{alert.state} · {Math.round(alert.winProbability * 100)}% win prob</p>
              </div>
            ))
          )}
        </div>
      </div>

      <LiveAlerts />
    </div>
  );
}
