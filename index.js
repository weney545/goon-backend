const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Updated import

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Use your new env variable
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Use a Gemini model

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    // Prepare content for Gemini
    const chat = model.startChat({
      history: [], // For simple single-turn requests, history can be empty
      generationConfig: {
        maxOutputTokens: 100, // Optional: Limit response length
      },
    });

    const result = await chat.sendMessage(message); // Send the user's message
    const response = await result.response;
    const text = response.text(); // Get the text from the response

    res.json({ reply: text }); // Send the reply back
  } catch (err) {
    console.error('Gemini API error:', err); // Log the actual error for debugging
    res.status(500).json({ error: 'Failed to get response from AI. Please try again later.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`G.O.O.N running on port ${port}`));

