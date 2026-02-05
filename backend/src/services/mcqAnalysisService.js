export function analyzeMCQAttempt(test, questions, attempt) {
  /* ───────────── Summary ───────────── */
  const summary = {
    totalQuestions: test.totalQuestions,
    attempted: 0,
    correct: 0,
    wrong: 0,
    unattempted: 0,
    score: attempt.score ?? 0,
    totalMarks: test.totalMarks,
    accuracyPercentage: 0,
    avgTimePerQuestion: 0,
  };

  /* ───────────── Containers ───────────── */
  const topicAnalysis = {};
  const difficultyAnalysis = {
    easy: { total: 0, correct: 0, accuracy: 0 },
    medium: { total: 0, correct: 0, accuracy: 0 },
    hard: { total: 0, correct: 0, accuracy: 0 },
  };

  let totalTime = 0;

  /* ───────────── Lookup Map ───────────── */
  const questionMap = {};
  questions.forEach((q) => {
    questionMap[q._id.toString()] = q;
  });

  /* ───────────── First Pass: Stats ───────────── */
  attempt.responses.forEach((res) => {
    const q = questionMap[res.questionId.toString()];
    if (!q) return;

    const time = res.timeTaken ?? 0;
    totalTime += time;

    // Topic
    topicAnalysis[q.topic] ??= { total: 0, correct: 0, accuracy: 0 };
    topicAnalysis[q.topic].total++;

    // Difficulty
    difficultyAnalysis[q.difficulty].total++;

    if (res.selectedOption === null) {
      summary.unattempted++;
      return;
    }

    summary.attempted++;

    if (res.selectedOption === q.correctAnswer) {
      summary.correct++;
      topicAnalysis[q.topic].correct++;
      difficultyAnalysis[q.difficulty].correct++;
    } else {
      summary.wrong++;
    }
  });

  summary.accuracyPercentage = summary.attempted
    ? Math.round((summary.correct / summary.attempted) * 100)
    : 0;

  summary.avgTimePerQuestion = Math.round(totalTime / summary.totalQuestions);

  /* ───────────── Percentages ───────────── */
  Object.values(topicAnalysis).forEach((t) => {
    t.accuracy = Math.round((t.correct / t.total) * 100);
  });

  Object.values(difficultyAnalysis).forEach((d) => {
    d.accuracy = d.total ? Math.round((d.correct / d.total) * 100) : 0;
  });

  /* ───────────── Speed Thresholds ───────────── */
  const avgTime = summary.avgTimePerQuestion;
  const fastThreshold = avgTime * 0.6;
  const slowThreshold = avgTime * 1.4;

  /* ───────────── Behavioral Analysis ───────────── */
  const behavioralCounts = {
    fastCorrect: 0,
    slowCorrect: 0,
    fastWrong: 0,
    slowWrong: 0,
  };

  attempt.responses.forEach((res) => {
    const q = questionMap[res.questionId.toString()];
    if (!q || res.selectedOption === null) return;

    const isFast = res.timeTaken < fastThreshold;
    const isSlow = res.timeTaken > slowThreshold;
    const isCorrect = res.selectedOption === q.correctAnswer;

    if (isFast && isCorrect) behavioralCounts.fastCorrect++;
    if (isSlow && isCorrect) behavioralCounts.slowCorrect++;
    if (isFast && !isCorrect) behavioralCounts.fastWrong++;
    if (isSlow && !isCorrect) behavioralCounts.slowWrong++;
  });

  const totalBehavior =
    behavioralCounts.fastCorrect +
    behavioralCounts.slowCorrect +
    behavioralCounts.fastWrong +
    behavioralCounts.slowWrong;

  const behavioralAnalysis = {};
  for (const key in behavioralCounts) {
    behavioralAnalysis[key] = {
      count: behavioralCounts[key],
      percentage: totalBehavior
        ? Math.round((behavioralCounts[key] / totalBehavior) * 100)
        : 0,
    };
  }

  behavioralAnalysis.fastCorrect.interpretation =
    "Answered correctly very quickly, indicating strong intuition or possible guessing.";

  behavioralAnalysis.slowCorrect.interpretation =
    "Answered correctly but took more time, showing conceptual clarity with slower recall.";

  behavioralAnalysis.fastWrong.interpretation =
    "Answered incorrectly very quickly, suggesting impulsive or careless mistakes.";

  behavioralAnalysis.slowWrong.interpretation =
    "Spent time but still answered incorrectly, indicating conceptual gaps.";

  /* ───────────── Speed Analysis ───────────── */
  const speedAnalysis = {
    avgTime,
    fastThreshold,
    slowThreshold,
    fastAttempts: behavioralCounts.fastCorrect + behavioralCounts.fastWrong,
    slowAttempts: behavioralCounts.slowCorrect + behavioralCounts.slowWrong,
  };

  return {
    summary,
    topicAnalysis,
    difficultyAnalysis,
    speedAnalysis,
    behavioralAnalysis,
  };
}
