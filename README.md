
# AI Knowledge Inbox

An AI-powered knowledge management application that allows users to save text notes and website URLs, extract content, store information, and ask questions using Retrieval-Augmented Generation (RAG).

## 1. Project Overview

AI Knowledge Inbox is a full-stack application that helps users organize their knowledge in one place and retrieve relevant information using natural language questions.

Users can:
- Save text notes.
- Save website URLs.
- Extract readable website content.
- Store content in SQLite.
- Generate embeddings using OpenAI.
- Search relevant content using cosine similarity.
- Ask questions about saved information.
- Receive AI-generated answers with relevant sources.

## 2. Features

### Content Management
- Add text-based notes.
- Add website URLs.
- Extract website title and content.
- View all saved content.
- Store content persistently in SQLite.

### AI and RAG
- Split content into smaller chunks.
- Generate embeddings using OpenAI.
- Perform vector similarity search.
- Retrieve the top 5 relevant chunks.
- Generate answers using GPT-4o-mini.
- Display relevant sources with answers.

### Frontend
- React component-based architecture.
- Add content form.
- Saved content list.
- Ask-question interface.
- AI answer and source display.

### Backend
- REST API development using Express.js.
- Modular routes, controllers, and services.
- Request validation and error handling.
- SQLite database integration.
- Centralized logging.

## 3. Technologies Used

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Database Library | better-sqlite3 |
| AI Integration | OpenAI API |
| Embeddings | text-embedding-3-small |
| AI Model | gpt-4o-mini |
| HTTP Client | Axios |
| HTML Parsing | Cheerio |
| Tools | VS Code, npm, Git |
| API Testing | Postman |

## 4. Project Structure

```text
ai-knowledge-inbox/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddContent.jsx
│   │   │   ├── ItemsList.jsx
│   │   │   ├── AskQuestion.jsx
│   │   │   └── AnswerDisplay.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── contentRoutes.js
│   │   │   └── queryRoutes.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── contentController.js
│   │   │   └── queryController.js
│   │   │
│   │   ├── services/
│   │   │   ├── contentService.js
│   │   │   └── ragService.js
│   │   │
│   │   ├── utils/
│   │   │   └── logger.js
│   │   │
│   │   ├── db/
│   │   │   └── database.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── README.md
└── .gitignore
```

## 5. Prerequisites

Install the following:

- Node.js
- npm
- Visual Studio Code
- OpenAI API account and API key

Verify installation:

```cmd
node -v
npm -v
```

## 6. Backend Setup

Navigate to the backend folder:

```cmd
cd C:\Users\heman\ai-knowledge-inbox\server
```

Install dependencies:

```cmd
npm install
```

If dependencies are missing:

```cmd
npm install express cors dotenv openai better-sqlite3 cheerio axios
```

Install nodemon:

```cmd
npm install --save-dev nodemon
```

Ensure `server/package.json` contains:

```json
{
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

Preserve your existing dependencies in package.json.

## 7. OpenAI API Configuration

Create an API key:

https://platform.openai.com/api-keys

Open the following file:

`server/.env`

Add:

```env
PORT=5000
OPENAI_API_KEY=your_actual_openai_api_key
```

Replace the placeholder with your actual OpenAI API key.

Important:
- Never expose your API key in frontend code.
- Never commit `.env` to GitHub.
- Ensure your OpenAI API account has available credits and permissions.

## 8. Frontend Setup

Open a new CMD terminal:

```cmd
cd C:\Users\heman\ai-knowledge-inbox\client
```

Install dependencies:

```cmd
npm install
```

Install Axios if needed:

```cmd
npm install axios
```

Start frontend:

```cmd
npm run dev
```

Frontend URL:

http://localhost:5173

## 9. Run the Application

Run frontend and backend in two separate CMD terminals.

### Terminal 1 - Backend

```cmd
cd C:\Users\heman\ai-knowledge-inbox\server
npm run dev
```

Backend URL:

http://localhost:5000

### Terminal 2 - Frontend

```cmd
cd C:\Users\heman\ai-knowledge-inbox\client
npm run dev
```

Frontend URL:

http://localhost:5173

Open the frontend URL in your browser.

## 10. REST API Endpoints

Base URL:

`http://localhost:5000/api`

### 1. Add Content

**Method:** POST

**Endpoint:** `/api/ingest`

Request body:

```json
{
  "type": "text",
  "title": "React Developer",
  "content": "React JS is a JavaScript library for building dynamic, component-based user interfaces.",
  "url": ""
}
```

Expected response:

```json
{
  "message": "Content saved successfully.",
  "itemId": 1
}
```

### 2. Get All Items

**Method:** GET

**Endpoint:** `/api/items`

Expected response:

```json
{
  "items": []
}
```

### 3. Ask a Question

**Method:** POST

**Endpoint:** `/api/query`

