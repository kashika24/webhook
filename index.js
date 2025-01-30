const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Webhook Server is Live!');
});

// Function to scrape upcoming hackathons from NoticeBard
const getUpcomingHackathons = async () => {
  try {
    const url = "https://cse.noticebard.com/hackathon/upcoming-hackathon-2025-in-india/";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let hackathons = [];

    // Adjust the selector based on the webpage structure
    $("h3").each((index, element) => {
      const title = $(element).text().trim();
      const link = $(element).find("a").attr("href") || url; // Use the NoticeBard URL if no direct link is found
      hackathons.push({ title, link });
    });

    return hackathons.slice(0, 5); // Return top 5 results
  } catch (error) {
    console.error("Error scraping hackathons:", error);
    return [];
  }
};

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters;
  const programType = parameters.programType; // Extract program type

  if (intentName === 'Upcoming Programs') {
    if (!programType || programType.toLowerCase() !== "hackathon") {
      return res.json({
        fulfillmentText: "I currently fetch only hackathons. Please specify 'hackathon' for the best results!",
      });
    }

    try {
      const hackathons = await getUpcomingHackathons();

      if (hackathons.length === 0) {
        return res.json({
          fulfillmentText: "I couldn't find any upcoming hackathons in 2025 right now. Try again later.",
        });
      }

      let responseText = "Here are some upcoming hackathons in 2025:\n";
      hackathons.forEach((hackathon) => {
        responseText += `- ${hackathon.title} [More Info](${hackathon.link})\n`;
      });

      res.json({ fulfillmentText: responseText });
    } catch (error) {
      console.error('Error fetching programs:', error);
      res.json({
        fulfillmentText: "Sorry, I couldn’t fetch upcoming hackathons right now. Please try again later.",
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
