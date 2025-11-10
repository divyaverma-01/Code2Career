import { Schema, model } from "mongoose";

const topicBreakdownSchema = new Schema({
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
});

const feedbackReportSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
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
    topicWiseBreakdown: [topicBreakdownSchema],
    strengths: [
      {
        type: String,
      },
    ],
    weaknesses: [
      {
        type: String,
      },
    ],
    recommendations: [
      {
        type: String,
      },
    ],
    communicationScore: {
      type: Number,
      default: null,
    },
    codeQualityScore: {
      type: Number,
      default: null,
    },
    testData: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("FeedbackReport", feedbackReportSchema);
