import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // ✅ Fix: Ensure API key is passed
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Global Variables
let activeUsers = 0;
let cachedPerception = null;
let lastUpdateTime = Date.now();

// 🔹 Perception State Structure
let perceptionState = {
  internal: {
    body: "",
    selfImage: "",
    emotion: "",
    desires: "",
    anxieties: "",
    immediateDesires: "",  // ✅ New category
    immediateAnxieties: "" // ✅ New category
  },
  external: {
    peoplePresent: "",
    socialEnergy: "",
    environment: "",
    sensoryTriggers: "",
    weather: ""
  },
  memory: []
};

// 🔹 Active Users Route
app.get('/api/activeUsers', (req, res) => {
  res.json({ active: activeUsers > 0 });
});

app.post('/api/userActive', (req, res) => {
  activeUsers++;  // ✅ Increase active user count
  console.log("User activated, current activeUsers:", activeUsers);
  res.sendStatus(200);
});

// 🔹 Fetch Weather Data
async function getBerkeleyWeather() {
  try {
    const key = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=94720&aqi=no`;
    const res = await axios.get(url);
    const conditionText = res.data.current.condition.text.toLowerCase();
    const temp = res.data.current.temp_f;

    perceptionState.external.weather = conditionText;  // ✅ Fix: Assign weather to state
    return `It's currently ${conditionText} and ${temp}°F in Berkeley.`;
  } catch (err) {
    console.error('Error fetching weather:', err.message);
    return "Weather data unavailable.";
  }
}

// 🔹 Mutate Perception State
function mutatePerception(state) {
  const random = list => list[Math.floor(Math.random() * list.length)];

  state.internal.emotion = random(["restless", "anxious", "elated", "numb", "irritated", "hopeful"]);
  state.internal.body = random(["tight chest", "dry mouth", "heavy legs", "clammy hands", "buzzing skin"]);
  state.internal.desires = random(["to be noticed", "to disappear", "to be comforted", "to impress someone"]);
  state.internal.anxieties = random(["fear of missing out", "social rejection", "not being enough"]);
  state.internal.selfImage = random(["feels invisible", "compares herself to others", "feels confident today"]);
  
  state.internal.immediateDesires = random(["grab coffee", "send a risky text", "leave the conversation", "find someone familiar"]);
  state.internal.immediateAnxieties = random(["someone is judging her", "she said the wrong thing", "not fitting in", "looking awkward"]);
  
  state.external.peoplePresent = random(["Vanessa hasn’t replied", "a guy checked her out", "someone is staring at her"]);
  state.external.socialEnergy = random(["awkward tension", "playful excitement", "everyone's lost in their own worlds"]);
  state.external.environment = random(["dimly lit sorority house", "crowded quad", "rainy sidewalk"]);
  state.external.sensoryTriggers = random(["loud pop music", "overwhelming perfume", "cold air conditioner hum"]);
}

// 🔹 Cached Perception API
app.get("/api/perception", async (req, res) => {
  const now = Date.now();

  if (cachedPerception && now - lastUpdateTime < 60000) {
    return res.json(cachedPerception);
  }

  try {
    await getBerkeleyWeather();  // ✅ Fix: Update weather before mutation
    mutatePerception(perceptionState);

    const newPerception = {
      perception: { ...perceptionState.internal, ...perceptionState.external },
      updatedAt: new Date().toISOString()
    };

    cachedPerception = newPerception;
    lastUpdateTime = now;
    res.json(newPerception);
  } catch (err) {
    console.error("Perception error:", err.message);
    res.status(500).json({ error: "Perception unavailable" });
  }
});

// 🔹 Thought Generation
app.get('/thought', async (req, res) => {
  try {
    const weather = await getBerkeleyWeather();
    mutatePerception(perceptionState);

    const perceptionText = `She perceives: ${perceptionState.external.environment}, the weather is ${perceptionState.external.weather}, ${perceptionState.external.socialEnergy}. Internally: she feels ${perceptionState.internal.emotion}, her body reports ${perceptionState.internal.body}, and she desires ${perceptionState.internal.desires}.`;

    const prompt = `You are a 21-year-old sorority girl at Berkeley.\n${perceptionText}\nOutput a single internal thought influenced by this perception. No greetings. No explanations.`;

    console.log("System prompt:", prompt);
      
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
    });

    const thought = response.choices[0].message.content.trim();
    perceptionState.memory.push(thought);
    if (perceptionState.memory.length > 5) perceptionState.memory.shift();

    res.json({ thought, weather });
  } catch (err) {
    console.error('Error generating thought:', err.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});
app.post('/api/userActive', (req, res) => {
  activeUsers++;
  console.log(`User activated, current activeUsers: ${activeUsers}`);
  res.sendStatus(200);
});

app.post('/api/userInactive', (req, res) => {
  if (activeUsers > 0) activeUsers--; // ✅ Decrease active users
  console.log(`User left, current activeUsers: ${activeUsers}`);
  res.sendStatus(200);
});

// 🔹 Start Server (Only ONE `app.listen`)
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
