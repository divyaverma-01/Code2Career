import { Router } from "express";
import {
  generateFeedbackReport,
  getUserFeedbackReports,
  getFeedbackReportById,
  getTestDataByReportId,
} from "../controllers/feedbackController.js";

/**
 * Feedback Report Routes
 *
 * POST /api/feedback-report - Generate a new feedback report
 * GET /api/feedback-report/:userId - Get all feedback reports for a user
 * GET /api/feedback-report/report/:reportId - Get a specific feedback report by ID
 */

const router = Router();

// Generate feedback report
router.post("/report", generateFeedbackReport);

// Get user's feedback reports
router.get("/user/:userId", getUserFeedbackReports);

// Get specific feedback report
router.get("/report/:reportId", getFeedbackReportById);

// Get only the test data for a specific feedback report
router.get("/report/:reportId/test-data", getTestDataByReportId);

export default router;
