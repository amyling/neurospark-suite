import type { ResponseStyle } from "@/lib/character-chat/mock-styles";

export const EXTENDED_STYLES_EN: Record<string, ResponseStyle> = {
  jingkong_master: {
    openers: ["Amituofo, my friend,", "Let us be honest:", "Gently speaking,"],
    closers: [
      "Recite honestly every day — that is enough to begin.",
      "One door, deep entry; do not scatter your mind.",
    ],
    topicReplies: [
      {
        pattern: /念佛|净土|烦恼|nianfo|pure land|worry/i,
        replies: [
          "Return to the Buddha's name when the mind wanders — gently, again and again.",
          "Faith, vow, and practice together; wish sincerely to reach the Pure Land.",
        ],
      },
    ],
    fallback: [
      "Change the mind first; miracles are not the point.",
      "Filial piety and repentance support recitation.",
    ],
  },
  xuanhua_master: {
    openers: ["Listen well!", "I tell you plainly:", "Do not fool yourself —"],
    closers: [
      "No fighting, no greed, no seeking — start there.",
      "If you fear hardship, how will you finish the journey?",
    ],
    topicReplies: [
      {
        pattern: /懒|贪|戒|lazy|greed|precept/i,
        replies: [
          "Hold one precept today with your whole body — speech counts.",
          "Greed freezes the heart; give something away before you sleep.",
        ],
      },
    ],
    fallback: [
      "Cultivation is what you do when nobody applauds.",
      "Stop lying to yourself — the Way is not comfortable.",
    ],
  },
  hsing_yun_master: {
    openers: ["Friend,", "In Humanistic Buddhism,", "Consider this —"],
    closers: [
      "Give faith, joy, hope, and convenience.",
      "Do good deeds, speak good words, keep a good heart.",
    ],
    topicReplies: [
      {
        pattern: /生活|家庭|工作|压力|family|work|stress/i,
        replies: [
          "Practice kindness where you already stand — that is daily Dharma.",
          "Do not trouble others; do not trouble yourself unnecessarily.",
        ],
      },
    ],
    fallback: [
      "Bring Buddhism into life, not only into temples.",
      "Even difficulty can train compassion and wisdom.",
    ],
  },
  jack_ma: {
    openers: ["Let me tell you a story:", "At Alibaba we learned:", "Be honest —"],
    closers: [
      "Dream big, execute small, persist long.",
      "Customer first — always.",
    ],
    topicReplies: [
      {
        pattern: /创业|团队|失败|start|team|fail/i,
        replies: [
          "The right team beats the perfect idea on paper.",
          "If you have not failed lately, you are not trying hard enough.",
        ],
      },
    ],
    fallback: [
      "Embrace change before it embraces you.",
      "Today is hard; tomorrow harder; the day after is beautiful for survivors.",
    ],
  },
  ren_zhengfei: {
    openers: ["Fact:", "From a survival view,", "Organizationally,"],
    closers: [
      "Prepare for winter while the sun shines.",
      "Focus on core capability, not noise.",
    ],
    topicReplies: [
      {
        pattern: /危机|管理|竞争|crisis|manage|compete/i,
        replies: [
          "Cash flow, core tech, morale — rank them honestly for your situation.",
          "Openness, compromise, grey — find the workable path.",
        ],
      },
    ],
    fallback: [
      "Strivers must see reward; slack must not poison the team.",
      "Survive first, then win elegantly.",
    ],
  },
  kazuo_inamori: {
    openers: ["As a human being,", "In the workplace,", "Quietly consider:"],
    closers: [
      "Pour sincere effort into what is in front of you.",
      "Ask if your motive is truly altruistic.",
    ],
    topicReplies: [
      {
        pattern: /工作|道德|选择|work|ethic|choose/i,
        replies: [
          "What is correct? Choose honesty and diligence when no one watches.",
          "Mindset × passion × capability — upgrade all three daily.",
        ],
      },
    ],
    fallback: [
      "Respect heaven, love people — profit follows right mind.",
      "The gemba teaches what spreadsheets hide.",
    ],
  },
  warren_buffett: {
    openers: ["Simply put,", "Mr. Market reminds us:", "In my view,"],
    closers: [
      "Stay inside your circle of competence.",
      "Time and compound interest are allies of patience.",
    ],
    topicReplies: [
      {
        pattern: /投资|股票|钱|invest|stock|money/i,
        replies: [
          "If you cannot explain it simply, do not buy it.",
          "Margin of safety — price is paid, value is received.",
        ],
      },
    ],
    fallback: [
      "Be fearful when others are greedy, and greedy when others are fearful.",
      "Our favorite holding period is forever — for wonderful businesses.",
    ],
  },
};

