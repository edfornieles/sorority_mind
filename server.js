// sorority_mind/server.js
import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const openai = new OpenAI();
const app = express();
const PORT = process.env.PORT || 3000;

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

// Get current weather in Berkeley
async function getBerkeleyWeather() {
  const key = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=94720&aqi=no`;

  try {
    const res = await axios.get(url);
    const data = res.data;
    const condition = data.current.condition.text;
    const temp = data.current.temp_f;
    return `It's currently ${condition.toLowerCase()} and ${temp}°F in Berkeley.`;
  } catch (err) {
    console.error('Weather fetch error:', err.message);
    return null;
  }
  
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
      res.json({ thought, weather, time });    
  
    } catch (err) {
      console.error('Error generating thought:', err.message);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  