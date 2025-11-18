import { Schema, model } from "mongoose";

const testSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    durationMinutes: {
      type: Number,
      default: 60,
      min: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: undefined,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

//It runs automatically before every .save() or .create() call on the Test model.
testSchema.pre("save", function updateTotalMarks(next) {
  //This ensures recalculation only happens when questions or totalMarks are modified
  if (!this.isModified("questions") && !this.isModified("totalMarks")) {
    return next();
  }

  //ensures it only tries to sum marks if the questions field has been populated (so it has full question objects, not just ObjectIds).
  if (this.populated("questions") && Array.isArray(this.questions)) {
    this.totalMarks = this.questions.reduce((sum, question) => {
      const marks = question?.marks ?? 0;
      return sum + marks;
    }, 0);
  }

  next();
});

export default model("Test", testSchema);
