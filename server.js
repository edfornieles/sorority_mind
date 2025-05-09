// character_sim/server.js
import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files like index.html
app.use(express.static(__dirname));

// Route: Serve AI-generated thought
app.get('/thought', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a 21-year-old sorority girl who goes to Berkeley. You're self-absorbed, sharp, distracted, emotionally intense, and constantly narrating your life. Output a single sentence internal thought — no explanations, no greetings.`,
        },
        {
          role: 'user',
          content: 'What are you thinking right now?',
        },
      ],
    });

    const thought = response.choices[0].message.content.trim();
    res.json({ thought });
  } catch (err) {
    console.error('Error fetching thought:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.get('/thought', async (req, res) => {
    try {
      const hour = new Date().getHours();
      let mood = 'neutral';
  
      if (hour >= 6 && hour < 11) mood = 'groggy but hopeful';
      else if (hour >= 11 && hour < 16) mood = 'confident and distracted';
      else if (hour >= 16 && hour < 21) mood = 'chaotic and dramatic';
      else mood = 'sleepy and spiraling';
  
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a 21-year-old sorority girl at Berkeley. Your current mood is "${mood}". Narrate your internal monologue as a one-sentence thought. No explanations. No greetings.`,
          },
          {
            role: 'user',
            content: 'What are you thinking right now?',
          },
        ],
      });
  
      const thought = response.choices[0].message.content.trim();
      res.json({ thought, mood });
    } catch (err) {
      console.error('Error fetching thought:', err);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  });
  