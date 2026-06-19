"use client";

import { Suspense } from "react";
import CharacterChatPage from "./CharacterChatInner";

export default function CharacterChatRoutePage() {
  return (
    <Suspense fallback={null}>
      <CharacterChatPage />
    </Suspense>
  );
}
