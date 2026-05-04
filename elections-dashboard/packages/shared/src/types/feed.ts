import type { ECISnapshot } from './constituency';
import type { MonteCarloPrediction, SwingSeat } from './prediction';
import type { CitizenReport } from './report';

export interface FeedItem {
  constituencyId: string;
  constituencyName: string;
  state: string;
  snapshot: ECISnapshot;
}

export type WebSocketMessage =
  | { type: 'connected'; sessionCount: number }
  | { type: 'snapshot_update'; payload: ECISnapshot }
  | { type: 'swing_alert'; payload: SwingSeat }
  | { type: 'prediction_update'; payload: MonteCarloPrediction }
  | { type: 'report_new'; payload: CitizenReport };
