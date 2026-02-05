import TestAttempt from "../models/TestAttempt.js";
import Test from "../models/Test.js";
import Question from "../models/Question.js";
import { analyzeMCQAttempt } from "../services/mcqAnalysisService.js";
import { generateMCQFeedback } from "../services/mcqFeedbackService.js";

/**
 * POST /test-attempts/submit
 * Submit test attempt & evaluate MCQs
 */
async function submitTestAttempt(req, res, next) {
  try {
    const { testId, userId, responses, startedAt } = req.body;

    if (!testId || !userId || !Array.isArray(responses)) {
      return res.status(400).json({
        success: false,
        message: "testId, userId and responses are required",
      });
    }

    const test = await Test.findById(testId).lean();
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    const questions = await Question.find({
      _id: { $in: test.questionIds },
    }).lean();

    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    /* ─── Evaluation ─── */
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    responses.forEach((r) => {
      const q = questionMap[r.questionId];
      if (!q) return;

      if (r.selectedOption === null) {
        unattempted++;
      } else if (r.selectedOption === q.correctAnswer) {
        correct++;
        score += q.marks;
      } else {
        wrong++;
      }
    });

    /* ─── Store attempt ─── */
    const attempt = await TestAttempt.create({
      testId,
      userId,
      responses,
      startedAt,
      submittedAt: new Date(),
      score,
      correctCount: correct,
      wrongCount: wrong,
      unattemptedCount: unattempted,
    });

    res.status(201).json({
      success: true,
      data: {
        attemptId: attempt._id,
        score,
        correct,
        wrong,
        unattempted,
        totalMarks: test.totalMarks,
      },
    });
  } catch (error) {
    console.error("Error submitting test attempt:", error);
    next(error);
  }
}

/**
 * GET /test-attempts/:id
 * Review test attempt (with answers & evaluation)
 */
async function getTestAttemptById(req, res, next) {
  try {
    const { id } = req.params;

    const attempt = await TestAttempt.findById(id).lean();
    if (!attempt) {
      return res
        .status(404)
        .json({ success: false, message: "Attempt not found" });
    }

    const test = await Test.findById(attempt.testId).lean();
    const questions = await Question.find({
      _id: { $in: test.questionIds },
    }).lean();

    const analysis = analyzeMCQAttempt(test, questions, attempt);
    const feedback = generateMCQFeedback(analysis);

    res.status(200).json({
      success: true,
      data: {
        attempt,
        analysis,
        feedback,
      },
    });
  } catch (error) {
    console.error("Error fetching test attempt:", error);
    next(error);
  }
}

export { submitTestAttempt, getTestAttemptById };

// async function getTestAttemptById(req, res, next) {
//   try {
//     const { id } = req.params;

//     const attempt = await TestAttempt.findById(id)
//       .populate("testId")
//       .populate({
//         path: "responses.questionId",
//         select: "questionText options correctAnswer topic difficulty marks",
//       })
//       .lean();

//     if (!attempt) {
//       return res.status(404).json({
//         success: false,
//         message: "Test attempt not found",
//       });
//     }

//     res.status(200).json({ success: true, data: attempt });
//   } catch (error) {
//     console.error("Error fetching test attempt:", error);
//     next(error);
//   }
// }
