import type { LearningVisualStep, LessonVisualType } from "../types";
import {
  isEmailWritingLesson,
  isWritingLesson,
} from "../lesson/detect-writing-lesson";

/**
 * Picks an animation scene from step content when the model omits visualType.
 */
export function detectLessonVisualType(
  step: LearningVisualStep,
  topic?: string,
  subject?: string
): LessonVisualType {
  if (step.visualType) {
    return step.visualType;
  }

  const haystack = `${step.title} ${step.body} ${step.latex ?? ""}`.toLowerCase();

  if (topic && isEmailWritingLesson(topic, subject)) {
    if (/mistake|误区|错误|易错|pitfall/.test(haystack)) {
      return "mistake_compare";
    }
    return "writing_structure";
  }

  if (topic && isWritingLesson(topic, subject)) {
    if (/mistake|误区|错误|易错|pitfall/.test(haystack)) {
      return "mistake_compare";
    }
    if (/结构|格式|段落|提纲|outline|paragraph|salutation|称呼/.test(haystack)) {
      return "writing_structure";
    }
    return "concept_map";
  }

  if (/化学|反应|chemistry|reaction|分子|molecule|催化剂|catalyst|氧化|还原|试剂/.test(haystack)) {
    return "chemistry_reaction";
  }
  if (
    /相对论|relativity|einstein|爱因斯坦|时间膨胀|time dilation|洛伦兹|lorentz|参考系|frame of reference|spacetime|时空/.test(
      haystack
    )
  ) {
    return "physics_spacetime";
  }
  if (/流程|步骤|因素|条件|process|stage|phase|condition|factor/.test(haystack)) {
    return "concept_process";
  }
  if (/\\int|∫|integral|定积分|积分|曲边|面积|antiderivative|原函数/.test(haystack)) {
    return "integral_area";
  }
  if (/抛物线|parabola|顶点|vertex|对称轴|二次函数|quadratic/.test(haystack)) {
    return "parabola_graph";
  }
  if (/factor|因式|分解|multiply|相乘|零积/.test(haystack)) {
    return "factor_pairs";
  }
  if (/mistake|error|wrong|错误|常见|粗心/.test(haystack)) {
    return "mistake_compare";
  }
  if (/number line|数轴|区间/.test(haystack)) {
    return "number_line";
  }
  if (/=/.test(haystack) && (/solve|方程|根|代入/.test(haystack) || step.latex?.includes("="))) {
    return "equation_balance";
  }
  if (step.latex) {
    return "formula_spotlight";
  }
  return "generic";
}
