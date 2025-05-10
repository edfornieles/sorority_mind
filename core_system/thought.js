// thought.js

// Initial thought state
export const thought = {
  current: "I feel calm and open to new experiences.",
  history: []
};

// Function to update thought
export function updateThought(newThought) {
  // Save current thought into history before updating
  if (thought.current) {
    thought.history.push(thought.current);
  }
  thought.current = newThought;

  // Optionally limit history length (for example, last 50 thoughts)
  if (thought.history.length > 50) {
    thought.history.shift();
  }
}

// For simulation: A function to generate a random thought update from a pool
const thoughtPool = [
  "I feel anxious about the upcoming interaction.",
  "A memory from earlier today makes me smile.",
  "I wonder if I'm truly understood by my friends.",
  "I feel a spark of inspiration after hearing a familiar song.",
  "Sometimes, I question if I fit in, but I know who I am deep down."
];

export function generateRandomThoughtUpdate() {
  // For simplicity, pick a random string from our pool.
  const randomIndex = Math.floor(Math.random() * thoughtPool.length);
  const newThought = thoughtPool[randomIndex];
  updateThought(newThought);
}
