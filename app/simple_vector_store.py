import json
import os
import numpy as np
from typing import List, Dict, Any
from pathlib import Path

class SimpleVectorStore:
    def __init__(self, path: str = "data/vector_store"):
        self.path = Path(path)
        self.path.mkdir(parents=True, exist_ok=True)
        self.data_file = self.path / "data.json"
        self.vectors_file = self.path / "vectors.npy"
        self.data = []
        self.vectors = None
        self._load()

    def _load(self):
        if self.data_file.exists():
            with open(self.data_file, "r", encoding="utf-8") as f:
                self.data = json.load(f)
        if self.vectors_file.exists():
            self.vectors = np.load(self.vectors_file)

    def _save(self):
        with open(self.data_file, "w", encoding="utf-8") as f:
            json.dump(self.data, f)
        if self.vectors is not None:
            np.save(self.vectors_file, self.vectors)

    def add(self, documents: List[str], embeddings: List[List[float]], metadatas: List[Dict[str, Any]], ids: List[str]):
        new_vectors = np.array(embeddings, dtype=np.float32)
        
        if self.vectors is None:
            self.vectors = new_vectors
        else:
            self.vectors = np.vstack((self.vectors, new_vectors))
            
        for i, doc in enumerate(documents):
            self.data.append({
                "id": ids[i],
                "document": doc,
                "metadata": metadatas[i]
            })
            
        self._save()

    def clear(self):
        self.data = []
        self.vectors = None
        self._save()

    def query(self, query_embeddings: List[List[float]], n_results: int = 3):
        if self.vectors is None or len(self.data) == 0:
            return {
                "documents": [[] for _ in query_embeddings],
                "metadatas": [[] for _ in query_embeddings],
                "ids": [[] for _ in query_embeddings]
            }

        results = {"documents": [], "metadatas": [], "ids": []}
        
        for query_vec in query_embeddings:
            query_vec = np.array(query_vec, dtype=np.float32)
            
            # Cosine similarity
            # Normalize vectors
            norm_vectors = self.vectors / np.linalg.norm(self.vectors, axis=1)[:, np.newaxis]
            norm_query = query_vec / np.linalg.norm(query_vec)
            
            similarities = np.dot(norm_vectors, norm_query)
            
            # Get top indices
            # If fewer vectors than n_results, take all
            k = min(n_results, len(self.data))
            top_indices = np.argsort(similarities)[-k:][::-1]
            
            results["documents"].append([self.data[i]["document"] for i in top_indices])
            results["metadatas"].append([self.data[i]["metadata"] for i in top_indices])
            results["ids"].append([self.data[i]["id"] for i in top_indices])
            
        return results

    def heartbeat(self):
        return int(time.time() * 1000)
