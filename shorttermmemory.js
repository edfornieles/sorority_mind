export let shortTermMemory = {
    tasks: [
      "Finish reading for sociology class.",
      "Buy a gift for Maya's birthday.",
      "Make a doctor's appointment.",
      "Check if she has enough money to go out this weekend."
    ],
    socialThoughts: [
      "Did Jake really mean that compliment or was he joking?",
      "Vanessa seemed annoyed earlier—was it something I said?",
      "Everyone at the party seemed to talk over me—why?",
      "Should I apologize for interrupting Maya in class?",
      "That moment when someone ignored her and she pretended not to notice."
    ],
    emotionalCarryover: [
      "Still frustrated about that awkward moment at the coffee shop.",
      "Excitement lingering from the spontaneous beach trip.",
      "That weird sadness that comes out of nowhere at night.",
      "Feeling nostalgic after hearing that old song.",
      "Still carrying stress from that argument with Dad last week."
    ],
    mentalLoops: [
      "Why can’t she stop thinking about Jake?",
      "What if she embarrassed herself without realizing?",
      "Replaying that compliment she got—does it mean anything?",
      "That weird TikTok about psychological theories—why did it hit so hard?",
      "Regret from texting too fast without thinking it through."
    ],
    sensoryAwareness: [
      "The way the streetlights flicker when she walks home.",
      "The lingering scent of someone’s cologne—reminds her of someone.",
      "That sharp cold breeze when stepping outside.",
      "The annoying buzz of neon lights in the hallway.",
      "The warmth of the sunlight through the sorority house window."
    ],
    fleetingCuriosities: [
      "What if she completely changed her style—would she feel different?",
      "How do people just *know* what career they want?",
      "Can dreams predict things?",
      "Are friendships supposed to feel this complicated?",
      "Why do rainy days feel so cinematic?"
    ]
  };
  
  // 🔹 Function to update short-term memory dynamically
  export function updateShortTermMemory({ task, socialThought, emotion, loop, sensory, curiosity }) {
    if (task) shortTermMemory.tasks.push(task);
    if (socialThought) shortTermMemory.socialThoughts.push(socialThought);
    if (emotion) shortTermMemory.emotionalCarryover.push(emotion);
    if (loop) shortTermMemory.mentalLoops.push(loop);
    if (sensory) shortTermMemory.sensoryAwareness.push(sensory);
    if (curiosity) shortTermMemory.fleetingCuriosities.push(curiosity);
  
    // ✅ Limit short-term entries to avoid excessive buildup
    for (const category in shortTermMemory) {
      if (shortTermMemory[category].length > 6) shortTermMemory[category].shift();
    }
  }
  