import { Router } from "express";
import { generateTest, getTestById } from "../controllers/testController.js";

const router = Router();

router.post("/", generateTest);
router.get("/:id", getTestById);

export default router;
