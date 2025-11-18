import Test from "../models/Test.js";
import Question from "../models/Question.js";

async function createTest(req, res, next) {
  try {
    const { title, description, questionIds, durationMinutes, tags } = req.body;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "questionIds array is required",
      });
    }

    const questions = await Question.find({ _id: { $in: questionIds } });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some questionIds are invalid",
      });
    }

    const totalMarks = questions.reduce((sum, q) => sum + (q.marks ?? 0), 0);

    const test = await Test.create({
      title,
      description,
      questions: questionIds,
      durationMinutes,
      totalMarks,
      tags,
    });

    res.status(201).json({ success: true, data: test });
  } catch (error) {
    console.error("Error creating test:", error);
    next(error);
  }
}

async function getTests(req, res, next) {
  try {
    const tests = await Test.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    const summaries = tests.map((test) => ({
      _id: test._id,
      title: test.title,
      description: test.description,
      durationMinutes: test.durationMinutes,
      totalMarks: test.totalMarks,
      questionCount: test.questions.length,
      tags: test.tags,
    }));

    res.status(200).json({ success: true, data: summaries });
  } catch (error) {
    console.error("Error fetching tests:", error);
    next(error);
  }
}

async function getTestById(req, res, next) {
  try {
    const { id } = req.params;

    const test = await Test.findById(id)
      .populate({ path: "questions", model: "Question" })
      .lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: `Test not found for id: ${id}`,
      });
    }

    res.status(200).json({ success: true, data: test });
  } catch (error) {
    console.error("Error fetching test:", error);
    next(error);
  }
}

export { createTest, getTests, getTestById };
