export function generatePerception() {
    const internalStates = {
      emotion: getRandom([
        "restless", "anxious", "elated", "numb", "irritated", "hopeful"
      ]),
      body: getRandom([
        "tense shoulders", "dry mouth", "headache", "racing heart", "warm skin"
      ]),
      desire: getRandom([
        "to be seen", "to disappear", "to make someone jealous", "to feel safe"
      ]),
    };
  
    const externalStates = {
      setting: getRandom([
        "inside her sorority house", "on the quad", "walking to class", "in line for coffee"
      ]),
      weather: "", // leave this empty for now, it will be passed in from server
      social: getRandom([
        "Vanessa just walked by", "she's alone", "everyone's looking at their phones"
      ])
    };
  
    return {
      internal: internalStates,
      external: externalStates,
    };
  }
  
  function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }
  