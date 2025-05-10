// Core Dependencies
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Environment Configuration
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Derive __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import System Modules
import { worldState, campusMap } from './modules/worldState.js';
import { shortTermMemory, addShortTermMemory, decayShortTermMemory } from './core_system/shortTermMemory.js';
import { midTermMemory, addMidTermMemory, decayMidTermMemory } from './core_system/midTermMemory.js';
import { longTermMemory, addCoreMemory } from './core_system/longTermMemory.js';
import { thought, updateThought, generateRandomThoughtUpdate } from './core_system/thought.js';
import { identity } from './modules/identity.js';
import { retrieveRelevantMemories } from './modules/memory.js';

// Import Simulation Modules
import { culturalInputs, processCulturalInput } from './modules/culturalInput.js';
import { socialMediaInputs, processSocialMediaInput } from './modules/socialMediaProcessing.js';

// Import API Routes
import { router as identityRoutes } from './routes/identityRoutes.js';
import { router as memoryRoutes } from './routes/memoryRoutes.js';
import { router as perceptionRoutes } from './routes/perception.js';


// Initialize Express App
const app = express();

// Static File Serving
app.use(express.static(path.join(__dirname, 'public')));

// API Route Registration
app.use('/api/perception', perceptionRoutes);
app.use('/api/identity', identityRoutes);
app.use('/api/memory', memoryRoutes);
app.use(express.json());

// Global State Variables
const globalState = {
    activeUsers: 0,
    cachedPerception: null,
    lastUpdateTime: Date.now(),
    currentLocation: campusMap["sorority_house"],
    perceptionState: { internal: {}, external: {} }
};


// Utility Functions
const random = list => list[Math.floor(Math.random() * list.length)];

/*===============================================================
  1. ASSOCIATIVE THOUGHT UPDATE FUNCTION
  This function creates a new thought from a memory event, current thought,
  identity, and perception context.
================================================================*/
function associativeThoughtUpdate(memoryEvent, currentThought, identity, perception = {}) {
  // Improved keyword extraction: remove punctuation, lowercase, etc.
  const extractKeywords = text => {
    const stopwords = ["a", "an", "the", "and", "or", "but", "to", "of", "on", "in"];
    return text
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .toLowerCase()
      .split(" ")
      .filter(word => word.length > 3 && !stopwords.includes(word));
  };

  const eventKeywords = extractKeywords(memoryEvent.event);
  const commonKeywords = eventKeywords.filter(kw =>
    currentThought.toLowerCase().includes(kw)
  );

  // Template options for generating the new thought.
  const templates = [
    commonKeywords.length > 0
      ? `Reflecting on ${commonKeywords[0]}, I recall that ${memoryEvent.event}. ${memoryEvent.tone}`
      : `Considering my belief that "${identity.coreBeliefs[0] || "my core values"}", I note that ${memoryEvent.event}. ${memoryEvent.tone}`,
    
    `In light of my conviction, especially that "${identity.coreBeliefs[0] || "I value authenticity"}", witnessing "${memoryEvent.event}" makes me feel: ${memoryEvent.tone}`,
    
    `After experiencing "${memoryEvent.event}", I can't help but think, "${memoryEvent.tone}".`
  ];

  // Add perception influence if available
  let perceptionInfluence = "";
  if (perception.external && perception.external.environment) {
    perceptionInfluence = ` Also, being in a ${perception.external.environment} adds to my mood.`;
  }

  let newThought = templates[Math.floor(Math.random() * templates.length)] + perceptionInfluence;

  // Occasionally add an abrupt transition (for non-linear thought)
  if (Math.random() < 0.3) {
    newThought += " Suddenly, a stray thought interrupts my reflection.";
  }
  
  return newThought;
}

/*===============================================================
  2. MEMORY EVENT SIMULATION FUNCTION
  This function chooses a random event from a pool, updates memory,
  and refreshes the internal thought via the associative updater.
================================================================*/
const eventPool = [
  { 
    event: "Had a deep conversation with a friend about insecurities.", 
    tone: "That conversation made me feel vulnerable yet understood." 
  },
  { 
    event: "Received a sincere compliment that brightened my day.", 
    tone: "I still feel the warmth of that compliment." 
  },
  { 
    event: "Experienced a minor misunderstanding that left me doubting myself.", 
    tone: "I feel a nagging uncertainty after that encounter." 
  },
  { 
    event: "Witnessed a random act of kindness that restored my faith in people.", 
    tone: "I feel hopeful and a bit more connected to the world." 
  }
];

