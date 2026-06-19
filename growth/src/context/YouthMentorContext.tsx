"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocale } from "@/context/LocaleContext";
import { createActionPlan } from "@/lib/youthmentor/action-plan";
import {
  getDemoCases,
  createCheckInFromDemo,
  type DemoCaseId,
} from "@/lib/youthmentor/demo-seed";
import { generateMentorResponse } from "@/lib/youthmentor/mentor";
import { classifyRisk, getSafetyCrisisMessage } from "@/lib/youthmentor/risk";
import { saveReflection } from "@/lib/youthmentor/reflection-storage";
import type {
  ActionPlanItem,
  MentorPersona,
  MentorResponse,
  Mood,
  MoodCheckIn,
  ReflectionAnswers,
  RiskClassification,
  SavedReflection,
  StressSource,
} from "@/types/youthmentor";

const emptyAnswers: ReflectionAnswers = {
  whatHappened: "",
  whatFelt: "",
  worseThought: "",
  anotherView: "",
  smallAction: "",
  trustedPerson: "",
};

type YouthMentorContextValue = {
  checkIn: MoodCheckIn | null;
  mentorPersona: MentorPersona | null;
  answers: ReflectionAnswers;
  risk: RiskClassification | null;
  response: MentorResponse | null;
  actionPlan: ActionPlanItem[];
  isHighRiskBlocked: boolean;
  sessionId: string | null;
  setMood: (mood: Mood) => void;
  setIntensity: (intensity: number) => void;
  setStressSource: (source: StressSource) => void;
  setFreeText: (text: string) => void;
  setMentorPersona: (persona: MentorPersona) => void;
  setAnswer: (key: keyof ReflectionAnswers, value: string) => void;
  initCheckIn: () => void;
  loadDemo: (demoId: DemoCaseId) => void;
  processReflection: () => Promise<boolean>;
  toggleActionItem: (id: string) => void;
  persistSession: () => SavedReflection | null;
  resetSession: () => void;
  safetyMessage: string;
};

const YouthMentorContext = createContext<YouthMentorContextValue | null>(null);

/**
 * Provides structured reflection flow state across YouthMentor pages.
 */
