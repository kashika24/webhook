const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName; // Intent name
  const parameters = req.body.queryResult.parameters; // Extract parameters if needed

  if (intentName === 'Upcoming Programs') {
    try {
      // Fetch programs from a sample API or web scraping
      const response = await axios.get('https://example.com/api/upcoming-programs'); // Replace with a real API URL
      const programs = response.data.programs; // Adjust based on the API response structure

      // Create a response
      let programList = programs.map(program => `- ${program.name}: ${program.date}`).join('\n');
      const fulfillmentText = `Here are the upcoming programs offered by companies:\n${programList}`;

      res.json({
        fulfillmentText,
      });
    } catch (error) {
      console.error('Error fetching programs:', error);
      res.json({
        fulfillmentText: 'Sorry, I couldn’t fetch the programs right now. Please try again later.',
      });
    }
  } else {
    res.json({
      fulfillmentText: 'Intent not handled.',
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
