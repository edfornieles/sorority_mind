// sorority_mind/server.js
import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';
import { generatePerception } from './perception.js';

dotenv.config();

const openai = new OpenAI();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      const perception = generatePerception();
      perception.external.weather = condition.toLowerCase(); // inject real weather
      
      const perceptionText = `She perceives: ${perception.external.setting}, the weather is ${perception.external.weather}, ${perception.external.social}. Internally: she feels ${perception.internal.emotion}, her body reports ${perception.internal.body}, and she desires ${perception.internal.desire}.`;
      
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
