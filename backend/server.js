require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided." });

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-3-haiku', // You can change to mistral/mixtral/gpt
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // optional for tracking
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content?.trim();
    res.json({ reply: reply || "⚠️ AI did not return a message." });
  } catch (err) {
    console.error("❌ AI error:", err.response?.data || err.message);
    res.status(500).json({ reply: "❌ AI error or key issue." });
  }
});
app.get('/', (req, res) => {
  res.send('🧠 AI Chatbot backend is live!');
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 AI backend running at http://localhost:${PORT}`));
