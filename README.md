# AI Text Assistant (Ollama + Express)

## Overview

AI Text Assistant is a full-stack web application that uses a locally running large language model (Ollama) to analyze user input. The system classifies text into categories (Complaint, Question, Praise, Other) and generates helpful AI responses in real time using streaming output.

This project demonstrates integration between a frontend interface, a Node.js/Express backend, and a locally hosted AI model.


## Features

- AI-powered text classification
- Context-aware response generation using an LLM (Ollama)
- Real-time streaming responses (ChatGPT-style output)
- Simple and responsive web interface
- Full-stack architecture (frontend + backend integration)
- Runs locally without API keys or external services


## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- AI Model: Ollama (local LLM - gemma:2b or similar)
- Communication: Fetch API + Server-Sent Events (streaming)


## How It Works

1. User enters text in the interface
2. Frontend sends request to `/api/analyze`
3. Backend sends a prompt to Ollama
4. Ollama returns:
- A classification label
- A generated response
5. Response is streamed back to the frontend
6. UI displays results in real time


## Installation & Setup

### 1. Install Ollama
Download and install Ollama:
https://ollama.com

Then run a model:

```bash

ollama run gemma:2b

```

### 2. Clone the repository
git clone https://github.com/Sadieg123/AI-Powered-Feature.git
cd AI-Powered-Feature

### 3. Install dependencies 
npm install

### 4. Start the server
node server.js

### 5. Open the application
Open your browser and go to:
http://localhost:3000
