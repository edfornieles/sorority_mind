import express from 'express';
import { Memory, retrieveRelevantMemories } from '../modules/memory.js';

// Initialize Express Router
const router = express.Router();
const memoryStore = []; // Temporary in-memory storage (consider database integration later)

/*===============================================================
  1. UPDATE PERCEPTION ENDPOINT
  - Processes the current context and retrieves relevant memories
================================================================*/
router.post('/update-perception', (req, res) => {
    try {
        const { currentContext } = req.body;
        if (!currentContext) {
            return res.status(400).json({ error: "Missing 'currentContext' in request body." });
        }

        // Retrieve relevant memories based on context
        const activeMemories = retrieveRelevantMemories(currentContext, memoryStore);

        res.json({
            perception: `Processing context: ${currentContext}`,
            memoriesInfluencingPerception: activeMemories.map(mem => mem.content),
        });
    } catch (error) {
        console.error("Error in /update-perception:", error.message);
        res.status(500).json({ error: "Failed to update perception." });
    }
});

/*===============================================================
  2. MEMORY MANAGEMENT ENDPOINTS
  - Allows adding new memories
  - Retrieves all stored memories (for debugging or expansion)
================================================================*/

// Add a new memory entry
router.post('/add-memory', (req, res) => {
    try {
        const { content, emotion, intensity, contextTags } = req.body;
        if (!content || !emotion || intensity === undefined || !contextTags) {
            return res.status(400).json({ error: "Missing required fields: 'content', 'emotion', 'intensity', 'contextTags'." });
        }

        const newMemory = new Memory(content, emotion, intensity, contextTags);
        memoryStore.push(newMemory);

        res.status(201).json({ message: "Memory added successfully.", memory: newMemory });
    } catch (error) {
        console.error("Error in /add-memory:", error.message);
        res.status(500).json({ error: "Failed to add memory." });
    }
});

// Retrieve all stored memories (for debugging or visualization)
router.get('/memories', (req, res) => {
    try {
        res.json({ storedMemories: memoryStore });
    } catch (error) {
        console.error("Error in /memories:", error.message);
        res.status(500).json({ error: "Failed to retrieve memories." });
    }
});

export { router };
