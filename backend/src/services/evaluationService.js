import {
  analyzeParagraphAnswer,
  vocabularyRichness,
  keywordOverlapScore,
} from "../utils/textSimilarity.js";
import {
  analyzeCodeAnswer,
  analyzeCodeStructure,
} from "../utils/codeAnalysis.js";

/**
 * Evaluation Service
 * Main orchestrator for evaluating test responses and generating feedback reports
 * Designed to be extensible for AI integration later
 */

/**
 * Evaluate a single question based on its type
 */
function evaluateQuestion(question) {
  const { type, userAnswer, correctAnswer, marks } = question;

  let score = 0;
  let obtainedMarks = 0;
  let analysisDetails = {};

  switch (type.toLowerCase()) {
    case "mcq":
      // Direct comparison for MCQ
      const isCorrect =
        userAnswer &&
        correctAnswer &&
        userAnswer.toString().trim().toLowerCase() ===
          correctAnswer.toString().trim().toLowerCase();

      score = isCorrect ? 1 : 0;
      obtainedMarks = isCorrect ? marks : 0;
      analysisDetails = {
        isCorrect,
        userAnswer,
        correctAnswer,
      };
      break;

    case "paragraph":
      // Text analysis for paragraph answers
      const paragraphScore = analyzeParagraphAnswer(userAnswer, correctAnswer);
      score = paragraphScore;
      obtainedMarks = Math.round(paragraphScore * marks);
      analysisDetails = {
        similarityScore: paragraphScore,
        vocabularyScore: vocabularyRichness(userAnswer),
        keywordScore: keywordOverlapScore(userAnswer, correctAnswer),
      };
      break;

    case "code":
      // Code analysis
      // For code, correctAnswer might be expected output or code pattern
      const codeScore = analyzeCodeAnswer(
        userAnswer,
        correctAnswer,
        question.expectedOutput || correctAnswer
      );
      score = codeScore;
      obtainedMarks = Math.round(codeScore * marks);
      const codeStructure = analyzeCodeStructure(userAnswer);
      analysisDetails = {
        codeScore,
        structureScore: codeStructure.score,
        issues: codeStructure.issues,
      };
      break;

    default:
      console.warn(`Unknown question type: ${type}`);
      score = 0;
      obtainedMarks = 0;
  }

  return {
    score,
    obtainedMarks,
    maxMarks: marks,
    analysisDetails,
  };
}

/**
 * Calculate topic-wise breakdown
 */
function calculateTopicBreakdown(questions, evaluations) {
  const topicMap = {};

  questions.forEach((question, index) => {
    const topic = question.topic || "General";
    const evaluation = evaluations[index];

    if (!topicMap[topic]) {
      topicMap[topic] = {
        totalQuestions: 0,
        correctAnswers: 0,
        totalMarks: 0,
        obtainedMarks: 0,
      };
    }

    topicMap[topic].totalQuestions += 1;
    topicMap[topic].totalMarks += evaluation.maxMarks;
    topicMap[topic].obtainedMarks += evaluation.obtainedMarks;

    if (evaluation.score >= 0.7) {
      // Consider 70%+ as correct for analysis
      topicMap[topic].correctAnswers += 1;
    }
  });

  // Convert to array format with accuracy and status
  const topicBreakdown = Object.entries(topicMap).map(([topic, data]) => {
    const accuracy =
      data.totalMarks > 0 ? (data.obtainedMarks / data.totalMarks) * 100 : 0;

    return {
      topic,
      accuracy: Math.round(accuracy * 100) / 100,
      totalQuestions: data.totalQuestions,
      correctAnswers: data.correctAnswers,
      status: accuracy >= 70 ? "strength" : "weakness",
    };
  });

  return topicBreakdown;
}

/**
 * Generate strengths and weaknesses based on topic breakdown
 */
function generateStrengthsAndWeaknesses(topicBreakdown) {
  const strengths = [];
  const weaknesses = [];

  topicBreakdown.forEach((topic) => {
    if (topic.status === "strength") {
      strengths.push(`${topic.topic} (${topic.accuracy.toFixed(1)}% accuracy)`);
    } else {
      weaknesses.push(
        `${topic.topic} (${topic.accuracy.toFixed(1)}% accuracy)`
      );
    }
  });

  return { strengths, weaknesses };
}

/**
 * Generate AI-like recommendations based on performance
 */
