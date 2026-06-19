/**
 * Structured JSON schema description sent to the LLM for homework marking.
 */
export const HOMEWORK_ANALYSIS_JSON_SCHEMA = `{
  "result": "correct" | "partially_correct" | "incorrect" | "uncertain",
  "estimatedScore": { "score": number, "maxScore": number, "confidence": "low"|"medium"|"high" },
  "answerComparison": {
    "questionRecap": "short quote/summary of the actual question",
    "studentAnswerRecap": "short quote/summary of what the student wrote",
    "modelAnswer": "your derived correct answer for THIS question",
    "keyDifferences": ["specific difference 1", "specific difference 2"]
  },
  "correctSolution": "full step-by-step correct solution for THIS exact question (use $...$ for inline math)",
  "mistakeTypes": ["Procedural slip"|"Calculation error"|...],
  "knowledgePoints": { "mainTopic": string, "subTopics": string[], "prerequisites": string[] },
  "rubricAnalysis": [{
    "point": string, "maxMarks": number, "earnedMarks": number,
    "status": "present"|"partial"|"missing"|"uncertain",
    "confidence": 0-1, "explanation": string,
    "standardAnswer": string, "improvementSuggestion": string
  }],
  "mistakeBreakdown": [{
    "category": string, "percentage": number, "questionCount": 1,
    "lostMarks": number, "recoverableMarks": number,
    "priority": "high"|"medium"|"low", "actionPlan": string[]
  }],
  "scoreForecast": {
    "currentScore": number, "maxScore": number,
    "conservativeGain": number, "sprintGain": number,
    "nextTestMin": number, "nextTestMax": number,
    "recoverablePercentage": number,
    "executionDifficulty": "low"|"medium"|"high"
  },
  "improvementTips": string[],
  "perfectAnswerTemplate": string,
  "learningVisualLessons": [{
    "title": "micro-lesson title for the knowledge gap",
    "knowledgeGap": "what the student misunderstood",
    "steps": [{
      "title": "step title",
      "body": "plain explanation with $LaTeX$ for variables",
      "latex": "optional display formula LaTeX without delimiters",
      "highlightVars": ["∫", "dx", "F(x)"],
      "visualType": "integral_area"|"equation_balance"|"factor_pairs"|"number_line"|"formula_spotlight"|"mistake_compare"|"generic"
    }],
    "summary": "one-line takeaway"
  }],
  "nextKnowledgeUnits": [{
    "topic": "concept to study next",
    "whyNeeded": "why this fixes the mistake",
    "keyIdeas": ["idea 1", "idea 2"],
    "formulas": ["LaTeX formula 1"],
    "studySteps": ["read ch.3", "practice 5 problems"]
  }],
  "feedback": "personalised feedback referencing the student's actual work",
  "similarQuestions": [{ "question": string, "answer": string, "difficulty": "basic"|"standard"|"challenge" }],
  "remedialQuestions": [{ "question": string, "answer": string, "difficulty": "basic"|"standard"|"challenge" }],
  "extensionQuestions": [{ "question": string, "answer": string, "difficulty": "basic"|"standard"|"challenge" }],
  "learningPlan": string[],
  "teacherReviewRecommended": boolean
}` as const;

/**
 * Smaller schema for retry when the full JSON response is truncated.
 */
export const HOMEWORK_ANALYSIS_COMPACT_SCHEMA = `{
  "result": "correct" | "partially_correct" | "incorrect" | "uncertain",
  "estimatedScore": { "score": number, "maxScore": number, "confidence": "low"|"medium"|"high" },
  "answerComparison": {
    "questionRecap": string,
    "studentAnswerRecap": string,
    "modelAnswer": string,
    "keyDifferences": string[]
  },
  "correctSolution": string,
  "mistakeTypes": string[],
  "knowledgePoints": { "mainTopic": string, "subTopics": string[], "prerequisites": string[] },
  "rubricAnalysis": [{
    "point": string, "maxMarks": number, "earnedMarks": number,
    "status": "present"|"partial"|"missing"|"uncertain",
    "confidence": number, "explanation": string,
    "standardAnswer": string, "improvementSuggestion": string
  }],
  "mistakeBreakdown": [{
    "category": string, "percentage": number, "questionCount": 1,
    "lostMarks": number, "recoverableMarks": number,
    "priority": "high"|"medium"|"low", "actionPlan": string[]
  }],
  "feedback": string,
  "learningVisualLessons": [{
    "title": string, "knowledgeGap": string,
    "steps": [{ "title": string, "body": string, "latex": string, "highlightVars": string[] }],
    "summary": string
  }],
  "nextKnowledgeUnits": [{
    "topic": string, "whyNeeded": string,
    "keyIdeas": string[], "formulas": string[], "studySteps": string[]
  }],
  "similarQuestions": [{ "question": string, "answer": string, "difficulty": "basic"|"standard"|"challenge" }],
  "remedialQuestions": [{ "question": string, "answer": string, "difficulty": "basic"|"standard"|"challenge" }],
  "extensionQuestions": [{ "question": string, "answer": string, "difficulty": "basic"|"standard"|"challenge" }],
  "learningPlan": string[],
  "teacherReviewRecommended": boolean
}` as const;
