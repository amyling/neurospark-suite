"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/context/LocaleContext";

export type CharacterFormValues = {
  name: string;
  avatar: string;
  description: string;
  greeting: string;
  personality: string;
  speakingStyle: string;
};

const DEFAULT_FORM: CharacterFormValues = {
  name: "",
  avatar: "🤖",
  description: "",
  greeting: "",
  personality: "",
  speakingStyle: "",
};

/**
 * Form for creating a custom virtual persona.
 */
export function CharacterForm({
  onSubmit,
}: {
  onSubmit: (values: CharacterFormValues) => void;
}) {
  const { t } = useLocale();
  const [form, setForm] = useState<CharacterFormValues>(DEFAULT_FORM);
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.greeting.trim()) {
      return;
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      greeting: form.greeting.trim(),
      personality: form.personality.trim(),
      speakingStyle: form.speakingStyle.trim(),
    });
    setForm(DEFAULT_FORM);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 px-4 py-6 text-sm font-medium text-violet-700 hover:border-violet-300 hover:bg-violet-50"
      >
        {t.characterChat.createCharacter}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-5 ring-1 ring-violet-100"
    >
      <h3 className="font-semibold text-slate-800">
        {t.characterChat.createTitle}
      </h3>
      <p className="mt-1 text-xs text-slate-500">{t.characterChat.createHint}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-slate-600">{t.characterChat.formName}</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder={t.characterChat.formNamePlaceholder}
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">{t.characterChat.formAvatar}</span>
          <input
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            maxLength={4}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="🤖"
          />
        </label>
      </div>

      <label className="mt-3 block text-sm">
        <span className="text-slate-600">{t.characterChat.formDescription}</span>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>

      <label className="mt-3 block text-sm">
        <span className="text-slate-600">{t.characterChat.formGreeting}</span>
        <textarea
          required
          value={form.greeting}
          onChange={(e) => setForm({ ...form, greeting: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>

      <label className="mt-3 block text-sm">
        <span className="text-slate-600">{t.characterChat.formPersonality}</span>
        <textarea
          value={form.personality}
          onChange={(e) => setForm({ ...form, personality: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>

      <label className="mt-3 block text-sm">
        <span className="text-slate-600">{t.characterChat.formStyle}</span>
        <textarea
          value={form.speakingStyle}
          onChange={(e) => setForm({ ...form, speakingStyle: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600"
        >
          {t.characterChat.saveCharacter}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
        >
          {t.common.back}
        </button>
      </div>
    </form>
  );
}
