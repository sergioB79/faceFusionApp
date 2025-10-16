require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { OpenAI } = require('openai');

const app = express();
const port = 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/generate', async (req, res) => {
  try {
    const { image, mask } = req.body;

    const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const maskBuffer = Buffer.from(mask.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    const imagePath = './image.png';
    const maskPath = './mask.png';

    fs.writeFileSync(imagePath, imageBuffer);
    fs.writeFileSync(maskPath, maskBuffer);

    const response = await openai.images.edit({
      image: fs.createReadStream(imagePath),
      mask: fs.createReadStream(maskPath),
      prompt: "A futuristic city skyline in the style of vaporwave",
    });

    res.json({ image: response.data[0].url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating image' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
