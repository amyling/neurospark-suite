import type { Locale } from "@/lib/i18n/types";
import type { LessonRequest } from "../types";
import type { LessonOutputPayload } from "../ai/validator";

/**
 * Topic-neutral demo lesson when the subject is not quadratic or calculus.
 */
export function buildGenericMockLesson(
  request: LessonRequest,
  locale: Locale
): LessonOutputPayload {
  const usedTeacher = Boolean(request.teacherContent?.trim());
  const topic = request.topic;
  const isZh = locale === "zh";

  const intro = isZh
    ? usedTeacher
      ? `【教师输入摘要】${request.teacherContent!.slice(0, 200)}…`
      : `本课围绕「${topic}」展开，适合${request.classProfile ?? request.level}。`
    : usedTeacher
      ? `[From teacher notes] ${request.teacherContent!.slice(0, 200)}…`
      : `Lesson on ${topic} for ${request.classProfile ?? request.level}.`;

  return {
    contentSource: usedTeacher ? "mixed" : "ai_generated",
    learningObjectives: isZh
      ? [
          `掌握 ${topic} 的核心定义与符号`,
          `能在 ${request.level} 难度下完成典型例题`,
          `识别并纠正 ${topic} 的常见误区`,
        ]
      : [
          `Master key definitions and notation for ${topic}`,
          `Solve ${request.level}-level problems`,
          `Address common errors in ${topic}`,
        ],
    keyConcepts: isZh
      ? ["核心定义", "关键公式", "应用步骤"]
      : ["Core definitions", "Key formulas", "Problem-solving steps"],
    teachingContent: [
      { type: "text", content: intro },
      {
        type: "formula",
        content: isZh ? `「${topic}」核心公式` : `Key formula for ${topic}`,
        latex: isZh ? "\\\\text{见课堂推导}" : "\\\\text{see class derivation}",
      },
      {
        type: "diagram",
        content: isZh
          ? `板书画图：与「${topic}」相关的示意图；标出已知量与未知量。`
          : `Board sketch for ${topic}; label knowns and unknowns.`,
      },
      {
        type: "table",
        content: isZh
          ? "| 步骤 | 操作 | 注意 |\n|------|------|------|\n| 1 | 读题建模 | 写清单位 |\n| 2 | 选公式 | 检查条件 |\n| 3 | 计算检验 | 回看题意 |"
          : "| Step | Action | Note |\n|------|--------|------|\n| 1 | Model | Units |\n| 2 | Choose formula | Check conditions |\n| 3 | Compute | Verify |",
      },
      {
        type: "text",
        content: isZh
          ? "差异化：基础组巩固概念；标准组完成例题；挑战组拓展应用。"
          : "Differentiation: basic — concepts; standard — examples; challenge — applications.",
      },
    ],
    lessonPlan: [
      {
        phase: isZh ? "导入（8 分钟）" : "Starter (8 min)",
        durationMinutes: 8,
        activities: isZh
          ? [`复习与 ${topic} 相关的前置知识`, "提出本课核心问题"]
          : [`Review prerequisites for ${topic}`, "Pose the guiding question"],
        teacherScript: isZh
          ? `同学们，今天学习「${topic}」。先看我们已掌握什么，再进入新知识。`
          : `Today we study ${topic}. Let's activate prior knowledge first.`,
      },
      {
        phase: isZh ? "讲授与例题（22 分钟）" : "Teach & examples (22 min)",
        durationMinutes: 22,
        activities: isZh
          ? ["教师示范一道典型例题", "学生跟练一道同类题"]
          : ["Worked example on board", "Guided practice"],
        teacherScript: isZh
          ? "按：理解题意 → 选方法 → 规范书写 → 检验答案。"
          : "Understand → choose method → show working → check.",
      },
      {
        phase: isZh ? "巩固练习（20 分钟）" : "Practice (20 min)",
        durationMinutes: 20,
        activities: isZh
          ? ["完成习题单", "小组互评"]
          : ["Worksheet", "Peer review"],
      },
      {
        phase: isZh ? "总结（10 分钟）" : "Plenary (10 min)",
        durationMinutes: 10,
        activities: isZh
          ? ["学生自评学习目标", "出门测"]
          : ["Self-check", "Exit ticket"],
      },
    ],
    workedExamples: [
      {
        question: isZh
          ? `【${topic}】例题：根据所学方法完成一道标准题。`
          : `[${topic}] Standard worked example.`,
        difficulty: "standard",
      },
    ],
    worksheet: [
      {
        question: isZh ? `${topic} 基础练习 1` : `${topic} practice 1`,
        difficulty: "basic",
      },
      {
        question: isZh ? `${topic} 提高练习 2` : `${topic} practice 2`,
        difficulty: "standard",
      },
    ],
    answerKey: [
      {
        questionId: "ws-1",
        answer: isZh ? "见课堂讲解" : "See class notes",
      },
      {
        questionId: "ws-2",
        answer: isZh ? "见课堂讲解" : "See class notes",
      },
    ],
    commonMisconceptions: isZh
      ? ["概念混淆", "公式用错条件", "计算粗心"]
      : ["Concept confusion", "Wrong formula choice", "Arithmetic slips"],
    revisionNotes: isZh
      ? `复习 ${topic} 的定义、公式与典型题型。`
      : `Revise definitions, formulas, and standard question types for ${topic}.`,
    exitTicket: [
      {
        question: isZh ? `用一句话概括 ${topic} 的核心思想。` : `One-sentence summary of ${topic}.`,
      },
    ],
    homework: [
      {
        question: isZh ? "完成剩余习题；预习下一节" : "Finish exercises; preview next section",
      },
    ],
    cheatSheet: isZh ? `${topic} 要点速记` : `${topic} cheat sheet`,
    learningVisualLessons: [
      {
        title: isZh ? `${topic}：分步讲解` : `${topic}: step-by-step`,
        knowledgeGap: isZh
          ? `把「${topic}」拆成可演示的步骤`
          : `Break ${topic} into teachable steps`,
        steps: [
          {
            title: isZh ? "引入" : "Introduction",
            body: isZh ? `理解 ${topic} 的定义与符号。` : `Definitions and notation for ${topic}.`,
            visualType: "generic",
          },
          {
            title: isZh ? "关键方法" : "Key method",
            body: isZh ? "示范解题步骤并强调书写格式。" : "Model the solution steps clearly.",
            visualType: "formula_spotlight",
          },
          {
            title: isZh ? "易错点" : "Pitfalls",
            body: isZh ? "对照常见错误并纠正。" : "Compare with common mistakes.",
            visualType: "mistake_compare",
          },
        ],
        summary: isZh ? "概念 → 方法 → 练习 → 纠错。" : "Concept → method → practice → fix errors.",
      },
    ],
  };
}
