import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/locale";
import type { RiskClassification, SafetyLevel } from "@/types/youthmentor";

const HIGH_RISK_PATTERNS: RegExp[] = [
  /\b(suicide|suicidal|kill myself|killing myself|end my life|end it all)\b/i,
  /\b(self[- ]?harm|hurt myself|cut myself|cutting myself)\b/i,
  /\b(want to die|wish i (was|were) dead|better off dead)\b/i,
  /\b(hurt (someone|others)|kill (someone|them|him|her))\b/i,
  /\b(abuse(d)?|being abused|sexual abuse)\b/i,
  /\b(immediate danger|in danger right now|emergency now)\b/i,
  /\b(no reason to live|nothing left to live for)\b/i,
  /自杀|想死|不想活|结束生命|自残|伤害自己|想伤害自己/,
  /想杀|伤害别人|紧急危险|马上危险/,
];

const WATCH_PATTERNS: RegExp[] = [
  /\b(hopeless|worthless|give up|can't go on|cannot go on)\b/i,
  /\b(nobody cares|no one cares|all alone forever)\b/i,
  /\b(terrified|panic attack|can't breathe from anxiety)\b/i,
  /绝望|没希望|撑不下去|没人关心|恐慌|喘不过气/,
];

/**
 * Keyword-based first layer of crisis detection.
 */
export function scanKeywords(text: string, locale: Locale): RiskClassification {
  const t = getDictionary(locale).risk;
  const combined = text.trim();
  const matchedKeywords: string[] = [];

  for (const pattern of HIGH_RISK_PATTERNS) {
    const match = combined.match(pattern);
    if (match) {
      matchedKeywords.push(match[0]);
    }
  }

  if (matchedKeywords.length > 0) {
    return {
      safetyLevel: "high_risk",
      matchedKeywords,
      classifierReason: t.highKeyword,
    };
  }

  for (const pattern of WATCH_PATTERNS) {
    const match = combined.match(pattern);
    if (match) {
      matchedKeywords.push(match[0]);
    }
  }

  if (matchedKeywords.length > 0) {
    return {
      safetyLevel: "watch",
      matchedKeywords,
      classifierReason: t.watchKeyword,
    };
  }

  return {
    safetyLevel: "normal",
    matchedKeywords: [],
    classifierReason: t.noKeyword,
  };
}

/**
 * Mock LLM risk classifier — merges keyword scan with contextual rules.
 */
export async function classifyRisk(
  text: string,
  locale: Locale
): Promise<RiskClassification> {
  const t = getDictionary(locale).risk;
  const keywordResult = scanKeywords(text, locale);

  if (keywordResult.safetyLevel === "high_risk") {
    return keywordResult;
  }

  const severeHopelessness =
    (/\b(severe|extreme)\b/i.test(text) && /\b(hopeless|despair)\b/i.test(text)) ||
    (/严重|极度/.test(text) && /绝望|无助/.test(text));

  if (severeHopelessness) {
    return {
      safetyLevel: "high_risk",
      matchedKeywords: keywordResult.matchedKeywords,
      classifierReason: t.severeHopeless,
    };
  }

  if (keywordResult.safetyLevel === "watch") {
    return keywordResult;
  }

  return {
    safetyLevel: "normal" as SafetyLevel,
    matchedKeywords: [],
    classifierReason: t.normalScope,
  };
}

/**
 * Localized crisis message for high-risk sessions.
 */
export function getSafetyCrisisMessage(locale: Locale): string {
  return getDictionary(locale).risk.crisisMessage;
}
