import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12">
      <div className="container mx-auto px-4 max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          ElecAI &mdash; Live India Elections Dashboard. Data sourced from ECI.
        </p>
        <div className="flex gap-4 text-sm">
          <Link to="/report" className="text-gray-500 hover:text-gray-700">Submit Report</Link>
          <Link to="/vote" className="text-gray-500 hover:text-gray-700">Record Vote</Link>
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">ECI</a>
        </div>
      </div>
    </footer>
  );
}
