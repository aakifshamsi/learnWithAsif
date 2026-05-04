export interface MonteCarloPrediction {
  constituencyId: string;
  winProbabilities: Record<string, number>;
  confidenceInterval: [number, number];
  simulations: number;
  generatedAt: string;
}

export interface AllianceTally {
  name: string;
  minSeats: number;
  medianSeats: number;
  maxSeats: number;
  parties: string[];
}

export interface SwingSeat {
  constituencyId: string;
  name: string;
  state: string;
  leadingParty: string;
  margin: number;
  winProbability: number;
}

export interface NationalPrediction {
  allianceTallies: Record<string, AllianceTally>;
  swingSeats: SwingSeat[];
  predictions: MonteCarloPrediction[];
  generatedAt: string;
}
