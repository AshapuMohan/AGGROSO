import os
import shutil
from pathlib import Path
from fastapi import UploadFile

UPLOAD_DIR = Path("data/docs")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def save_upload_file(upload_file: UploadFile) -> str:
    try:
        file_path = UPLOAD_DIR / upload_file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        return str(file_path)
    finally:
        upload_file.file.close()

def list_documents():
    return [f.name for f in UPLOAD_DIR.iterdir() if f.is_file()]
