import {
  EXTENDED_STYLES_EN,
  EXTENDED_STYLES_ZH,
} from "@/lib/character-chat/mock-styles-extended";
import type { Locale } from "@/types/locale";

export type ResponseStyle = {
  openers: string[];
  closers: string[];
  topicReplies: { pattern: RegExp; replies: string[] }[];
  fallback: string[];
};

const STYLES_EN: Record<string, ResponseStyle> = {
  elon_musk: {
    openers: ["Okay, first principles:", "Honestly?", "Look —"],
    closers: [
      "What's the actual bottleneck?",
      "Ship something small this week.",
      "Physics doesn't care about excuses.",
    ],
    topicReplies: [
      {
        pattern: /school|exam|study|grade|homework|考试|学习|成绩|作业/i,
        replies: [
          "Treat studying like engineering: break the problem, measure progress, iterate. What subject is the real constraint?",
          "Cramming is a bad process. What's one thing you could understand deeply instead of memorizing?",
        ],
      },
      {
        pattern: /future|career|job|dream|未来|职业|梦想/i,
        replies: [
          "Pick hard problems that matter. What would you work on if failure wasn't scary?",
          "Skills compound. What can you build or learn in the next 30 days that proves you're serious?",
        ],
      },
      {
        pattern: /afraid|scared|anxious|worry|害怕|焦虑|担心/i,
        replies: [
          "Fear often means the problem is important. Name the worst case — then design around it.",
          "Action reduces anxiety. What's the smallest step you can take in the next hour?",
        ],
      },
    ],
    fallback: [
      "Interesting. I'd attack it by questioning every assumption. What part is definitely true?",
      "Most people overestimate risk and underestimate iteration speed. What have you actually tried?",
    ],
  },
  steve_jobs: {
    openers: ["Here's what I see:", "Let me be direct:", "Think about this:"],
    closers: [
      "Make something you're proud of.",
      "Simplify until only the essential remains.",
      "The work will teach you who you are.",
    ],
    topicReplies: [
      {
        pattern: /creative|art|design|create|创作|设计|艺术/i,
        replies: [
          "Design is not how it looks — it's how it works and how it makes people feel. What experience are you really designing?",
          "Stay beginner-minded. What would this look like if you removed everything non-essential?",
        ],
      },
      {
        pattern: /fail|mistake|wrong|失败|错误/i,
        replies: [
          "You can't connect the dots looking forward. What did this failure teach you that success couldn't?",
          "Sometimes losing is the best thing that happens. What door might be opening?",
        ],
      },
    ],
    fallback: [
      "People don't know what they want until you show them something honest. What truth are you avoiding?",
      "Focus means saying no to a hundred good ideas. What is the one thing that matters here?",
    ],
  },
  dalai_lama: {
    openers: ["My dear friend,", "If I may share,", "With warmth,"],
    closers: [
      "Be kind to yourself as you would to a good friend.",
      "Small acts of compassion change the world — and your heart.",
      "We are all learning together.",
    ],
    topicReplies: [
      {
        pattern: /angry|hate|fight|conflict|生气|恨|冲突/i,
        replies: [
          "Anger often covers hurt. Can you look at the person — or yourself — with a little more understanding?",
          "If you can, try to wish them well, even quietly. It frees your own mind first.",
        ],
      },
      {
        pattern: /sad|lonely|alone|孤独|难过|伤心/i,
        replies: [
          "Loneliness is very human. Reach toward one person today — even a small hello matters.",
          "Your suffering is real, but you are not only your suffering. What small joy is still available?",
        ],
      },
    ],
    fallback: [
      "When we cannot change a situation, we can still change our response. What would compassion look like here?",
      "Happiness comes from your own actions and thoughts.",
    ],
  },
  pope_francis: {
    openers: ["My child,", "Listen,", "Remember:"],
    closers: [
      "God walks with those who feel lost — and so can we walk with each other.",
      "Do not be afraid to ask for help.",
      "Mercy begins when we stop pretending we are perfect.",
    ],
    topicReplies: [
      {
        pattern: /guilt|shame|sin|愧疚|羞耻/i,
        replies: [
          "You are loved before you are perfect. What weight can you lay down today?",
          "Mercy is courage to begin again. Who can accompany you?",
        ],
      },
      {
        pattern: /poor|unfair|justice|不公平|贫穷|正义/i,
        replies: [
          "We are called to see dignity in everyone. What small act of service is possible?",
          "Hope grows when we stand with others, not above them.",
        ],
      },
    ],
    fallback: [
      "What do you need most right now?",
      "Prayer can be honest conversation. Tell the truth about how you feel.",
    ],
  },
  buddha_teacher: {
    openers: ["Observe:", "Notice:", "Consider:"],
    closers: [
      "Return to the breath when the mind storms.",
      "This too will change.",
      "What remains when you stop clinging?",
    ],
    topicReplies: [
      {
        pattern: /stress|overwhelm|busy|压力|忙|累/i,
        replies: [
          "The mind adds a second arrow of suffering. Can you feel one breath without fixing everything?",
          "Like a river, thoughts pass. You are the bank, not every wave.",
        ],
      },
      {
        pattern: /want|desire|need|渴望|想要/i,
        replies: [
          "Craving whispers that fulfillment is always elsewhere. What is enough, right here?",
          "Hold the wish lightly, like a leaf on water.",
        ],
      },
    ],
    fallback: [
      "Can you sit with the question for three breaths?",
      "Suffering lessens when we see impermanence clearly. What are you gripping too tightly?",
    ],
  },
  marie_curie: {
    openers: ["Scientifically speaking,", "Let us examine:", "Curiosity asks:"],
    closers: [
      "Record what you learn — even failures are data.",
      "Perseverance turns obstacles into stepping stones.",
      "One careful step at a time.",
    ],
    topicReplies: [
      {
        pattern: /science|math|physics|化学|物理|数学|科学/i,
        replies: [
          "Form a hypothesis, test it small, revise. What is your next experiment?",
          "Understanding deepens when you teach others. Could you explain the problem to a friend?",
        ],
      },
      {
        pattern: /give up|quit|hard|放弃|太难/i,
        replies: [
          "Believe you are gifted for something. What gift are you cultivating through this difficulty?",
          "Do not let setbacks define your worth — let your response define your character.",
        ],
      },
    ],
    fallback: [
      "Which assumption might be wrong here?",
      "Be less afraid of the unknown — be curious about it.",
    ],
  },
};

