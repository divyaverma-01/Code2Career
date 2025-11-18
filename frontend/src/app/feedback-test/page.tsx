"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchTestById,
  fetchTests,
  generateFeedbackReport,
  submitTestResult,
  FeedbackReport,
  TestDetail,
  TestQuestion,
  TestSummary,
} from "@/lib/api";
import FeedbackReportDisplay from "@/components/FeedbackReportDisplay";

interface AnswerMap {
  [questionId: string]: string;
}

export default function FeedbackTestPage() {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<TestDetail | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [userId, setUserId] = useState("candidate001");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState<FeedbackReport | null>(null);
  const [testResultId, setTestResultId] = useState<string | null>(null);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);

  useEffect(() => {
    async function loadTests() {
      try {
        const availableTests = await fetchTests();
        setTests(availableTests);
        if (availableTests.length > 0) {
          setSelectedTestId(availableTests[0]._id);
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load available tests."
        );
      } finally {
        setTestsLoading(false);
      }
    }

    loadTests();
  }, []);

  useEffect(() => {
    if (!selectedTestId) {
      setSelectedTest(null);
      return;
    }

    const id = selectedTestId;

    async function loadTestDetails() {
      setError(null);
      setReport(null);
      setTestResultId(null);
      setSubmitting(false);

      try {
        const testDetails = await fetchTestById(id);
        setSelectedTest(testDetails);
        const blankAnswers = testDetails.questions.reduce<AnswerMap>(
          (acc, q) => {
            acc[q._id] = "";
            return acc;
          },
          {}
        );
        setAnswers(blankAnswers);
        setTestStartTime(Date.now());
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load test details."
        );
      }
    }

    loadTestDetails();
  }, [selectedTestId]);

  const durationSeconds = useMemo(() => {
    if (!testStartTime) return undefined;
    return Math.floor((Date.now() - testStartTime) / 1000);
  }, [testStartTime, submitting]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedTest) return;

    setSubmitting(true);
    setError(null);

    try {
      const formattedAnswers = selectedTest.questions.map((question) => ({
        questionId: question._id,
        answer: answers[question._id] ?? "",
      }));

      const payload = {
        userId,
        testId: selectedTest._id,
        answers: formattedAnswers,
        startedAt: testStartTime
          ? new Date(testStartTime).toISOString()
          : undefined,
        durationSeconds,
      };

      const createdResult = await submitTestResult(payload);
      setTestResultId(createdResult._id);

      const feedback = await generateFeedbackReport(createdResult._id);
      setReport(feedback);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the test."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: TestQuestion, index: number) => {
    const userAnswer = answers[question._id] ?? "";

    if (question.type === "mcq") {
      return (
        <fieldset className="space-y-2">
          <legend className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
            {index + 1}. {question.questionText}
          </legend>
          <div className="space-y-2">
            {(question.options || []).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200"
              >
                <input
                  type="radio"
                  name={question._id}
                  value={option.value}
                  checked={userAnswer === option.value}
                  onChange={() =>
                    handleAnswerChange(question._id, option.value)
                  }
                  className="h-4 w-4 border-zinc-300 text-blue-600"
                />
                <span>{option.value}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    if (question.type === "paragraph") {
      return (
        <div className="space-y-2">
          <label className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
            {index + 1}. {question.questionText}
          </label>
          <textarea
            value={userAnswer}
            onChange={(event) =>
              handleAnswerChange(question._id, event.target.value)
            }
            rows={5}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="Write your answer here..."
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
          {index + 1}. {question.questionText}
        </label>
        <textarea
          value={userAnswer}
          onChange={(event) =>
            handleAnswerChange(question._id, event.target.value)
          }
          rows={8}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="Write your code answer here..."
        />
      </div>
    );
  };

  const resetFlow = () => {
    setReport(null);
    setTestResultId(null);
    setAnswers((prev) => {
      const reset: AnswerMap = {};
      Object.keys(prev).forEach((key) => {
        reset[key] = "";
      });
      return reset;
    });
    setTestStartTime(Date.now());
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Test Runner & Feedback
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Pick a test, submit your answers, and review the AI-style feedback
              report.
            </p>
          </header>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300 font-semibold">
                {error}
              </p>
            </div>
          )}

          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
            <div className="flex flex-col gap-4 border-b border-zinc-200 p-6 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  1. Choose a Test
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Tests are loaded from MongoDB. Select one to begin.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Candidate ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  placeholder="Enter your user identifier"
                />
              </div>
            </div>

            <div className="p-6 space-y-6">
              {testsLoading ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Loading tests...
                </p>
              ) : tests.length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  No tests available. Seed the database to get started.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {tests.map((test) => (
                    <button
                      key={test._id}
                      onClick={() => setSelectedTestId(test._id)}
                      className={`rounded-lg border p-4 text-left transition-all ${
                        selectedTestId === test._id
                          ? "border-blue-500 bg-blue-50 shadow-md dark:border-blue-400 dark:bg-blue-900/20"
                          : "border-zinc-200 bg-white hover:border-blue-400 hover:shadow dark:border-zinc-800 dark:bg-zinc-900"
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {test.title}
                      </h3>
                      {test.description && (
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {test.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Questions: {test.questionCount}</span>
                        {typeof test.totalMarks === "number" && (
                          <span>Marks: {test.totalMarks}</span>
                        )}
                        {typeof test.durationMinutes === "number" && (
                          <span>Duration: {test.durationMinutes} mins</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedTest && (
                <div className="space-y-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                  <header>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      2. Answer Questions
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Provide answers for each question below. Leave blank if
                      unsure.
                    </p>
                  </header>

                  <div className="space-y-6">
                    {selectedTest.questions.map((question, index) => (
                      <div
                        key={question._id}
                        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          <span>{question.topic}</span>
                          <span>
                            {question.difficulty} • {question.marks} marks
                          </span>
                        </div>
                        {renderQuestion(question, index)}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                      {submitting
                        ? "Submitting..."
                        : "Submit Answers & Generate Feedback"}
                    </button>

                    {testResultId && (
                      <button
                        onClick={resetFlow}
                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Retake this test
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {report && (
            <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
              <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  3. Feedback Report
                </h2>
                {testResultId && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Test Result ID:{" "}
                    <span className="font-mono">{testResultId}</span>
                  </p>
                )}
              </div>
              <div className="p-6">
                <FeedbackReportDisplay report={report} />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
