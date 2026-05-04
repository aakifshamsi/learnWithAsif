import Plot from 'react-plotly.js';
import type { TrendPoint } from '@elections/shared';
import { PARTIES } from '@elections/shared';

interface Props {
  data: TrendPoint[];
  name: string;
  chartId?: string;
}

export function ConstituencyTimeSeries({ data, name, chartId }: Props) {
  if (!data.length) {
    return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No trend data yet</div>;
  }

  const parties = [...new Set(data.flatMap(d => Object.keys(d.rawJson ?? {})))];
  const timestamps = data.map(d => d.capturedAt);

  const traces: Plotly.Data[] = parties.map(party => ({
    type: 'scatter',
    mode: 'lines',
    name: party,
    x: timestamps,
    y: data.map(d => (d.rawJson?.[party] ?? 0)),
    line: { color: PARTIES[party]?.color ?? '#6B7280', width: 2 },
    hovertemplate: `<b>${party}</b>: %{y:,}<extra></extra>`,
  }));

  return (
    <div id={chartId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{name} — Vote Count Over Time</h3>
      <Plot
        data={traces}
        layout={{
          xaxis: { title: 'Time', type: 'date' },
          yaxis: { title: 'Votes', gridcolor: '#F3F4F6' },
          legend: { orientation: 'h', y: -0.2 },
          margin: { l: 60, r: 20, t: 10, b: 60 },
          height: 280,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
        }}
        config={{ displayModeBar: true, displaylogo: false, responsive: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}