const STYLES_ZH: Record<string, ResponseStyle> = {
  elon_musk: {
    openers: ["好，从第一性原理说起：", "老实说，", "听着——"],
    closers: [
      "真正的瓶颈是什么？",
      "这周先做出一个小成果。",
      "物理定律不会为你的借口让步。",
    ],
    topicReplies: [
      {
        pattern: /school|exam|study|grade|homework|考试|学习|成绩|作业/i,
        replies: [
          "把学习当工程：拆解问题、量化进度、迭代。哪门课才是真正的约束？",
          "死记硬背是糟糕流程。有哪一件事你可以真正理解，而不是硬背？",
        ],
      },
      {
        pattern: /future|career|job|dream|未来|职业|梦想/i,
        replies: [
          "选值得解决的难题。如果不怕失败，你会做什么？",
          "技能会复利。未来30天你能做出什么来证明你是认真的？",
        ],
      },
      {
        pattern: /afraid|scared|anxious|worry|害怕|焦虑|担心/i,
        replies: [
          "恐惧往往说明这事很重要。最坏情况是什么？然后设计应对路径。",
          "行动能缓解焦虑。下一小时你能做的最小一步是什么？",
        ],
      },
    ],
    fallback: [
      "有意思。我会质疑每个假设。哪一部分是确定无疑的？",
      "多数人高估风险、低估迭代速度。你实际试过什么？",
    ],
  },
  steve_jobs: {
    openers: ["我看到的是：", "我直说吧：", "想一想："],
    closers: [
      "做出让你骄傲的东西。",
      "简化到只剩本质。",
      "工作会教会你是谁。",
    ],
    topicReplies: [
      {
        pattern: /creative|art|design|create|创作|设计|艺术/i,
        replies: [
          "设计不是外观，而是如何运作、如何让人感受。你真正在设计什么体验？",
          "保持初学者心态。若去掉一切非必要，会剩下什么？",
        ],
      },
      {
        pattern: /fail|mistake|wrong|失败|错误/i,
        replies: [
          "向前看时无法连起那些点。这次失败教会了你什么，是成功教不会的？",
          "有时失去反而是最好的事。哪扇门可能正在打开？",
        ],
      },
    ],
    fallback: [
      "人们不知道自己要什么，直到你展示真诚的东西。你在回避什么真相？",
      "专注就是对一百个好主意说不。此刻最重要的是什么？",
    ],
  },
  dalai_lama: {
    openers: ["亲爱的朋友，", "若我可以分享，", "带着温暖，"],
    closers: [
      "像对待好友一样善待自己。",
      "微小的慈悲能改变世界，也能温暖你的心。",
      "我们都在一起学习。",
    ],
    topicReplies: [
      {
        pattern: /angry|hate|fight|conflict|生气|恨|冲突/i,
        replies: [
          "愤怒常掩盖伤痛。能否对对方——或对自己——多一分理解？",
          "若可以，默默祝愿对方安好，你的心会先自由起来。",
        ],
      },
      {
        pattern: /sad|lonely|alone|孤独|难过|伤心/i,
        replies: [
          "孤独很常见。今天向一个人靠近——哪怕一声问候也有意义。",
          "你的痛苦是真实的，但你不仅是痛苦。还有什么小确幸仍在？",
        ],
      },
    ],
    fallback: [
      "若不能改变处境，仍可改变回应。此刻慈悲是什么样子？",
      "幸福来自自己的行动与念头。",
    ],
  },
  pope_francis: {
    openers: ["孩子，", "听着，", "记住："],
    closers: [
      "天主与迷失者同行——我们也可以彼此陪伴。",
      "不要害怕求助。",
      "慈悲从承认我们不完美开始。",
    ],
    topicReplies: [
      {
        pattern: /guilt|shame|sin|愧疚|羞耻/i,
        replies: [
          "你在完美之前就被爱了。今天能放下什么重担？",
          "慈悲不是软弱，而是重新开始的勇气。谁能陪伴你？",
        ],
      },
      {
        pattern: /poor|unfair|justice|不公平|贫穷|正义/i,
        replies: [
          "我们被召唤看见每个人的尊严。今天能做哪件小小的服务？",
          "希望在我们与他人并肩而立时生长。",
        ],
      },
    ],
    fallback: [
      "你现在最需要什么？",
      "祈祷可以是诚实的对话。说出你真实的感受。",
    ],
  },
  buddha_teacher: {
    openers: ["观察：", "注意：", "想想："],
    closers: [
      "心起风暴时，回到呼吸。",
      "这一切也会变化。",
      "放下执著后，还剩下什么？",
    ],
    topicReplies: [
      {
        pattern: /stress|overwhelm|busy|压力|忙|累/i,
        replies: [
          "心常在痛之上再加一支箭。能否先感受一次呼吸，而不急着解决一切？",
          "念头如河水流过，你是河岸，不是每一朵浪。",
        ],
      },
      {
        pattern: /want|desire|need|渴望|想要/i,
        replies: [
          "渴爱低语：满足总在别处。此刻什么是足够的？",
          "轻轻托住愿望，像托住水面上的叶子。",
        ],
      },
    ],
    fallback: [
      "能否与这个问题共处三次呼吸？",
      "看清无常，苦就会减轻。你抓得太紧的是什么？",
    ],
  },
  marie_curie: {
    openers: ["从科学角度说，", "我们来分析：", "好奇心问："],
    closers: [
      "记录所学——失败也是数据。",
      "坚持能把障碍变成台阶。",
      "一步一步来。",
    ],
    topicReplies: [
      {
        pattern: /science|math|physics|化学|物理|数学|科学/i,
        replies: [
          "提出假设，小规模验证，再修正。你的下一个实验是什么？",
          "教别人能加深理解。能否向朋友解释这个问题？",
        ],
      },
      {
        pattern: /give up|quit|hard|放弃|太难/i,
        replies: [
          "相信自己为某事而生。这份困难正在磨练你什么天赋？",
          "别让挫折定义你的价值——让你的回应定义你的品格。",
        ],
      },
    ],
    fallback: [
      "哪个假设可能是错的？",
      "别那么怕未知——对未知保持好奇。",
    ],
  },
};

/**
 * Returns mock reply styles for the target reply language.
 */
export function getMockStyles(replyLang: Locale): Record<string, ResponseStyle> {
  return replyLang === "zh"
    ? { ...STYLES_ZH, ...EXTENDED_STYLES_ZH }
    : { ...STYLES_EN, ...EXTENDED_STYLES_EN };
}
