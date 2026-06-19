import type { Dictionary } from "./dictionary";

export const en: Dictionary = {
  meta: {
    title: "YouthMentor AI | Student Wellbeing Reflection",
    description:
      "A safe digital mentor prototype for mood check-ins, structured reflection, and crisis guardrails.",
  },
  landing: {
    badge: "YouthMentor AI · Growth",
    title: "Student wellbeing & character chat",
    portNote:
      "This app runs on port 3007 (not 3000 or 3006). Choose a section below.",
    mentorLink: "YouthMentor home",
    charactersLink: "Character chat (Character AI style)",
    edutechNote: "EduTech sibling app",
  },
  lang: { switchLabel: "Language", en: "English", zh: "中文" },
  nav: {
    home: "Home",
    characters: "Characters",
    checkIn: "Check-in",
    reflection: "Reflection",
    mentor: "Mentor",
    actions: "Actions",
    safety: "Safety",
    history: "History",
    settings: "Settings",
  },
  layout: {
    badge: "Student wellbeing prototype",
    appName: "YouthMentor AI",
    tagline: "A safe reflection tool — not therapy or emergency care.",
    footer:
      "YouthMentor does not diagnose, treat, or replace counsellors. If you are unsafe, talk to a trusted adult or call emergency services.",
    navAria: "YouthMentor navigation",
  },
  flow: {
    steps: [
      "Mood check-in",
      "Stress & mentor",
      "Reflection",
      "Mentor response",
      "Action plan",
      "Safety",
      "Save",
    ],
  },
  common: {
    back: "Back",
    continue: "Continue",
    startCheckIn: "Start mood check-in",
    viewHistory: "View history",
    goToCheckIn: "Go to check-in",
    goToReflection: "Go to reflection",
    intensityMild: "Mild",
    intensityStrong: "Very strong",
    delete: "Delete",
    optional: "optional",
  },
  home: {
    title: "Your calm space to reflect",
    intro:
      "YouthMentor helps you check in on your mood, choose an original digital mentor, complete a structured reflection, and pick small positive actions. It is not therapy — it encourages help-seeking when needed.",
    flowList: [
      "Mood check-in & stress source",
      "Choose mentor style",
      "Guided reflection prompts",
      "Structured mentor response",
      "Action plan & safety review",
      "Save to your local history",
    ],
    demoHint:
      "After loading a demo, continue from Check-in → Reflection to see the full flow.",
    safetyDemoLink: "Safety demo (DSA highlight)",
  },
  safetyDemo: {
    title: "Safety guardrail demo",
    subtitle:
      "Shows how YouthMentor blocks normal coaching when high-risk language is detected.",
    whyTitle: "Why this matters",
    whyBody:
      "Youth wellbeing apps must not rely on the LLM alone for crisis detection. This demo uses a keyword layer plus classifier before any mentor prompt runs.",
    stepsTitle: "Demo steps",
    steps: [
      "Click Run safety demo — reflection answers are pre-filled with a high-risk sample.",
      "On the Reflection page, click Get mentor response.",
      "You are redirected to Safety — only crisis resources are shown, no coaching reply.",
      "Review matched keywords and classifier reason at the bottom of the panel.",
    ],
    runButton: "Run safety demo",
    openReflection: "Go to reflection (after loading demo)",
    note: "Sample text is fictional and for testing guardrails only. If you are in crisis, contact a trusted adult or emergency services immediately.",
  },
  checkIn: {
    title: "Mood check-in",
    subtitle: "How are you feeling right now? There are no wrong answers.",
    moodLabel: "Your mood",
    intensityLabel: "How strong is this feeling?",
    stressLabel: "What is stressing you most?",
    freeTextLabel: "Anything else you want to note?",
    freeTextPlaceholder: "A few words about today…",
    mentorLabel: "Choose your mentor style",
    continueReflection: "Continue to reflection",
  },
  reflection: {
    title: "Guided reflection",
    subtitle:
      "Answer each prompt thoughtfully. This is structured reflection — not endless chat.",
    submit: "Get mentor response",
    submitting: "Checking safety…",
    needCheckIn: "Please complete your mood check-in first.",
  },
  reflectionPrompts: [
    {
      key: "whatHappened",
      label: "1. What happened?",
      placeholder: "Describe the situation in your own words…",
    },
    {
      key: "whatFelt",
      label: "2. What did you feel?",
      placeholder: "Name the feelings you noticed…",
    },
    {
      key: "worseThought",
      label: "3. What thought made it worse?",
      placeholder: "The thought that pulled you down…",
    },
    {
      key: "anotherView",
      label: "4. Is there another way to view the situation?",
      placeholder: "A kinder or fairer perspective…",
    },
    {
      key: "smallAction",
      label: "5. What is one small helpful action you can take today?",
      placeholder: "Something tiny but real…",
    },
    {
      key: "trustedPerson",
      label: "6. Who is one trusted person you can talk to if needed?",
      placeholder: "Parent, teacher, counsellor, friend…",
    },
  ],
  mentorChat: {
    title: "Mentor response",
    subtitle:
      "Structured guidance only — not open-ended chat. One response per reflection session.",
    watchNotice:
      "We noticed some heavy feelings. Please consider telling a trusted adult soon.",
    needReflection: "Complete your reflection to receive a structured mentor response.",
    buildActionPlan: "Build action plan",
  },
  mentorCard: {
    title: "Mentor response",
    trustedNamed: "Trusted person you named",
    sections: {
      heard: "You are heard",
      summary: "Reflection summary",
      reframe: "Reframed thought",
      encouragement: "Encouragement",
      seekHelp: "When to seek help",
      followUp: "Follow-up",
      actions: "Small action steps",
    },
    badges: { watch: "Extra care", normal: "Normal" },
  },
  actionPlan: {
    title: "Your action plan",
    subtitle:
      "Small steps matter. Check off what you try today — no pressure to finish everything.",
    paused: "Action planning is paused during safety escalation.",
    viewSafety: "View safety resources",
    safetyCheck: "Safety check",
    empty: "Complete a reflection first to receive action steps.",
  },
  safety: {
    title: "Safety check",
    subtitle: "Review resources and confirm you know when to seek real-world help.",
    normalIntro:
      "Your reflection was assessed as within normal coaching scope. If you ever feel unsafe, stop using the app and talk to a trusted adult immediately.",
    normalList: [
      "Talk to a trusted adult if feelings stay very strong",
      "Contact your school counsellor for ongoing support",
      "Call emergency services if anyone is in immediate danger",
    ],
    save: "Save reflection",
    saved: "Saved locally. You can delete it anytime in History.",
    newSession: "Start new session",
    detection: "Detection",
    keywords: "Keywords",
  },
  history: {
    title: "Reflection history",
    subtitle:
      "Saved only on this device. Delete any entry whenever you want — minimal data stored.",
    empty: "No saved reflections yet. Complete a check-in flow to save one.",
    highRiskNote:
      "Safety guardrail activated — crisis resources shown, no coaching saved.",
    backHome: "Back to home",
    intensity: "intensity",
    blockedSummary: "Safety session — see Safety page for resources.",
  },
  demo: {
    title: "Try a demo case",
    subtitle:
      "Pre-filled examples for school demos. High-risk sample shows safety guardrails only.",
    cases: {
      exam_stress: {
        title: "Exam stress",
        description: "Worried about upcoming tests and feeling overwhelmed.",
        freeText: "I have two exams this week and I cannot focus.",
        answers: {
          whatHappened:
            "I studied late but still feel unprepared for my math exam.",
          whatFelt: "stressed and anxious",
          worseThought: "I will fail and disappoint everyone.",
          anotherView: "One exam is a checkpoint, not my whole future.",
          smallAction: "Review one topic for 20 minutes, then stop.",
          trustedPerson: "my form teacher",
        },
      },
      friendship_conflict: {
        title: "Friendship conflict",
        description: "Feeling left out after a disagreement with friends.",
        freeText: "My friends ignored me at recess after we argued.",
        answers: {
          whatHappened: "We argued about a group project and they walked away.",
          whatFelt: "hurt and lonely",
          worseThought: "Nobody wants me in the group anymore.",
          anotherView: "Friendships can repair with honest, calm conversation.",
          smallAction: "Ask one friend if we can talk after school.",
          trustedPerson: "my mum",
        },
      },
      procrastination: {
        title: "Procrastination",
        description: "Putting off homework and feeling guilty.",
        freeText: "I keep scrolling instead of starting assignments.",
        answers: {
          whatHappened: "I planned to start homework at 4pm but started at 9pm.",
          whatFelt: "guilty and drained",
          worseThought: "I am lazy and will never catch up.",
          anotherView: "Starting small still counts as progress.",
          smallAction: "Set a 10-minute timer and begin the easiest task.",
          trustedPerson: "my older sibling",
        },
      },
      low_confidence: {
        title: "Low confidence",
        description: "Doubting abilities after a tough lesson.",
        freeText: "Science class was hard and I felt stupid.",
        answers: {
          whatHappened: "I could not answer questions in class today.",
          whatFelt: "embarrassed and doubtful",
          worseThought: "I am not smart enough for this subject.",
          anotherView: "Struggling means my brain is learning, not failing.",
          smallAction: "Write down one question to ask tomorrow.",
          trustedPerson: "my science teacher",
        },
      },
      high_risk: {
        title: "High-risk sample (safety demo)",
        description:
          "Triggers safety guardrails — no normal coaching response is shown.",
        freeText: "I want to hurt myself and I do not see the point of living.",
        answers: {
          whatHappened: "Everything feels too heavy and I cannot cope.",
          whatFelt: "hopeless",
          worseThought: "I want to end it all tonight.",
          anotherView: "",
          smallAction: "",
          trustedPerson: "school counsellor",
        },
      },
    },
  },
  moods: {
    happy: "Happy",
    calm: "Calm",
    stressed: "Stressed",
    anxious: "Anxious",
    sad: "Sad",
    angry: "Angry",
    tired: "Tired",
    confused: "Confused",
  },
  stress: {
    exam: "Exams",
    homework: "Homework",
    friendship: "Friendship",
    family: "Family",
    teacher: "Teacher",
    cca: "CCA",
    future: "Future",
    self_confidence: "Self-confidence",
    other: "Other",
  },
  personas: {
    study_coach: {
      title: "Study Coach",
      description: "Practical plans for exams and procrastination.",
      tone: "Structured & action-focused",
    },
    mindful_mentor: {
      title: "Mindful Mentor",
      description: "Calm grounding for stress and overwhelm.",
      tone: "Breathing & reflection",
    },
    scientist_mentor: {
      title: "Scientist Mentor",
      description: "Curious problem-solving for learning doubts.",
      tone: "Analytical & curious",
    },
    kindness_mentor: {
      title: "Kindness Mentor",
      description: "Gentle support for sadness and friendship pain.",
      tone: "Warm & compassionate",
    },
    wisdom_mode: {
      title: "Wisdom Mode",
      description: "Values like courage, patience, and hope — no religion claims.",
      tone: "Values-based guidance",
    },
  },
  mentorGen: {
    defaultTrusted: "a trusted adult you choose",
    somethingDifficult: "something difficult",
    sharedHappened: "You shared that {what} happened.",
    felt: "You felt {feeling}.",
    toughThought: 'A tough thought was: "{thought}".',
    reframe: {
      study_coach:
        "One setback does not define your whole journey. You can plan the next small step.",
      mindful_mentor:
        "Feelings are visitors — intense now, but they can soften when you breathe and ground yourself.",
      scientist_mentor:
        "Let's treat this as data: one hard moment is a sample, not the whole experiment of who you are.",
      kindness_mentor:
        "You deserve kindness, especially from yourself. What happened hurts — and you still matter.",
      wisdom_mode:
        "Courage can look like asking for help. Patience with yourself is a form of strength.",
    },
    watchHelp:
      "Because some of your words sound very heavy, please tell a trusted adult soon — even if things feel a bit better later.",
    normalHelp:
      "If feelings stay strong for several days, or you feel unsafe, talk to a trusted adult or school counsellor.",
    validation:
      "Thank you for being honest with {persona}. Feeling {mood} about {stress} makes sense — many students feel this way.",
    followUp:
      "Tomorrow, notice one small moment that went okay — even a tiny one counts.",
    encouragement: {
      study_coach:
        "You are building skills step by step. Progress beats perfection.",
      mindful_mentor:
        "You showed awareness by checking in. That is real emotional strength.",
      scientist_mentor:
        "Curiosity about your own mind is a superpower — keep investigating with care.",
      kindness_mentor:
        "You are not alone in feeling this. Gentle steps still move you forward.",
      wisdom_mode:
        "Hope grows in small moments. You took one today by reflecting here.",
    },
    actionExtras: {
      study_coach: [
        "Break one task into a 15-minute starter block.",
        "Write tomorrow's top one study priority on a sticky note.",
      ],
      mindful_mentor: [
        "Try 4-7-8 breathing: inhale 4, hold 7, exhale 8 — repeat three times.",
        "Step outside for two minutes and notice three calm sights.",
      ],
      scientist_mentor: [
        "List one thing you learned from today, even if it was hard.",
        "Ask one question to a teacher or friend about what confuses you.",
      ],
      kindness_mentor: [
        "Send a kind message to yourself in your notes app.",
        "Do one gentle thing you enjoy for ten minutes.",
      ],
      wisdom_mode: [
        "Write one value you want to practice today (e.g. courage, patience).",
        "Thank one person who helped you recently — including yourself.",
      ],
    },
    examPackBag: "Pack your bag tonight so morning feels calmer.",
  },
  risk: {
    highKeyword: "High-risk keywords detected in user input.",
    watchKeyword: "Concerning language detected; extra care recommended.",
    noKeyword: "No crisis keywords detected.",
    severeHopeless:
      "Classifier flagged severe hopelessness combined with distress language.",
    normalScope: "Classifier assessed input as within normal coaching scope.",
    crisisMessage:
      "I'm sorry you're going through this. This tool cannot handle emergencies or replace real support. Please contact a trusted adult, parent, teacher, school counsellor, or local emergency service immediately. If you are in immediate danger, call emergency services now.",
  },
  crisisPanel: {
    title: "Safety support",
    talkAdult: "Talk to a trusted adult now",
    counsellor: "Contact school counsellor",
    emergency: "Emergency help",
    adultTitle: "Talk to a trusted adult now",
    adultBody:
      "Reach out to a parent, guardian, family member, or teacher you trust. Tell them clearly how you are feeling — you deserve real-world support.",
    counsellorTitle: "Contact school counsellor",
    counsellorBody:
      "School counsellors are trained to help students in distress. Ask a teacher or front office how to book a session today.",
    emergencyTitle: "Emergency help",
    emergencyBody:
      "If you or someone else is in immediate danger, call your local emergency number right away (for example 999 or 911). Do not wait for an app to respond.",
    coachingPaused:
      "Normal mentor coaching is paused when high-risk language is detected.",
  },
  safetyBanner: {
    important: "Important",
    text: "YouthMentor is a reflection and encouragement tool. It does not diagnose mental illness, replace counsellors, or handle emergencies. Always talk to a trusted adult when things feel unsafe.",
  },
  characterChat: {
    categories: {
      celebrity: "Celebrities",
      religious: "Religious leaders",
      custom: "Your characters",
    },
    title: "Character chat (like Character AI)",
    intro:
      "Chat with celebrity-style personas, religious-leader-style guides, or your own custom virtual characters. Multi-turn open conversation with personality-aware replies.",
    disclaimer:
      "AI simulation only — not the real person, not official religious teaching, and not professional advice. High-risk language still triggers crisis support.",
    createCharacter: "+ Create custom virtual character",
    createTitle: "New virtual persona",
    createHint:
      "Define name, greeting, personality, and speaking style. Saved locally in your browser.",
    formName: "Character name",
    formNamePlaceholder: "e.g. Space Explorer",
    formAvatar: "Avatar (emoji)",
    formDescription: "Short description",
    formGreeting: "Opening greeting",
    formPersonality: "Personality traits",
    formStyle: "Speaking style",
    saveCharacter: "Save & chat",
    continueChat: "Continue chat",
    chatTitle: "Character conversation",
    chatSubtitle: "Open-ended multi-turn chat with your selected persona.",
    changeCharacter: "Switch character",
    selectToChat: "Select a character from the Characters page to start chatting.",
    simulationNote: "AI role-play simulation",
    clearChat: "Clear history",
    typing: "Thinking…",
    inputPlaceholder: "Type your message…",
    send: "Send",
    llmActive: "LLM connected",
    llmChain: "LLM chain",
    llmMock: "LLM not configured — using mock replies (copy .env.local from EduTech)",
  },
  characterGrowth: {
    scenarioTitle: "What do you need help with?",
    scenarioSubtitle: "Pick a situation — we match you to the best mentor persona.",
    dailyQuote: "Daily quote",
    shareQuote: "Share quote",
    shareDisclaimer: "AI simulation — not the real person.",
    copied: "Copied to clipboard.",
    intimacyLevel: "Bond",
    streak: "streak",
    profileTitle: "Your profile (for memory)",
    profileName: "Name / nickname",
    profileRole: "Grade or role",
    saveProfile: "Save profile",
    messagesLeft: "{n} messages left today (limit {limit})",
    limitReached: "Daily free limit reached. Upgrade or try tomorrow.",
    quietHours: "Parent quiet hours — chat paused.",
    premiumActive: "Premium demo active — unlimited messages.",
    tryPremiumDemo: "Try premium (demo toggle)",
    feedbackUp: "Helpful",
    feedbackDown: "Not like this character",
    listen: "Listen",
    debriefCta: "Character mentor debrief",
    debriefLink: "Talk with a character mentor about this reflection",
    settingsLink: "Settings",
    insightsLink: "Insights",
    settingsTitle: "Growth settings",
    settingsSubtitle: "Parent mode, quiet hours, premium demo, and data export.",
    parentMode: "Parent mode",
    parentModeHint: "Limits daily messages and blocks chat during quiet hours.",
    premiumToggle: "Premium demo (unlimited)",
    quietStart: "Quiet hours start (24h)",
    quietEnd: "Quiet hours end (24h)",
    exportData: "Export growth data (backup)",
    insightsTitle: "Usage insights (local)",
    insightsSubtitle: "Anonymous aggregates for schools / programs — no chat text stored here.",
    insightsNote: "Data stays on this device unless you export it.",
    statMessages: "Total messages",
    statFeedback: "Feedback",
    statActiveDays: "Best streak (days)",
    topScenarios: "Top scenario starts",
    topStress: "Top stress tags",
    noData: "No data yet — start a scenario chat.",
    resonanceTitle: "You are not alone",
    resonanceNote: "Anonymous daily estimate — no personal chat text is shared.",
    coachingTitle: "Themed coaching packs",
    coachingSubtitle: "Multi-day guided journeys with a matched mentor.",
    coachingStart: "Start {days}-day pack",
    coachingActive: "Day {day} in progress — tap to continue",
    coachingPremiumOnly: "Premium demo required",
    importData: "Import growth backup",
    importSuccess: "Backup imported successfully.",
    importFailed: "Could not import — check the JSON file.",
    cloudSyncNote: "Cloud sync (Supabase) coming soon — use export/import for now.",
  },
};
