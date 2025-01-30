const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Default route to check if the server is running
app.get('/', (req, res) => {
  res.send('Webhook Server is Live!');
});

// Webhook endpoint for Dialogflow
app.post('/webhook', async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters;
  const programType = parameters.programType;

  if (intentName === 'Upcoming Programs') {
    if (!programType) {
      return res.json({
        fulfillmentText: "What type of upcoming program are you looking for? (e.g., hackathons, internships, conferences, coding competitions)",
      });
    }

    try {
      const response = await axios.get(`https://cse.noticebard.com/api/upcoming?category=${programType}`);
      const programs = response.data.programs;

      if (!programs || programs.length === 0) {
        return res.json({
          fulfillmentText: `I couldn't find any upcoming ${programType} in 2025. Try a different category.`,
        });
      }

      let programList = programs.map(program => `- ${program.name}: ${program.date}`).join('\n');
      const fulfillmentText = `Here are the upcoming ${programType} events in 2025:\n${programList}`;

      res.json({ fulfillmentText });
    } catch (error) {
      console.error('Error fetching programs:', error);
      res.json({
        fulfillmentText: `Sorry, I couldn’t fetch upcoming ${programType} right now. Please try again later.`,
      });
    }
  } else {
    res.json({ fulfillmentText: 'Intent not handled.' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
