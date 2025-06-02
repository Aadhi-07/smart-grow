# Face-recognition
#  RAG QA System

**RAG QA System** is a Retrieval-Augmented Generation (RAG) based Question Answering system that allows users to upload documents and ask questions. The system retrieves relevant document chunks and generates accurate, context-aware answers using a transformer-based language model.

---

##  Features

- Upload multiple documents (PDF, DOCX, TXT)
- Semantic search using embeddings and vector similarity
- Answer generation using a transformer (Flan-T5)
- Lightweight and easy to run locally
- Simple UI with Streamlit

---

## ¸ Tech Stack

| Component         | Technology                    |
|------------------|-------------------------------|
| Embeddings        | Sentence-Transformers         |
| Vector Store      | FAISS                         |
| Language Model    | Hugging Face Transformers     |
| UI (optional)     | Streamlit                     |
| File Parsing      | PyPDF2, python-docx            |

---

##  Project Structure

```
rag-qa-system/
data/                   # Sample document files
src/
app.py              # Main Streamlit app
indexer.py          # Document parsing + embedding
retriever.py        # Similarity search logic
generator.py        # Answer generation logic
requirements.txt
README.md
```

---

##  Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aadhi-07/rag-qa-system.git
cd rag-qa-system
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. Install Requirements

```bash
pip install -r requirements.txt
```

---

## ¸ Run the App

```bash
python src/app.py
```

Then, open the Streamlit app in your browser (default: http://localhost:8501).

---

##  Example Usage

```python
from src.qa import ask_question

ask_question("What is retrieval-augmented generation?")
```

---

##  How It Works

1. **Document Upload**
   - Supports `.pdf`, `.docx`, and `.txt` files.

2. **Indexing**
   - Extracts and chunks text
   - Converts chunks into vector embeddings using a sentence transformer
   - Stores vectors using FAISS for fast retrieval

3. **Retrieval**
   - User inputs a question
   - Vector search identifies the top-k most relevant chunks

4. **Answer Generation**
   - A Hugging Face model (e.g., Flan-T5) generates an answer using the context

---

##  Use Cases

- Academic research assistants
- Corporate knowledge base Q&A
- Support bots for internal documents
- Personal document search assistants

---

##  To-Do / Future Work

- Add UI for viewing document sources
- Add support for more formats (CSV, XLSX)
- Improve chunking logic (semantic splitting)
- Add persistent storage and database integration
- Docker support

---

##  Contributing

Contributions are welcome!

```bash
git checkout -b feature/my-feature
git commit -m "Add some feature"
git push origin feature/my-feature
```

Then, open a Pull Request on GitHub.

---