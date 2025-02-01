// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const mongoose = require('mongoose');
// const app = express();
// require('dotenv').config();

// app.use(express.json());

// // ✅ Connect to MongoDB (Replace `<your_mongodb_connection_string>` with actual URL)
// mongoose.connect(process.env.MONGODB_URI)
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB Connection Error:', err));

// // ✅ Define Mongoose Schema & Model
// const seniorSchema = new mongoose.Schema({
//   email: String,
//   fullName: String,
//   startYear: Number,
//   course: String,
//   hasInternship: Boolean,
//   internshipCompany: String,
//   hasFullTimeOffer: Boolean,
//   fullTimeCompany: String,
//   otherExperiences: String
// });

// const Senior = mongoose.model('Senior', seniorSchema);


// // Default route
// app.get('/', (req, res) => {
//   res.send('Webhook Server is Live!');
// });

// // Function to scrape upcoming hackathons from NoticeBard
// const getUpcomingHackathons = async () => {
//   try {
//     const url = "https://cse.noticebard.com/hackathon/upcoming-hackathon-2025-in-india/";
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     let hackathons = [];

//     // Adjust the selector based on the webpage structure
//     $("h3").each((index, element) => {
//       const title = $(element).text().trim();
//       const link = $(element).find("a").attr("href") || url; // Use the NoticeBard URL if no direct link is found
//       hackathons.push({ title, link });
//     });

//     return hackathons.slice(0, 5); // Return top 5 results
//   } catch (error) {
//     console.error("Error scraping hackathons:", error);
//     return [];
//   }
// };

// // Webhook endpoint
// app.post('/webhook', async (req, res) => {
//   const intentName = req.body.queryResult.intent.displayName;
//   const parameters = req.body.queryResult.parameters;
//   const programType = parameters.programType; // Extract program type

//   //intent that handles the program datails to be fetched form the web
//   if (intentName === 'Upcoming Programs') {
//     if (!programType || programType.toLowerCase() !== "hackathon") {
//       return res.json({
//         fulfillmentText: "I currently fetch only hackathons. Please specify 'hackathon' for the best results!",
//       });
//     }

//     try {
//       const hackathons = await getUpcomingHackathons();

//       if (hackathons.length === 0) {
//         return res.json({
//           fulfillmentText: "I couldn't find any upcoming hackathons in 2025 right now. Try again later.",
//         });
//       }

//       let responseText = "Here are some upcoming hackathons in 2025:\n";
//       hackathons.forEach((hackathon) => {
//         responseText += `- ${hackathon.title} [More Info](${hackathon.link})\n`;
//       });

//       res.json({ fulfillmentText: responseText });
//     } catch (error) {
//       console.error('Error fetching programs:', error);
//       res.json({
//         fulfillmentText: "Sorry, I couldn’t fetch upcoming hackathons right now. Please try again later.",
//       });
//     }
//   } else {
//     res.json({ fulfillmentText: 'Intent not handled.' });
//   }

//   //intent that handles the requests for connecting with seniors for internship and placement help
  
//   // if (intentName === "Senior Help") {
//   //   const company = parameters.company;
//   //   const experience = parameters.experience;

//   //   console.log(`Searching for seniors from ${company} with experience in ${experience}`);

//   //   // Find matching senior profiles
//   //   const filteredSeniors = seniorProfiles.filter(
//   //     senior => senior.company.toLowerCase() === company.toLowerCase() &&
//   //               senior.experience.toLowerCase().includes(experience.toLowerCase())
//   //   );

//   //   // Create response
//   //   if (filteredSeniors.length > 0) {
//   //     let responseText = "Here are some seniors who can guide you:\n";
//   //     filteredSeniors.forEach(senior => {
//   //       responseText += `👨‍💻 *${senior.name}* - ${senior.experience} (${senior.year})\n📩 Contact: ${senior.contact}\n\n`;
//   //     });

//   //     res.json({ fulfillmentText: responseText });
//   //   } else {
//   //     res.json({ fulfillmentText: `Sorry, no seniors found for ${company} with experience in ${experience}.` });
//   //   }
//   // } else {
//   //   res.json({ fulfillmentText: "Intent not handled." });
//   // }

//   // if (intentName === "Senior Help") {
//   //   const company = parameters.company;  // Company the student is asking for
//   //   const experienceType = parameters.experience_type;  // 'internship' or 'full-time'

