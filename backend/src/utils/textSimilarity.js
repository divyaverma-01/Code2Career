/**
 * Text similarity utility functions for paragraph answer analysis (ES Module version)
 * Currently implements rule-based analysis, can be extended with AI/ML later.
 */

/**
 * Calculate cosine similarity between two text strings
 * Simplified version using word frequency vectors
 */
export const cosineSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;

  // Normalize and tokenize
  const words1 = text1.toLowerCase().match(/\b\w+\b/g) || [];
  const words2 = text2.toLowerCase().match(/\b\w+\b/g) || [];

  if (words1.length === 0 || words2.length === 0) return 0;

  // Create word frequency maps
  const freq1 = {};
  const freq2 = {};
  const allWords = new Set([...words1, ...words2]);

  words1.forEach((word) => {
    freq1[word] = (freq1[word] || 0) + 1;
  });

  words2.forEach((word) => {
    freq2[word] = (freq2[word] || 0) + 1;
  });

  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  allWords.forEach((word) => {
    const count1 = freq1[word] || 0;
    const count2 = freq2[word] || 0;
    dotProduct += count1 * count2;
    magnitude1 += count1 * count1;
    magnitude2 += count2 * count2;
  });

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
};

/**
 * Calculate keyword overlap score
 * Checks how many important keywords from correct answer appear in user answer
 */
export const keywordOverlapScore = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return 0;

  const userWords = new Set(userAnswer.toLowerCase().match(/\b\w+\b/g) || []);
  const correctWords = new Set(
    correctAnswer.toLowerCase().match(/\b\w+\b/g) || []
  );

  if (correctWords.size === 0) return 0;

  // Filter out common stop words
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
  ]);

  const userKeywords = Array.from(userWords).filter(
    (word) => word.length > 3 && !stopWords.has(word)
  );
  const correctKeywords = Array.from(correctWords).filter(
    (word) => word.length > 3 && !stopWords.has(word)
  );

  if (correctKeywords.length === 0) return 0;

  const matchedKeywords = userKeywords.filter((word) =>
    correctKeywords.includes(word)
  ).length;

  return matchedKeywords / correctKeywords.length;
};

/**
 * Calculate vocabulary richness score
 * Based on unique words ratio and average word length
 */
export const vocabularyRichness = (text) => {
  if (!text) return 0;

  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  if (words.length === 0) return 0;

  const uniqueWords = new Set(words);
  const uniqueRatio = uniqueWords.size / words.length;

  const avgWordLength =
    words.reduce((sum, word) => sum + word.length, 0) / words.length;

  // Combined score (0-1 scale)
  return uniqueRatio * 0.6 + Math.min(avgWordLength / 10, 1) * 0.4;
};

/**
 * Analyze paragraph answer quality
 * Returns a score between 0 and 1
 */
export const analyzeParagraphAnswer = (userAnswer, correctAnswer) => {
  if (!userAnswer || userAnswer.trim().length === 0) return 0;

  // Calculate multiple metrics
  const similarityScore = cosineSimilarity(userAnswer, correctAnswer);
  const keywordScore = keywordOverlapScore(userAnswer, correctAnswer);
  const vocabScore = vocabularyRichness(userAnswer);

  // Length check - answers that are too short get penalized
  const lengthScore = Math.min(userAnswer.trim().length / 200, 1);

  // Weighted combination
  const finalScore =
    similarityScore * 0.4 +
    keywordScore * 0.3 +
    vocabScore * 0.2 +
    lengthScore * 0.1;

  return Math.min(Math.max(finalScore, 0), 1);
};

// /**
//  * Text similarity utility functions for paragraph answer analysis
//  * Currently implements rule-based analysis, can be extended with AI/ML later
//  */

// /**
//  * Calculate cosine similarity between two text strings
//  * Simplified version using word frequency vectors
//  */
// function cosineSimilarity(text1, text2) {
//   if (!text1 || !text2) return 0;

//   // Normalize and tokenize
//   const words1 = text1.toLowerCase().match(/\b\w+\b/g) || [];
//   const words2 = text2.toLowerCase().match(/\b\w+\b/g) || [];

//   if (words1.length === 0 || words2.length === 0) return 0;

