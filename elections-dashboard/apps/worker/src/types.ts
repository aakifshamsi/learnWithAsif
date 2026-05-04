export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  REPORTS_BUCKET: R2Bucket;
  AI: Ai;
  ELECTION_ROOM: DurableObjectNamespace;
  ENVIRONMENT: string;
  ECI_FEED_URL: string;
  CF_ACCESS_TEAM_DOMAIN: string;
}
