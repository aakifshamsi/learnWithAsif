import Plot from 'react-plotly.js';
import type { TrendPoint } from '@elections/shared';
import { PARTIES } from '@elections/shared';

interface Props {
  data: TrendPoint[];
  chartId?: string;
}

export function LeadMarginChart({ data, chartId }: Props) {
  if (!data.length) return null;

  const timestamps = data.map(d => d.capturedAt);
  const margins = data.map(d => d.leadMargin);
  const leaders = data.map(d => d.leadingParty);
  const colors = leaders.map(p => PARTIES[p]?.color ?? '#6B7280');

  return (
    <div id={chartId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Lead Margin Over Time</h3>
      <Plot
        data={[{
          type: 'scatter',
          mode: 'lines+markers',
          x: timestamps,
          y: margins,
          line: { color: '#FF6B00', width: 2 },
          marker: { color: colors, size: 6 },
          hovertemplate: '<b>%{x}</b><br>Margin: %{y:,}<extra></extra>',
        }]}
        layout={{
          xaxis: { title: 'Time', type: 'date' },
          yaxis: { title: 'Lead Margin (votes)', gridcolor: '#F3F4F6', zeroline: true },
          margin: { l: 70, r: 20, t: 10, b: 50 },
          height: 220,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
        }}
        config={{ displayModeBar: true, displaylogo: false, responsive: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}
