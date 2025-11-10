"use client";

import { useState } from "react";
import { generateFeedbackReport, TestData, FeedbackReport } from "@/lib/api";
import FeedbackReportDisplay from "@/components/FeedbackReportDisplay";

export default function FeedbackTestPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<FeedbackReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dummy test data for testing
  const dummyTestData: TestData = {
    userId: "user123",
    questions: [
      {
        questionId: "q1",
        type: "mcq",
        topic: "DSA",
        questionText: "What is the time complexity of binary search?",
        userAnswer: "O(log n)",
        correctAnswer: "O(log n)",
        marks: 5,
      },
      {
        questionId: "q2",
        type: "mcq",
        topic: "OS",
        questionText: "What is a deadlock?",
        userAnswer: "A process waiting indefinitely",
        correctAnswer: "A situation where processes are blocked",
        marks: 5,
      },
      {
        questionId: "q3",
        type: "paragraph",
        topic: "OOPS",
        questionText:
          "Explain the concept of inheritance in object-oriented programming.",
        userAnswer:
          "Inheritance is a fundamental concept in OOP where a class can inherit properties and methods from another class. It allows code reusability and establishes a relationship between classes. The class that inherits is called the subclass or child class, and the class being inherited from is called the superclass or parent class.",
        correctAnswer:
          "Inheritance is a mechanism in object-oriented programming where a new class is derived from an existing class. The derived class inherits all the properties and methods of the base class, allowing for code reuse and the creation of hierarchical class structures. This enables polymorphism and helps in organizing code more efficiently.",
        marks: 10,
      },
      {
        questionId: "q4",
        type: "paragraph",
        topic: "DSA",
        questionText:
          "Describe the differences between arrays and linked lists.",
        userAnswer: "Arrays are fixed size. Linked lists are dynamic.",
        correctAnswer:
          "Arrays are contiguous memory structures with fixed size, allowing random access but requiring memory reallocation for size changes. Linked lists are dynamic data structures where elements are stored in nodes connected by pointers, allowing efficient insertion and deletion but requiring sequential access and extra memory for pointers.",
        marks: 10,
      },
      {
        questionId: "q5",
        type: "code",
        topic: "DSA",
        questionText:
          "Write a function to find the factorial of a number using recursion.",
        userAnswer: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
        correctAnswer: "recursive function with base case",
        marks: 15,
      },
      {
        questionId: "q6",
        type: "code",
        topic: "DSA",
        questionText: "Implement a function to reverse a string.",
        userAnswer: `function reverse(str) {
  return str;
}`,
        correctAnswer: "reversed string output",
        marks: 10,
      },
    ],
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const feedbackReport = await generateFeedbackReport(dummyTestData);
      setReport(feedbackReport);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate feedback report"
      );
      console.error("Error generating report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Feedback Report System
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Test the feedback report generation with sample test data
            </p>
          </div>

          {/* Test Button */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800 mb-6">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {loading ? "Generating Report..." : "Generate Feedback Report"}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                Error:
              </p>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Report Display */}
          {report && <FeedbackReportDisplay report={report} />}

          {/* Dummy Data Info */}
          {!report && !loading && (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Sample Test Data
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                The test includes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
                <li>2 MCQ questions (DSA, OS)</li>
                <li>2 Paragraph questions (OOPS, DSA)</li>
                <li>2 Code questions (DSA)</li>
              </ul>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-4">
                Click the button above to generate a feedback report based on
                this sample data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
