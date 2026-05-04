import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';
import type { MonteCarloPrediction } from '@elections/shared';
import { PARTIES } from '@elections/shared';

interface Props {
  prediction: MonteCarloPrediction;
}

export function SeatProbabilityHistogram({ prediction }: Props) {
  const sorted = Object.entries(prediction.winProbabilities).sort((a, b) => b[1] - a[1]);
  const [topParty, topProb] = sorted[0] ?? ['', 0];
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const target = Math.round(topProb * 100);
    let frame: number;
    const step = () => setDisplayPct(prev => {
      if (prev >= target) return target;
      frame = requestAnimationFrame(step);
      return prev + 1;
    });
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [topProb]);

  const parties = sorted.map(([p]) => p);
  const probs = sorted.map(([, v]) => +(v * 100).toFixed(1));
  const colors = parties.map(p => PARTIES[p]?.color ?? '#E5E7EB');

  const [ciLow, ciHigh] = prediction.confidenceInterval;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Win Probability</h3>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-4xl font-bold" style={{ color: PARTIES[topParty]?.color ?? '#FF6B00' }}>
          {displayPct}%
        </span>
        <span className="text-sm text-gray-500">{PARTIES[topParty]?.abbr ?? topParty} leading</span>
      </div>
      {ciLow !== undefined && ciHigh !== undefined && (
        <p className="text-xs text-gray-400 mb-2">
          95% CI lead: {Math.round(ciLow).toLocaleString()}–{Math.round(ciHigh).toLocaleString()} votes
        </p>
      )}
      <Plot
        data={[{
          type: 'bar',
          x: parties.map(p => PARTIES[p]?.abbr ?? p),
          y: probs,
          marker: { color: colors },
          hovertemplate: '<b>%{x}</b>: %{y}%<extra></extra>',
        }]}
        layout={{
          yaxis: { title: 'Win %', range: [0, 100], gridcolor: '#F3F4F6' },
          margin: { l: 40, r: 10, t: 10, b: 40 },
          height: 160,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
      <p className="text-xs text-gray-400 mt-1">{prediction.simulations.toLocaleString()} simulations</p>
    </div>
  );
}
