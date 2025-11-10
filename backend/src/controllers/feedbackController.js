import { evaluateTest } from "../services/evaluationService.js";
import FeedbackReport from "../models/FeedbackReport.js";

/**
 * Generate feedback report for test data
 * POST /api/feedback-report
 */
async function generateFeedbackReport(req, res, next) {
  try {
    const testData = req.body;

    // Validate input
    if (!testData.userId) {
      return res.status(400).json({
        error: "Validation error",
        message: "userId is required",
      });
    }

    if (!testData.questions || !Array.isArray(testData.questions)) {
      return res.status(400).json({
        error: "Validation error",
        message: "questions array is required",
      });
    }

    // Validate each question
    for (let i = 0; i < testData.questions.length; i++) {
      const question = testData.questions[i];
      if (!question.questionId || !question.type || !question.topic) {
        return res.status(400).json({
          error: "Validation error",
          message: `Question at index ${i} is missing required fields (questionId, type, topic)`,
        });
      }
    }

    // Generate feedback report using evaluation service
    const feedbackReport = evaluateTest(testData);

    // Optionally save to database
    try {
      const savedReport = await FeedbackReport.create(feedbackReport);
      console.log("Feedback report saved to database:", savedReport._id);
    } catch (dbError) {
      // Log error but don't fail the request if DB save fails
      console.error("Error saving report to database:", dbError.message);
    }

    // Return the feedback report
    res.status(200).json({
      success: true,
      data: feedbackReport,
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
      .select("-testData") // Exclude testData to reduce response size
      .limit(10);

    // If no reports found for this userId
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

    const report = await FeedbackReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        error: "Not found",
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
 * Get only the test data for a specific feedback report
 * GET /api/feedback-report/report/:reportId/test-data
 */
async function getTestDataByReportId(req, res, next) {
  try {
    const { reportId } = req.params;

    const report = await FeedbackReport.findById(reportId).select(
      "testData userId createdAt"
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `No report found with ID: ${reportId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: report.testData,
      meta: {
        userId: report.userId,
        createdAt: report.createdAt,
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
