import Test from "../models/Test.js";
import Question from "../models/Question.js";

const DIFFICULTY_SPLIT = {
  easy: { easy: 0.7, medium: 0.2, hard: 0.1 },
  medium: { easy: 0.2, medium: 0.6, hard: 0.2 },
  hard: { easy: 0.1, medium: 0.3, hard: 0.6 },
  intermediate: { easy: 0.4, medium: 0.4, hard: 0.2 },
};

/*
 * POST /tests/generate
 * Generates a dynamic test based on preferences
 */
async function generateTest(req, res, next) {
  try {
    const {
      totalQuestions,
      duration,
      difficultyPreference,
      topicPreference,
      companyPreference,
    } = req.body;

    /* ─── Basic Validation ─── */
    if (!totalQuestions || totalQuestions <= 0) {
      return res.status(400).json({
        success: false,
        message: "totalQuestions must be > 0",
      });
    }

    if (!DIFFICULTY_SPLIT[difficultyPreference]) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficultyPreference",
      });
    }

    /* ─── Difficulty Counts ─── */
    const split = DIFFICULTY_SPLIT[difficultyPreference];
    const difficultyCounts = {
      easy: Math.round(totalQuestions * split.easy),
      medium: Math.round(totalQuestions * split.medium),
      hard:
        totalQuestions -
        Math.round(totalQuestions * split.easy) -
        Math.round(totalQuestions * split.medium),
    };

    /* ─── Build base question filter ─── */
    const filter = { type: "mcq" };

    if (topicPreference?.length) filter.topic = { $in: topicPreference };
    if (companyPreference) filter.companyTags = companyPreference;

    const allQuestions = await Question.find(filter).lean();

    /* ─── Group Questions ─── */
    const grouped = { easy: {}, medium: {}, hard: {} };

    for (const q of allQuestions) {
      const { difficulty, topic, subtopic } = q;
      if (!grouped[difficulty]) continue;

      // builds a hierarchy like this: Difficulty → Topic → Subtopic
      grouped[difficulty][topic] ??= {};
      grouped[difficulty][topic][subtopic] ??= [];
      grouped[difficulty][topic][subtopic].push(q);
    }

    /* ─── Selection Logic ─── */
    const selected = [];

    function pickQuestions(diff, count) {
      const topics = Object.keys(grouped[diff]);
      let topicIndex = 0;
      const subtopicIndices = {};

      while (count > 0 && topics.length > 0) {
        const topic = topics[topicIndex % topics.length];
        const subtopics = Object.keys(grouped[diff][topic]);

        subtopicIndices[topic] ??= 0;

        let picked = false;
        let attempts = 0;

        while (attempts < subtopics.length) {
          const sub = subtopics[subtopicIndices[topic] % subtopics.length];
          const arr = grouped[diff][topic][sub];

          if (arr.length > 0) {
            selected.push(arr.pop());
            count--;
            subtopicIndices[topic]++;
            picked = true;
            break;
          }

          subtopicIndices[topic]++;
          attempts++;
        }

        if (!picked) {
          topics.splice(topicIndex % topics.length, 1);
          if (topics.length === 0) break;
        } else {
          topicIndex++;
        }
      }
    }

    pickQuestions("easy", difficultyCounts.easy);
    pickQuestions("medium", difficultyCounts.medium);
    pickQuestions("hard", difficultyCounts.hard);

    if (selected.length < totalQuestions) {
      return res.status(400).json({
        success: false,
        message: "Not enough questions after balancing",
      });
    }

    /* ─── Final Shuffle ─── */
    selected.sort(() => Math.random() - 0.5);

    const questionIds = selected.map((q) => q._id);
    const totalMarks = selected.reduce((s, q) => s + (q.marks || 0), 0);

    /* ─── Store Test ─── */
    const test = await Test.create({
      questionIds,
      totalQuestions,
      totalMarks,
      duration,
      difficultyPreference,
      topicPreference,
      companyPreference,
    });

    res.status(201).json({
      success: true,
      data: {
        testId: test._id,
        totalQuestions,
        totalMarks,
        duration,
        breakdown: difficultyCounts,
      },
    });
  } catch (error) {
    console.error("Error generating test: ", error);
    next(error);
  }
}

/**
 * GET /tests/:id
 * Fetch test and questions for attempt
 */
async function getTestById(req, res, next) {
  try {
    const { id } = req.params;

    /* ─── Fetch Test ─── */
    const test = await Test.findById(id).lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    /* ─── Fetch Questions ─── */
    const questions = await Question.find({
      _id: { $in: test.questionIds },
    })
      .select("-correctAnswer") // never expose answers
      .lean();

    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    const orderedQuestions = test.questionIds
      .map((qid) => questionMap[qid.toString()])
      .filter(Boolean);

    res.status(200).json({
      success: true,
      data: {
        testMeta: {
          testId: test._id,
          totalQuestions: test.totalQuestions,
          totalMarks: test.totalMarks,
          duration: test.duration,
          difficultyPreference: test.difficultyPreference,
        },
        questions: orderedQuestions,
      },
    });
  } catch (error) {
    console.error("Error fetching test:", error);
    next(error);
  }
}

export { generateTest, getTestById };
