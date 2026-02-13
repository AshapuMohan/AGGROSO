const API_BASE = window.location.port === "5500" ? "http://127.0.0.1:8000" : "";

// --- Home Page Functions ---

async function loadDocuments() {
    const list = document.getElementById('docList');
    if (!list) return; // Not on home page

    try {
        const res = await fetch(`${API_BASE}/documents`);
        const data = await res.json();

        list.innerHTML = '';
        if (data.documents.length === 0) {
            list.innerHTML = '<li>No documents uploaded yet.</li>';
            return;
        }

        data.documents.forEach(doc => {
            const li = document.createElement('li');
            li.textContent = doc;
            list.appendChild(li);
        });
    } catch (err) {
        console.error("Failed to load docs", err);
        list.innerHTML = '<li style="color:red">Failed to load documents.</li>';
    }
}

async function uploadDocument(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('uploadStatus');

    if (!fileInput.files[0]) return;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    statusDiv.textContent = 'Uploading & Indexing...';
    statusDiv.style.color = 'blue';

    try {
        const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Upload failed');
        }

        const data = await res.json();
        statusDiv.textContent = `Success: ${data.filename} indexed.`;
        statusDiv.style.color = 'green';
        fileInput.value = ''; // Clear input
        loadDocuments(); // Refresh list
    } catch (err) {
        statusDiv.textContent = `Error: ${err.message}`;
        statusDiv.style.color = 'red';
    }
}

async function askQuestion(e) {
    e.preventDefault();
    const input = document.getElementById('questionInput');
    const container = document.getElementById('answerContainer');
    const answerText = document.getElementById('answerText');
    const sourcesText = document.getElementById('sourcesText');

    if (!input.value.trim()) return;

    // UI Loading state
    container.style.display = 'block';
    answerText.textContent = 'Thinking...';
    sourcesText.textContent = '';

    try {
        const res = await fetch(`${API_BASE}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: input.value })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || 'Request failed');
        }

        const data = await res.json();

        answerText.textContent = data.answer;
        if (data.sources && data.sources.length > 0) {
            sourcesText.textContent = data.sources.join(', ');
        } else {
            sourcesText.textContent = 'None';
        }

    } catch (err) {
        answerText.textContent = `Error: ${err.message}`;
        sourcesText.textContent = '';
    }
}

// --- Status Page Functions ---

async function checkHealth() {
    const backend = document.getElementById('backendStatus');
    const chroma = document.getElementById('chromaStatus');
    const llm = document.getElementById('llmStatus');

    if (!backend) return; // Not on status page OR elements missing

    // Reset UI
    [backend, chroma, llm].forEach(el => {
        el.className = '';
        el.textContent = 'Checking...';
    });

    try {
        const res = await fetch(`${API_BASE}/health`);
        const data = await res.json();

        // Backend
        backend.textContent = data.backend || 'Unknown';
        backend.className = data.backend === 'running' ? 'status-ok' : 'status-error';

        // Vector Store
        chroma.textContent = data.vector_store || 'Unknown';
        chroma.className = data.vector_store === 'available' ? 'status-ok' : 'status-error';

        // LLM
        llm.textContent = data.llm_key || 'Unknown';
        llm.className = data.llm_key === 'present' ? 'status-ok' : 'status-error';

    } catch (err) {
        backend.textContent = 'Unreachable';
        backend.className = 'status-error';
        chroma.textContent = 'Unknown';
        llm.textContent = 'Unknown';
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Home Page Listeners
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', uploadDocument);
        loadDocuments();
    }

    const askForm = document.getElementById('askForm');
    if (askForm) {
        askForm.addEventListener('submit', askQuestion);
    }
});
