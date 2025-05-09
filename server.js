import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';
import { worldState } from './worldState.js';
import { campusMap } from './worldState.js';
import { shortTermMemory, updateShortTermMemory } from "./shortTermMemory.js";
import { midTermMemory, addMidTermEvent } from "./midTermMemory.js";
import { longTermMemory, addCoreMemory } from "./longTermMemory.js";
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

let activeUsers = 0;
let cachedPerception = null;
let lastUpdateTime = Date.now();
let currentLocation = campusMap["sorority_house"];

let perceptionState = { internal: {}, external: {} };

const random = list => list[Math.floor(Math.random() * list.length)];

// 🔹 Fetch Weather Data
async function getBerkeleyWeather() {
  try {
    const key = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=94720&aqi=no`;
    const res = await axios.get(url);
    return res.data.current.condition.text.toLowerCase();
  } catch (err) {
    console.error('Error fetching weather:', err.message);
    return "unknown weather";
  }
}

// 🔹 Mutate Perception State
async function mutatePerception(state) {
  state.internal = {
    emotion: random(["restless", "anxious", "elated", "numb", "irritated", "hopeful"]),
    body: random(["tight chest", "dry mouth", "heavy legs", "clammy hands", "buzzing skin"]),
    desires: random(["to be noticed", "to disappear", "to be comforted", "to impress someone"]),
    anxieties: random(["fear of missing out", "social rejection", "not being enough"]),
    selfImage: random(["feels invisible", "compares herself to others", "feels confident today"]),
    immediateDesires: random(["grab coffee", "send a risky text", "leave the conversation", "find someone familiar"]),
    immediateAnxieties: random(["someone is judging her", "she said the wrong thing", "not fitting in", "looking awkward"])
  };

  state.external = {
    peoplePresent: random(["Vanessa hasn’t replied", "a guy checked her out", "someone is staring at her"]),
    socialEnergy: random(["awkward tension", "playful excitement", "everyone's lost in their own worlds"]),
    environment: random(["dimly lit sorority house", "crowded quad", "rainy sidewalk"]),
    sensoryTriggers: random(["loud pop music", "overwhelming perfume", "cold air conditioner hum"]),
    weather: await getBerkeleyWeather()
  };

  // ✅ Apply Memory Influence
  if (midTermMemory.emotionalCarryover.includes("anxiety")) {
    state.internal.emotion = "on edge";
  }

  if (longTermMemory.attachmentStyle === "avoidant") {
    state.internal.desires += ", but also struggles with emotional closeness.";
  }

  // ✅ Properly Update Short-Term Memory Based on Categories
  updateShortTermMemory({
    emotion: state.internal.emotion,
    socialThought: state.external.peoplePresent,
    anxiety: state.internal.immediateAnxieties
  });

  if (state.internal.emotion === "anxious") {
    addMidTermEvent("Felt overwhelmed in social space", "anxiety lingered", "avoid large crowds");
  }

  if (state.external.environment === "rainy sidewalk") {
    addCoreMemory("Reflecting on loneliness during rain", "recurrent rainy-day sadness", "seeks warmth in friendships", "secure attachment", "fear of isolation", "values deep connection");
  }

  console.log("Perception updated:", state.internal.emotion, state.external.environment);
}

// 🔹 API Routes
app.get("/api/perception", async (req, res) => {
  try {
    await mutatePerception(perceptionState);
    console.log("🔹 Returning Perception Data:", JSON.stringify(perceptionState, null, 2)); // ✅ Debugging Log
    res.json({ perception: perceptionState });
  } catch (err) {
    console.error("Perception API error:", err.message);
    res.status(500).json({ error: "Failed to generate perception." });
  }
});

// ✅ Memory API Routes
app.get("/api/shortMemory", (req, res) => {
  console.log("🔹 Short-Term Memory Accessed:", JSON.stringify(shortTermMemory, null, 2));
  res.json(shortTermMemory);
});

app.get("/api/midMemory", (req, res) => {
  console.log("🔹 Mid-Term Memory Before Sending:", JSON.stringify(midTermMemory, null, 2));
  res.json({ memory: midTermMemory.significantEncounters || [] });
});

app.get("/api/longMemory", (req, res) => {
  console.log("🔹 Long-Term Memory Before Sending:", JSON.stringify(longTermMemory, null, 2));
  res.json({ memory: longTermMemory.definingExperiences || [] });
});

app.get("/thought", async (req, res) => {
  try {
    await mutatePerception(perceptionState);

    const perceptionText = `She perceives: ${perceptionState.external.environment}, weather is ${perceptionState.external.weather}, ${perceptionState.external.socialEnergy}. Internally: she feels ${perceptionState.internal.emotion}, body reports ${perceptionState.internal.body}, and she desires ${perceptionState.internal.desires}.`;

    const prompt = `Generate **ONE concise sentence** reflecting her internal monologue.  
    Keep it **short, personal, and emotionally driven**. Do **NOT** repeat perception details.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
    });

    res.json({ thought: response.choices[0].message.content.trim().split(".")[0] + "." });
  } catch (err) {
    console.error("Error generating thought:", err.message);
    res.status(500).json({ error: "Failed to generate thought." });
  }
});

// 🔹 Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
