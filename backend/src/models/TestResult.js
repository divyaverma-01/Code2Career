import { Schema, model } from "mongoose";

const answerSchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answer: {
      type: String,
      default: "",
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
);

const testResultSchema = new Schema(
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
    answers: {
      type: [answerSchema],
      default: [],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Answers required",
      ],
    },
    startedAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    durationSeconds: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

testResultSchema.index({ test: 1, userId: 1, createdAt: -1 });

testResultSchema.virtual("answerCount").get(function getAnswerCount() {
  return this.answers?.length ?? 0;
});

export default model("TestResult", testResultSchema);
