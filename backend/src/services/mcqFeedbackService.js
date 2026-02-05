export function generateMCQFeedback(analysis) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  /* ───────────── Overall Accuracy ───────────── */
  if (analysis.summary.accuracyPercentage >= 75) {
    strengths.push(
      "Strong overall accuracy with good conceptual understanding.",
    );
  } else if (analysis.summary.accuracyPercentage <= 40) {
    weaknesses.push("Low overall accuracy indicates gaps in core concepts.");
    recommendations.push(
      "Revise fundamentals before attempting more mock tests.",
    );
  }

  /* ───────────── Topic-Based ───────────── */
  for (const topic in analysis.topicAnalysis) {
    const t = analysis.topicAnalysis[topic];
    if (t.accuracy >= 70) {
      strengths.push(`Good performance in ${topic}.`);
    } else if (t.accuracy <= 40) {
      weaknesses.push(`Weak performance in ${topic}.`);
      recommendations.push(
        `Practice more ${topic} questions and revise basics.`,
      );
    }
  }

  /* ───────────── Difficulty-Based ───────────── */
  if (
    analysis.difficultyAnalysis.hard.total > 0 &&
    analysis.difficultyAnalysis.hard.accuracy === 0
  ) {
    weaknesses.push("Unable to solve hard-level questions.");
    recommendations.push(
      "Work on advanced problem-solving patterns and edge cases.",
    );
  }

  /* ───────────── Behavioral Insights ───────────── */
  if (analysis.behavioralAnalysis.slowCorrect.percentage > 40) {
    strengths.push(
      "You show strong conceptual understanding but need to improve speed.",
    );
    recommendations.push("Practice timed questions to improve recall speed.");
  }

  if (analysis.behavioralAnalysis.fastWrong.percentage > 30) {
    weaknesses.push(
      "Many incorrect answers were due to rushing through questions.",
    );
    recommendations.push(
      "Slow down slightly and read questions more carefully.",
    );
  }

  if (analysis.behavioralAnalysis.slowWrong.percentage > 25) {
    weaknesses.push(
      "Some questions took time but were still incorrect, indicating conceptual gaps.",
    );
    recommendations.push(
      "Focus on understanding weak concepts instead of increasing speed.",
    );
  }

  return {
    strengths,
    weaknesses,
    recommendations,
  };
}
