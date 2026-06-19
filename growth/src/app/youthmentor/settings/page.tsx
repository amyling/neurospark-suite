"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { useGrowthSettings } from "@/context/GrowthSettingsContext";
import { exportGrowthData, importGrowthData } from "@/lib/character-chat/growth-storage";
import { useState } from "react";

export default function SettingsPage() {
  const { t } = useLocale();
  const { settings, updateSettings, togglePremium } = useGrowthSettings();
  const [importStatus, setImportStatus] = useState<"idle" | "ok" | "fail">("idle");

  const handleExport = () => {
    const blob = new Blob([exportGrowthData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "youthmentor-growth-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const ok = importGrowthData(String(reader.result ?? ""));
        setImportStatus(ok ? "ok" : "fail");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800">
        {t.characterGrowth.settingsTitle}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {t.characterGrowth.settingsSubtitle}
      </p>

      <section className="mt-6 space-y-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-700">{t.characterGrowth.parentMode}</span>
          <input
            type="checkbox"
            checked={settings.parentModeEnabled}
            onChange={(e) =>
              updateSettings({ parentModeEnabled: e.target.checked })
            }
          />
        </label>
        <p className="text-xs text-slate-500">{t.characterGrowth.parentModeHint}</p>

        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-slate-700">{t.characterGrowth.premiumToggle}</span>
          <input
            type="checkbox"
            checked={settings.isPremium}
            onChange={() => togglePremium()}
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="text-slate-600">{t.characterGrowth.quietStart}</span>
            <input
              type="number"
              min={0}
              max={23}
              value={settings.quietHoursStart}
              onChange={(e) =>
                updateSettings({ quietHoursStart: Number(e.target.value) })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs">
            <span className="text-slate-600">{t.characterGrowth.quietEnd}</span>
            <input
              type="number"
              min={0}
              max={23}
              value={settings.quietHoursEnd}
              onChange={(e) =>
                updateSettings({ quietHoursEnd: Number(e.target.value) })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
        >
          {t.characterGrowth.exportData}
        </button>
        <button
          type="button"
          onClick={handleImport}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
        >
          {t.characterGrowth.importData}
        </button>
        {importStatus === "ok" && (
          <p className="text-xs text-emerald-600">{t.characterGrowth.importSuccess}</p>
        )}
        {importStatus === "fail" && (
          <p className="text-xs text-rose-600">{t.characterGrowth.importFailed}</p>
        )}
        <p className="text-xs text-slate-500">{t.characterGrowth.cloudSyncNote}</p>
      </section>

      <div className="mt-6">
        <Link
          href="/youthmentor/characters"
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          {t.characterChat.changeCharacter}
        </Link>
      </div>
    </div>
  );
}
