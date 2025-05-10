const { memoryStore } = require('../modules/memory');

function updateMemoryDecay() {
    memoryStore.forEach(memory => memory.decay());
}

// Decay every 60 seconds
setInterval(updateMemoryDecay, 60000);
