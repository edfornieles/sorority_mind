// longTermMemory.js - Stores and manages core long-term memories

export const longTermMemory = {
  coreMemories: [
      {
          content: "Watching the rain through her bedroom window as a child.",
          emotion: "nostalgia",
          intensity: 0.8,
          tags: ["childhood", "reflection"]
      },
      {
          content: "Realizing she had grown apart from an old friend.",
          emotion: "sadness",
          intensity: 0.6,
          tags: ["growth", "change"]
      },
      {
          content: "Understanding that she values deep, meaningful friendships.",
          emotion: "gratitude",
          intensity: 0.9,
          tags: ["identity", "relationships"]
      }
  ]
};

/**
* Adds a new core memory to long-term storage.
* @param {string} content - Description of the memory.
* @param {string} emotion - Associated emotional value.
* @param {number} intensity - Strength (0 to 1).
* @param {Array} tags - Contextual tags related to memory.
*/
export function addCoreMemory(content, emotion, intensity, tags = []) {
  longTermMemory.coreMemories.push({
      content,
      emotion,
      intensity,
      tags
  });
  console.log("Core Memory added:", content);
}
