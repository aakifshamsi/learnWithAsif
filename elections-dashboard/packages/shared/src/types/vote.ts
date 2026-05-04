export interface RecordedVote {
  id: string;
  epicHash: string;
  constituencyId: string;
  party: string;
  recordedAt: string;
}

export interface VoteSubmission {
  epicNumber: string;
  constituencyId: string;
  party: string;
}

export interface EPICValidationResult {
  valid: boolean;
  errorMessage?: string;
}
