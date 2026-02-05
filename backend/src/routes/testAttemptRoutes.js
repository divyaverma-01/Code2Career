import { Router } from "express";
import {
  submitTestAttempt,
  getTestAttemptById,
} from "../controllers/testAttemptController.js";

const router = Router();

router.post("/", submitTestAttempt);
router.get("/:id", getTestAttemptById);

export default router;
