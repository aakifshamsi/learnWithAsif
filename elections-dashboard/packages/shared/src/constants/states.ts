export interface StateInfo {
  code: string;
  name: string;
  seats: number;
}

export const STATES: StateInfo[] = [
  { code: 'AN', name: 'Andaman & Nicobar Islands', seats: 1 },
  { code: 'AP', name: 'Andhra Pradesh',            seats: 25 },
  { code: 'AR', name: 'Arunachal Pradesh',         seats: 2 },
  { code: 'AS', name: 'Assam',                     seats: 14 },
  { code: 'BR', name: 'Bihar',                     seats: 40 },
  { code: 'CH', name: 'Chandigarh',                seats: 1 },
  { code: 'CT', name: 'Chhattisgarh',              seats: 11 },
  { code: 'DN', name: 'Dadra & Nagar Haveli and Daman & Diu', seats: 2 },
  { code: 'DL', name: 'Delhi',                     seats: 7 },
  { code: 'GA', name: 'Goa',                       seats: 2 },
  { code: 'GJ', name: 'Gujarat',                   seats: 26 },
  { code: 'HR', name: 'Haryana',                   seats: 10 },
  { code: 'HP', name: 'Himachal Pradesh',           seats: 4 },
  { code: 'JK', name: 'Jammu & Kashmir',           seats: 5 },
  { code: 'JH', name: 'Jharkhand',                 seats: 14 },
  { code: 'KA', name: 'Karnataka',                 seats: 28 },
  { code: 'KL', name: 'Kerala',                    seats: 20 },
  { code: 'LA', name: 'Ladakh',                    seats: 1 },
  { code: 'LD', name: 'Lakshadweep',               seats: 1 },
  { code: 'MP', name: 'Madhya Pradesh',            seats: 29 },
  { code: 'MH', name: 'Maharashtra',               seats: 48 },
  { code: 'MN', name: 'Manipur',                   seats: 2 },
  { code: 'ML', name: 'Meghalaya',                 seats: 2 },
  { code: 'MZ', name: 'Mizoram',                   seats: 1 },
  { code: 'NL', name: 'Nagaland',                  seats: 1 },
  { code: 'OD', name: 'Odisha',                    seats: 21 },
  { code: 'PY', name: 'Puducherry',                seats: 1 },
  { code: 'PB', name: 'Punjab',                    seats: 13 },
  { code: 'RJ', name: 'Rajasthan',                 seats: 25 },
  { code: 'SK', name: 'Sikkim',                    seats: 1 },
  { code: 'TN', name: 'Tamil Nadu',                seats: 39 },
  { code: 'TG', name: 'Telangana',                 seats: 17 },
  { code: 'TR', name: 'Tripura',                   seats: 2 },
  { code: 'UP', name: 'Uttar Pradesh',             seats: 80 },
  { code: 'UK', name: 'Uttarakhand',               seats: 5 },
  { code: 'WB', name: 'West Bengal',               seats: 42 },
];

export const STATE_BY_CODE: Record<string, StateInfo> = Object.fromEntries(
  STATES.map(s => [s.code, s])
);

export const TOTAL_LOK_SABHA_SEATS = STATES.reduce((sum, s) => sum + s.seats, 0);
export const MAJORITY_MARK = Math.ceil(TOTAL_LOK_SABHA_SEATS / 2);
