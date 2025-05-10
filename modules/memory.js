// memory.js - Handles memory storage, decay, and retrieval.

export class Memory {
    constructor(content, emotion, intensity, contextTags = []) {
        this.content = content;
        this.emotion = emotion; // e.g., "fear", "joy"
        this.intensity = intensity; // Scale from 0 to 1
        this.timestamp = Date.now();
        this.contextTags = contextTags;
        this.decayRate = 0.01;
    }

    // Reduce intensity over time
    decay() {
        this.intensity -= this.decayRate;
        if (this.intensity < 0) this.intensity = 0;
    }
}

/**
 * Retrieves relevant memories based on context and intensity.
 * @param {string} currentContext - Context tag for filtering.
 * @param {Array} memoryStore - Collection of stored memories.
 * @returns {Array} - Sorted list of relevant memories.
 */
export function retrieveRelevantMemories(currentContext, memoryStore) {
    return memoryStore
        .filter(memory => memory.contextTags.includes(currentContext) && memory.intensity > 0.2)
        .sort((a, b) => b.intensity - a.intensity);
}
