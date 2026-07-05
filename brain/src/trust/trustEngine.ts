import type { Source, TrustLevel } from '../types.js';

/**
 * SPEC-007 Trust Engine: confidence is computed from evidence, never
 * hardcoded. "Ninguna fuente tiene la verdad" — we combine weight, source
 * diversity (consensus) and freshness into a level plus a plain-language
 * rationale. The PWA only ever sees the level + rationale, never a raw score
 * ("El usuario nunca ve números. Ve explicaciones.").
 */

const WEIGHT_POINTS: Record<Source['weight'], number> = { strong: 3, medium: 2, weak: 1 };

const KIND_LABEL: Record<Source['kind'], string> = {
  curator: 'un curador',
  community: 'la comunidad',
  visit: 'una visita confirmada',
  press: 'prensa especializada',
  menu: 'el menú vigente',
};

const FRESHNESS_HALF_LIFE_DAYS = 270;

function freshnessFactor(capturedAt: string, now: number): number {
  const ageDays = (now - new Date(capturedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= 0) return 1;
  // Gentle exponential decay — old evidence still counts, just less (CP-033 Data Quality).
  return Math.pow(0.5, ageDays / FRESHNESS_HALF_LIFE_DAYS);
}

/**
 * SPEC-007 "Contradictions": each pair is two sides of the same axis. Deterministic
 * keyword matching, not an LLM call — the Trust Engine has to stay explainable.
 */
const CONTRADICTION_AXES: [RegExp, RegExp][] = [
  [/ruidos|animad|bullicios/i, /tranquil|callad|silencios/i],
  [/car[oa]/i, /econ[oó]mic|barat/i],
  [/r[aá]pid/i, /lent[oa]|demor/i],
  [/grupos? grandes?/i, /[ií]ntim[oa]|de a dos/i],
];

interface Contradiction {
  a: Source;
  b: Source;
}

/** Nunca elegir arbitrariamente entre dos fuentes que dicen cosas distintas — se detecta y se nombra, no se promedia en silencio. */
function detectContradiction(sources: Source[]): Contradiction | null {
  const claimed = sources.filter((s): s is Source & { claim: string } => !!s.claim);
  for (let i = 0; i < claimed.length; i++) {
    for (let j = i + 1; j < claimed.length; j++) {
      const [a, b] = [claimed[i], claimed[j]];
      for (const [sideA, sideB] of CONTRADICTION_AXES) {
        const aMatchesA = sideA.test(a.claim);
        const bMatchesA = sideA.test(b.claim);
        const aMatchesB = sideB.test(a.claim);
        const bMatchesB = sideB.test(b.claim);
        if ((aMatchesA && bMatchesB) || (aMatchesB && bMatchesA)) {
          return { a, b };
        }
      }
    }
  }
  return null;
}

export interface TrustResult {
  level: TrustLevel;
  rationale: string;
}

export function computeTrust(sources: Source[], now: number = Date.now()): TrustResult {
  if (sources.length === 0) {
    return { level: 'low', rationale: 'Todavía no tenemos evidencia suficiente sobre este lugar.' };
  }

  const conflict = detectContradiction(sources);
  if (conflict) {
    // A real contradiction caps confidence regardless of score/consensus — "buscar evidencia
    // adicional", nunca resolverlo eligiendo una fuente por sobre la otra.
    return {
      level: 'low',
      rationale: `Señales en conflicto: ${conflict.a.name} dice "${conflict.a.claim}", pero ${conflict.b.name} dice "${conflict.b.claim}". Todavía no es concluyente.`,
    };
  }

  const weighted = sources.map((s) => ({
    source: s,
    score: WEIGHT_POINTS[s.weight] * freshnessFactor(s.capturedAt, now),
  }));

  const totalScore = weighted.reduce((sum, w) => sum + w.score, 0);
  // Consensus (SPEC-007): independent kinds of evidence agreeing counts for more than
  // one source repeating itself — this is what "varias fuentes → mayor confianza" means here.
  const distinctKinds = new Set(sources.map((s) => s.kind)).size;

  let level: TrustLevel;
  if (totalScore >= 6 && distinctKinds >= 2) {
    level = 'high';
  } else if (totalScore >= 3) {
    level = 'mid';
  } else {
    level = 'low';
  }

  // Cite the strongest contributors, not every source — a rationale, not a data dump.
  const topContributors = [...weighted]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((w) => w.source.name);

  const kindsInvolved = [...new Set(sources.map((s) => KIND_LABEL[s.kind]))];
  const consensusPhrase = kindsInvolved.length > 1 ? `, con coincidencia entre ${kindsInvolved.join(' y ')}` : '';

  const prefix = level === 'high' ? 'Confianza alta' : level === 'mid' ? 'Confianza media' : 'Confianza baja';
  const rationale = `${prefix}: respaldado por ${topContributors.join(' y ')}${consensusPhrase}.`;

  return { level, rationale };
}
