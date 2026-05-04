import type { MonteCarloPrediction, NationalPrediction, SwingSeat } from '@elections/shared';

const DEFAULT_N = 10_000;

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function runConstituencySimulation(
  partyTallies: Record<string, number>,
  remainingPct: number,
  constituencyId: string,
  N = DEFAULT_N
): MonteCarloPrediction {
  const parties = Object.keys(partyTallies);
  const totalCounted = Object.values(partyTallies).reduce((a, b) => a + b, 0);

  if (parties.length === 0 || totalCounted === 0) {
    const uniform = 1 / Math.max(parties.length, 1);
    return {
      constituencyId,
      winProbabilities: Object.fromEntries(parties.map(p => [p, uniform])),
      confidenceInterval: [0, 0],
      simulations: N,
      generatedAt: new Date().toISOString(),
    };
  }

  const winCounts: Record<string, number> = Object.fromEntries(parties.map(p => [p, 0]));
  const leadMargins: number[] = [];
  const remaining = Math.max(0, remainingPct);

  for (let i = 0; i < N; i++) {
    const simTallies: Record<string, number> = {};

    for (const party of parties) {
      const share = partyTallies[party] / totalCounted;
      const uncertainty = Math.sqrt((share * (1 - share)) / Math.max(totalCounted, 1)) * remaining;
      const noise = gaussianRandom() * uncertainty;
      simTallies[party] = Math.max(0, partyTallies[party] + noise * totalCounted * remaining);
    }

    const sorted = Object.entries(simTallies).sort((a, b) => b[1] - a[1]);
    const winner = sorted[0][0];
    winCounts[winner]++;
    leadMargins.push(sorted[0][1] - (sorted[1]?.[1] ?? 0));
  }

  leadMargins.sort((a, b) => a - b);
  return {
    constituencyId,
    winProbabilities: Object.fromEntries(parties.map(p => [p, winCounts[p] / N])),
    confidenceInterval: [
      leadMargins[Math.floor(N * 0.025)],
      leadMargins[Math.floor(N * 0.975)],
    ],
    simulations: N,
    generatedAt: new Date().toISOString(),
  };
}

export function aggregateNational(
  predictions: MonteCarloPrediction[],
  partyToAlliance: Record<string, string>,
  constituencies: Array<{ id: string; name: string; state: string; leadingParty: string; leadMargin: number }>,
  N = DEFAULT_N
): NationalPrediction {
  const allianceSeats: Record<string, number[]> = {};
  const MAJORITY = 272;

  for (let sim = 0; sim < N; sim++) {
    const allianceCounts: Record<string, number> = {};

    for (const pred of predictions) {
      const rand = Math.random();
      let cumulative = 0;
      let winner = '';
      for (const [party, prob] of Object.entries(pred.winProbabilities)) {
        cumulative += prob;
        if (rand <= cumulative) { winner = party; break; }
      }
      if (!winner) winner = Object.keys(pred.winProbabilities)[0] ?? 'IND';
      const alliance = partyToAlliance[winner] ?? 'Others';
      allianceCounts[alliance] = (allianceCounts[alliance] ?? 0) + 1;
    }

    for (const [alliance, count] of Object.entries(allianceCounts)) {
      if (!allianceSeats[alliance]) allianceSeats[alliance] = [];
      allianceSeats[alliance].push(count);
    }
  }

  const allianceTallies: NationalPrediction['allianceTallies'] = {};
  for (const [alliance, seats] of Object.entries(allianceSeats)) {
    seats.sort((a, b) => a - b);
    const partyList = Object.entries(partyToAlliance)
      .filter(([, a]) => a === alliance)
      .map(([p]) => p);
    allianceTallies[alliance] = {
      name: alliance,
      minSeats: seats[Math.floor(N * 0.025)] ?? 0,
      medianSeats: seats[Math.floor(N * 0.5)] ?? 0,
      maxSeats: seats[Math.floor(N * 0.975)] ?? 0,
      parties: partyList,
    };
  }

  // Identify swing seats: win probability of leader between 40-65%
  const swingSeats: SwingSeat[] = predictions
    .map(pred => {
      const sorted = Object.entries(pred.winProbabilities).sort((a, b) => b[1] - a[1]);
      const topParty = sorted[0];
      const topProb = topParty[1];
      if (topProb < 0.40 || topProb > 0.65) return null;
      const con = constituencies.find(c => c.id === pred.constituencyId);
      if (!con) return null;
      return {
        constituencyId: pred.constituencyId,
        name: con.name,
        state: con.state,
        leadingParty: topParty[0],
        margin: con.leadMargin,
        winProbability: topProb,
      } satisfies SwingSeat;
    })
    .filter((s): s is SwingSeat => s !== null)
    .sort((a, b) => a.winProbability - b.winProbability)
    .slice(0, 50);

  return {
    allianceTallies,
    swingSeats,
    predictions,
    generatedAt: new Date().toISOString(),
  };
}

export const MAJORITY = 272;
