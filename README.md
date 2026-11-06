# PrepAI – AI-Powered Quiz Generator 


PrepAI is an AI-powered learning assistant that automatically generates quizzes from documents and web content using Google Gemini, Retrieval-Augmented Generation (RAG), and semantic search.


##  Features

-  Document upload: PDF, DOCX, and TXT.
-  URL-based content extraction.
-  AI-powered quiz generation using Google Gemini.
-  Semantic search using Sentence Transformers and FAISS.
-  Multiple question types: MCQ, short answer, fill in the blanks, and true/false.
-  Automatic document summarization.
-  Asynchronous quiz generation with progress tracking.
-  Context-aware question generation using RAG.

##  Tech Stack

| Technology | Purpose |
|---|---|
| Python | Core backend |
| Flask | REST API |
| Google Gemini | AI question generation |
| Sentence Transformers | Text embeddings |
| FAISS | Vector similarity search |
| Cross-Encoder | Semantic reranking |
| spaCy / NLTK | NLP processing |
| BeautifulSoup | Web scraping |
| pdfplumber | PDF extraction |
| python-docx | DOCX extraction |
| Vercel | Frontend deployment |

##  How It Works

1. Upload a document or provide a webpage URL.
2. Extract and clean the text.
3. Split content into overlapping chunks.
4. Generate embeddings using Sentence Transformers.
5. Index embeddings using FAISS.
6. Retrieve relevant chunks and rerank them.
7. Send relevant context to Google Gemini.
8. Generate quizzes and summaries.
9. Return the results in JSON format.

##  Project Structure

```text
PrepAI/
├── PrepAI/                  # Frontend application
├── server.py                # Flask backend and REST API
├── gemini3.py               # RAG-based quiz generation engine
├── requirements.txt         # Python dependencies
├── quiz.json                # Sample quiz data
├── bad_effects_of_smoking.pdf
├── .gitignore
└── README.md
```

##  Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Rajathaaa/PrepAI.git
cd PrepAI
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it:

**Windows:**
```bash
venv\\Scripts\\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Gemini API key

Get an API key from [Google AI Studio](https://aistudio.google.com/).

**Windows PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**macOS/Linux:**
```bash
export GEMINI_API_KEY="your_api_key_here"
```

### 5. Download NLP resources

```bash
python -m spacy download en_core_web_sm
```

### 6. Run the backend

```bash
python server.py
```

Backend URL:

```text
http://localhost:5000
```

##  API Documentation

### Health Check

`GET /health`

Checks whether the backend is running.

### Upload Document / Submit URL

`POST /upload`

Accepts a document or webpage URL and starts quiz generation.

**Request parameters (multipart/form-data):**

| Parameter | Description | Default |
|---|---|---|
| file | PDF, DOCX, or TXT file | Optional |
| url | Webpage URL | Optional |
| num_questions | Number of questions (1–100) | 20 |
| question_types | Comma-separated question types | mcq,short,fillblank,tf |

Supported question types:
- `mcq`
- `short`
- `fillblank`
- `tf`

### Retrieve Quiz / Check Progress

`GET /quiz/{file_id}`

Returns the quiz generation status or completed quiz.

Example response:

```json
{
  "status": "done",
  "quiz": {
    "source": "document.pdf",
    "summary": "Summary of the uploaded material",
    "questions": []
  }
}
```

##  Configuration

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | None | Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.5-flash-lite` | Gemini model |
| `EMBED_MODEL` | `sentence-transformers/all-mpnet-base-v2` | Embedding model |
| `CROSS_ENCODER_MODEL` | `cross-encoder/ms-marco-MiniLM-L-6-v2` | Reranking model |
| `CHUNK_WORDS` | `600` | Words per chunk |
| `CHUNK_OVERLAP` | `120` | Overlapping words |

##  Use Cases

- Students preparing for examinations.
- Educators creating assessments.
- Self-learners practicing from online resources.
- Researchers reviewing lengthy documents.

##  Future Enhancements

- User authentication and personalized profiles.
- Quiz history and performance tracking.
- Difficulty-based question generation.
- Adaptive quizzes.
- Multilingual support.
- PDF quiz export.
- Learning analytics dashboard.