export function YouthMentorProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const [checkIn, setCheckIn] = useState<MoodCheckIn | null>(null);
  const [mentorPersona, setMentorPersonaState] =
    useState<MentorPersona | null>(null);
  const [answers, setAnswers] = useState<ReflectionAnswers>(emptyAnswers);
  const [risk, setRisk] = useState<RiskClassification | null>(null);
  const [response, setResponse] = useState<MentorResponse | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>([]);
  const [isHighRiskBlocked, setIsHighRiskBlocked] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeDemoId, setActiveDemoId] = useState<DemoCaseId | null>(null);

  const initCheckIn = useCallback(() => {
    const entry: MoodCheckIn = {
      id: crypto.randomUUID(),
      mood: "calm",
      intensity: 5,
      stressSource: "other",
      freeText: "",
      createdAt: new Date().toISOString(),
    };
    setCheckIn(entry);
    setSessionId(entry.id);
    setMentorPersonaState(null);
    setAnswers(emptyAnswers);
    setRisk(null);
    setResponse(null);
    setActionPlan([]);
    setIsHighRiskBlocked(false);
    setActiveDemoId(null);
  }, []);

  const setMood = useCallback((mood: Mood) => {
    setCheckIn((prev) => (prev ? { ...prev, mood } : prev));
  }, []);

  const setIntensity = useCallback((intensity: number) => {
    setCheckIn((prev) => (prev ? { ...prev, intensity } : prev));
  }, []);

  const setStressSource = useCallback((stressSource: StressSource) => {
    setCheckIn((prev) => (prev ? { ...prev, stressSource } : prev));
  }, []);

  const setFreeText = useCallback((freeText: string) => {
    setCheckIn((prev) => (prev ? { ...prev, freeText } : prev));
  }, []);

  const setMentorPersona = useCallback((persona: MentorPersona) => {
    setMentorPersonaState(persona);
  }, []);

  const setAnswer = useCallback(
    (key: keyof ReflectionAnswers, value: string) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const loadDemo = useCallback(
    (demoId: DemoCaseId) => {
      const demo = getDemoCases(locale).find((d) => d.id === demoId);
      if (!demo) {
        return;
      }
      const entry = createCheckInFromDemo(demo.checkIn);
      setCheckIn(entry);
      setSessionId(entry.id);
      setMentorPersonaState(demo.mentorPersona);
      setAnswers({ ...demo.answers });
      setRisk(null);
      setResponse(null);
      setActionPlan([]);
      setIsHighRiskBlocked(false);
      setActiveDemoId(demoId);
    },
    [locale]
  );

  useEffect(() => {
    if (!activeDemoId) {
      return;
    }
    const demo = getDemoCases(locale).find((d) => d.id === activeDemoId);
    if (!demo) {
      return;
    }
    setCheckIn((prev) =>
      prev
        ? { ...prev, freeText: demo.checkIn.freeText }
        : createCheckInFromDemo(demo.checkIn)
    );
    setAnswers({ ...demo.answers });
    setMentorPersonaState(demo.mentorPersona);
  }, [locale, activeDemoId]);

  const processReflection = useCallback(async (): Promise<boolean> => {
    if (!checkIn || !mentorPersona) {
      return false;
    }

    const combinedText = [
      checkIn.freeText,
      answers.whatHappened,
      answers.whatFelt,
      answers.worseThought,
      answers.anotherView,
      answers.smallAction,
      answers.trustedPerson,
    ].join(" ");

    const riskResult = await classifyRisk(combinedText, locale);
    setRisk(riskResult);

    if (riskResult.safetyLevel === "high_risk") {
      setIsHighRiskBlocked(true);
      setResponse(null);
      setActionPlan([]);
      return true;
    }

    const mentorResponse = await generateMentorResponse(
      checkIn,
      answers,
      mentorPersona,
      riskResult,
      locale
    );
    setResponse(mentorResponse);
    setActionPlan(createActionPlan(mentorResponse));
    setIsHighRiskBlocked(false);
    return false;
  }, [answers, checkIn, locale, mentorPersona]);

  useEffect(() => {
    if (!checkIn || !mentorPersona || isHighRiskBlocked || !response) {
      return;
    }
    let cancelled = false;
    (async () => {
      const combinedText = [
        checkIn.freeText,
        answers.whatHappened,
        answers.whatFelt,
        answers.worseThought,
        answers.anotherView,
        answers.smallAction,
        answers.trustedPerson,
      ].join(" ");
      const riskResult = await classifyRisk(combinedText, locale);
      if (cancelled || riskResult.safetyLevel === "high_risk") {
        return;
      }
      const mentorResponse = await generateMentorResponse(
        checkIn,
        answers,
        mentorPersona,
        riskResult,
        locale
      );
      if (!cancelled) {
        setRisk(riskResult);
        setResponse(mentorResponse);
        setActionPlan(createActionPlan(mentorResponse));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const toggleActionItem = useCallback((id: string) => {
    setActionPlan((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  const persistSession = useCallback((): SavedReflection | null => {
    if (!checkIn || !mentorPersona || !sessionId) {
      return null;
    }

    const entry: SavedReflection = {
      id: sessionId,
      checkIn,
      mentorPersona,
      answers,
      response: isHighRiskBlocked ? null : response,
      actionPlan,
      isHighRiskBlocked,
      locale,
      createdAt: new Date().toISOString(),
    };

    return saveReflection(entry);
  }, [
    actionPlan,
    answers,
    checkIn,
    isHighRiskBlocked,
    locale,
    mentorPersona,
    response,
    sessionId,
  ]);

  const resetSession = useCallback(() => {
    setCheckIn(null);
    setMentorPersonaState(null);
    setAnswers(emptyAnswers);
    setRisk(null);
    setResponse(null);
    setActionPlan([]);
    setIsHighRiskBlocked(false);
    setSessionId(null);
    setActiveDemoId(null);
  }, []);

  const value = useMemo(
    () => ({
      checkIn,
      mentorPersona,
      answers,
      risk,
      response,
      actionPlan,
      isHighRiskBlocked,
      sessionId,
      setMood,
      setIntensity,
      setStressSource,
      setFreeText,
      setMentorPersona,
      setAnswer,
      initCheckIn,
      loadDemo,
      processReflection,
      toggleActionItem,
      persistSession,
      resetSession,
      safetyMessage: getSafetyCrisisMessage(locale),
    }),
    [
      actionPlan,
      answers,
      checkIn,
      initCheckIn,
      isHighRiskBlocked,
      loadDemo,
      locale,
      mentorPersona,
      persistSession,
      processReflection,
      resetSession,
      response,
      risk,
      sessionId,
      setAnswer,
      setFreeText,
      setIntensity,
      setMentorPersona,
      setMood,
      setStressSource,
      toggleActionItem,
    ]
  );

  return (
    <YouthMentorContext.Provider value={value}>
      {children}
    </YouthMentorContext.Provider>
  );
}

/**
 * Access YouthMentor flow state (must be used inside provider).
 */
export function useYouthMentor(): YouthMentorContextValue {
  const ctx = useContext(YouthMentorContext);
  if (!ctx) {
    throw new Error("useYouthMentor must be used within YouthMentorProvider");
  }
  return ctx;
}