function simulateMemoryEvent() {
  const randomIndex = Math.floor(Math.random() * eventPool.length);
  const selectedEvent = eventPool[randomIndex];

  // Update mid-term memory with the selected event.
  addMidTermEvent(selectedEvent.event, selectedEvent.tone);
  console.log("New Mid-Term Event Added:", selectedEvent.event);
  console.log("Starting server...");
debugger; // Stops execution here so you can inspect variables


  // Update internal thought based on the event and current perception.
  const newThought = associativeThoughtUpdate(selectedEvent, thought.current, identity, perceptionState);
  updateThought(newThought);
  console.log("Associative Thought Updated:", newThought);
}

/*===============================================================
  3. PERCEPTION STATE MUTATION & INFLUENCES
================================================================*/
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
    weather: await getBerkeleyWeather(),
    culturalCue: random([
      "Scrolling through a viral feed",
      "Noticed an interesting blog post",
      "Saw a trending meme"
    ])
  };

  // Existing Memory Influences
  if (midTermMemory.emotionalCarryover && midTermMemory.emotionalCarryover.includes("anxiety")) {
    state.internal.emotion = "on edge";
  }
  if (longTermMemory.attachmentStyle === "avoidant") {
    state.internal.desires += ", but also struggles with emotional closeness.";
  }

  updateShortTermMemory({
    emotion: state.internal.emotion,
    socialThought: state.external.peoplePresent,
    anxiety: state.internal.immediateAnxieties
  });

  if (state.internal.emotion === "anxious") {
    addMidTermEvent("Felt overwhelmed in social space", "anxiety lingered");
  }
  if (state.external.environment === "rainy sidewalk") {
    addCoreMemory("Reflecting on loneliness during rain", "recurrent rainy-day sadness", "seeks warmth in friendships");
  }

  console.log("Perception updated:", state.internal.emotion, state.external.environment);
}

/*===============================================================
  4. API ROUTES
================================================================*/
app.get("/api/perception", async (req, res) => {
  try {
    await mutatePerception(perceptionState);
    console.log("🔹 Returning Perception Data:", JSON.stringify(perceptionState, null, 2));
    res.json({ perception: perceptionState });
  } catch (err) {
    console.error("Perception API error:", err.message);
    res.status(500).json({ error: "Failed to generate perception." });
  }
});

app.get("/api/identity", (req, res) => {
  console.log("Identity Requested:", identity);
  res.json(identity);
});

app.get("/api/shortMemory", (req, res) => {
  console.log("Short-Term Memory Requested:", shortTermMemory);
  res.json(shortTermMemory);
});

app.get("/api/midMemory", (req, res) => {
  console.log("Mid-Term Memory Requested:", midTermMemory);
  res.json(midTermMemory);
});

app.get("/api/longMemory", (req, res) => {
  console.log("Long-Term Memory Requested:", longTermMemory);
  res.json(longTermMemory);
});

app.get("/api/thought", (req, res) => {
  console.log("Current Thought Requested:", thought.current);
  res.json(thought);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/*===============================================================
  5. SIMULATION LOOPS
================================================================*/
// Option A: Generate a random thought update every 30 seconds.
setInterval(() => {
  generateRandomThoughtUpdate();
  console.log("Thought Updated (Random):", thought.current);
}, 30000);

// Option B: Simulate a memory event every minute.
setInterval(() => {
  simulateMemoryEvent();
}, 60000);

// Social Media Simulation: Process a social media input every 90 seconds.
setInterval(() => {
  const randomIndex = Math.floor(Math.random() * socialMediaInputs.length);
  const selectedSMEvent = socialMediaInputs[randomIndex];
  processSocialMediaInput(selectedSMEvent);
}, 90000);

// Cultural Input Simulation: Process a cultural input event every 3 minutes.
setInterval(() => {
  const randomIndex = Math.floor(Math.random() * culturalInputs.length);
  const selectedEvent = culturalInputs[randomIndex];
  const culturalResult = processCulturalInput(selectedEvent);
  
  if (culturalResult !== null) {
    // Update mid-term memory with the cultural event.
    addMidTermEvent(culturalResult.description, culturalResult.tone);
    console.log("Cultural input added:", culturalResult.description);
    
    // Update thought using associative thought update.
    const newThought = associativeThoughtUpdate(
      { event: culturalResult.description, tone: culturalResult.tone },
      thought.current,
      identity,
      perceptionState
    );
    updateThought(newThought);
    console.log("Thought updated from cultural input:", newThought);
  } else {
    console.log("Cultural input not retained:", selectedEvent.title);
  }
}, 180000);
