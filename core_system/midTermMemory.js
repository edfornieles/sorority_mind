// midTermMemory.js - Manages mid-term memories with associative emotional tones.

export const midTermMemory = {
  memories: [],
  decayRate: 0.02,
  emotionalTones: [
      { emotion: "happiness", intensity: 0.8 },
      { emotion: "frustration", intensity: 0.4 },
      { emotion: "curiosity", intensity: 0.6 }
  ]
};

/**
* Adds a new experience to mid-term memory.
* @param {string} content - Description of the memory.
* @param {string} emotion - Associated emotional value.
* @param {number} intensity - Strength (0 to 1).
* @param {Array} tags - Contextual tags related to memory.
*/
export function addMidTermMemory(content, emotion, intensity, tags = []) {
  midTermMemory.memories.push({
      content,
      emotion,
      intensity,
      tags,
      timestamp: Date.now()
  });
  console.log("Mid-Term Memory added:", content);
}

/**
* Decays mid-term memories over time.
*/
export function decayMidTermMemory() {
  midTermMemory.memories.forEach(memory => {
      memory.intensity -= midTermMemory.decayRate;
      if (memory.intensity < 0) memory.intensity = 0;
  });
}
