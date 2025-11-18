/**
 * API client for Feedback Report System
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined. Set it in your environment."
  );
}

const API_PREFIX = `${API_BASE_URL.replace(/\/$/, "")}/api`;

export type QuestionType = "mcq" | "paragraph" | "code";

export interface TestQuestion {
  _id: string;
  questionText: string;
  type: QuestionType;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  options?: { value: string }[];
  correctAnswer: string;
  expectedOutput?: string;
  keywords?: string[];
}

export interface TestSummary {
  _id: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  totalMarks?: number;
  questionCount: number;
  tags?: string[];
}

export interface TestDetail extends TestSummary {
  questions: TestQuestion[];
}

export interface TopicBreakdown {
  topic: string;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  status: "strength" | "weakness";
}

export interface FeedbackReport {
  _id: string;
  userId: string;
  test: string;
  testResult: string;
  testTitle: string;
  totalScore: number;
  totalMarks: number;
  accuracyPercent: number;
  topicWiseBreakdown: TopicBreakdown[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  communicationScore: number | null;
  codeQualityScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitTestResultPayload {
  userId: string;
  testId: string;
  answers: Array<{
    questionId: string;
    answer: string;
    metadata?: Record<string, unknown> | null;
  }>;
  startedAt?: string;
  durationSeconds?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorBody = await response.json();
      message = errorBody.message || errorBody.error || message;
    } catch (error) {
      // ignore json parsing error
    }
    throw new Error(message || "Request failed");
  }

  const payload: ApiResponse<T> = await response.json();
  return payload.data;
}

export async function fetchTests(): Promise<TestSummary[]> {
  const response = await fetch(`${API_PREFIX}/tests`, {
    cache: "no-store",
  });
  return handleResponse<TestSummary[]>(response);
}

export async function fetchTestById(testId: string): Promise<TestDetail> {
  const response = await fetch(`${API_PREFIX}/tests/${testId}`, {
    cache: "no-store",
  });
  return handleResponse<TestDetail>(response);
}

export async function submitTestResult(
  payload: SubmitTestResultPayload
): Promise<{ _id: string; userId: string; test: string }> {
  const response = await fetch(`${API_PREFIX}/test-results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<{
    _id: string;
    userId: string;
    test: string;
  }>(response);
  return data;
}

export async function generateFeedbackReport(
  testResultId: string
): Promise<FeedbackReport> {
  const response = await fetch(`${API_PREFIX}/feedback/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ testResultId }),
  });

  return handleResponse<FeedbackReport>(response);
}

export async function getUserFeedbackReports(
  userId: string
): Promise<FeedbackReport[]> {
  const response = await fetch(`${API_PREFIX}/feedback/user/${userId}`, {
    cache: "no-store",
  });
  return handleResponse<FeedbackReport[]>(response);
}
