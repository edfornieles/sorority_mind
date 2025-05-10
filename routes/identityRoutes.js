import express from 'express';
import { identity } from '../modules/identity.js';

const router = express.Router();

/*===============================================================
  1. GET Identity Data
  - Returns the current identity state (core beliefs, self-perception).
================================================================*/
router.get('/identity', (req, res) => {
    try {
        console.log("Identity Requested:", identity);
        res.json(identity);
    } catch (error) {
        console.error("Error in /identity:", error.message);
        res.status(500).json({ error: "Failed to retrieve identity." });
    }
});

/*===============================================================
  2. Update Identity Attributes
  - Allows modification of core beliefs and personality traits.
================================================================*/
router.post('/identity/update', (req, res) => {
    try {
        const { newBeliefs, newPersonalityTraits } = req.body;

        if (!newBeliefs || !newPersonalityTraits) {
            return res.status(400).json({ error: "Missing 'newBeliefs' or 'newPersonalityTraits' fields." });
        }

        identity.coreBeliefs = newBeliefs;
        identity.personalityTraits = newPersonalityTraits;

        res.json({ message: "Identity updated successfully.", updatedIdentity: identity });
    } catch (error) {
        console.error("Error in /identity/update:", error.message);
        res.status(500).json({ error: "Failed to update identity." });
    }
});

export { router };
