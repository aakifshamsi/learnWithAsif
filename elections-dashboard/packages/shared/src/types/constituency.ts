export interface Constituency {
  id: string;
  name: string;
  state: string;
  totalVoters: number;
  createdAt?: string;
}

export interface ECISnapshot {
  id: string;
  constituencyId: string;
  capturedAt: string;
  leadingParty: string;
  leadMargin: number;
  totalVotesCounted: number;
  percentCounted: number;
  rawJson: Record<string, number>;
}

export interface TrendPoint {
  capturedAt: string;
  leadingParty: string;
  leadMargin: number;
  totalVotesCounted: number;
  percentCounted: number;
  rawJson: Record<string, number>;
}