//   // Create word frequency maps
//   const freq1 = {};
//   const freq2 = {};
//   const allWords = new Set([...words1, ...words2]);

//   words1.forEach((word) => {
//     freq1[word] = (freq1[word] || 0) + 1;
//   });

//   words2.forEach((word) => {
//     freq2[word] = (freq2[word] || 0) + 1;
//   });

//   // Calculate dot product and magnitudes
//   let dotProduct = 0;
//   let magnitude1 = 0;
//   let magnitude2 = 0;

//   allWords.forEach((word) => {
//     const count1 = freq1[word] || 0;
//     const count2 = freq2[word] || 0;
//     dotProduct += count1 * count2;
//     magnitude1 += count1 * count1;
//     magnitude2 += count2 * count2;
//   });

//   if (magnitude1 === 0 || magnitude2 === 0) return 0;

//   return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
// }

// /**
//  * Calculate keyword overlap score
//  * Checks how many important keywords from correct answer appear in user answer
//  */
// function keywordOverlapScore(userAnswer, correctAnswer) {
//   if (!userAnswer || !correctAnswer) return 0;

//   const userWords = new Set(userAnswer.toLowerCase().match(/\b\w+\b/g) || []);
//   const correctWords = new Set(
//     correctAnswer.toLowerCase().match(/\b\w+\b/g) || []
//   );

//   if (correctWords.size === 0) return 0;

//   // Filter out common stop words
//   const stopWords = new Set([
//     "the",
//     "a",
//     "an",
//     "and",
//     "or",
//     "but",
//     "in",
//     "on",
//     "at",
//     "to",
//     "for",
//     "of",
//     "with",
//     "by",
//     "is",
//     "are",
//     "was",
//     "were",
//     "be",
//     "been",
//     "being",
//     "have",
//     "has",
//     "had",
//     "do",
//     "does",
//     "did",
//     "will",
//     "would",
//     "could",
//     "should",
//   ]);

//   const userKeywords = Array.from(userWords).filter(
//     (word) => word.length > 3 && !stopWords.has(word)
//   );
//   const correctKeywords = Array.from(correctWords).filter(
//     (word) => word.length > 3 && !stopWords.has(word)
//   );

//   if (correctKeywords.length === 0) return 0;

//   const matchedKeywords = userKeywords.filter((word) =>
//     correctKeywords.includes(word)
//   ).length;

//   return matchedKeywords / correctKeywords.length;
// }

// /**
//  * Calculate vocabulary richness score
//  * Based on unique words ratio and average word length
//  */
// function vocabularyRichness(text) {
//   if (!text) return 0;

//   const words = text.toLowerCase().match(/\b\w+\b/g) || [];
//   if (words.length === 0) return 0;

//   const uniqueWords = new Set(words);
//   const uniqueRatio = uniqueWords.size / words.length;

//   const avgWordLength =
//     words.reduce((sum, word) => sum + word.length, 0) / words.length;

//   // Combined score (0-1 scale)
//   return uniqueRatio * 0.6 + Math.min(avgWordLength / 10, 1) * 0.4;
// }

// /**
//  * Analyze paragraph answer quality
//  * Returns a score between 0 and 1
//  */
// function analyzeParagraphAnswer(userAnswer, correctAnswer) {
//   if (!userAnswer || userAnswer.trim().length === 0) return 0;

//   // Calculate multiple metrics
//   const similarityScore = cosineSimilarity(userAnswer, correctAnswer);
//   const keywordScore = keywordOverlapScore(userAnswer, correctAnswer);
//   const vocabScore = vocabularyRichness(userAnswer);

//   // Length check - answers that are too short get penalized
//   const lengthScore = Math.min(userAnswer.trim().length / 200, 1);

//   // Weighted combination
//   const finalScore =
//     similarityScore * 0.4 +
//     keywordScore * 0.3 +
//     vocabScore * 0.2 +
//     lengthScore * 0.1;

//   return Math.min(Math.max(finalScore, 0), 1);
// }

// module.exports = {
//   cosineSimilarity,
//   keywordOverlapScore,
//   vocabularyRichness,
//   analyzeParagraphAnswer,
// };
