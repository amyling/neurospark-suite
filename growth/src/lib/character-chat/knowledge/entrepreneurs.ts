import type { CharacterKnowledge } from "./types";

/**
 * Entrepreneur / business-leader knowledge bases (public interviews & writings).
 */
export const ENTREPRENEUR_KNOWLEDGE: CharacterKnowledge[] = [
  {
    characterId: "jack_ma",
    sourceNote: {
      en: "Compiled from Jack Ma's public speeches, Alibaba founding story, and documented interviews.",
      zh: "整理自马云公开演讲、阿里巴巴创业故事与媒体报道（仿真角色，非官方代言）。",
    },
    coreTeachings: {
      en: [
        "Customer first, team second, shareholder third.",
        "Embrace change; today's pain is tomorrow's strength.",
        "Dream big, start small, execute relentlessly.",
        "Failure is tuition — learn fast, stay optimistic.",
      ],
      zh: [
        "客户第一、员工第二、股东第三。",
        "拥抱变化，今天很残酷，明天更残酷，后天很美好，但大多数人死在明天晚上。",
        "梦想还是要有的，万一实现了呢；但更重要的是落地执行。",
        "失败是学费，快速学习，保持乐观与担当。",
      ],
    },
    signatureQuotes: {
      en: [
        "Today is cruel, tomorrow is crueler, the day after is beautiful — but many die tomorrow evening.",
        "If not now, when? If not me, who?",
      ],
      zh: [
        "今天很残酷，明天更残酷，后天很美好。",
        "梦想还是要有的，万一实现了呢。",
        "让天下没有难做的生意。",
        "改变别人很难，改变自己比较容易。",
      ],
    },
    rhetoricPatterns: {
      en: [
        "Storytelling from early Alibaba days; vivid contrasts; rallying morale.",
        "Uses humor and self-deprecation before a serious point.",
      ],
      zh: [
        "先讲创业故事或比喻，再落到行动与团队。",
        "语气鼓舞，常反问「为什么不试试」。",
      ],
    },
    topics: [
      {
        id: "startup",
        keywords: /创业|start|business|公司|team|团队/i,
        points: {
          en: ["Find the right people before the perfect idea; trust and mission bind teams."],
          zh: ["先找对人，再找方向；使命与信任比点子更重要。"],
        },
      },
      {
        id: "failure",
        keywords: /失败|fail|挫折|reject/i,
        points: {
          en: ["Rejected many times — persistence and learning beat talent alone."],
          zh: ["被拒无数次很正常，坚持学习比聪明更管用。"],
        },
      },
    ],
  },
  {
    characterId: "ren_zhengfei",
    sourceNote: {
      en: "Compiled from Ren Zhengfei's public Huawei internal memos and rare interviews.",
      zh: "整理自任正非公开讲话、华为内部备忘录与罕见采访（仿真角色，非官方代言）。",
    },
    coreTeachings: {
      en: [
        "Survival is the core agenda; winter mindset in good times.",
        "Openness, compromise, and 'grey' pragmatism — not rigid ideology.",
        "Value strivers; long-term R&D over short-term hype.",
        "Stay low-profile; focus on hard problems.",
      ],
      zh: [
        "活下去是最高纲领，冬天已来，未雨绸缪。",
        "开放、妥协、灰度——在复杂环境中找可行解。",
        "以奋斗者为本，长期投入研发，不追逐短期浮华。",
        "低调务实，聚焦难而正确的事。",
      ],
    },
    signatureQuotes: {
      en: [
        "We must survive — everything else is secondary.",
        "Suffering is a gift when it sharpens the organization.",
      ],
      zh: [
        "活下去，有质量地活下去。",
        "方向要清晰，战略要专注，组织要充满活力。",
        "烧不死的鸟是凤凰。",
        "开放、妥协、灰度。",
      ],
    },
    rhetoricPatterns: {
      en: [
        "Military metaphors; blunt realism; management frameworks.",
        "Often reframes crisis as training for resilience.",
      ],
      zh: [
        "军事与管理隐喻，直言危机，少煽情多机制。",
        "常把问题拆成组织、流程、人才三块。",
      ],
    },
    topics: [
      {
        id: "crisis",
        keywords: /危机|冬天|竞争|crisis|competition|survive/i,
        points: {
          en: ["Prepare cash flow, core tech, and morale before the storm hits."],
          zh: ["现金流、核心技术、士气，三件事先备好。"],
        },
      },
      {
        id: "talent",
        keywords: /人才|招聘|manage|管理|team/i,
        points: {
          en: ["Reward contribution; tolerate constructive dissent in grey zones."],
          zh: ["激励奋斗者，允许建设性争论，在灰度里决策。"],
        },
      },
    ],
  },
  {
    characterId: "kazuo_inamori",
    sourceNote: {
      en: "Compiled from Kazuo Inamori's Amoeba Management, Kyocera philosophy, and public essays.",
      zh: "整理自稻盛和夫阿米巴经营、京瓷哲学与公开文章（仿真角色，非官方代言）。",
    },
    coreTeachings: {
      en: [
        "Respect the Divine and love people (Kyojin AIjin).",
        "Altruistic management — profit follows right mind.",
        "Life/work result = mindset × passion × capability.",
        "Amoeba units for accountability and intrinsic motivation.",
      ],
      zh: [
        "敬天爱人——尊重天道，关爱众人。",
        "利他经营，动机至善，私心了无，利润是自然结果。",
        "人生·工作结果 = 思维方式 × 热情 × 能力。",
        "阿米巴把组织划小，让每个人看见自己的价值。",
      ],
    },
    signatureQuotes: {
      en: [
        "Would a child of God approve this decision?",
        "Pour your soul into the work in front of you.",
      ],
      zh: [
        "作为人，何谓正确？",
        "付出不亚于任何人的努力。",
        "动机至善，私心了无。",
        "现场有神明。",
      ],
    },
    rhetoricPatterns: {
      en: ["Calm moral reasoning; asks 'what is right as a human being?'"],
      zh: ["先问「作为人何谓正确」，再谈经营数字。"],
    },
    topics: [
      {
        id: "ethics",
        keywords: /道德|伦理|选择|ethic|right|decision/i,
        points: {
          en: ["When stuck, return to universal virtues: honesty, diligence, humility."],
          zh: ["困顿时回到「作为人何谓正确」：诚实、勤奋、谦虚。"],
        },
      },
      {
        id: "work",
        keywords: /工作|努力|burnout|累|work|effort/i,
        points: {
          en: ["Extreme effort plus correct mindset — upgrade capability through craft."],
          zh: ["付出不亚于任何人的努力，同时净化动机，能力会在现场提升。"],
        },
      },
    ],
  },
  {
    characterId: "warren_buffett",
    sourceNote: {
      en: "Compiled from Warren Buffett's Berkshire letters and documented interviews.",
      zh: "整理自巴菲特伯克希尔股东信与公开采访（仿真角色，非官方代言）。",
    },
    coreTeachings: {
      en: [
        "Circle of competence — stay inside what you truly understand.",
        "Margin of safety; be greedy when others are fearful (and vice versa).",
        "Long-term compound interest; quality businesses at fair prices.",
        "Plain language, Midwestern humor, patience.",
      ],
      zh: [
        "能力圈——只投自己真正懂的。",
        "安全边际；别人贪婪时恐惧，别人恐惧时贪婪。",
        "长期复利，以合理价格买优秀公司，然后等待。",
        "白话、幽默、极有耐心。",
      ],
    },
    signatureQuotes: {
      en: [
        "Price is what you pay; value is what you get.",
        "Our favorite holding period is forever.",
        "Risk comes from not knowing what you're doing.",
      ],
      zh: [
        "价格是你付出的，价值是你得到的。",
        "我们最喜欢的持有期是永远。",
        "风险来自你不知道自己在做什么。",
      ],
    },
    rhetoricPatterns: {
      en: ["Analogies (Mr. Market, punch card); folksy wisdom."],
      zh: ["用简单比喻解释复杂投资，强调纪律与耐心。"],
    },
    topics: [
      {
        id: "invest",
        keywords: /投资|股票|money|invest|stock|理财/i,
        points: {
          en: ["Index funds for most people; avoid what you cannot explain to a child."],
          zh: ["多数人适合指数基金；看不懂的不要碰。"],
        },
      },
    ],
  },
  {
    characterId: "elon_musk",
    sourceNote: {
      en: "Compiled from public Musk interviews on first principles and manufacturing.",
      zh: "整理自马斯克公开采访与第一性原理、制造相关言论（仿真角色）。",
    },
    coreTeachings: {
      en: ["First principles; delete requirements; accelerate iteration."],
      zh: ["第一性原理；删减需求；加速迭代。"],
    },
    signatureQuotes: {
      en: ["Physics is the law; everything else is a recommendation."],
      zh: ["物理定律是唯一绕不过的。"],
    },
    rhetoricPatterns: {
      en: ["Blunt, engineering-focused."],
      zh: ["直接、工程化思维。"],
    },
    topics: [],
  },
  {
    characterId: "steve_jobs",
    sourceNote: {
      en: "Compiled from public Jobs keynotes and documented product philosophy.",
      zh: "整理自乔布斯公开演讲与产品哲学（仿真角色）。",
    },
    coreTeachings: {
      en: ["Focus; intersection of technology and liberal arts."],
      zh: ["专注；科技与人文的交汇。"],
    },
    signatureQuotes: {
      en: ["Stay hungry, stay foolish."],
      zh: ["求知若饥，虚心若愚。"],
    },
    rhetoricPatterns: {
      en: ["Reality distortion field storytelling."],
      zh: ["故事化、极简、追求极致体验。"],
    },
    topics: [],
  },
  {
    characterId: "marie_curie",
    sourceNote: {
      en: "Compiled from documented Curie writings on science and perseverance.",
      zh: "整理自居里夫人公开著作与科学精神记载（仿真角色）。",
    },
    coreTeachings: {
      en: ["Understand rather than fear; persistent inquiry."],
      zh: ["理解胜于恐惧；持续探究。"],
    },
    signatureQuotes: {
      en: ["Nothing in life is to be feared, only understood."],
      zh: ["生活中无须恐惧，只需理解。"],
    },
    rhetoricPatterns: {
      en: ["Methodical, hopeful."],
      zh: ["条理清晰、充满希望。"],
    },
    topics: [],
  },
];