function generateRecommendations(
  topicBreakdown,
  evaluations,
  questions,
  overallAccuracy
) {
  const recommendations = [];

  // Topic-based recommendations
  const weakTopics = topicBreakdown.filter((t) => t.status === "weakness");
  if (weakTopics.length > 0) {
    const weakTopicNames = weakTopics.map((t) => t.topic).join(", ");
    recommendations.push(
      `Focus on improving ${weakTopicNames} concepts. Consider reviewing fundamentals and practicing more questions in these areas.`
    );
  }

  // Question type-based recommendations
  const paragraphQuestions = questions.filter(
    (q) => q.type.toLowerCase() === "paragraph"
  );
  const codeQuestions = questions.filter(
    (q) => q.type.toLowerCase() === "code"
  );

  if (paragraphQuestions.length > 0) {
    const paragraphEvals = paragraphQuestions.map(
      (q, idx) => evaluations[questions.indexOf(q)]
    );
    const avgParagraphScore =
      paragraphEvals.reduce((sum, e) => sum + e.score, 0) /
      paragraphEvals.length;

    if (avgParagraphScore < 0.6) {
      recommendations.push(
        "Work on improving written communication skills. Practice structuring answers clearly and using appropriate technical vocabulary."
      );
    }
  }

  if (codeQuestions.length > 0) {
    const codeEvals = codeQuestions.map(
      (q, idx) => evaluations[questions.indexOf(q)]
    );
    const avgCodeScore =
      codeEvals.reduce((sum, e) => sum + e.score, 0) / codeEvals.length;

    if (avgCodeScore < 0.6) {
      recommendations.push(
        "Focus on improving coding skills. Practice problem-solving, algorithm implementation, and code structure. Consider working on more coding challenges."
      );
    }
  }

  // Overall performance recommendations
  if (overallAccuracy >= 80) {
    recommendations.push(
      "Excellent performance! Keep up the good work and continue practicing to maintain your skills."
    );
  } else if (overallAccuracy >= 60) {
    recommendations.push(
      "Good performance. Review incorrect answers and focus on areas that need improvement."
    );
  } else {
    recommendations.push(
      "Consider dedicating more time to study and practice. Focus on understanding core concepts before attempting advanced topics."
    );
  }

  return recommendations;
}

/**
 * Calculate communication score for paragraph answers
 */
function calculateCommunicationScore(questions, evaluations) {
  const paragraphQuestions = questions
    .map((q, idx) => ({ question: q, evaluation: evaluations[idx] }))
    .filter((item) => item.question.type.toLowerCase() === "paragraph");

  if (paragraphQuestions.length === 0) return null;

  const avgScore =
    paragraphQuestions.reduce(
      (sum, item) => sum + item.evaluation.analysisDetails.vocabularyScore,
      0
    ) / paragraphQuestions.length;

  return Math.round(avgScore * 100);
}

/**
 * Calculate code quality score for code answers
 */
function calculateCodeQualityScore(questions, evaluations) {
  const codeQuestions = questions
    .map((q, idx) => ({ question: q, evaluation: evaluations[idx] }))
    .filter((item) => item.question.type.toLowerCase() === "code");

  if (codeQuestions.length === 0) return null;

  const avgScore =
    codeQuestions.reduce(
      (sum, item) => sum + item.evaluation.analysisDetails.structureScore,
      0
    ) / codeQuestions.length;

  return Math.round(avgScore * 100);
}

/**
 * Main function to evaluate test and generate feedback report
 */
function evaluateTest(testData) {
  const { userId, questions } = testData;

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new Error("Invalid test data: questions array is required");
  }

  // Evaluate each question
  const evaluations = questions.map((question) => evaluateQuestion(question));

  // Calculate total scores
  const totalMarks = evaluations.reduce(
    (sum, evaluation) => sum + evaluation.maxMarks,
    0
  );
  const totalScore = evaluations.reduce(
    (sum, evaluation) => sum + evaluation.obtainedMarks,
    0
  );
  const accuracyPercent = totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0;

  // Calculate topic-wise breakdown
  const topicWiseBreakdown = calculateTopicBreakdown(questions, evaluations);

  // Generate strengths and weaknesses
  const { strengths, weaknesses } =
    generateStrengthsAndWeaknesses(topicWiseBreakdown);

  // Generate recommendations
  const recommendations = generateRecommendations(
    topicWiseBreakdown,
    evaluations,
    questions,
    accuracyPercent
  );

  // Calculate optional scores
  const communicationScore = calculateCommunicationScore(
    questions,
    evaluations
  );
  const codeQualityScore = calculateCodeQualityScore(questions, evaluations);

  // Build feedback report
  const feedbackReport = {
    userId,
    totalScore: Math.round(totalScore * 100) / 100,
    totalMarks,
    accuracyPercent: Math.round(accuracyPercent * 100) / 100,
    topicWiseBreakdown,
    strengths,
    weaknesses,
    recommendations,
    communicationScore,
    codeQualityScore,
  };

  return feedbackReport;
}

export {
  evaluateTest,
  evaluateQuestion,
  calculateTopicBreakdown,
  generateRecommendations,
};
