// shortTermMemory.js - Handles temporary experiences with decay over time

export const shortTermMemory = {
  experiences: [],
  decayRate: 0.05
};

/**
* Adds a new experience to short-term memory.
* @param {string} content - Description of the memory.
* @param {string} emotion - Associated emotional value.
* @param {number} intensity - Strength (0 to 1).
* @param {Array} tags - Contextual tags related to memory.
*/
export function addShortTermMemory(content, emotion, intensity, tags = []) {
  shortTermMemory.experiences.push({
      content,
      emotion,
      intensity,
      tags,
      timestamp: Date.now()
  });
  console.log("Short-Term Memory added:", content);
}

/**
* Decays short-term memories over time.
*/
export function decayShortTermMemory() {
  shortTermMemory.experiences.forEach(memory => {
      memory.intensity -= shortTermMemory.decayRate;
      if (memory.intensity < 0) memory.intensity = 0;
  });
}
