// culturalInput.js

export const culturalInputs = [
    {
      id: 1,
      type: "book",
      title: "To Kill a Mockingbird",
      snippet: "A classic exploration of morality and justice in the American South.",
      duration: 120, // simulated minutes
      retentionScore: 0.8  // higher means more likely to be retained
    },
    {
      id: 2,
      type: "lecture",
      title: "Modern Art and Expressionism",
      snippet: "A lecture on how art can express the inexpressible, challenging traditional aesthetics.",
      duration: 90,
      retentionScore: 0.6
    },
    {
      id: 3,
      type: "song",
      title: "Blue in Green - Miles Davis",
      snippet: "A melancholic jazz standard that evokes introspection and longing.",
      duration: 5,
      retentionScore: 0.4
    }
  ];
  
  export function processCulturalInput(selectedEvent) {
    // Use retentionScore to decide if the event is retained
    if (Math.random() <= selectedEvent.retentionScore) {
      const eventDescription = `Studied ${selectedEvent.type} "${selectedEvent.title}": ${selectedEvent.snippet}`;
      const emotionalTone = `Felt inspired and challenged by the ${selectedEvent.type}.`;
      // Return the result so the simulation loop can use it for updates.
      return { description: eventDescription, tone: emotionalTone };
    } 
    return null;
  }
  