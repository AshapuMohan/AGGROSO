# Prompts Used Log

## Backend Prompts
<!-- Paste your backend-related prompts here -->


You are a senior Python architect.

Build a production-ready FastAPI app for a "Private Knowledge Q&A" system.

Requirements:

FEATURES:
- Upload text documents (.txt)
- Store them locally in /data/docs
- Chunk documents into ~500 token chunks with overlap
- Create embeddings using OpenAI embeddings API
- Store vectors in ChromaDB
- Endpoint to list uploaded documents
- Endpoint to ask question
- Retrieve top 3 relevant chunks
- Call LLM with retrieved context
- Return:
  - final answer
  - source chunks
  - document names

ENDPOINTS:
POST /upload
GET /documents
POST /ask
GET /health

HEALTH endpoint must check:
- backend running
- chroma available
- llm key present

CONSTRAINTS:
- Use environment variables for API keys
- No secrets in code
- Add input validation
- Handle empty files
- Handle empty questions
- Add error handling
- Modular structure:
    app/
      main.py
      rag.py
      embeddings.py
      storage.py
      health.py

Use:
- FastAPI
- pydantic
- chromadb
- openai
- python-dotenv

Also generate:
- requirements.txt
- .env.example

Code must be runnable immediately.


## Frontend Prompts
<!-- Paste your frontend-related prompts here -->


Create a minimal HTML + JS frontend for a FastAPI RAG app.

Pages:

Home page:
- upload document form
- list uploaded documents
- question input
- answer display
- sources display

Status page:
- calls /health endpoint
- shows green/red status for:
  backend
  vector db
  llm key

Use:
- vanilla HTML
- minimal CSS
- fetch API
- no frameworks

Must be clean and readable.


## Docker Prompts
<!-- Paste your Docker/Deployment prompts here -->

Create a Dockerfile for a FastAPI app with chromadb and openai.

Requirements:
- python 3.11
- install dependencies
- copy app
- expose port 8000
- run uvicorn app.main:app

Also create docker-compose.yml with volume for /data

