"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useCharacterChat } from "@/context/CharacterChatContext";

/**
 * User profile fields for memory personalization.
 */
export function ProfileForm() {
  const { t } = useLocale();
  const { profile, updateProfile } = useCharacterChat();
  const [name, setName] = useState(profile.displayName);
  const [role, setRole] = useState(profile.gradeOrRole);

  const save = () => {
    updateProfile(name.trim(), role.trim());
  };

  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <h3 className="text-sm font-semibold text-slate-800">
        {t.characterGrowth.profileTitle}
      </h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="block text-xs">
          <span className="text-slate-600">{t.characterGrowth.profileName}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs">
          <span className="text-slate-600">{t.characterGrowth.profileRole}</span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={save}
        className="mt-3 rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-600"
      >
        {t.characterGrowth.saveProfile}
      </button>
    </section>
  );
}
