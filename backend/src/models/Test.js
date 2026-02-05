import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    questionIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Question",
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number, // minutes
      required: true,
      min: 1,
    },

    difficultyPreference: {
      type: String,
      enum: ["easy", "medium", "hard", "intermediate"],
      required: true,
    },

    topicPreference: {
      type: [String],
      default: undefined,
    },

    companyPreference: {
      type: String,
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Test", testSchema);
