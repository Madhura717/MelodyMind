import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const BASE_PORT = Number(process.env.PORT || 3000);

  // API routes
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "MelodyMind API is running" });
  });

  const isBlockedTopic = (text: string) => {
    const t = (text || "").toLowerCase();

    // Hard refusals for adult/unsafe topics
    const blocked = [
      "sex",
      "porn",
      "nude",
      "nsfw",
      "drugs",
      "alcohol",
      "cigarette",
      "vape",
      "gambling",
      "bet",
      "violence",
      "weapon",
      "gun",
      "bomb",
      "suicide",
      "self-harm",
      "politics",
      "religion",
    ];
    return blocked.some((w) => t.includes(w));
  };

  const isProbablyUnrelatedToKids = (text: string) => {
    const t = (text || "").toLowerCase();
    // If the user asks for technical/enterprise topics, we redirect without answering.
    const unrelatedHints = [
      "kubernetes",
      "docker",
      "linux",
      "windows",
      "powershell",
      "terminal",
      "sql",
      "database",
      "react",
      "nextjs",
      "typescript",
      "javascript",
      "python",
      "java",
      "c++",
      "api key",
      "token",
      "bitcoin",
      "stocks",
      "trading",
      "tax",
      "loan",
      "mortgage",
      "relationship advice",
      "dating",
      "resume",
      "job interview",
      "salary",
    ];
    return unrelatedHints.some((w) => t.includes(w));
  };

  app.post("/api/kid-chat", async (req, res) => {
    try {
      const message = String(req.body?.message ?? "").trim();
      const history = Array.isArray(req.body?.history) ? req.body.history : [];

      if (!message) return res.status(400).json({ error: "Missing message" });

      if (isBlockedTopic(message)) {
        return res.json({
          reply:
            "I can’t help with that topic. But I *can* help with kid-friendly stuff like music games, animal sounds, speech practice, feelings, and learning words. Want to try one of those?",
        });
      }

      if (isProbablyUnrelatedToKids(message)) {
        return res.json({
          reply:
            "Ooh, that sounds like a grown-up/tech question. I’m MelodyBot for kids! 💛\n\nTry asking me something kid-friendly like:\n- “Tell me a short rhyming song”\n- “Help me practice the ‘R’ sound”\n- “Give me a fun clapping rhythm”\n- “Tell me an animal sound game”",
        });
      }

      const token = process.env.HF_TOKEN;
      if (!token) {
        return res.status(500).json({
          error: "Missing HF_TOKEN. Add it to your .env file.",
        });
      }

      const requestedModel = process.env.HF_MODEL || "microsoft/Phi-3-mini-4k-instruct";
      const fallbackModels = [
        requestedModel,
        "meta-llama/Llama-3.1-8B-Instruct",
        "mistralai/Mistral-7B-Instruct-v0.3",
        "google/gemma-2-9b-it",
      ];

      const safeHistory = history
        .slice(-8)
        .map((m: any) => ({
          role: m?.role === "user" ? "user" : "assistant",
          text: String(m?.text ?? "").slice(0, 500),
        }))
        .filter((m: any) => m.text.trim().length > 0);

      const system =
        "You are MelodyBot, a kind, playful helper for kids (ages ~5–12) in a music-based speech therapy app.\n\n" +
        "Rules:\n" +
        "- Be warm, encouraging, and never rude.\n" +
        "- Only answer kid-friendly, educational topics (learning, stories, simple math, feelings, fun facts, animals, music, speech practice).\n" +
        "- If asked something not meant for kids or totally unrelated, gently redirect to kid-friendly topics.\n" +
        "- Avoid unsafe/adult topics. If asked, refuse briefly and redirect.\n" +
        "- When you redirect, offer 3 kid-friendly example questions.\n" +
        "- Keep answers short, cheerful, and easy to understand.\n" +
        "- If the user asks about adult/technical topics, do NOT explain them. Redirect.\n";

      const hfMessages = [
        { role: "system", content: system },
        ...safeHistory.map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        })),
        { role: "user", content: message },
      ];

      let data: any = null;
      let lastError: any = null;

      for (const model of fallbackModels) {
        const hfRes = await fetch("https://router.huggingface.co/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: hfMessages,
            temperature: 0.4,
            top_p: 0.9,
            max_tokens: 160,
          }),
        });

        data = await hfRes.json().catch(() => null);
        if (hfRes.ok) {
          lastError = null;
          break;
        }

        lastError = data ?? { status: hfRes.status };
        const code = data?.error?.code;
        if (code === "model_not_supported") {
          continue;
        }
        // Non-retryable error
        break;
      }

      if (lastError) {
        return res.status(502).json({
          error: "Hugging Face request failed",
          details: lastError,
        });
      }

      const reply =
        (typeof data?.choices?.[0]?.message?.content === "string" &&
          data.choices[0].message.content) ||
        "";

      const cleaned = String(reply).trim();

      if (!cleaned) {
        return res.status(502).json({
          error: "Empty reply from model",
          details: data ?? null,
        });
      }

      return res.json({ reply: cleaned });
    } catch (err: any) {
      return res.status(500).json({
        error: "Server error",
        details: String(err?.message ?? err),
      });
    }
  });

  // Mock database
  let userProgress = {
    stars: 1250,
    streak: 12,
    accuracy: 92,
    history: [
      { name: 'Mon', progress: 40, accuracy: 65 },
      { name: 'Tue', progress: 45, accuracy: 68 },
      { name: 'Wed', progress: 60, accuracy: 75 },
      { name: 'Thu', progress: 55, accuracy: 72 },
      { name: 'Fri', progress: 75, accuracy: 85 },
      { name: 'Sat', progress: 85, accuracy: 90 },
      { name: 'Sun', progress: 90, accuracy: 95 },
    ],
    screenTime: [
      { name: 'Mon', minutes: 22, limit: 45 },
      { name: 'Tue', minutes: 35, limit: 45 },
      { name: 'Wed', minutes: 28, limit: 45 },
      { name: 'Thu', minutes: 41, limit: 45 },
      { name: 'Fri', minutes: 18, limit: 45 },
      { name: 'Sat', minutes: 52, limit: 60 },
      { name: 'Sun', minutes: 44, limit: 60 },
    ],
  };

  app.get("/api/user/progress", (req, res) => {
    res.json(userProgress);
  });

  app.post("/api/user/progress", (req, res) => {
    const { stars } = req.body;
    if (stars) userProgress.stars += stars;
    res.json(userProgress);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const listen = (port: number) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    server.on("error", (err: any) => {
      if (err?.code === "EADDRINUSE" && port < BASE_PORT + 20) {
        console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
        listen(port + 1);
        return;
      }
      console.error("Server failed to start:", err);
      process.exit(1);
    });
  };

  listen(BASE_PORT);
}

startServer();