export const EXTENDED_STYLES_ZH: Record<string, ResponseStyle> = {
  jingkong_master: {
    openers: ["阿弥陀佛，", "老实跟你说，", "慈悲地提醒你，"],
    closers: ["老实念佛，一门深入，自然有受用。", "先从十声佛号做起，持之以恒。"],
    topicReplies: [
      {
        pattern: /念佛|净土|烦恼|焦虑|nianfo/i,
        replies: [
          "念头来了，轻轻回到佛号，不要跟烦恼较劲。",
          "信愿行要真，求生净土的心不能含糊。",
        ],
      },
    ],
    fallback: [
      "改心换面，从孝亲尊师、忏悔持戒做起。",
      "不要杂修杂证，先把念佛念到心里去。",
    ],
  },
  xuanhua_master: {
    openers: ["听着！", "我直说了，", "不要骗自己——"],
    closers: ["不争、不贪、不求，从今天做起。", "怕苦怕累，怎么能了生死？"],
    topicReplies: [
      {
        pattern: /懒|贪|戒|说谎|欲望/i,
        replies: [
          "今天守住一条戒，说话算数，就是修行。",
          "贪心一起，道心就冷，多布施、少占有。",
        ],
      },
    ],
    fallback: [
      "修行是没人鼓掌时你还在做。",
      "不要空谈，用行为证明。",
    ],
  },
  hsing_yun_master: {
    openers: ["朋友，", "人间佛教讲，", "不妨这样想，"],
    closers: ["给人信心、欢喜、希望、方便。", "做好事、说好话、存好心。"],
    topicReplies: [
      {
        pattern: /生活|家庭|工作|压力/i,
        replies: [
          "在当下的家里、岗位上，先多一句好话、一件善事。",
          "不麻烦别人，也不麻烦自己。",
        ],
      },
    ],
    fallback: [
      "把佛法用在生活，不是挂在嘴上。",
      "困难里也能培养慈悲与智慧。",
    ],
  },
  jack_ma: {
    openers: ["我讲个故事，", "在阿里巴巴时，", "说句实话，"],
    closers: ["梦想要有，行动更要有。", "客户第一，拥抱变化。"],
    topicReplies: [
      {
        pattern: /创业|团队|失败|梦想/i,
        replies: [
          "先找对人，再找方向，使命比点子重要。",
          "失败是学费，被拒绝很正常，关键是学到什么。",
        ],
      },
    ],
    fallback: [
      "今天很残酷，明天更残酷，后天很美好——但要熬过明天晚上。",
      "改变别人难，改变自己容易一点。",
    ],
  },
  ren_zhengfei: {
    openers: ["实话讲，", "从生存角度，", "组织上，"],
    closers: ["冬天来了，未雨绸缪。", "聚焦核心能力，别被噪音带走。"],
    topicReplies: [
      {
        pattern: /危机|管理|竞争|人才/i,
        replies: [
          "现金流、核心技术、士气——按你的情况排优先级。",
          "开放、妥协、灰度，在复杂里找可行解。",
        ],
      },
    ],
    fallback: [
      "奋斗者要看到回报，混日子会拖累全队。",
      "先活下去，再谈漂亮胜利。",
    ],
  },
  kazuo_inamori: {
    openers: ["作为人，", "在工作现场，", "静心想一想，"],
    closers: ["付出不亚于任何人的努力。", "动机至善，私心了无。"],
    topicReplies: [
      {
        pattern: /工作|道德|选择|努力/i,
        replies: [
          "何谓正确？选诚实、勤奋，即使没人看见。",
          "人生·工作结果 = 思维方式 × 热情 × 能力。",
        ],
      },
    ],
    fallback: [
      "敬天爱人，利润是正确心的结果。",
      "现场有神明，把手头事做到极致。",
    ],
  },
  warren_buffett: {
    openers: ["简单说，", "市场先生告诉我们，", "我的看法是，"],
    closers: ["待在能力圈里。", "时间和复利是朋友。"],
    topicReplies: [
      {
        pattern: /投资|股票|钱|理财/i,
        replies: [
          "看不懂的不要碰，能向孩子解释清楚再买。",
          "价格是付出的，价值是得到的——留安全边际。",
        ],
      },
    ],
    fallback: [
      "别人贪婪时恐惧，别人恐惧时贪婪——但前提是懂。",
      "最喜欢的持有期是永远，前提是伟大公司。",
    ],
  },
};
