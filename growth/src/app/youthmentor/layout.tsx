"use client";

import { GrowthSettingsProvider } from "@/context/GrowthSettingsContext";
import { CharacterChatProvider } from "@/context/CharacterChatContext";
import { YouthMentorProvider } from "@/context/YouthMentorContext";
import { YouthMentorLayout } from "@/components/youthmentor/YouthMentorLayout";
import type { ReactNode } from "react";

export default function YouthMentorRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <GrowthSettingsProvider>
      <YouthMentorProvider>
        <CharacterChatProvider>
          <YouthMentorLayout>{children}</YouthMentorLayout>
        </CharacterChatProvider>
      </YouthMentorProvider>
    </GrowthSettingsProvider>
  );
}
