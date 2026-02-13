import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List

# Load env vars
load_dotenv()

from app import storage, rag, health

app = FastAPI(title="Private Knowledge Q&A")


# Get allowed origins from env
origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    query: str

class Answer(BaseModel):
    answer: str
    sources: List[str]
    # context: List[str] = [] # Optional

@app.on_event("startup")
async def startup_event():
    # Verify keys
    if not os.getenv("NVIDIA_API_KEY"):
        print("WARNING: NVIDIA_API_KEY not found in environment variables.")

@app.post("/upload")
def upload_document(file: UploadFile = File(...)):
    allowed_exts = [".txt", ".pdf", ".docx"]
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(status_code=400, detail=f"Only {', '.join(allowed_exts)} files are supported.")
    
    # Save file
    try:
        file_path = storage.save_upload_file(file)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Process & Index
    try:
        # Extract text using parser
        from app import parsing
        text = parsing.extract_text(file_path, file.filename)
            
        rag.ingest_document(text, file.filename)
    except Exception as e:
        import traceback
        traceback.print_exc()
        # Cleanup if indexing fails?
        # os.remove(file_path) 
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
        
    return {"filename": file.filename, "status": "indexed"}

@app.get("/documents")
def get_documents():
    return {"documents": storage.list_documents()}

@app.delete("/reset")
def reset_database():
    try:
        # Clear vector store
        rag.reset_knowledge_base()
        
        # Clear physical files
        folder = "data/docs"
        if os.path.exists(folder):
            for filename in os.listdir(folder):
                file_path = os.path.join(folder, filename)
                try:
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                except Exception as e:
                    print(f"Failed to delete {file_path}. Reason: {e}")
                    
        return {"status": "success", "message": "Knowledge base cleared."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset: {str(e)}")

@app.post("/ask", response_model=Answer)
def ask_question(question: Question):
    if not question.query.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
        
    try:
        result = rag.query_documents(question.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ... (Previous code)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_index():
    return FileResponse('static/index.html')

@app.get("/health")
def health_check():
    return health.check_health()
