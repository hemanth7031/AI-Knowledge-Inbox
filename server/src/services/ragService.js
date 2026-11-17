import OpenAI from "openai";
import db from "../db/database.js";
import { splitIntoChunks } from "./contentService.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createEmbedding(text) {
  const result = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return result.data[0].embedding;
}

function cosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

export async function saveContent({ title, type, content, url }) {
  const chunks = splitIntoChunks(content);

  if (chunks.length === 0) {
    throw new Error("No content available to save.");
  }

  // Generate all embeddings before inserting the item.
  const preparedChunks = [];

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);

    preparedChunks.push({
      content: chunk,
      embedding: JSON.stringify(embedding),
    });
  }

  const insertItem = db.prepare(`
    INSERT INTO items (title, type, content, url, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertChunk = db.prepare(`
    INSERT INTO chunks (item_id, content, embedding)
    VALUES (?, ?, ?)
  `);

  const saveTransaction = db.transaction(() => {
    const result = insertItem.run(
      title,
      type,
      content,
      url || null,
      new Date().toISOString()
    );

    const itemId = Number(result.lastInsertRowid);

    for (const chunk of preparedChunks) {
      insertChunk.run(itemId, chunk.content, chunk.embedding);
    }

    return itemId;
  });

  return saveTransaction();
}

export function getAllItems() {
  return db.prepare(`
    SELECT
      id,
      title,
      type,
      url,
      created_at,
      substr(content, 1, 200) AS preview
    FROM items
    ORDER BY id DESC
  `).all();
}

export async function answerQuestion(question) {
  const questionEmbedding = await createEmbedding(question);

  const rows = db.prepare(`
    SELECT
      chunks.id AS chunk_id,
      chunks.content,
      chunks.embedding,
      items.title,
      items.url
    FROM chunks
    INNER JOIN items ON items.id = chunks.item_id
  `).all();

  if (rows.length === 0) {
    return {
      answer: "No saved knowledge found. Please add some content first.",
      sources: [],
    };
  }

  const rankedChunks = rows
    .map((row) => ({
      ...row,
      score: cosineSimilarity(
        questionEmbedding,
        JSON.parse(row.embedding)
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const context = rankedChunks
    .map((chunk, index) => {
      return `Source ${index + 1}: ${chunk.title}\n${chunk.content}`;
    })
    .join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an AI knowledge assistant.

Answer the user's question using only the supplied context.
If the answer is not available in the context, clearly say that.
Do not invent facts.
Mention source numbers such as [Source 1] when appropriate.
        `.trim(),
      },
      {
        role: "user",
        content: `
Context:
${context}

Question:
${question}
        `.trim(),
      },
    ],
    temperature: 0.2,
  });

  const answer = completion.choices[0].message.content;

  const sources = rankedChunks.map((chunk) => ({
    chunk_id: chunk.chunk_id,
    title: chunk.title,
    content: chunk.content,
    url: chunk.url,
    score: Number(chunk.score.toFixed(4)),
  }));

  return {
    answer,
    sources,
  };
}