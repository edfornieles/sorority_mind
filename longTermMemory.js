export let longTermMemory = {
    definingExperiences: [
      "Childhood memory: Watching the rain through her bedroom window.",
      "Big emotional shift: The moment she realized she had grown apart from an old friend.",
      "Core realization: She values deep, meaningful friendships over surface-level connections.",
      "The feeling of being truly seen after opening up to someone for the first time.",
      "That one summer road trip where everything felt perfect."
    ],
    coreLessons: [
      "Friendships require effort, but some people won’t reciprocate.",
      "Being alone doesn’t mean being lonely—sometimes it’s peaceful.",
      "Change is inevitable, but growth comes from adapting.",
      "Emotions are complicated, and it’s okay not to always understand them.",
      "It's okay to ask for help instead of pretending to be fine."
    ],
    pastRegrets: [
      "Not speaking up for herself when she felt uncomfortable in a situation.",
      "Letting an important friendship fade because she assumed it would last forever.",
      "Worrying too much about what others thought instead of just being herself.",
      "Pushing people away when she needed them the most.",
      "Hesitating when she had an opportunity to do something exciting."
    ],
    emotionalAnchors: [
      "Rainy days bring back a sense of quiet nostalgia.",
      "Old songs transport her to memories she thought she had forgotten.",
      "Certain scents instantly remind her of childhood or specific moments.",
      "Feeling out of place in a crowd makes her retreat into herself.",
      "Deep conversations are when she feels most connected."
    ]
  };
  
  // 🔹 Function to store core defining memories
  export function addCoreMemory(experience, lesson, regret, anchor) {
    longTermMemory.definingExperiences.push(experience);
    longTermMemory.coreLessons.push(lesson);
    longTermMemory.pastRegrets.push(regret);
    longTermMemory.emotionalAnchors.push(anchor);
  
    // ✅ Prevent excessive memory growth—keep max entries at 15
    for (const category in longTermMemory) {
      if (longTermMemory[category].length > 15) longTermMemory[category].shift();
    }
  
    console.log(`Added core memory: ${experience}`);
  }
  
  // 🔹 Function to archive older long-term memories
  function archiveLongTermMemory(experience, lesson, regret, anchor) {
    console.log(`Archiving long-term memory: ${experience}`);
  
    const removeEntry = (array, entry) => {
      const index = array.indexOf(entry);
      if (index !== -1) array.splice(index, 1); // ✅ Prevent accidental data removal
    };
  
    removeEntry(longTermMemory.definingExperiences, experience);
    removeEntry(longTermMemory.coreLessons, lesson);
    removeEntry(longTermMemory.pastRegrets, regret);
    removeEntry(longTermMemory.emotionalAnchors, anchor);
  }
  