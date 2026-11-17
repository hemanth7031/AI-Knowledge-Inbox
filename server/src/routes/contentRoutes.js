import express from "express";

import {
  ingestContent,
  getItems,
} from "../controllers/contentController.js";

const router = express.Router();

router.post("/ingest", ingestContent);
router.get("/items", getItems);

export default router;