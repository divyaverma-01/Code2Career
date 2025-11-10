"use client";

import { FeedbackReport, TopicBreakdown } from "@/lib/api";

interface FeedbackReportDisplayProps {
  report: FeedbackReport;
}

export default function FeedbackReportDisplay({
  report,
}: FeedbackReportDisplayProps) {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600 dark:text-green-400";
    if (accuracy >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAccuracyBgColor = (accuracy: number) => {
    if (accuracy >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (accuracy >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          Feedback Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Total Score
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {report.totalScore} / {report.totalMarks}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg ${getAccuracyBgColor(
              report.accuracyPercent
            )}`}
          >
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Accuracy</p>
            <p
              className={`text-2xl font-bold ${getAccuracyColor(
                report.accuracyPercent
              )}`}
            >
              {report.accuracyPercent.toFixed(2)}%
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">User ID</p>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {report.userId}
            </p>
          </div>
        </div>
      </div>

      {/* Topic-wise Breakdown */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Topic-wise Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.topicWiseBreakdown.map((topic: TopicBreakdown, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                topic.status === "strength"
                  ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                  : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {topic.topic}
                </h4>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    topic.status === "strength"
                      ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                      : "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
                  }`}
                >
                  {topic.status === "strength" ? "Strength" : "Weakness"}
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${getAccuracyColor(
                  topic.accuracy
                )}`}
              >
                {topic.accuracy.toFixed(1)}%
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {topic.correctAnswers} / {topic.totalQuestions} correct
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
            Strengths
          </h3>
          <ul className="space-y-2">
            {report.strengths.length > 0 ? (
              report.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300"
                >
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))
            ) : (
              <li className="text-zinc-500 dark:text-zinc-400">
                No significant strengths identified.
              </li>
            )}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {report.weaknesses.length > 0 ? (
              report.weaknesses.map((weakness, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300"
                >
                  <span className="text-red-500 mt-1">✗</span>
                  <span>{weakness}</span>
                </li>
              ))
            ) : (
              <li className="text-zinc-500 dark:text-zinc-400">
                No significant weaknesses identified.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
          Recommendations
        </h3>
        <ul className="space-y-3">
          {report.recommendations.map((recommendation, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <span className="text-blue-500 font-bold mt-1">{index + 1}.</span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {recommendation}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Optional Scores */}
      {(report.communicationScore !== null ||
        report.codeQualityScore !== null) && (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Additional Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.communicationScore !== null && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Communication Score
                </p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {report.communicationScore} / 100
                </p>
              </div>
            )}
            {report.codeQualityScore !== null && (
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Code Quality Score
                </p>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {report.codeQualityScore} / 100
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
