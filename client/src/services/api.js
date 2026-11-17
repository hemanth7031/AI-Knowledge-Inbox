import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function ingestContent(data) {
  const response = await API.post("/ingest", data);
  return response.data;
}

export async function getItems() {
  const response = await API.get("/items");
  return response.data.items;
}

export async function askQuestion(question) {
  const response = await API.post("/query", { question });
  return response.data;
}