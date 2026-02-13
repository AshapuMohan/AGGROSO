import os
from pypdf import PdfReader
from docx import Document

def extract_text(file_path: str, filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    
    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
            
    elif ext == ".pdf":
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            print(f"[DEBUG] Extracted {len(text)} chars from PDF.")
            return text
        except Exception as e:
            raise ValueError(f"Error reading PDF: {str(e)}")
            
    elif ext == ".docx":
        try:
            doc = Document(file_path)
            text = "\n".join([para.text for para in doc.paragraphs])
            print(f"[DEBUG] Extracted {len(text)} chars from DOCX.")
            return text
        except Exception as e:
            raise ValueError(f"Error reading DOCX: {str(e)}")
            
    else:
        raise ValueError(f"Unsupported file format: {ext}")
