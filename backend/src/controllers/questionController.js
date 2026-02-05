import Question from "../models/Question.js";

async function createQuestion(req, res, next) {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    console.error("Error creating question:", error);
    next(error);
  }
}

async function bulkCreateQuestions(req, res, next) {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "questions array is required",
      });
    }

    const created = await Question.insertMany(questions);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Error bulk creating questions:", error);
    next(error);
  }
}

async function getQuestions(req, res, next) {
  try {
    const { topic, subtopic, type, difficulty, company } = req.query;

    const filters = {};
    if (topic) filters.topic = topic;
    if (subtopic) filters.subtopic = subtopic;
    if (type) filters.type = type;
    if (difficulty) filters.difficulty = difficulty;
    if (company) filters.company = company;

    const questions = await Question.find(filters)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    next(error);
  }
}

async function getQuestionById(req, res, next) {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).lean();

    if (!question) {
      return res.status(404).json({
        success: false,
        message: `Question not found for id: ${id}`,
      });
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    console.error("Error fetching question:", error);
    next(error);
  }
}

export { createQuestion, bulkCreateQuestions, getQuestions, getQuestionById };