Request body:

```json
{
  "question": "What is React JS?"
}
```

Expected response structure:

```json
{
  "answer": "React is a JavaScript library used to build user interfaces.",
  "sources": []
}
```

The actual answer and sources depend on your saved content and backend implementation.

## 11. How RAG Works

Retrieval-Augmented Generation (RAG) combines information retrieval with large language models.

### Content Ingestion Flow

1. User submits text or a URL.
2. Backend receives the request.
3. Cheerio extracts readable website content when a URL is provided.
4. Content is split into smaller chunks.
5. OpenAI generates embeddings for the chunks.
6. Original content and embeddings are stored in SQLite.

### Question and Answer Flow

1. User enters a question.
2. Backend generates a question embedding.
3. Backend compares it with stored chunk embeddings.
4. Cosine similarity identifies relevant chunks.
5. Top 5 relevant chunks are selected.
6. Retrieved content is sent to GPT-4o-mini as context.
7. OpenAI generates an answer.
8. Backend returns the answer and sources.
9. React displays the result.

### RAG Architecture

```text
              USER
                |
                v
         REACT FRONTEND
                |
                v
         EXPRESS BACKEND
                |
         +------+------+
         |             |
         v             v
    INGEST CONTENT  ASK QUESTION
         |             |
         v             v
    EXTRACT TEXT  QUESTION EMBEDDING
         |             |
         v             v
    TEXT CHUNKING  VECTOR SEARCH
         |             |
         v             v
    OPENAI EMBEDDING  TOP 5 CHUNKS
         |             |
         v             v
    SQLITE DATABASE  GPT-4o-mini
                       |
                       v
                   AI ANSWER
                       |
                       v
                 REACT FRONTEND
```

## 12. Database Structure

Database: SQLite

Database file:

`server/knowledge.db`

### Items Table

Stores original user content.

| Column | Description |
|---|---|
| id | Unique content ID |
| title | Content title |
| type | Text or URL |
| content | Original or extracted content |
| url | Website URL |
| created_at | Creation timestamp |

### Chunks Table

Stores content chunks and their embeddings.

| Column | Description |
|---|---|
| id | Unique chunk ID |
| item_id | Reference to items table |
| content | Chunk text |
| embedding | Serialized embedding vector |

## 13. Troubleshooting

### Issue: Cannot find module

Run:

```cmd
npm install
```

### Issue: Cannot use import statement outside a module

Ensure `server/package.json` contains:

```json
"type": "module"
```

Restart backend.

### Issue: Port 5000 already in use

Check:

```cmd
netstat -ano | findstr :5000
```

### Issue: Incorrect OpenAI API key (401)

- Open `server/.env`.
- Verify the actual API key.
- Remove the placeholder key.
- Save the file.
- Restart backend.

### Issue: OpenAI quota or billing error (429)

Check:

https://platform.openai.com/usage

https://platform.openai.com/settings/organization/billing/

ChatGPT subscriptions do not automatically include API credits.

### Issue: CORS error

Check the backend CORS configuration:

```javascript
app.use(cors({ origin: "http://localhost:5173" }));
```

### Issue: Frontend cannot connect to backend

Verify that:

- Backend runs on port 5000.
- Frontend runs on port 5173.
- `client/src/services/api.js` uses the correct API base URL.

```javascript
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});
```

## 14. Security Considerations

- Keep API keys in backend environment variables.
- Add `.env` to `.gitignore`.
- Validate incoming API requests.
- Add authentication and authorization before production deployment.
- Add API rate limiting.
- Avoid logging sensitive information.
- Use HTTPS in production.
- Restrict URL fetching to safe public destinations.
- Implement SSRF protection and redirect validation for URL ingestion.

The current implementation is intended as a local MVP.

## 15. Future Enhancements

- User authentication and authorization.
- Edit and delete saved content.
- PDF and DOCX uploads.
- Search and filter functionality.
- Chat history.
- Streaming AI responses.
- Dedicated vector database integration.
- Background document processing.
- Improved source citations.
- Docker deployment.
- AWS cloud deployment.

## 16. Project Status

- [x] React frontend setup
- [x] Node.js and Express backend
- [x] SQLite database setup
- [x] Text content ingestion
- [x] URL content extraction
- [x] Text chunking
- [x] OpenAI embedding integration
- [x] Cosine similarity retrieval
- [x] AI question answering
- [x] REST API integration
- [x] Source display

## 17. Author and Project Information

**Project Name:** AI Knowledge Inbox

**Category:** Full Stack Development / Generative AI / RAG

**Frontend:** React.js

**Backend:** Node.js and Express.js

**Database:** SQLite

**AI Integration:** OpenAI API

## 18. License

This project is intended for learning, development, and demonstration purposes. Add an appropriate open-source license if you plan to distribute it publicly.
