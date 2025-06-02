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
â”œâ”€â”€ data/                   # Sample document files
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app.py              # Main Streamlit app
â”‚   â”œâ”€â”€ indexer.py          # Document parsing + embedding
â”‚   â”œâ”€â”€ retriever.py        # Similarity search logic
â”‚   â””â”€â”€ generator.py        # Answer generation logic
â”œâ”€â”€ requirements.txt
â””â”€â”€ README.md
```

---

## ðŸ“¦ Installation

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

## â–¶ï¸ Run the App

```bash
python src/app.py
```

Then, open the Streamlit app in your browser (default: http://localhost:8501).

---

## ðŸ§ª Example Usage

```python
from src.qa import ask_question

ask_question("What is retrieval-augmented generation?")
```

---

## ðŸ“š How It Works

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

## ðŸ“Œ Use Cases

- Academic research assistants
- Corporate knowledge base Q&A
- Support bots for internal documents
- Personal document search assistants

---

## ðŸš§ To-Do / Future Work

- Add UI for viewing document sources
- Add support for more formats (CSV, XLSX)
- Improve chunking logic (semantic splitting)
- Add persistent storage and database integration
- Docker support

---

## ðŸ¤ Contributing

Contributions are welcome!

```bash
git checkout -b feature/my-feature
git commit -m "Add some feature"
git push origin feature/my-feature
```

Then, open a Pull Request on GitHub.

---

## ðŸ“œ License

This project is licensed under the MIT License. See `LICENSE` for more details.

---

## ðŸ‘¤ Author

- GitHub: [Aadhi-07](https://github.com/Aadhi-07)