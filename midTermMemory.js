export let midTermMemory = {
    significantEncounters: [
      "Vanessa ignored her text after their last meetup.",
      "Jake made a teasing comment about her overthinking.",
      "Maya seemed overwhelmed with studying but appreciated her support.",
      "A classmate invited her to a late-night study session.",
      "She accidentally embarrassed herself at a crowded coffee shop."
    ],
    emotionalCarryover: [
      "Lingering awkwardness from a weird interaction in class.",
      "Excitement about an upcoming party but uncertainty about who’s going.",
      "A feeling of loneliness after walking past a group laughing together.",
      "Stress from nearly missing a project deadline.",
      "Confidence boost after getting a compliment on her outfit."
    ],
    activeGoals: [
      "Get closer to Maya and help her feel less overwhelmed.",
      "Figure out what’s happening with Vanessa—does she care?",
      "Keep her grades up while balancing her social life.",
      "Try to be more bold in conversations instead of overthinking.",
      "Avoid embarrassing herself again in public spaces."
    ],
    anxieties: [
      "Worried that Vanessa secretly dislikes her.",
      "Afraid Jake sees her as needy and overthinks everything.",
      "Social anxiety when entering a crowded space, unsure if people notice her discomfort.",
      "Fear that she’s missing out on the 'real' college experience while focusing too much on work.",
      "Nervous about accidentally saying the wrong thing and being judged."
    ],
    fears: [
      "Losing touch with Chloe permanently, realizing friendships don’t always last.",
      "Never finding a group where she feels truly accepted.",
      "Feeling invisible in a room full of people.",
      "Failing her classes and disappointing her family.",
      "Becoming emotionally dependent on someone who doesn’t care about her."
    ]
  };
  
  // 🔹 Function to store impactful social events
  export function addMidTermEvent(encounter, moodImpact, goal) {
    midTermMemory.significantEncounters.push(encounter);
    midTermMemory.emotionalCarryover.push(moodImpact);
    midTermMemory.activeGoals.push(goal);
  
    // ✅ Prevent excessive memory growth—keep max entries at 10
    for (const category in midTermMemory) {
      if (midTermMemory[category].length > 10) midTermMemory[category].shift();
    }
  
    // ✅ Mid-term entries persist for 7 days before being archived
    setTimeout(() => archiveMidTermMemory(encounter, moodImpact, goal), 7 * 24 * 60 * 60 * 1000);
  }
  
  // 🔹 Function to archive older mid-term memories
  function archiveMidTermMemory(encounter, moodImpact, goal) {
    console.log(`Archiving mid-term memory: ${encounter}`);
  
    const removeEntry = (array, entry) => {
      const index = array.indexOf(entry);
      if (index !== -1) array.splice(index, 1); // ✅ Prevent accidental data removal
    };
  
    removeEntry(midTermMemory.significantEncounters, encounter);
    removeEntry(midTermMemory.emotionalCarryover, moodImpact);
    removeEntry(midTermMemory.activeGoals, goal);
  }
  