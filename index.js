const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(bodyParser.text());
app.use(cors());

const speechServiceKey = process.env.SPEECH_SERVICE_KEY;

app.post('/api/speech-to-text', async (req, res) => {
  try {
    const apiKey = speechServiceKey;
    const ttsUrl = 'https://westus.tts.speech.microsoft.com/cognitiveservices/v1';

    // Get the audio data
    const audioResponse = await axios.post(ttsUrl, req.body, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'curl',
      },
      responseType: 'stream',
    });

    // Set response headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename=audio.mp3');

    // Stream the audio data to the client
    audioResponse.data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