//   //   console.log(`Searching for seniors from ${company} with ${experienceType} experience`);

//   //   try {
//   //     let query = {};

//   //     if (experienceType.toLowerCase() === "internship") {
//   //       query = { internshipCompany: { $regex: new RegExp(company, "i") } };
//   //     } else if (experienceType.toLowerCase() === "full-time") {
//   //       query = { fullTimeCompany: { $regex: new RegExp(company, "i") } };
//   //     }

//   //     const seniors = await Senior.find(query);

//   //     if (seniors.length > 0) {
//   //       let responseText = `👨‍💻 Here are seniors with ${experienceType} experience at ${company}:\n\n`;

//   //       seniors.forEach(senior => {
//   //         responseText += `🔹 *${senior.fullName}* (${senior.course}, Batch ${senior.startYear})\n📩 Contact: ${senior.email}\n\n`;
//   //       });

//   //       res.json({ fulfillmentText: responseText });
//   //     } else {
//   //       res.json({ fulfillmentText: `Sorry, no seniors found for ${company} with ${experienceType} experience.` });
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching senior data:', error);
//   //     res.json({ fulfillmentText: "Sorry, something went wrong while fetching senior details. Please try again later." });
//   //   }
//   // } else {
//   //   res.json({ fulfillmentText: "Intent not handled." });
//   // }

//   if (intentName === 'Find Senior Help') {
//     const companyName = parameters.company; // Extracted from Dialogflow

//     if (!companyName) {
//       return res.json({ fulfillmentText: "Please specify the company name." });
//     }

//     try {
//       // Fetch seniors who interned at the requested company
//       const seniors = await Senior.find({ internshipCompany: companyName });

//       if (seniors.length === 0) {
//         return res.json({ fulfillmentText: `No seniors found who interned at ${companyName}.` });
//       }

//       // Create response
//       let seniorList = seniors.map(senior => `- ${senior.fullName}, Course: ${senior.course}, Start Year: ${senior.startYear}`).join('\n');
//       const fulfillmentText = `Here are some seniors who interned at ${companyName}:\n${seniorList}`;

//       res.json({ fulfillmentText });
//     } catch (error) {
//       console.error('Error fetching seniors:', error);
//       res.json({ fulfillmentText: 'Sorry, I couldn’t fetch the information right now. Please try again later.' });
//     }
//   } else {
//     res.json({ fulfillmentText: 'Intent not handled.' });
//   }

// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Webhook server is running on port ${PORT}`);
// });



const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ Define Schema & Model
const SeniorSchema = new mongoose.Schema({
  email: String,
  fullName: String,
  startYear: Number,
  course: String,
  hasInternship: Boolean,
  internshipCompany: String,
  hasFullTimeOffer: Boolean,
  fullTimeCompany: String,
  otherExperiences: String
});

const Senior = mongoose.model('Senior', SeniorSchema);

// ✅ Webhook Route
app.post('/webhook', async (req, res) => {
  console.log('🔹 Full Webhook Request:', JSON.stringify(req.body, null, 2));

  const intentName = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters;

  console.log(`🔹 Intent Received: ${intentName}`);
  console.log(`🔹 Parameters Received:`, parameters);

  if (intentName.toLowerCase().includes("senior")) {
    const companyName = parameters.company?.trim(); // Extract company name

    if (!companyName) {
      return res.json({ fulfillmentText: "Please specify a company name to find seniors." });
    }

    try {
      console.log(`🔹 Searching for seniors who interned at: ${companyName}`);

      const seniors = await Senior.find({ internshipCompany: new RegExp(companyName, 'i') });

      if (seniors.length === 0) {
        return res.json({ fulfillmentText: `No seniors found who interned at ${companyName}.` });
      }

      let responseText = `✅ Seniors who interned at ${companyName}:\n`;
      seniors.forEach(senior => {
        responseText += `👨‍💻 *${senior.fullName}* (${senior.course}, Batch ${senior.startYear})\n📩 Email: ${senior.email}\n\n`;
      });

      return res.json({ fulfillmentText: responseText });
    } catch (error) {
      console.error('❌ Error fetching seniors:', error);
      return res.json({ fulfillmentText: 'Sorry, I couldn’t fetch the information right now. Please try again later.' });
    }
  }

  return res.json({ fulfillmentText: 'Intent not handled.' });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Webhook server is running on port ${PORT}`);
});
