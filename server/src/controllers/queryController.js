import { answerQuestion } from "../services/ragService.js";
import { logError } from "../utils/logger.js";

export async function queryKnowledge(req, res) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        message: "Please provide a valid question.",
      });
    }

    if (question.length > 2000) {
      return res.status(400).json({
        message: "Question is too long.",
      });
    }

    const result = await answerQuestion(question.trim());

    return res.status(200).json(result);

  } catch (error) {
    logError("Question processing failed", {
      error: error.message,
    });

    return res.status(500).json({
      message: error.message || "Unable to process question.",
    });
  }
}