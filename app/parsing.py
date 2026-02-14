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
            import pdfplumber
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            
            cleaned_text = text.strip()
            print(f"[DEBUG] Extracted {len(cleaned_text)} chars from PDF using pdfplumber.")
            return cleaned_text
        except ImportError:
            print("[WARNING] pdfplumber not found, falling back to pypdf.")
            try:
                reader = PdfReader(file_path)
                text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                
                cleaned_text = text.strip()
                print(f"[DEBUG] Extracted {len(cleaned_text)} chars from PDF using pypdf.")
                return cleaned_text
            except Exception as e:
                raise ValueError(f"Error reading PDF with pypdf: {str(e)}")
        except Exception as e:
            raise ValueError(f"Error reading PDF with pdfplumber: {str(e)}")
            
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
