/**
 * Code analysis utility functions (ES Module version)
 * Currently implements rule-based analysis, can be extended with AI/compiler integration later.
 */

/**
 * Check if code contains expected keywords/patterns
 */
export const checkCodeKeywords = (code, expectedKeywords = []) => {
  if (!code) return false;

  const codeLower = code.toLowerCase();
  return expectedKeywords.some((keyword) =>
    codeLower.includes(keyword.toLowerCase())
  );
};

/**
 * Compare code outputs (simple string comparison)
 * In production, this would run the code and compare outputs
 */
export const compareCodeOutput = (userOutput, expectedOutput) => {
  if (!userOutput || !expectedOutput) return false;

  // Normalize outputs (trim, remove extra whitespace)
  const normalizedUser = userOutput.trim().replace(/\s+/g, " ");
  const normalizedExpected = expectedOutput.trim().replace(/\s+/g, " ");

  return normalizedUser === normalizedExpected;
};

/**
 * Check code structure quality
 * Looks for common patterns, proper syntax indicators
 */
export const analyzeCodeStructure = (code) => {
  if (!code) return { score: 0, issues: [] };

  const issues = [];
  let score = 1.0;

  // Check for basic syntax indicators
  const hasOpeningBraces = (code.match(/{/g) || []).length;
  const hasClosingBraces = (code.match(/}/g) || []).length;
  if (hasOpeningBraces !== hasClosingBraces) {
    issues.push("Mismatched braces");
    score -= 0.3;
  }

  // Check for parentheses balance
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    issues.push("Mismatched parentheses");
    score -= 0.2;
  }

  // Check for basic control structures
  const hasControlStructures = /(if|else|for|while|switch|return)/i.test(code);
  if (!hasControlStructures && code.length > 50) {
    issues.push("Missing control structures");
    score -= 0.1;
  }

  // Check for comments (good practice indicator)
  const hasComments = /(\/\/|\/\*|\*\/)/.test(code);
  if (hasComments) {
    score += 0.05; // Small bonus
  }

  return {
    score: Math.max(0, Math.min(1, score)),
    issues,
  };
};

/**
 * Analyze code quality and correctness
 * Returns a score between 0 and 1
 */
