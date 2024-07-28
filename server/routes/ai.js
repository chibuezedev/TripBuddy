import express from "express";
import {
  generateText,
  generateCode,
  assistCompletion,
  chatWithAssistant,
  getTravelSuggestion
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/text", generateText);
router.post("/code", generateCode);
router.post("/assist", assistCompletion);
router.post("/chat", chatWithAssistant);
router.post("/suggestion", getTravelSuggestion);

export default router;
