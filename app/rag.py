import os
# from app.embeddings import get_passage_embedding, get_query_embedding # Re-import below
from app.embeddings import get_passage_embedding, get_query_embedding
from openai import OpenAI
from app.simple_vector_store import SimpleVectorStore

# Initialize Simple Vector Store (Replacing ChromaDB)
# chroma_client = chromadb.PersistentClient(path="data/chroma_db")
# collection = chroma_client.get_or_create_collection(name="documents")

vector_store = SimpleVectorStore(path="data/vector_store")

# NVIDIA-compatible OpenAI Client for Chat
openai_client = OpenAI(
    api_key=os.getenv("NVIDIA_API_KEY"),
    base_url=os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
)
LLM_MODEL = os.getenv("LLM_MODEL", "meta/llama-3.1-70b-instruct")

def ingest_document(text: str, doc_name: str):
    """
    Chunks text, embeds chunks, and stores in VectorStore with metadata.
    """
    # Simple chunking (overlapped)
    chunk_size = 1000 # characters approx
    overlap = 200
    
    chunks = []
    ids = []
    metadatas = []
    
    # Handle empty text
    if not text:
        print("[DEBUG] Text is empty, skipping ingestion.")
        return

    for i in range(0, len(text), chunk_size - overlap):
        chunk = text[i:i + chunk_size]
        if chunk.strip(): # Only add non-empty chunks
            chunks.append(chunk)
            ids.append(f"{doc_name}_{i}")
            metadatas.append({"source": doc_name})
        
    print(f"[DEBUG] Created {len(chunks)} chunks.")
    
    if not chunks:
        print("[WARNING] No valid chunks created. Skipping ingestion.")
        return
        
    # Use PASSAGE embedding for storage
    try:
        if len(chunks) > 0:
            print(f"[DEBUG] First chunk content (repr): {repr(chunks[0])}")
            
        embeddings = []
        for i, chunk in enumerate(chunks):
            try:
                emb = get_passage_embedding(chunk)
                embeddings.append(emb)
            except Exception as e:
                print(f"[ERROR] Failed to embed chunk {i}: {repr(chunk)}")
                raise e
                
        print(f"[DEBUG] Generated {len(embeddings)} embeddings.")
    except Exception as e:
        print(f"[ERROR] Embedding generation failed: {e}")
        raise e
    
    vector_store.add(
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )
    print(f"[DEBUG] Ingestion complete for {doc_name}.")

def reset_knowledge_base():
    """
    Clears the vector store.
    """
    vector_store.clear()

def query_documents(question: str):
    """
    Embeds question, retrieves top 3 chunks, calls LLM, returns answer + sources.
    """
    # Use QUERY embedding for retrieval
    query_embedding = get_query_embedding(question)
    
    results = vector_store.query(
        query_embeddings=[query_embedding],
        n_results=3
    )
    
    # Check if we have results
    if not results['documents'] or not results['documents'][0]:
        return {
            "answer": "Not found in documents",
            "sources": []
        }
        
    documents = results['documents'][0]
    metadatas = results['metadatas'][0]
    
    context = "\n\n".join(documents)
    
    system_prompt = (
        "You are a helpful assistant. Use the following context to answer the question. "
        "Answer strictly based on the provided context. "
        "If the answer is not in the context, say exactly 'Not found in documents'."
    )
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
    ]
    
    response = openai_client.chat.completions.create(
        model=LLM_MODEL,
        messages=messages,
        temperature=0.2,
        max_tokens=1024
    )
    
    answer = response.choices[0].message.content
    
    return {
        "answer": answer,
        "sources": list(set([m['source'] for m in metadatas])) # Unique sources
    }
