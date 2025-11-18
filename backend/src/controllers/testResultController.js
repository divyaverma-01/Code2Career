import TestResult from "../models/TestResult.js";
import Test from "../models/Test.js";

async function createTestResult(req, res, next) {
  try {
    const { userId, testId, answers, startedAt, durationSeconds } = req.body;

    if (!userId || !testId) {
      return res.status(400).json({
        success: false,
        message: "userId and testId are required",
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "answers array is required",
      });
    }

    const test = await Test.findById(testId).populate("questions");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: `Test not found for id: ${testId}`,
      });
    }

    const validQuestionIds = new Set(
      test.questions.map((q) => q._id.toString())
    );

    const formattedAnswers = [];

    for (let index = 0; index < answers.length; index += 1) {
      const answer = answers[index];
      if (!answer?.questionId) {
        return res.status(400).json({
          success: false,
          message: `questionId is required for answer index ${index}`,
        });
      }

      if (!validQuestionIds.has(answer.questionId)) {
        return res.status(400).json({
          success: false,
          message: `Question ${answer.questionId} is not part of test ${testId}`,
        });
      }

      formattedAnswers.push({
        question: answer.questionId,
        answer: answer.answer ?? "",
        metadata: answer.metadata ?? null,
      });
    }

    const testResult = await TestResult.create({
      userId,
      test: testId,
      answers: formattedAnswers,
      startedAt,
      durationSeconds,
    });

    res.status(201).json({ success: true, data: testResult });
  } catch (error) {
    console.error("Error creating test result:", error);
    next(error);
  }
}

async function getTestResultById(req, res, next) {
  try {
    const { id } = req.params;

    const testResult = await TestResult.findById(id)
      .populate({ path: "test", select: "title durationMinutes totalMarks" })
      .populate({
        path: "answers.question",
        select: "questionText type topic marks correctAnswer expectedOutput",
      })
      .lean();

    if (!testResult) {
      return res.status(404).json({
        success: false,
        message: `Test result not found for id: ${id}`,
      });
    }

    res.status(200).json({ success: true, data: testResult });
  } catch (error) {
    console.error("Error fetching test result:", error);
    next(error);
  }
}

export { createTestResult, getTestResultById };
