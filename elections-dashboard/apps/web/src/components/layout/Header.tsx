import { Link, useLocation } from 'react-router-dom';
import { useWSStore } from '../../store/wsStore';

const NAV = [
  { href: '/', label: 'Dashboard' },
  { href: '/gameroom', label: 'Game Room' },
  { href: '/vote', label: 'Record Vote' },
  { href: '/reports', label: 'Reports' },
];

export function Header() {
  const location = useLocation();
  const connected = useWSStore(s => s.connected);

  const adsDisabled = localStorage.getItem('ads-disabled') === 'true';

  function toggleAds() {
    if (adsDisabled) {
      localStorage.removeItem('ads-disabled');
    } else {
      localStorage.setItem('ads-disabled', 'true');
    }
    window.location.reload();
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-orange-600">ElecAI</span>
          <span className="text-sm text-gray-500 hidden sm:inline">Live Elections Dashboard</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                location.pathname === href
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-amber-400'}`}
            title={connected ? 'Live' : 'Reconnecting'}
          />
          <button
            onClick={toggleAds}
            className="text-xs text-gray-400 hover:text-gray-600 hidden sm:block"
          >
            {adsDisabled ? 'Enable Ads' : 'Disable Ads'}
          </button>
        </div>
      </div>
    </header>
  );
}
