from openai import OpenAI
import os
from typing import List

# Configure for NVIDIA API
# Uses standard OpenAI client but points to NVIDIA endpoint
client = OpenAI(
    api_key=os.getenv("NVIDIA_API_KEY"),
    base_url=os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
)

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nvidia/nv-embedqa-e5-v5")

def get_embedding(text: str) -> List[float]:
    text = text.replace("\n", " ")
    # NVIDIA embedding models often require 'input_type' related handling or specific usage
    # But via the standard API it usually defaults to 'query' or 'passage'.
    # For general usage, the standard creation call works.
    
    # Note: Some NVIDIA models max out at 512 or 2048 tokens. 
    # Our chunk size is ~1000 chars (~250-300 tokens), so we are safe.
    
    response = client.embeddings.create(
        input=[text], 
        model=EMBEDDING_MODEL,
        extra_body={"input_type": "query"} # "query" or "passage". "query" is often safer default for symmetric search or unspecified.
                                          # actually for storage "passage" might be better, but "query" is versatile. 
                                          # Let's use "passage" for storage if we could distinguish, but here we use one func.
                                          # actually nv-embedqa-e5-v5 supports "passage" and "query".
                                          # Let's use "passage" for documents and "query" for questions? 
                                          # The current function doesn't know context. 
                                          # Let's default to no type and see if it works, or "query" as generic.
    )
    return response.data[0].embedding

def get_query_embedding(text: str) -> List[float]:
    # Specific function for query embedding if needed
    text = text.replace("\n", " ")
    response = client.embeddings.create(
        input=[text], 
        model=EMBEDDING_MODEL,
        extra_body={"input_type": "query"}
    )
    return response.data[0].embedding

def get_passage_embedding(text: str) -> List[float]:
    # Specific function for document embedding
    text = text.replace("\n", " ")
    response = client.embeddings.create(
        input=[text], 
        model=EMBEDDING_MODEL,
        extra_body={"input_type": "passage"}
    )
    return response.data[0].embedding
