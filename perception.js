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
  </style>
</head>
<body>
  <div id="feed">Loading perception...</div>

  <script>
    async function fetchPerception() {
      const res = await fetch('/api/perception');
      const data = await res.json();
      const perceptionText = data.raw.join('<br>'); // Format each line
      
      document.getElementById('feed').innerHTML += `<p>${perceptionText}</p>`;
    }

    // Fetch and update every 15 seconds
    setInterval(fetchPerception, 15000);
  </script>
</body>
</html>
