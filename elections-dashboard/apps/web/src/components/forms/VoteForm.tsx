import { useState } from 'react';
import { api } from '../../api/client';
import type { EPICValidationResult } from '@elections/shared';
import { PARTIES, STATES } from '@elections/shared';

type Step = 'input' | 'validating' | 'select-party' | 'submitting' | 'done' | 'error';

export function VoteForm() {
  const [step, setStep] = useState<Step>('input');
  const [epicNumber, setEpicNumber] = useState('');
  const [constituencyId, setConstituencyId] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    if (!epicNumber || !constituencyId) return;
    setStep('validating');
    try {
      const result = await api.post<EPICValidationResult>('/api/validate-epic', { epicNumber, constituencyId });
      if (result.valid) {
        setStep('select-party');
      } else {
        setErrorMsg(result.errorMessage ?? 'Validation failed');
        setStep('error');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Validation failed');
      setStep('error');
    }
  }

  async function handleSubmit() {
    if (!selectedParty) return;
    setStep('submitting');
    try {
      await api.post('/api/votes', { epicNumber, constituencyId, party: selectedParty });
      setStep('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
      setStep('error');
    }
  }

  if (step === 'done') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🗳️</div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">Vote Recorded!</h2>
        <p className="text-gray-500 text-sm">Your EPIC was verified and your preference registered securely.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Record Your Vote</h1>
        <p className="text-sm text-gray-500 mt-1">Your EPIC # is verified against ECI before recording. Only a hash is stored — never your raw EPIC.</p>
      </div>

      <form onSubmit={handleValidate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State & Constituency
          </label>
          <select
            value={constituencyId}
            onChange={e => setConstituencyId(e.target.value)}
            disabled={step !== 'input'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
          >
            <option value="">Select your constituency…</option>
            {STATES.map(state => {
              const stateConst = Array.from({ length: state.seats }, (_, i) => ({
                id: `${state.code}-${String(i + 1).padStart(2, '0')}`,
                label: `${state.code}-${String(i + 1).padStart(2, '0')}`,
              }));
              return (
                <optgroup key={state.code} label={state.name}>
                  {stateConst.map(c => (
                    <option key={c.id} value={c.id}>{c.id}</option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="epic">
            EPIC Number
          </label>
          <input
            id="epic"
            type="text"
            value={epicNumber}
            onChange={e => setEpicNumber(e.target.value.toUpperCase().trim())}
            placeholder="e.g. ABC1234567"
            maxLength={10}
            pattern="[A-Z]{3}[0-9]{7}"
            disabled={step !== 'input'}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono tracking-widest focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
            aria-describedby="epic-hint"
          />
          <p id="epic-hint" className="text-xs text-gray-400 mt-1">3 capital letters + 7 digits (printed on your Voter ID card)</p>
        </div>

        {step === 'input' && (
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 font-semibold text-sm transition-colors"
          >
            Verify EPIC with ECI
          </button>
        )}
      </form>

      {step === 'validating' && (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-500">Verifying with ECI database…</p>
        </div>
      )}

      {step === 'select-party' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700">
            EPIC verified successfully
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Party</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PARTIES).filter(([k]) => k !== 'NOTA').map(([code, party]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedParty(code)}
                  className={`border-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                    selectedParty === code
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: party.color }}
                  />
                  {party.abbr}
                  <span className="block text-xs font-normal text-gray-400 truncate">{party.alliance}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedParty('NOTA')}
                className={`border-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left col-span-2 ${
                  selectedParty === 'NOTA' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                NOTA — None of the Above
              </button>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!selectedParty}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2.5 font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Vote
          </button>
        </div>
      )}

      {step === 'submitting' && (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-500">Recording your vote…</p>
        </div>
      )}

      {step === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-3 text-sm text-red-700">
          <p className="font-medium mb-1">Verification failed</p>
          <p>{errorMsg}</p>
          <button
            onClick={() => { setStep('input'); setErrorMsg(''); }}
            className="mt-2 text-sm underline text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
