import { Schema, model } from "mongoose";

const optionSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["mcq", "paragraph", "code"],
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    marks: {
      type: Number,
      default: 5,
      min: 0,
    },
    options: {
      type: [optionSchema],
      default: undefined,
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    expectedOutput: {
      type: String,
      trim: true,
    },
    keywords: {
      type: [String],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

//what does this signify?
questionSchema.index({ topic: 1, difficulty: 1 });

export default model("Question", questionSchema);
