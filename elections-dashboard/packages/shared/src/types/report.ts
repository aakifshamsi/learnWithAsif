export interface CitizenReport {
  id: string;
  text: string;
  r2Key?: string;
  lat?: number;
  lng?: number;
  constituencyId?: string;
  sentiment?: string;
  createdAt: string;
}

export interface ReportSubmission {
  text: string;
  constituencyId?: string;
  lat?: number;
  lng?: number;
}
