import type {
  MentorPersona,
  Mood,
  ReflectionAnswers,
  StressSource,
} from "@/types/youthmentor";
import type { CharacterCategory } from "@/types/character-chat";
import type { DemoCaseId } from "@/lib/youthmentor/demo-seed";

export type DemoCaseContent = {
  title: string;
  description: string;
  freeText: string;
  answers: ReflectionAnswers;
};

export type Dictionary = {
  meta: { title: string; description: string };
  landing: {
    badge: string;
    title: string;
    portNote: string;
    mentorLink: string;
    charactersLink: string;
    edutechNote: string;
  };
  lang: { switchLabel: string; en: string; zh: string };
  nav: {
    home: string;
    characters: string;
    checkIn: string;
    reflection: string;
    mentor: string;
    actions: string;
    safety: string;
    history: string;
    settings: string;
  };
  layout: {
    badge: string;
    appName: string;
    tagline: string;
    footer: string;
    navAria: string;
  };
  flow: {
    steps: string[];
  };
  common: {
    back: string;
    continue: string;
    startCheckIn: string;
    viewHistory: string;
    goToCheckIn: string;
    goToReflection: string;
    intensityMild: string;
    intensityStrong: string;
    delete: string;
    optional: string;
  };
  home: {
    title: string;
    intro: string;
    flowList: string[];
    demoHint: string;
    safetyDemoLink: string;
  };
  safetyDemo: {
    title: string;
    subtitle: string;
    whyTitle: string;
    whyBody: string;
    stepsTitle: string;
    steps: string[];
    runButton: string;
    openReflection: string;
    note: string;
  };
  checkIn: {
    title: string;
    subtitle: string;
    moodLabel: string;
    intensityLabel: string;
    stressLabel: string;
    freeTextLabel: string;
    freeTextPlaceholder: string;
    mentorLabel: string;
    continueReflection: string;
  };
  reflection: {
    title: string;
    subtitle: string;
    submit: string;
    submitting: string;
    needCheckIn: string;
  };
  reflectionPrompts: {
    key: keyof ReflectionAnswers;
    label: string;
    placeholder: string;
  }[];
  mentorChat: {
    title: string;
    subtitle: string;
    watchNotice: string;
    needReflection: string;
    buildActionPlan: string;
  };
  mentorCard: {
    title: string;
    trustedNamed: string;
    sections: {
      heard: string;
      summary: string;
      reframe: string;
      encouragement: string;
      seekHelp: string;
      followUp: string;
      actions: string;
    };
    badges: { watch: string; normal: string };
  };
  actionPlan: {
    title: string;
    subtitle: string;
    paused: string;
    viewSafety: string;
    safetyCheck: string;
    empty: string;
  };
  safety: {
    title: string;
    subtitle: string;
    normalIntro: string;
    normalList: string[];
    save: string;
    saved: string;
    newSession: string;
    detection: string;
    keywords: string;
  };
  history: {
    title: string;
    subtitle: string;
    empty: string;
    highRiskNote: string;
    backHome: string;
    intensity: string;
    blockedSummary: string;
  };
  demo: {
    title: string;
    subtitle: string;
    cases: Record<DemoCaseId, DemoCaseContent>;
  };
  moods: Record<Mood, string>;
  stress: Record<StressSource, string>;
  personas: Record<
    MentorPersona,
    { title: string; description: string; tone: string }
  >;
  mentorGen: {
    defaultTrusted: string;
    somethingDifficult: string;
    sharedHappened: string;
    felt: string;
    toughThought: string;
    reframe: Record<MentorPersona, string>;
    watchHelp: string;
    normalHelp: string;
    validation: string;
    followUp: string;
    encouragement: Record<MentorPersona, string>;
    actionExtras: Record<MentorPersona, string[]>;
    examPackBag: string;
  };
  risk: {
    highKeyword: string;
    watchKeyword: string;
    noKeyword: string;
    severeHopeless: string;
    normalScope: string;
    crisisMessage: string;
  };
  crisisPanel: {
    title: string;
    talkAdult: string;
    counsellor: string;
    emergency: string;
    adultTitle: string;
    adultBody: string;
    counsellorTitle: string;
    counsellorBody: string;
    emergencyTitle: string;
    emergencyBody: string;
    coachingPaused: string;
  };
  safetyBanner: {
    important: string;
    text: string;
  };
  characterChat: {
    categories: Record<CharacterCategory, string>;
    title: string;
    intro: string;
    disclaimer: string;
    createCharacter: string;
    createTitle: string;
    createHint: string;
    formName: string;
    formNamePlaceholder: string;
    formAvatar: string;
    formDescription: string;
    formGreeting: string;
    formPersonality: string;
    formStyle: string;
    saveCharacter: string;
    continueChat: string;
    chatTitle: string;
    chatSubtitle: string;
    changeCharacter: string;
    selectToChat: string;
    simulationNote: string;
    clearChat: string;
    typing: string;
    inputPlaceholder: string;
    send: string;
    llmActive: string;
    llmChain: string;
    llmMock: string;
  };
  characterGrowth: {
    scenarioTitle: string;
    scenarioSubtitle: string;
    dailyQuote: string;
    shareQuote: string;
    shareDisclaimer: string;
    copied: string;
    intimacyLevel: string;
    streak: string;
    profileTitle: string;
    profileName: string;
    profileRole: string;
    saveProfile: string;
    messagesLeft: string;
    limitReached: string;
    quietHours: string;
    premiumActive: string;
    tryPremiumDemo: string;
    feedbackUp: string;
    feedbackDown: string;
    listen: string;
    debriefCta: string;
    debriefLink: string;
    settingsLink: string;
    insightsLink: string;
    settingsTitle: string;
    settingsSubtitle: string;
    parentMode: string;
    parentModeHint: string;
    premiumToggle: string;
    quietStart: string;
    quietEnd: string;
    exportData: string;
    insightsTitle: string;
    insightsSubtitle: string;
    insightsNote: string;
    statMessages: string;
    statFeedback: string;
    statActiveDays: string;
    topScenarios: string;
    topStress: string;
    noData: string;
    resonanceTitle: string;
    resonanceNote: string;
    coachingTitle: string;
    coachingSubtitle: string;
    coachingStart: string;
    coachingActive: string;
    coachingPremiumOnly: string;
    importData: string;
    importSuccess: string;
    importFailed: string;
    cloudSyncNote: string;
  };
};
