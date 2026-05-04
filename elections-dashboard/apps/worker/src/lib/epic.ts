import type { EPICValidationResult } from '@elections/shared';

const EPIC_REGEX = /^[A-Z]{3}[0-9]{7}$/;

export async function validateEPIC(
  epicNumber: string,
  expectedConstituencyId: string
): Promise<EPICValidationResult> {
  const normalized = epicNumber.toUpperCase().trim();

  if (!EPIC_REGEX.test(normalized)) {
    return { valid: false, errorMessage: 'Invalid EPIC format. Must be 3 letters followed by 7 digits (e.g. ABC1234567).' };
  }

  try {
    const url = `https://electoralsearch.eci.gov.in/Search/searchVoterDetails?epicNumber=${encodeURIComponent(normalized)}`;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ElectionsDashboard/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Referer': 'https://electoralsearch.eci.gov.in/',
      },
    });

    if (!resp.ok) {
      return { valid: false, errorMessage: 'ECI verification service temporarily unavailable. Please try again.' };
    }

    const html = await resp.text();

    if (html.includes('No voter found') || html.includes('Record Not Found') || html.includes('no record')) {
      return { valid: false, errorMessage: 'EPIC number not found in ECI database.' };
    }

    const nameMatch = html.match(/Voter\s+Name[^<]*<[^>]+>\s*([^<]+)</i);
    const constMatch = html.match(/Assembly\s+Constituency[^<]*<[^>]+>\s*([^<]+)</i);

    if (!nameMatch) {
      return { valid: false, errorMessage: 'Could not verify voter details from ECI database.' };
    }

    if (constMatch) {
      const eciConst = normalize(constMatch[1].trim());
      const expectedPart = normalize(expectedConstituencyId.split('-').slice(1).join(''));
      if (eciConst && expectedPart && !eciConst.includes(expectedPart) && !expectedPart.includes(eciConst)) {
        return {
          valid: false,
          errorMessage: `Your EPIC is registered in "${constMatch[1].trim()}", not in your selected constituency.`,
        };
      }
    }

    return { valid: true };
  } catch {
    return { valid: false, errorMessage: 'ECI validation service error. Please try again later.' };
  }
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[\s\-_.]/g, '');
}
