# AI Text Assistant (Ollama + Express)

An AI-powered web application that classifies user text and generates helpful responses using a locally running LLM (Ollama). The app demonstrates full stack development with a frontend interface, backend API, and real-time AI integration with streaming responses.

---

## Features

- AI text classification (Complaint, Question, Praise, Other)
- AI-generated helpful responses using Ollama
- Streaming responses (real time output like ChatGPT)
- Simple web interface (HTML, CSS, JavaScript)
- Full stack integration (frontend + Express backend)
- Runs locally with no API keys required

---

## Tech Stack

- Frontend: HTML, CSS, JavaScript  
- Backend: Node.js + Express  
- AI Model: Ollama (local LLM - gemma:2b or similar)  
- Communication: Fetch API + Server-Sent Events (streaming)

---

## How It Works

1. User enters text into the input field  
2. Frontend sends a POST request to `/api/analyze`  
3. Backend sends the prompt to Ollama running locally  
4. Ollama returns:
   - A classification label  
   - A generated response  
5. Response is streamed back to the frontend in real time  
6. UI displays both the category and AI response  

---

## Installation & Setup

### 1. Install Ollama
Download and install Ollama:
https://ollama.com

Then run a model:

```bash
ollama run gemma:2b

### 2. Clone the repository 
