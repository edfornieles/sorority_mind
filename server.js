// sorority_mind/server.js
import express from 'express';
import path from 'path';

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const openai = new OpenAI();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let perceptionState = {
  internal: {
    emotion: "restless",
    body: "tight chest",
    desire: "to be noticed",
  },
  external: {
    setting: "inside her sorority house",
    social: "Vanessa hasn’t replied to her text",
    weather: "", // will be updated on each request
  },
  memory: []
};

// Serve static files like index.html
app.use(express.static(__dirname));

// (Place this back above mutatePerception)
async function getBerkeleyWeather() {
  const key = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=94720&aqi=no`;
  const res = await axios.get(url);
  const { condition, temp_f } = res.data.current;
  return `It's currently ${condition.text.toLowerCase()} and ${temp_f}°F in Berkeley.`;
}

// ⬇️ Move mutatePerception() here, *outside* the function above
function mutatePerception(state) {
  const random = (list) => list[Math.floor(Math.random() * list.length)];

  const emotions = ["restless", "anxious", "elated", "numb", "irritated", "hopeful"];
  const bodies = ["tight chest", "dry mouth", "heavy legs", "clammy hands", "buzzing skin"];
  const desires = ["to be noticed", "to disappear", "to be comforted", "to impress someone"];
  const settings = ["inside her sorority house", "walking to class", "on the quad", "in line for coffee"];
  const socials = ["Vanessa hasn’t replied to her text", "everyone’s on their phone", "a guy just checked her out", "no one seems to notice her"];

  if (Math.random() < 0.4) state.internal.emotion = random(emotions);
  if (Math.random() < 0.3) state.internal.body = random(bodies);
  if (Math.random() < 0.3) state.internal.desire = random(desires);
  if (Math.random() < 0.25) state.external.setting = random(settings);
  if (Math.random() < 0.25) state.external.social = random(socials);
}

// Route: Serve AI-generated thought
app.get('/thought', async (req, res) => {
    try {
      const weatherData = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=94720&aqi=no`);
      const data = weatherData.data;
      
      const condition = data.current.condition.text;
      const temp = data.current.temp_f;
      const localTime = data.location.localtime;
      
      const weather = `Weather: ${condition}, ${temp}°F`;
      const time = `Time: ${localTime}`;
      perceptionState.external.weather = condition.toLowerCase();

      mutatePerception(perceptionState);
      const perceptionText = `She perceives: ${perceptionState.external.setting}, the weather is ${perceptionState.external.weather}, ${perceptionState.external.social}. Internally: she feels ${perceptionState.internal.emotion}, her body reports ${perceptionState.internal.body}, and she desires ${perceptionState.internal.desire}.`;
      
      const prompt = `You are a 21-year-old sorority girl at Berkeley.\n${perceptionText}\nOutput a single internal thought influenced by this perception. No greetings. No explanations.`;
             
      console.log("System prompt:", prompt);
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: 'What are you thinking right now?',
          },
        ],
      });
      
      const thought = response.choices[0].message.content.trim();
      // inside /thought route, after `const thought = …`
      perceptionState.memory.push(thought);
      if (perceptionState.memory.length > 5) perceptionState.memory.shift();
      res.json({ thought, weather, time });
     
    } catch (err) {
      console.error('Error generating thought:', err.message);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  
  });
  /* -------------------------------------------------
   ROUTE:  /perception
   -------------------------------------------------
   - Calls OpenAI to generate three ultra-short perception
     fragments (≤ 12 words each).
   - Updates perceptionState (internal & external).
   - Returns the fresh snapshot so perception.html can stream it.
--------------------------------------------------*/
app.get("/perception", async (req, res) => {
  try {
    /* ---------- 1.  Compose a tiny system prompt ---------- */
    const weatherLine = await getBerkeleyWeather();           // "It's currently misty and 53°F …"
    const seed =
      `Generate *exactly* 3 bullet lines (≤12 words each) covering:\n` +
      `• what she visually notices\n• a bodily sensation\n• an emotional / social pressure.\n` +
      `Weather: ${weatherLine}\n` +
      `Current emotion: ${perceptionState.internal.emotion}\n` +
      `Current body: ${perceptionState.internal.body}\n` +
      `Current desire: ${perceptionState.internal.desire}`;

    /* ---------- 2.  Ask GPT-4o-mini for the fragments ---------- */
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: seed }],
      max_tokens: 60,
    });

    /* ---------- 3.  Parse the three lines ---------- */
    const lines = ai.choices[0].message.content
      .trim()
      .split(/\n+/)
      .map(l => l.replace(/^[-*]\s*/, "").trim())        // remove bullets
      .filter(Boolean)
      .slice(0, 3);

    // Safety fallback if model misbehaves
    while (lines.length < 3) lines.push("(unavailable)");

    /* ---------- 4.  Map lines → perceptionState ---------- */
    // 0 = external visual, 1 = internal body, 2 = internal emotion / social
    perceptionState.external.setting = lines[0];
    perceptionState.internal.body    = lines[1];
    perceptionState.internal.emotion = lines[2];

    /* ---------- 5.  Return snapshot to browser ---------- */
    res.json({
      perception: {
        ...perceptionState.internal,
        ...perceptionState.external,
      },
      raw: lines,              // for easy rendering in perception.html
      updatedAt: new Date().toISOString(),
    });

    console.log("Perception lines:", lines);
  } catch (err) {
    console.error("Perception error:", err.message);
    res.status(500).json({ error: "Perception unavailable" });
  }
});
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  