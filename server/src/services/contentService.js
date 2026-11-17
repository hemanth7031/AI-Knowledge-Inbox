import * as cheerio from "cheerio";

export async function extractUrlContent(url) {
  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  const response = await fetch(parsedUrl, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent": "AI-Knowledge-Inbox/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to read URL. Status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("text/html")) {
    throw new Error("The URL must return an HTML page.");
  }

  const html = await response.text();

  if (html.length > 2_000_000) {
    throw new Error("The webpage is too large to process.");
  }

  const $ = cheerio.load(html);

  $("script, style, nav, footer, header, noscript, iframe").remove();

  const title = $("title").text().trim();

  const content = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  if (!content) {
    throw new Error("No readable content found on this webpage.");
  }

  return {
    title,
    content,
  };
}

export function splitIntoChunks(text, chunkSize = 1000, overlap = 150) {
  const chunks = [];
  const cleanText = text.trim();

  let start = 0;

  while (start < cleanText.length) {
    const end = Math.min(start + chunkSize, cleanText.length);

    const chunk = cleanText.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === cleanText.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}