export const analyzeCodeAnswer = (userCode, correctOutput, expectedOutput) => {
  if (!userCode || userCode.trim().length === 0) return 0;

  let score = 0;

  // Output comparison (if provided)
  if (expectedOutput && correctOutput) {
    const outputMatch = compareCodeOutput(userCode, expectedOutput);
    if (outputMatch) {
      return 1.0; // Perfect match
    }
  }

  // If output doesn't match, check code structure and logic
  const structureAnalysis = analyzeCodeStructure(userCode);
  score = structureAnalysis.score * 0.6;

  // Check for common algorithmic patterns
  const hasLoops = /(for|while|do\s*\{)/i.test(userCode);
  const hasConditionals = /(if|else|switch)/i.test(userCode);
  const hasReturns = /return/i.test(userCode);
  const hasFunctions = /(function|=>|def\s+\w+)/i.test(userCode);

  // Logic score based on presence of expected constructs
  let logicScore = 0;
  if (hasFunctions) logicScore += 0.3;
  if (hasLoops) logicScore += 0.2;
  if (hasConditionals) logicScore += 0.2;
  if (hasReturns) logicScore += 0.3;

  score += logicScore * 0.4;

  // If correctOutput is provided as a string pattern, check for keyword matches
  if (correctOutput && typeof correctOutput === "string") {
    const keywords =
      correctOutput
        .toLowerCase()
        .match(/\b\w+\b/g)
        ?.filter((w) => w.length > 3) || [];

    if (keywords.length > 0) {
      const keywordMatches = keywords.filter((kw) =>
        userCode.toLowerCase().includes(kw)
      ).length;
      score += (keywordMatches / keywords.length) * 0.2;
    }
  }

  return Math.min(Math.max(score, 0), 1);
};

// /**
//  * Code analysis utility functions
//  * Currently implements rule-based analysis, can be extended with AI/compiler integration later
//  */

// /**
//  * Check if code contains expected keywords/patterns
//  */
// function checkCodeKeywords(code, expectedKeywords = []) {
//   if (!code) return false;

//   const codeLower = code.toLowerCase();
//   return expectedKeywords.some((keyword) =>
//     codeLower.includes(keyword.toLowerCase())
//   );
// }

// /**
//  * Compare code outputs (simple string comparison)
//  * In production, this would run the code and compare outputs
//  */
// function compareCodeOutput(userOutput, expectedOutput) {
//   if (!userOutput || !expectedOutput) return false;

//   // Normalize outputs (trim, remove extra whitespace)
//   const normalizedUser = userOutput.trim().replace(/\s+/g, " ");
//   const normalizedExpected = expectedOutput.trim().replace(/\s+/g, " ");

//   return normalizedUser === normalizedExpected;
// }

// /**
//  * Check code structure quality
//  * Looks for common patterns, proper syntax indicators
//  */
// function analyzeCodeStructure(code) {
//   if (!code) return { score: 0, issues: [] };

//   const issues = [];
//   let score = 1.0;

//   // Check for basic syntax indicators
//   const hasOpeningBraces = (code.match(/{/g) || []).length;
//   const hasClosingBraces = (code.match(/}/g) || []).length;
//   if (hasOpeningBraces !== hasClosingBraces) {
//     issues.push("Mismatched braces");
//     score -= 0.3;
//   }

//   // Check for parentheses balance
//   const openParens = (code.match(/\(/g) || []).length;
//   const closeParens = (code.match(/\)/g) || []).length;
//   if (openParens !== closeParens) {
//     issues.push("Mismatched parentheses");
//     score -= 0.2;
//   }

//   // Check for basic control structures
//   const hasControlStructures = /(if|else|for|while|switch|return)/i.test(code);
//   if (!hasControlStructures && code.length > 50) {
//     issues.push("Missing control structures");
//     score -= 0.1;
//   }

//   // Check for comments (good practice indicator)
//   const hasComments = /(\/\/|\/\*|\*\/)/.test(code);
//   if (hasComments) {
//     score += 0.05; // Small bonus
//   }

//   return {
//     score: Math.max(0, Math.min(1, score)),
//     issues,
//   };
// }

// /**
//  * Analyze code quality and correctness
//  * Returns a score between 0 and 1
//  */
// function analyzeCodeAnswer(userCode, correctOutput, expectedOutput) {
//   if (!userCode || userCode.trim().length === 0) return 0;

//   let score = 0;

//   // Output comparison (if provided)
//   if (expectedOutput && correctOutput) {
//     const outputMatch = compareCodeOutput(userCode, expectedOutput);
//     if (outputMatch) {
//       score = 1.0; // Perfect match
//       return score;
//     }
//   }

//   // If output doesn't match, check code structure and logic
//   const structureAnalysis = analyzeCodeStructure(userCode);
//   score = structureAnalysis.score * 0.6;

//   // Check for common algorithmic patterns
//   const hasLoops = /(for|while|do\s*\{)/i.test(userCode);
//   const hasConditionals = /(if|else|switch)/i.test(userCode);
//   const hasReturns = /return/i.test(userCode);
//   const hasFunctions = /(function|=>|def\s+\w+)/i.test(userCode);

//   // Logic score based on presence of expected constructs
//   let logicScore = 0;
//   if (hasFunctions) logicScore += 0.3;
//   if (hasLoops) logicScore += 0.2;
//   if (hasConditionals) logicScore += 0.2;
//   if (hasReturns) logicScore += 0.3;

//   score += logicScore * 0.4;

//   // If correctOutput is provided as a string pattern, check for keyword matches
//   if (correctOutput && typeof correctOutput === "string") {
//     const keywords = correctOutput
//       .toLowerCase()
//       .match(/\b\w+\b/g)
//       .filter((w) => w.length > 3);
//     if (keywords && keywords.length > 0) {
//       const keywordMatches = keywords.filter((kw) =>
//         userCode.toLowerCase().includes(kw)
//       ).length;
//       score += (keywordMatches / keywords.length) * 0.2;
//     }
//   }

//   return Math.min(Math.max(score, 0), 1);
// }

// module.exports = {
//   checkCodeKeywords,
//   compareCodeOutput,
//   analyzeCodeStructure,
//   analyzeCodeAnswer,
// };
