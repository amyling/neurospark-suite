"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getGrowthSettings,
  saveGrowthSettings,
} from "@/lib/character-chat/growth-storage";
import {
  checkChatAllowed,
  recordMessageSent,
} from "@/lib/character-chat/usage-limits";
import type { GrowthSettings } from "@/types/character-growth";

type GrowthSettingsContextValue = {
  settings: GrowthSettings;
  usageRemaining: number;
  usageLimit: number;
  limitBlockedReason: "ok" | "limit" | "quiet_hours" | "parent_limit";
  canSendMessage: boolean;
  refreshUsage: () => void;
  updateSettings: (patch: Partial<GrowthSettings>) => void;
  togglePremium: () => void;
};

const GrowthSettingsContext = createContext<GrowthSettingsContextValue | null>(
  null
);

/**
 * Manages freemium limits, parent mode, and premium demo toggle.
 */
export function GrowthSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GrowthSettings>(getGrowthSettings());
  const [usageRemaining, setUsageRemaining] = useState(0);
  const [usageLimit, setUsageLimit] = useState(20);
  const [limitBlockedReason, setLimitBlockedReason] = useState<
    "ok" | "limit" | "quiet_hours" | "parent_limit"
  >("ok");

  const refreshUsage = useCallback(() => {
    const check = checkChatAllowed();
    setUsageRemaining(
      Number.isFinite(check.remaining) ? check.remaining : 999
    );
    setUsageLimit(Number.isFinite(check.limit) ? check.limit : 999);
    setLimitBlockedReason(check.reason);
  }, []);

  useEffect(() => {
    refreshUsage();
  }, [refreshUsage, settings]);

  const updateSettings = useCallback((patch: Partial<GrowthSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveGrowthSettings(next);
      return next;
    });
  }, []);

  const togglePremium = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, isPremium: !prev.isPremium };
      saveGrowthSettings(next);
      return next;
    });
  }, []);

  const canSendMessage = limitBlockedReason === "ok" || settings.isPremium;

  const value = useMemo(
    () => ({
      settings,
      usageRemaining,
      usageLimit,
      limitBlockedReason,
      canSendMessage,
      refreshUsage,
      updateSettings,
      togglePremium,
    }),
    [
      settings,
      usageRemaining,
      usageLimit,
      limitBlockedReason,
      canSendMessage,
      refreshUsage,
      updateSettings,
      togglePremium,
    ]
  );

  return (
    <GrowthSettingsContext.Provider value={value}>
      {children}
    </GrowthSettingsContext.Provider>
  );
}

/**
 * Access growth settings and usage limits.
 */
export function useGrowthSettings(): GrowthSettingsContextValue {
  const ctx = useContext(GrowthSettingsContext);
  if (!ctx) {
    throw new Error("useGrowthSettings must be used within GrowthSettingsProvider");
  }
  return ctx;
}

/**
 * Records a sent message against daily quota (call after successful send).
 */
export function useRecordChatUsage(): () => void {
  const { refreshUsage, settings } = useGrowthSettings();
  return useCallback(() => {
    if (!settings.isPremium) {
      recordMessageSent();
    }
    refreshUsage();
  }, [refreshUsage, settings.isPremium]);
}
