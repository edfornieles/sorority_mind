import express from 'express';
import { Memory, retrieveRelevantMemories } from '../modules/memory.js';

const router = express.Router();
const memoryStore = []; // Temporary storage (consider database integration later)

/*===============================================================
  1. GET Stored Memories
  - Retrieves all stored memories (for debugging or expansion).
================================================================*/
router.get('/memories', (req, res) => {
    try {
        res.json({ storedMemories: memoryStore });
    } catch (error) {
        console.error("Error in /memories:", error.message);
        res.status(500).json({ error: "Failed to retrieve memories." });
    }
});

/*===============================================================
  2. Add a New Memory Entry
  - Allows inserting new memories dynamically.
================================================================*/
router.post('/memories/add', (req, res) => {
    try {
        const { content, emotion, intensity, contextTags } = req.body;

        if (!content || !emotion || intensity === undefined || !contextTags) {
            return res.status(400).json({ error: "Missing required fields: 'content', 'emotion', 'intensity', 'contextTags'." });
        }

        const newMemory = new Memory(content, emotion, intensity, contextTags);
        memoryStore.push(newMemory);

        res.status(201).json({ message: "Memory added successfully.", memory: newMemory });
    } catch (error) {
        console.error("Error in /memories/add:", error.message);
        res.status(500).json({ error: "Failed to add memory." });
    }
});

/*===============================================================
  3. Retrieve Relevant Memories Based on Context
  - Pulls specific memories tied to the given perception context.
================================================================*/
router.post('/memories/retrieve', (req, res) => {
    try {
        const { currentContext } = req.body;

        if (!currentContext) {
            return res.status(400).json({ error: "Missing 'currentContext' in request body." });
        }

        const activeMemories = retrieveRelevantMemories(currentContext, memoryStore);

        res.json({
            context: currentContext,
            relevantMemories: activeMemories.map(mem => mem.content),
        });
    } catch (error) {
        console.error("Error in /memories/retrieve:", error.message);
        res.status(500).json({ error: "Failed to retrieve relevant memories." });
    }
});

export { router };
