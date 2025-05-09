<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Perception Stream</title>
  <style>
    body {
      background: black;
      color: white;
      font-family: monospace;
      padding: 20px;
    }
    #feed {
      max-width: 600px;
      margin: auto;
    }
    .internal { color: #ff8080; }   /* Red for internal states */
    .external { color: #80bfff; }   /* Blue for external perceptions */
  </style>
</head>
<body>
  <h2>Her Perception</h2>
  <div id="feed">Loading perception...</div>

  <script>
    async function fetchPerception() {
      const res = await fetch('/api/perception');
      const data = await res.json();
      const feed = document.getElementById('feed');
      
      feed.innerHTML += `
        <p class="internal">💭 <b>Emotion:</b> ${data.perception.emotion}</p>
        <p class="internal">🩸 <b>Body:</b> ${data.perception.body}</p>
        <p class="internal">🎭 <b>Self-Image:</b> ${data.perception.selfImage}</p>
        <p class="internal">🔥 <b>Desires:</b> ${data.perception.desires}</p>
        <p class="internal">⚠️ <b>Anxieties:</b> ${data.perception.anxieties}</p>
        <p class="external">🧍 <b>People:</b> ${data.perception.peoplePresent}</p>
        <p class="external">💬 <b>Social Energy:</b> ${data.perception.socialEnergy}</p>
        <p class="external">🏡 <b>Environment:</b> ${data.perception.environment}</p>
        <p class="external">🔊 <b>Sensory Triggers:</b> ${data.perception.sensoryTriggers}</p>
      `;
    }

    // Fetch new perception every 15 seconds
    setInterval(fetchPerception, 15000);
  </script>
</body>
</html>
