import {
  getDailyUsage,
  getGrowthSettings,
  incrementDailyUsage,
} from "@/lib/character-chat/growth-storage";

export const FREE_DAILY_MESSAGE_LIMIT = 20;
export const PARENT_MODE_DAILY_LIMIT = 10;

/**
 * Returns whether chat is allowed now (freemium + parent mode + quiet hours).
 */
export function checkChatAllowed(): {
  allowed: boolean;
  reason: "ok" | "limit" | "quiet_hours" | "parent_limit";
  remaining: number;
  limit: number;
} {
  const settings = getGrowthSettings();
  const usage = getDailyUsage();
  const limit = settings.isPremium
    ? Number.POSITIVE_INFINITY
    : settings.parentModeEnabled
      ? PARENT_MODE_DAILY_LIMIT
      : settings.dailyLimitOverride ?? FREE_DAILY_MESSAGE_LIMIT;

  if (settings.parentModeEnabled) {
    const hour = new Date().getHours();
    const { quietHoursStart, quietHoursEnd } = settings;
    const inQuiet =
      quietHoursStart > quietHoursEnd
        ? hour >= quietHoursStart || hour < quietHoursEnd
        : hour >= quietHoursStart && hour < quietHoursEnd;
    if (inQuiet) {
      return { allowed: false, reason: "quiet_hours", remaining: 0, limit };
    }
  }

  const remaining = Math.max(0, limit - usage.messageCount);
  if (!settings.isPremium && usage.messageCount >= limit) {
    return {
      allowed: false,
      reason: settings.parentModeEnabled ? "parent_limit" : "limit",
      remaining: 0,
      limit,
    };
  }

  return { allowed: true, reason: "ok", remaining, limit };
}

/**
 * Records one sent user message against daily quota.
 */
export function recordMessageSent(): void {
  incrementDailyUsage();
}
