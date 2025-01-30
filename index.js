const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName; // Intent name
  const parameters = req.body.queryResult.parameters; // Extract parameters
  const programType = parameters.programType; // Extract program type (hackathon, internship, conference, etc.)

  if (intentName === 'Upcoming Programs') {
    if (!programType) {
      // If programType is not provided, ask the user for clarification
      return res.json({
        fulfillmentText: "What type of upcoming program are you looking for? (e.g., hackathons, internships, conferences, coding competitions)",
      });
    }

    try {
      // Fetch upcoming programs dynamically based on user input
      const searchQuery = encodeURIComponent(`upcoming ${programType} 2025`);
      const searchUrl = `https://www.google.com/search?q=${searchQuery}`; // Placeholder for real API or web scraping
      
      // Replace this with a real API that provides upcoming events
      const response = await axios.get(`https://cse.noticebard.com/api/upcoming?category=${programType}`); 
      
      const programs = response.data.programs; // Adjust based on API response
      if (!programs || programs.length === 0) {
        return res.json({
          fulfillmentText: `I couldn't find any upcoming ${programType} in 2025. Try a different category.`,
        });
      }

      // Format the response
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
