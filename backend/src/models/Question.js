import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["mcq", "code"],
      required: true,
      default: "mcq",
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    subtopic: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    // ───── MCQ only ─────
    options: {
      type: [String],
      required: function () {
        return this.type === "mcq";
      },
    },

    correctAnswer: {
      type: String,
      required: function () {
        return this.type === "mcq";
      },
      trim: true,
    },

    // ───── Code only (future) ─────
    testCases: [
      {
        input: String,
        output: String,
      },
    ],

    constraints: String,

    supportedLanguages: [String],

    marks: {
      type: Number,
      required: true,
      min: 0,
    },

    companyTags: [String],
  },
  { timestamps: true },
);

/**
 * Indexes for fast dynamic test generation
 */
questionSchema.index({ topic: 1, subtopic: 1, difficulty: 1 });
questionSchema.index({ companyTags: 1 });

export default mongoose.model("Question", questionSchema);
