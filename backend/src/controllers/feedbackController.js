import { evaluateTest } from "../services/evaluationService.js";
import FeedbackReport from "../models/FeedbackReport.js";
import TestResult from "../models/TestResult.js";

/**
 * Generate feedback report for a submitted test result
 * POST /api/feedback-report
 */
async function generateFeedbackReport(req, res, next) {
  try {
    const { testResultId } = req.body;

    if (!testResultId) {
      return res.status(400).json({
        success: false,
        message: "testResultId is required",
      });
    }

    // Return cached report if it already exists for this testResult
    const existingReport = await FeedbackReport.findOne({
      testResult: testResultId,
    })
      .populate("test", "title durationMinutes")
      .lean();

    if (existingReport) {
      return res.status(200).json({
        success: true,
        data: existingReport,
        meta: { cached: true },
      });
    }

    const testResult = await TestResult.findById(testResultId)
      .populate({
        path: "test",
        populate: {
          path: "questions",
          model: "Question",
        },
      })
      .populate({
        path: "answers.question",
        model: "Question",
      });

    if (!testResult) {
      return res.status(404).json({
        success: false,
        message: `No test result found with ID: ${testResultId}`,
      });
    }

    if (!testResult.test) {
      return res.status(400).json({
        success: false,
        message: "Test metadata is missing for this result",
      });
    }

    const questionMap = new Map();
    const populatedTestQuestions = testResult.test.questions ?? [];

    populatedTestQuestions.forEach((question) => {
      if (question?._id) {
        questionMap.set(question._id.toString(), question);
      }
    });

    const evaluationQuestions = [];

    for (let index = 0; index < testResult.answers.length; index += 1) {
      const answer = testResult.answers[index];
      const questionDoc =
        answer.question && answer.question.questionText
          ? answer.question
          : questionMap.get(answer.question?.toString());

      if (!questionDoc) {
        return res.status(400).json({
          success: false,
          message: `Unable to locate question details for answer index ${index}`,
        });
      }

      evaluationQuestions.push({
        questionId: questionDoc._id.toString(),
        type: questionDoc.type,
        topic: questionDoc.topic,
        questionText: questionDoc.questionText,
        userAnswer: answer.answer ?? "",
        correctAnswer: questionDoc.correctAnswer,
        marks: questionDoc.marks ?? 0,
        expectedOutput: questionDoc.expectedOutput,
      });
    }

    const evaluationPayload = {
      userId: testResult.userId,
      questions: evaluationQuestions,
    };

    const feedbackMetrics = evaluateTest(evaluationPayload);

    const reportPayload = {
      ...feedbackMetrics,
      userId: testResult.userId,
      test: testResult.test._id,
      testResult: testResult._id,
      testTitle: testResult.test.title,
    };

    const savedReportDoc = await FeedbackReport.findOneAndUpdate(
      { testResult: testResult._id },
      reportPayload,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const savedReport = savedReportDoc.toObject();

    res.status(200).json({
      success: true,
      data: savedReport,
      meta: { cached: false },
    });
  } catch (error) {
    console.error("Error generating feedback report:", error);
    next(error);
  }
}

/**
 * Get feedback reports for a user
 * GET /api/feedback-report/:userId
 */
async function getUserFeedbackReports(req, res, next) {
  try {
    const { userId } = req.params;

    const reports = await FeedbackReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("test", "title durationMinutes totalMarks")
      .lean();

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User ID '${userId}' not found or has no feedback reports`,
      });
    }

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching feedback reports:", error);
    next(error);
  }
}

/**
 * Get a specific feedback report by ID
 * GET /api/feedback-report/report/:reportId
 */
async function getFeedbackReportById(req, res, next) {
  try {
    const { reportId } = req.params;

    const report = await FeedbackReport.findById(reportId)
      .populate("test", "title durationMinutes totalMarks")
      .populate("testResult", "userId createdAt")
      .lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Feedback report not found",
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error fetching feedback report:", error);
    next(error);
  }
}

/**
 * Get the submitted answers for a specific feedback report
 * GET /api/feedback-report/report/:reportId/test-data
 */
async function getTestDataByReportId(req, res, next) {
  try {
    const { reportId } = req.params;

    const report = await FeedbackReport.findById(reportId)
      .populate({
        path: "testResult",
        populate: {
          path: "answers.question",
          select: "questionText type topic marks correctAnswer expectedOutput",
        },
      })
      .lean();

    if (!report || !report.testResult) {
      return res.status(404).json({
        success: false,
        message: `No report found with ID: ${reportId}`,
      });
    }

    const { testResult } = report;

    const answers = (testResult.answers || []).map((answer) => ({
      questionId: answer.question?._id?.toString() ?? null,
      questionText: answer.question?.questionText,
      type: answer.question?.type,
      topic: answer.question?.topic,
      marks: answer.question?.marks,
      userAnswer: answer.answer,
      correctAnswer: answer.question?.correctAnswer,
      expectedOutput: answer.question?.expectedOutput,
    }));

    res.status(200).json({
      success: true,
      data: {
        userId: testResult.userId,
        testId: testResult.test?.toString() ?? null,
        submittedAt: testResult.submittedAt,
        answers,
      },
    });
  } catch (error) {
    console.error("Error fetching test data:", error);
    next(error);
  }
}

export {
  generateFeedbackReport,
  getUserFeedbackReports,
  getFeedbackReportById,
  getTestDataByReportId,
};
