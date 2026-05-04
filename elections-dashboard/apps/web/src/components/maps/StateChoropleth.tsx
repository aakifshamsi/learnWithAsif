import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = '/india-map.json';

interface StateData {
  seats: number;
  leadingParty: string;
  color: string;
}

interface Props {
  stateData: Record<string, StateData>;
  onStateClick: (stateCode: string) => void;
}

export function StateChoropleth({ stateData, onStateClick }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">State Seat Projections</h3>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [82, 22], scale: 900 }}
        style={{ width: '100%', height: 'auto' }}
        aria-label="India constituency map"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const code = String(geo.properties.ST_CODE ?? geo.properties.state_code ?? '');
              const d = stateData[code];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={d?.color ?? '#E5E7EB'}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  onClick={() => code && onStateClick(code)}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#FBBF24', outline: 'none', cursor: code ? 'pointer' : 'default' },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="flex gap-4 mt-2 text-xs text-gray-500 justify-center">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-nda inline-block" /> NDA</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-india inline-block" /> INDIA</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-300 inline-block" /> Others/No Data</span>
      </div>
    </div>
  );
}
