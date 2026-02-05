import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedOption: {
      type: String,
      default: null, // null = unattempted
    },

    timeTaken: {
      type: Number, // seconds
      min: 0,
      default: 0,
    },
  },
  { _id: false },
);

const testAttemptSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    responses: {
      type: [responseSchema],
      required: true,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    score: {
      type: Number,
      default: 0,
    },

    correctCount: Number,
    wrongCount: Number,
    unattemptedCount: Number,
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate submissions for same test
testAttemptSchema.index({ testId: 1, userId: 1 });

export default mongoose.model("TestAttempt", testAttemptSchema);
