import type { LessonVisualType } from "../types";

/**
 * Maps step index to animation phase for coordinate-style visuals.
 */
export function getLessonAnimPhase(
  stepIndex: number,
  visualType: LessonVisualType
): number {
  switch (visualType) {
    case "integral_area":
      return Math.min(stepIndex, 4);
    case "parabola_graph":
      return Math.min(stepIndex, 3);
    case "number_line":
      return Math.min(stepIndex, 3);
    default:
      return 0;
  }
}
