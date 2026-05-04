import Plot from 'react-plotly.js';
import type { NationalPrediction } from '@elections/shared';
import { ALLIANCE_COLORS, MAJORITY } from '@elections/shared';

interface Props {
  prediction: NationalPrediction;
}

export function NationalSummary({ prediction }: Props) {
  const alliances = Object.entries(prediction.allianceTallies);

  const data: Plotly.Data[] = [{
    type: 'bar',
    orientation: 'h',
    x: alliances.map(([, t]) => t.medianSeats),
    y: alliances.map(([name]) => name),
    error_x: {
      type: 'data',
      array: alliances.map(([, t]) => t.maxSeats - t.medianSeats),
      arrayminus: alliances.map(([, t]) => t.medianSeats - t.minSeats),
      visible: true,
      color: '#9CA3AF',
      thickness: 2,
    },
    marker: {
      color: alliances.map(([name]) => ALLIANCE_COLORS[name] ?? '#6B7280'),
    },
    text: alliances.map(([, t]) => `${t.medianSeats}`),
    textposition: 'outside',
    hovertemplate: '<b>%{y}</b><br>Median: %{x} seats<br>Range: %{customdata}<extra></extra>',
    customdata: alliances.map(([, t]) => `${t.minSeats}–${t.maxSeats}`),
  }];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold text-gray-800">National Seat Projection</h2>
        <span className="text-xs text-gray-400">Majority: {MAJORITY} seats</span>
      </div>
      <p className="text-xs text-gray-400 mb-3">95% confidence intervals · {prediction.predictions.length} constituencies</p>
      <Plot
        data={data}
        layout={{
          xaxis: { title: 'Seats', range: [0, 550], gridcolor: '#F3F4F6' },
          yaxis: { automargin: true },
          shapes: [{
            type: 'line', x0: MAJORITY, x1: MAJORITY, y0: -0.5, y1: alliances.length - 0.5,
            line: { color: '#EF4444', dash: 'dash', width: 1.5 },
          }],
          annotations: [{
            x: MAJORITY, y: alliances.length - 0.5,
            text: 'Majority', showarrow: false,
            font: { size: 10, color: '#EF4444' }, xanchor: 'left',
          }],
          margin: { l: 80, r: 60, t: 10, b: 40 },
          height: 180,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%' }}
      />
      <p className="text-xs text-gray-400 mt-1">Updated: {new Date(prediction.generatedAt).toLocaleTimeString()}</p>
    </div>
  );
}
