import express from 'express';
import { Memory, retrieveRelevantMemories } from '../modules/memory.js';

// Initialize Express Router
const router = express.Router();

// Temporary in-memory storage for memories. Consider using a database in production.
const memoryStore = [];

/* 
  Helper function: generateInfluencingMemories
  This function uses the memoryStore and retrieves memories relevant to the provided context.
  In a real-world scenario, this could involve decay logic, additional data processing, 
  or integration with external services.
*/
async function generateInfluencingMemories(currentContext) {
  // For demonstration, if memoryStore is empty return a dummy memory.
  if (!memoryStore.length) {
    return [{
      content: "No memories stored.",
      detail: "Your memory store is currently empty."
    }];
  }
  
  // Retrieve relevant memories using the provided helper.
  const relevantMemories = retrieveRelevantMemories(currentContext, memoryStore);

  // Format the memories for the API response.
  return relevantMemories.map(memory => ({
    content: memory.content,
    detail: `Emotion: ${memory.emotion}, Intensity: ${memory.intensity}`
  }));
}

/*===============================================================
  1. UPDATE PERCEPTION ENDPOINT
  - Processes the current context from the client request.
  - Retrieves the internal perception state.
  - Generates and returns influencing memories.
================================================================*/
router.post("/update-perception", async (req, res) => {
  try {
    // Debug: Log the incoming request body.
    console.log("Request body:", req.body);
    
    const { currentContext } = req.body;
    console.log("Current context:", currentContext);
    
    if (!currentContext) {
      return res.status(400).json({ error: "Missing currentContext in request." });
    }

    // Define the internal perception state.
    const perceptionState = {
      internal: { vibe: "calm", details: "I feel calm and open to new experiences." },
      external: { context: currentContext, details: "Crowd noise, visual prompts" }
    };

    // Generate influencing memories using the helper function.
    const memoriesInfluencingPerception = await generateInfluencingMemories(currentContext);
    console.log("Memories generated:", memoriesInfluencingPerception);
    
    if (!memoriesInfluencingPerception) {
      throw new Error("Could not generate memories.");
    }
    
    // Send the assembled perception state and memories in the response.
    res.json({ perception: perceptionState, memoriesInfluencingPerception });
  } catch (err) {
    console.error("Error generating perception:", err);
    res.json({ error: "Failed to generate perception." });
  }
});

/*===============================================================
  2. MEMORY MANAGEMENT ENDPOINTS
  - Allows adding new memories.
  - Retrieves all stored memories (useful for debugging or visualization).
================================================================*/

// Endpoint to add a new memory.
router.post('/add-memory', (req, res) => {
  try {
    const { content, emotion, intensity, contextTags } = req.body;
    if (!content || !emotion || intensity === undefined || !contextTags) {
      return res.status(400).json({ error: "Missing required fields: 'content', 'emotion', 'intensity', 'contextTags'." });
    }

    const newMemory = new Memory(content, emotion, intensity, contextTags);
    memoryStore.push(newMemory);
    console.log("Added new memory:", newMemory);

    res.status(201).json({ message: "Memory added successfully.", memory: newMemory });
  } catch (error) {
    console.error("Error in /add-memory:", error.message);
    res.status(500).json({ error: "Failed to add memory." });
  }
});

// Endpoint to retrieve all stored memories.
router.get('/memories', (req, res) => {
  try {
    res.json({ storedMemories: memoryStore });
  } catch (error) {
    console.error("Error in /memories:", error.message);
    res.status(500).json({ error: "Failed to retrieve memories." });
  }
});

export { router };
