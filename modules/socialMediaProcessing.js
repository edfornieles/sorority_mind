// socialMediaProcessing.js

export const socialMediaInputs = [
  {
    id: 1,
    type: "social media",
    title: "Viral Meme",
    snippet: "A hilarious meme that reflects a popular sentiment of the day.",
    duration: 2, // simulated minutes
    retentionScore: 0.3
  },
  {
    id: 2,
    type: "social media",
    title: "Trending News",
    snippet: "Breaking news that challenges her perspective on social justice.",
    duration: 5,
    retentionScore: 0.7
  },
  {
    id: 3,
    type: "social media",
    title: "Influencer Post",
    snippet: "A stylized post by a celebrity that sparks her curiosity about modern trends.",
    duration: 3,
    retentionScore: 0.5
  }
];

export function processSocialMediaInput(event) {
  if (Math.random() <= event.retentionScore) {
    const eventDescription = `While surfing social media, I encountered "${event.title}": ${event.snippet}`;
    const emotionalTone = `It left me feeling curious yet conflicted.`;
    addMidTermEvent(eventDescription, emotionalTone);  // Ensure addMidTermEvent is imported in the consuming file.
    console.log("Social media input added to mid-term memory:", eventDescription);
  } else {
    console.log("Social media input not retained:", event.title);
  }
}
