import { VoteForm } from '../components/forms/VoteForm';

export function VotePage() {
  return (
    <div className="max-w-lg mx-auto py-8">
      <VoteForm />
      <div className="mt-6 text-xs text-gray-400 space-y-1">
        <p>Your EPIC number is verified against the ECI electoral roll but is never stored raw — only a SHA-256 hash is kept to prevent duplicate votes.</p>
        <p>Authentication is handled by Cloudflare Access. We do not store your email or identity.</p>
      </div>
    </div>
  );
}
