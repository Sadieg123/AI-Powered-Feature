// ─────────────────────────────────────────────
// server.js  –  Week 12 Exercise
// A simple Express server that sends text to
// Ollama (gemma:2b) and returns an analysis.
// ─────────────────────────────────────────────

const express = require("express");

const app = express();
const PORT = 3000;

// Parse incoming JSON request bodies
app.use(express.json());

// Serve index.html (and any other files in this folder) to the browser
// When someone visits http://localhost:3000, Express will send index.html
app.use(express.static(__dirname));

// ─── POST /api/analyze ───────────────────────
// Expects:  { "text": "some user message" }
// Returns:  { "category": "...", "reply": "..." }
app.post("/api/analyze", async (req, res) => {
  const { text } = req.body;

  // Make sure the request actually includes text
  if (!text) {
    return res.status(400).json({ error: "Please provide a 'text' field in the request body." });
  }

  // Build the prompt — same as before, unchanged
  const prompt = `You are a helpful assistant. Analyze the following text and do two things:
1. Classify it into exactly one of these categories: Complaint, Question, Praise, or Other.
2. Write a short, helpful response to it (1–2 sentences).

Format your answer exactly like this (no extra text):
Category: <category>
Reply: <your reply>

Text: "${text}"`;

  try {
    // ── Set up Server-Sent Events (SSE) ───────
    // This tells the browser: "keep this connection open, I'll send data over time"
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Call Ollama with stream: true this time
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma:2b",
        prompt: prompt,
        stream: true  // Ollama will now send back many small chunks
      })
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama returned status ${ollamaResponse.status}`);
    }

    // Read the stream chunk by chunk
    const reader = ollamaResponse.body.getReader();
    const decoder = new TextDecoder();

    let fullText = "";       // accumulates everything the model says
    let replyStarted = false; // tracks whether we've passed "Reply: " yet

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Each chunk is a JSON line like: {"response":" word","done":false}
      const lines = decoder.decode(value).split("\n").filter(l => l.trim());

      for (const line of lines) {
        let parsed;
        try { parsed = JSON.parse(line); } catch { continue; }

        if (!parsed.response) continue;
        fullText += parsed.response;

        if (!replyStarted) {
          // Buffer silently until we see "Reply: " in the output
          // This hides the "Category: X" line from the streaming display
          const replyMatch = fullText.match(/Reply:\s*([\s\S]*)/i);
          if (replyMatch) {
            replyStarted = true;
            // Send whatever came after "Reply: " so far
            if (replyMatch[1]) {
              res.write(`data: ${JSON.stringify({ token: replyMatch[1] })}\n\n`);
            }
          }
        } else {
          // We're past "Reply: " — stream each token to the browser
          res.write(`data: ${JSON.stringify({ token: parsed.response })}\n\n`);
        }
      }
    }

    // ── Streaming done — now parse the category ──
    // Classification logic is the same as before
    const categoryMatch = fullText.match(/Category:\s*(.+)/i);
    const category = categoryMatch ? categoryMatch[1].trim() : "Unknown";

    // Send the category as a final event so the frontend can display it
    res.write(`data: ${JSON.stringify({ category, done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error("Error calling Ollama:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to reach Ollama. Is it running?" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
      res.end();
    }
  }
});

// ─── Start the server ────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Try:  POST http://localhost:${PORT}/api/analyze`);
});
