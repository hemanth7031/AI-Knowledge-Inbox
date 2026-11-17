import {
  extractUrlContent,
} from "../services/contentService.js";

import {
  saveContent,
  getAllItems,
} from "../services/ragService.js";

import {
  logInfo,
  logError,
} from "../utils/logger.js";

export async function ingestContent(req, res) {
  try {
    const { type, title, content, url } = req.body;

    if (!["text", "url"].includes(type)) {
      return res.status(400).json({
        message: "Type must be text or url.",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required.",
      });
    }

    let finalContent = content || "";
    let finalUrl = null;

    if (type === "url") {
      if (!url || !url.trim()) {
        return res.status(400).json({
          message: "URL is required.",
        });
      }

      const extracted = await extractUrlContent(url);

      finalContent = extracted.content;
      finalUrl = url;

    } else if (!finalContent.trim()) {
      return res.status(400).json({
        message: "Content is required.",
      });
    }

    if (finalContent.length > 100000) {
      return res.status(400).json({
        message: "Content is too large. Maximum 100000 characters.",
      });
    }

    const itemId = await saveContent({
      title: title.trim(),
      type,
      content: finalContent,
      url: finalUrl,
    });

    logInfo("Content saved", {
      itemId,
      type,
    });

    return res.status(201).json({
      message: "Content saved successfully.",
      itemId,
    });

  } catch (error) {
    logError("Content ingestion failed", {
      error: error.message,
    });

    return res.status(500).json({
      message: error.message || "Unable to save content.",
    });
  }
}

export function getItems(req, res) {
  try {
    const items = getAllItems();

    return res.status(200).json({
      items,
    });

  } catch (error) {
    logError("Unable to get items", {
      error: error.message,
    });

    return res.status(500).json({
      message: "Unable to retrieve saved content.",
    });
  }
}