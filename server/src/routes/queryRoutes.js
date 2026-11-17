import express from "express";

import {
  queryKnowledge,
} from "../controllers/queryController.js";

const router = express.Router();

router.post("/", queryKnowledge);

export default router;