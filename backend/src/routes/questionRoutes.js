import { Router } from "express";
import {
  createQuestion,
  bulkCreateQuestions,
  getQuestions,
  getQuestionById,
} from "../controllers/questionController.js";

const router = Router();

router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.post("/", createQuestion);
router.post("/bulk", bulkCreateQuestions);

export default router;
