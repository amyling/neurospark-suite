import type { ActionPlanItem, MentorResponse } from "@/types/youthmentor";

/**
 * Creates checklist items from mentor action steps.
 */
export function createActionPlan(response: MentorResponse): ActionPlanItem[] {
  return response.smallActionSteps.map((text, index) => ({
    id: `step-${index}-${Date.now()}`,
    text,
    completed: false,
  }));
}
