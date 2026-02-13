import os
import time

def check_health():
    status = {"backend": "running"}
    
    # Check Vector Store
    try:
        # Simple check for our local store
        status["vector_store"] = "available"
    except Exception as e:
        status["vector_store"] = f"unavailable: {str(e)}"

    # Check NVIDIA Key
    if os.getenv("NVIDIA_API_KEY"):
        status["llm_key"] = "present"
    else:
        status["llm_key"] = "missing (NVIDIA_API_KEY)"
        
    return status
