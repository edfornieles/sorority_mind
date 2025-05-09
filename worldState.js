export const campusMap = {
    sorority_house: { x: 10, y: 5, lat: 37.8743, lon: -122.2594, label: "Sorority House", neighbors: ["library", "quad", "bathroom_mirror"] },
    library: { x: 20, y: 10, lat: 37.8721, lon: -122.2581, label: "Library", neighbors: ["lecture_hall", "quad", "cafe_strada_external"] },
    quad: { x: 15, y: 12, lat: 37.8706, lon: -122.2600, label: "Quad", neighbors: ["library", "lecture_hall", "cafe_strada_internal"] },
    cafe_strada_internal: { x: 18, y: 8, lat: 37.8719, lon: -122.2567, label: "Cafe Strada", neighbors: ["quad", "bus_stop"] },
    bus_stop: { x: 22, y: 14, lat: 37.8697, lon: -122.2525, label: "Bus Stop", neighbors: ["stadium", "party_1"] },
    stadium: { x: 25, y: 18, lat: 37.8683, lon: -122.2502, label: "Stadium", neighbors: ["bus_stop", "lecture_hall"] },
    lecture_hall: { x: 23, y: 11, lat: 37.8725, lon: -122.2598, label: "Lecture Hall", neighbors: ["library", "quad", "professors_office"] },
    professors_office: { x: 24, y: 9, lat: 37.8729, lon: -122.2585, label: "Professor's Office", neighbors: ["lecture_hall"] },
    bathroom_mirror: { x: 10, y: 5, lat: 37.8742, lon: -122.2593, label: "Bathroom Mirror", neighbors: ["sorority_house", "hallway"] },
    hallway: { x: 12, y: 6, lat: 37.8735, lon: -122.2587, label: "Hallway", neighbors: ["sorority_living_room", "elevator_exterior"] },
    elevator_exterior: { x: 13, y: 7, lat: 37.8732, lon: -122.2579, label: "Elevator Entrance", neighbors: ["elevator_interior"] },
    elevator_interior: { x: 14, y: 8, lat: 37.8731, lon: -122.2575, label: "Inside the Elevator", neighbors: ["hallway", "bathroom_mirror"] },
    dream: { x: 99, y: 99, lat: 37.8701, lon: -122.2553, label: "Dream Space", neighbors: ["bathroom_mirror", "hallway"] } // Surreal space
  };
  
  // Attach images & environmental details for location updates
  export const worldState = {
    library: { location: "Library", image: "/images/locations/library.jpeg", weather: "quiet, book-scented air", nearbyPeople: ["Students studying"], events: ["Soft page turning"] },
    cafe_strada_internal: { location: "Inside Cafe Strada", image: "/images/locations/cafe_strada_internal.jpg", weather: "warm espresso aroma", nearbyPeople: ["Barista making coffee"], events: ["Milk steamer hissing"] },
    quad: { location: "Quad", image: "/images/locations/quad.jpg", weather: "breezy afternoon", nearbyPeople: ["Friends laughing on a bench"], events: ["Distant music from the student center"] },
    stadium: { location: "Stadium", image: "/images/locations/stadium.jpeg", weather: "sunlight bouncing off concrete", nearbyPeople: ["Athletes warming up"], events: ["Distant cheering", "Whistle blowing"] },
    dream: { location: "Dream Space", image: "/images/locations/dream.webp", weather: "uncertain", nearbyPeople: ["Echoes of past voices"], events: ["Hallways stretching infinitely"] }
  };
  
  export const npcMemory = {
    Vanessa: {
      lastInteraction: "ignored text",
      socialEnergy: "distant",
      relationshipStatus: "strained",
    },
    Jake: {
      lastInteraction: "flirty conversation",
      socialEnergy: "playful",
      relationshipStatus: "casual",
    },
    Maya: {
      lastInteraction: "complained about homework",
      socialEnergy: "stressed",
      relationshipStatus: "neutral",
    },
  };
  export const memoryState = {
    shortTerm: [],  // ✅ Temporary experiences, fades quickly
    midTerm: [],    // ✅ Events shaping moods over hours/days
    coreMemories: [] // ✅ Defining personality & identity
  };
    