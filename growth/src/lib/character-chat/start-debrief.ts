import { createReflectionDebriefPayload } from "@/lib/character-chat/reflection-bridge";
import { setReflectionDebrief } from "@/lib/character-chat/growth-storage";
import type { ReflectionAnswers, MoodCheckIn, MentorPersona } from "@/types/youthmentor";

/**
 * Queues a reflection session for character mentor debrief.
 */
export function queueReflectionDebrief(
  checkIn: MoodCheckIn,
  answers: ReflectionAnswers,
  mentorPersona: MentorPersona
): void {
  setReflectionDebrief(
    createReflectionDebriefPayload(checkIn, answers, mentorPersona)
  );
}
