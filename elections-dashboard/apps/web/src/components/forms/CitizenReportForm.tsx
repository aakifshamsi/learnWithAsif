import { useState, useRef } from 'react';
import { api } from '../../api/client';

interface SubmitResult {
  success: boolean;
  reportId: string;
  sentiment: string;
}

export function CitizenReportForm() {
  const [text, setText] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'locating' | 'submitting' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function getLocation() {
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('idle');
      },
      () => setStatus('idle')
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.length < 10) return;
    setStatus('submitting');

    try {
      const formData = new FormData();
      formData.append('text', text);
      if (location) {
        formData.append('lat', String(location.lat));
        formData.append('lng', String(location.lng));
      }
      if (imageFile) formData.append('image', imageFile);

      const res = await api.postForm<SubmitResult>('/api/reports', formData);
      setResult(res);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setStatus('error');
    }
  }

  if (status === 'done' && result) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-3">📝</div>
        <h2 className="text-xl font-bold text-green-600 mb-1">Report Submitted!</h2>
        <p className="text-sm text-gray-500">Sentiment: <strong>{result.sentiment}</strong></p>
        <p className="text-xs text-gray-400 mt-1">Report ID: {result.reportId}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Submit Citizen Report</h1>
        <p className="text-sm text-gray-500 mt-1">No personal information is stored. Reports are analyzed for sentiment by CF AI.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Report Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          minLength={10}
          maxLength={2000}
          placeholder="Describe what you observed at the polling station or during counting…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
          required
        />
        <p className="text-xs text-gray-400 text-right mt-0.5">{text.length}/2000</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={getLocation}
          disabled={status === 'locating'}
          className="text-sm text-blue-600 underline hover:text-blue-800 disabled:opacity-50"
        >
          {status === 'locating' ? 'Getting location…' : location ? 'Location attached' : 'Attach GPS location'}
        </button>
        {location && (
          <span className="text-xs text-gray-400">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </span>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          {imageFile ? `Image: ${imageFile.name}` : 'Attach image (optional, max 5MB)'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => setImageFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded text-sm text-red-700 px-3 py-2">{error}</div>
      )}

      <button
        type="submit"
        disabled={text.length < 10 || status === 'submitting'}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 font-semibold text-sm transition-colors disabled:opacity-40"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Report'}
      </button>
    </form>
  );
}
