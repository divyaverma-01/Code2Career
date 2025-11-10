/**
 * API client for Feedback Report System
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Question {
  questionId: string;
  type: "mcq" | "paragraph" | "code";
  topic: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  marks: number;
  expectedOutput?: string;
}

export interface TestData {
  userId: string;
  questions: Question[];
}

export interface TopicBreakdown {
  topic: string;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  status: "strength" | "weakness";
}

export interface FeedbackReport {
  userId: string;
  totalScore: number;
  totalMarks: number;
  accuracyPercent: number;
  topicWiseBreakdown: TopicBreakdown[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  communicationScore: number | null;
  codeQualityScore: number | null;
  testData?: TestData;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

/**
 * Generate feedback report from test data
 */
export async function generateFeedbackReport(
  testData: TestData
): Promise<FeedbackReport> {
  const response = await fetch(`${API_BASE_URL}/api/feedback-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to generate feedback report");
  }

  const result: ApiResponse<FeedbackReport> = await response.json();
  return result.data;
}

/**
 * Get feedback reports for a user
 */
export async function getUserFeedbackReports(
  userId: string
): Promise<FeedbackReport[]> {
  const response = await fetch(`${API_BASE_URL}/feedback-report/${userId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch feedback reports");
  }

  const result: ApiResponse<FeedbackReport[]> = await response.json();
  return result.data;
}
