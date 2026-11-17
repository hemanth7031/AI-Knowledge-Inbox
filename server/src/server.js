import "dotenv/config";

import express from "express";
import cors from "cors";

import contentRoutes from "./routes/contentRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";

import { logInfo } from "./utils/logger.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json({
  limit: "1mb",
}));

app.get("/", (req, res) => {
  res.json({
    message: "AI Knowledge Inbox API is running.",
  });
});

app.use("/api", contentRoutes);
app.use("/api/query", queryRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found.",
  });
});

app.listen(PORT, () => {
  logInfo("Server started", {
    port: PORT,
  });
});