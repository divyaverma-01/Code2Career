import { Router } from "express";
import {
  createTestResult,
  getTestResultById,
} from "../controllers/testResultController.js";

const router = Router();

router.get("/:id", getTestResultById);
router.post("/", createTestResult);

export default router;
