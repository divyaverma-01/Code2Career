import { Schema, model } from "mongoose";

const topicBreakdownSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["strength", "weakness"],
      required: true,
    },
  },
  { _id: false }
);

const feedbackReportSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    test: {
      type: Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },
    testResult: {
      type: Schema.Types.ObjectId,
      ref: "TestResult",
      required: true,
      unique: true,
    },
    testTitle: {
      type: String,
      required: true,
      trim: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    accuracyPercent: {
      type: Number,
      required: true,
    },
    topicWiseBreakdown: {
      type: [topicBreakdownSchema],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    communicationScore: {
      type: Number,
      default: null,
    },
    codeQualityScore: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model("FeedbackReport", feedbackReportSchema);
