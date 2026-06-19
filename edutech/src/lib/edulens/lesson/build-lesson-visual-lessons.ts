import type { Locale } from "@/lib/i18n/types";
import type { LearningVisualLesson, RichContentBlock } from "../types";
import { buildTopicKnowledgeContext } from "../knowledge/retrieve-topic-knowledge";
import { detectLessonTopicCategory } from "./detect-lesson-topic";
import {
  isEmailWritingLesson,
  isWritingLesson,
} from "./detect-writing-lesson";
import { isChemistryLesson, isRelativityTopic } from "./lesson-visual-rules";

/**
 * Builds a default animated micro-lesson when the model omits learningVisualLessons.
 */
export function buildDefaultLessonVisualLessons(
  topic: string,
  teachingContent: RichContentBlock[] | undefined,
  locale: Locale,
  subject?: string,
  level = "Sec 3"
): LearningVisualLesson[] {
  const teachingText = (teachingContent ?? []).map((b) => b.content).join(" ");
  const category = detectLessonTopicCategory(topic, subject, teachingText);
  const isZh = locale === "zh";
  const knowledge = buildTopicKnowledgeContext(subject ?? "", level, topic);
  const topMatch = knowledge.matches[0]?.entry;

  if (isRelativityTopic(topic)) {
    return [
      isZh
        ? {
            title: `${topic}：从直觉到公式`,
            knowledgeGap: "需要把「同时性」与「时间膨胀」建立直观联系，再理解洛伦兹变换",
            steps: [
              {
                title: "没有绝对的同时性",
                body: "在狭义相对论中，两个事件是否「同时发生」取决于观察者的参考系。静止观察者看到的同一时刻，对高速运动的观察者可能并不同时。这是理解时间膨胀的第一步。",
                visualType: "physics_spacetime",
              },
              {
                title: "光钟思想实验",
                body: "想象光在两面镜子之间来回反射。对静止观察者，光走路径较短；对运动的观察者，光路径被拉长，因此一次「滴答」耗时更长——运动时钟走得更慢。",
                visualType: "physics_spacetime",
              },
              {
                title: "洛伦兹因子 γ",
                body: "γ = 1/√(1−v²/c²)。当 v 接近光速 c 时，γ 迅速增大，时间膨胀与长度收缩效应变得显著。代入 v=0.8c 可得 γ≈1.67。",
                visualType: "formula_spotlight",
                latex: "\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}",
              },
              {
                title: "时间膨胀公式",
                body: "运动参考系中测得的时间 Δt′ 与静止系中 Δt 的关系为 Δt = γΔt′。表格中的 0.8c 对应 γ≈1.67，故运动时钟约为静止时钟的 0.6 倍。",
                visualType: "formula_spotlight",
                latex: "t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)",
              },
              {
                title: "常见误区",
                body: "误区：认为「看到」变慢就是视觉延迟。正确理解：这是时空几何性质，不是信号传播延迟。光速不变原理是出发点，不是推导结果。",
                visualType: "mistake_compare",
              },
            ],
            summary: "同时性相对 → 光钟思想实验 → γ 与时间膨胀公式 → 区分视觉效应与物理效应。",
          }
        : {
            title: `${topic}: intuition to formulas`,
            knowledgeGap:
              "Connect simultaneity and time dilation before using the Lorentz transformation",
            steps: [
              {
                title: "No absolute simultaneity",
                body: "In special relativity, whether two events are simultaneous depends on the observer's frame. Events that are simultaneous for a rest observer need not be simultaneous for a moving observer.",
                visualType: "physics_spacetime",
              },
              {
                title: "Light-clock thought experiment",
                body: "Light bouncing between mirrors ticks slower when the clock moves because the light path is longer in the lab frame. This gives a concrete picture of time dilation.",
                visualType: "physics_spacetime",
              },
              {
                title: "Lorentz factor γ",
                body: "γ = 1/√(1−v²/c²). As v approaches c, γ grows quickly and dilation effects dominate. At v = 0.8c, γ ≈ 1.67.",
                visualType: "formula_spotlight",
                latex: "\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}",
              },
              {
                title: "Time-dilation equation",
                body: "Proper time and coordinate time are related by Δt = γΔt′. For v = 0.8c, a moving clock runs at about 0.6 of a rest clock — matching the table in the lesson.",
                visualType: "formula_spotlight",
                latex: "t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)",
              },
              {
                title: "Common mistakes",
                body: "Mistake: treating slowing as mere signal delay. Correct view: dilation is a spacetime effect following from the constancy of c, not from how fast light reaches you.",
                visualType: "mistake_compare",
              },
            ],
            summary:
              "Simultaneity is relative → light clock → γ and dilation → separate observation from geometry.",
          },
    ];
  }

  if (isChemistryLesson(topic, subject) && topMatch) {
    const concepts = topMatch.keyConcepts;
    const visuals = topMatch.visualTypes;
    return [
      isZh
        ? {
            title: `${topic}：${topMatch.section}`,
            knowledgeGap: `按 ${topMatch.syllabusRef} 分步建立概念`,
            steps: concepts.slice(0, 5).map((concept, index) => ({
              title: `要点 ${index + 1}`,
              body: `${concept} 结合「${topic}」课堂实例，引导学生观察、解释并用自己的话复述。`,
              visualType: visuals[Math.min(index, visuals.length - 1)] ?? "concept_process",
            })),
            summary: `回顾 ${topic} 的 ${topMatch.section} 核心要点与常见误区。`,
          }
        : {
            title: `${topic}: ${topMatch.section}`,
            knowledgeGap: `Step through ${topMatch.syllabusRef}`,
            steps: concepts.slice(0, 5).map((concept, index) => ({
              title: `Key point ${index + 1}`,
              body: `${concept} Link to "${topic}" with a classroom example; students explain in their own words.`,
              visualType: visuals[Math.min(index, visuals.length - 1)] ?? "concept_process",
            })),
            summary: `Review core ideas and pitfalls for ${topic} (${topMatch.section}).`,
          },
    ];
  }

  if (category === "calculus") {
    return [
      isZh
        ? {
            title: `${topic}：从面积到定积分`,
            knowledgeGap: "需要把曲边梯形面积与牛顿-莱布尼茨公式联系起来",
            steps: [
              {
                title: "建立坐标系",
                body: "在坐标平面上标出 $x$ 轴与 $y$ 轴。",
                visualType: "integral_area",
              },
              {
                title: "画出 y = f(x)",
                body: "描出被积函数在 $[a,b]$ 上的图像。",
                visualType: "integral_area",
              },
              {
                title: "曲边梯形面积",
                body: "定积分 $\\int_a^b f(x)\\,dx$ 是有向面积。",
                latex: "\\int_a^b f(x)\\,dx",
                visualType: "integral_area",
              },
              {
                title: "黎曼矩形逼近",
                body: "矩形越来越多，面积逼近积分值。",
                visualType: "integral_area",
              },
              {
                title: "牛顿-莱布尼茨公式",
                body: "$\\int_a^b f(x)\\,dx=F(b)-F(a)$。",
                latex: "\\int_a^b f(x)\\,dx=F(b)-F(a)",
                visualType: "integral_area",
              },
              {
                title: "常见错误",
                body: "定积分后加 $+C$、上下限颠倒。",
                visualType: "mistake_compare",
              },
            ],
            summary: "定积分 = 原函数在上限的值减去在下限的值。",
          }
        : {
            title: `${topic}: area to definite integral`,
            knowledgeGap: "Connect shaded area with the Fundamental Theorem",
            steps: [
              {
                title: "Set up axes",
                body: "Draw the $x$ and $y$ axes.",
                visualType: "integral_area",
              },
              {
                title: "Sketch y = f(x)",
                body: "Plot the curve on $[a,b]$.",
                visualType: "integral_area",
              },
              {
                title: "Shaded area",
                body: "The definite integral $\\int_a^b f(x)\\,dx$ is signed area.",
                latex: "\\int_a^b f(x)\\,dx",
                visualType: "integral_area",
              },
              {
                title: "Riemann sums",
                body: "Rectangles approximate the area under the curve.",
                visualType: "integral_area",
              },
              {
                title: "Fundamental Theorem",
                body: "$\\int_a^b f(x)\\,dx=F(b)-F(a)$.",
                latex: "\\int_a^b f(x)\\,dx=F(b)-F(a)",
                visualType: "integral_area",
              },
              {
                title: "Common mistakes",
                body: "Adding +C, reversed limits, ignoring domain.",
                visualType: "mistake_compare",
              },
            ],
            summary: "Definite integral = F(b) − F(a).",
          },
    ];
  }

  if (category === "quadratic") {
    return [
      isZh
        ? {
            title: `${topic}：图像与判别式`,
            knowledgeGap: "需要把代数式、图像特征与根的个数联系起来",
            steps: [
              {
                title: "认识抛物线",
                body: "二次函数 $y=ax^2+bx+c$ 的图像是抛物线。$a>0$ 开口向上，$a<0$ 开口向下。",
                latex: "y=ax^2+bx+c",
                visualType: "formula_spotlight",
                highlightVars: ["a", "b", "c"],
              },
              {
                title: "标出关键特征",
                body: "在图上标出顶点、对称轴，以及与 $x$ 轴的交点（若有）。",
                visualType: "parabola_graph",
              },
              {
                title: "用判别式判断根",
                body: "计算 $\\Delta=b^2-4ac$：$\\Delta>0$ 两不等实根；$\\Delta=0$ 重根；$\\Delta<0$ 无实根。",
                latex: "\\Delta=b^2-4ac",
                visualType: "equation_balance",
                highlightVars: ["\\Delta"],
              },
              {
                title: "常见误区",
                body: "只记公式不画图；符号写错；把顶点横坐标与截距混淆。",
                visualType: "mistake_compare",
              },
              {
                title: "课堂小结",
                body: "先判开口与顶点，再用判别式解释与 $x$ 轴交点个数。",
                visualType: "formula_spotlight",
              },
            ],
            summary: "图像特征与判别式要一起使用，才能完整理解二次函数。",
          }
        : {
            title: `${topic}: graph and discriminant`,
            knowledgeGap: "Connect the formula, graph features, and number of roots",
            steps: [
              {
                title: "Parabola shape",
                body: "A quadratic $y=ax^2+bx+c$ graphs as a parabola. $a>0$ opens up; $a<0$ opens down.",
                latex: "y=ax^2+bx+c",
                visualType: "formula_spotlight",
                highlightVars: ["a", "b", "c"],
              },
              {
                title: "Mark key features",
                body: "Label the vertex, axis of symmetry, and $x$-intercepts (if any).",
                visualType: "parabola_graph",
              },
              {
                title: "Use the discriminant",
                body: "Compute $\\Delta=b^2-4ac$: $\\Delta>0$ two roots; $\\Delta=0$ repeated root; $\\Delta<0$ no real roots.",
                latex: "\\Delta=b^2-4ac",
                visualType: "equation_balance",
                highlightVars: ["\\Delta"],
              },
              {
                title: "Common mistakes",
                body: "Memorising formulas without sketching; sign errors; mixing vertex and intercepts.",
                visualType: "mistake_compare",
              },
              {
                title: "Wrap-up",
                body: "Sketch first, then explain roots with $\\Delta$.",
                visualType: "formula_spotlight",
              },
            ],
            summary: "Always pair graph features with the discriminant.",
          },
    ];
  }

  if (isEmailWritingLesson(topic, subject)) {
    return [
      isZh
        ? {
            title: `${topic}：公务电邮写作步骤`,
            knowledgeGap: "掌握公务电邮的格式规范、内容要素与正式语气",
            steps: [
              {
                title: "明确目的与读者",
                body: "写电邮前先回答：写给谁？要对方做什么？公务电邮通常用于申请、汇报、建议或跟进。读者是老师、主管或校方人员时，语气应正式、礼貌。",
                visualType: "writing_structure",
              },
              {
                title: "写好主题行与称呼",
                body: "主题行要具体，例如「申请更换实验室投影仪」。称呼用 Dear Mr/Ms + 姓氏，避免 Hey 或 To whom it may concern（除非真的不知道收件人）。",
                visualType: "writing_structure",
              },
              {
                title: "正文：情况—影响—建议",
                body: "第一段说明写信目的。第二段交代具体情况（时间、地点、事件）。第三段说明影响或问题。第四段提出明确、可行的建议或请求，例如「能否在周五前安排更换？」",
                visualType: "writing_structure",
              },
              {
                title: "结尾敬语与署名",
                body: "用 Yours sincerely（知道姓名）或 Yours faithfully（不知姓名）。署名写全名、班级/部门。检查附件说明（如有）。",
                visualType: "writing_structure",
              },
              {
                title: "常见误区对照",
                body: "误区：语气像聊天、没有具体建议、漏写称呼或署名。正确：正式语气、每段有功能、结尾有明确行动请求。",
                visualType: "mistake_compare",
              },
            ],
            summary: "目的 → 主题与称呼 → 情况/影响/建议 → 敬语署名 → 检查语气与格式。",
          }
        : {
            title: `${topic}: official email writing`,
            knowledgeGap: "Learn format, content blocks, and formal tone for official emails",
            steps: [
              {
                title: "Purpose and audience",
                body: "Before writing, identify the reader and the action you need. Official emails request, report, suggest, or follow up. Use a formal, polite tone for teachers or administrators.",
                visualType: "writing_structure",
              },
              {
                title: "Subject line and salutation",
                body: "Make the subject specific, e.g. \"Request to replace lab projector\". Use Dear Mr/Ms + surname; avoid casual greetings like Hey.",
                visualType: "writing_structure",
              },
              {
                title: "Body: situation → impact → request",
                body: "Paragraph 1 states the purpose. Paragraph 2 gives facts (when, where, what happened). Paragraph 3 explains the impact. Paragraph 4 makes a clear, feasible request.",
                visualType: "writing_structure",
              },
              {
                title: "Closing and signature",
                body: "Use Yours sincerely (named recipient) or Yours faithfully (unknown). Sign with full name and class/department. Mention attachments if any.",
                visualType: "writing_structure",
              },
              {
                title: "Common mistakes",
                body: "Mistake: chatty tone, vague suggestions, missing salutation or signature. Correct: formal tone, purposeful paragraphs, and a clear call to action.",
                visualType: "mistake_compare",
              },
            ],
            summary: "Purpose → subject & salutation → body blocks → closing → check tone and format.",
          },
    ];
  }

  if (isWritingLesson(topic, subject)) {
    return [
      isZh
        ? {
            title: `${topic}：写作结构分步`,
            knowledgeGap: "把写作任务拆成可操作的段落与语言要求",
            steps: [
              {
                title: "审题与立意",
                body: `阅读题目要求，确定「${topic}」的写作目的、读者对象与体裁（记叙/说明/议论/应用文）。列出 2–3 个必须回答的问题。`,
                visualType: "concept_map",
              },
              {
                title: "列提纲",
                body: "按开头—展开—结尾列出要点。每一段只写一个中心意思，避免堆砌关键词。",
                visualType: "concept_map",
              },
              {
                title: "段落展开",
                body: "开头吸引读者或点明主题；中间用例子、细节或理由支撑；结尾总结或提出建议。",
                visualType: "writing_structure",
              },
              {
                title: "语言与格式",
                body: "检查用词是否准确、语气是否得体、标点与分段是否清楚。应用文还需核对格式项（称呼、日期、署名等）。",
                visualType: "writing_structure",
              },
              {
                title: "易错提醒",
                body: "误区：只列关键词、段落没有逻辑、语气与读者不匹配。正确：每段有中心句，例子具体，格式完整。",
                visualType: "mistake_compare",
              },
            ],
            summary: "审题 → 提纲 → 段落 → 语言格式 → 对照易错点修改。",
          }
        : {
            title: `${topic}: writing structure`,
            knowledgeGap: "Break the writing task into paragraphs and language choices",
            steps: [
              {
                title: "Understand the task",
                body: `Clarify the purpose, audience, and genre for "${topic}". List 2–3 questions the piece must answer.`,
                visualType: "concept_map",
              },
              {
                title: "Outline",
                body: "Plan introduction, body, and conclusion. One main idea per paragraph — avoid keyword lists without logic.",
                visualType: "concept_map",
              },
              {
                title: "Develop paragraphs",
                body: "Open with purpose or hook; support with examples and details; close with summary or recommendation.",
                visualType: "writing_structure",
              },
              {
                title: "Language and format",
                body: "Check word choice, tone, punctuation, and layout. For formal writing, verify salutation, date, and signature.",
                visualType: "writing_structure",
              },
              {
                title: "Common mistakes",
                body: "Mistake: keyword dumping, weak paragraph logic, wrong tone. Correct: topic sentences, concrete examples, complete format.",
                visualType: "mistake_compare",
              },
            ],
            summary: "Task → outline → paragraphs → language → revise against pitfalls.",
          },
    ];
  }

  return [
    isZh
      ? {
          title: `${topic}：分步讲解`,
          knowledgeGap: "把本课核心概念拆成可演示的步骤",
          steps: [
            {
              title: "引入概念",
              body: `今天我们学习「${topic}」的核心定义与符号。`,
              visualType: "generic",
            },
            {
              title: "关键公式",
              body: "先看公式，再代入具体数值或图像理解。",
              visualType: "formula_spotlight",
            },
            {
              title: "课堂例题",
              body: "跟着老师一步一步完成例题，注意书写格式。",
              visualType: "equation_balance",
            },
            {
              title: "易错提醒",
              body: "对照常见误区，检查自己是否犯了同样错误。",
              visualType: "mistake_compare",
            },
          ],
          summary: "概念 → 公式 → 例题 → 纠错，四步掌握本课要点。",
        }
      : {
          title: `${topic}: step-by-step`,
          knowledgeGap: "Break the core idea into teachable visual steps",
          steps: [
            {
              title: "Introduce the idea",
              body: `We focus on the key definition and notation for ${topic}.`,
              visualType: "generic",
            },
            {
              title: "Key formula",
              body: "Read the formula first, then connect it to a graph or numbers.",
              visualType: "formula_spotlight",
            },
            {
              title: "Worked example",
              body: "Follow each step on the board and keep notation tidy.",
              visualType: "equation_balance",
            },
            {
              title: "Watch for mistakes",
              body: "Compare your work with typical errors students make.",
              visualType: "mistake_compare",
            },
          ],
          summary: "Concept → formula → example → fix mistakes.",
        },
  ];
}
