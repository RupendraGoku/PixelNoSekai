const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.accessKey;

app.use(cors());

// Route to search images via Unsplash API
app.get('/api/search', async (req, res) => {
    const { query, page, per_page } = req.query;

    try {
        const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&per_page=${per_page}&client_id=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching from Unsplash' });
    }
});

// Route to proxy image download through backend
app.get('/download', async (req, res) => {
    const imageUrl = req.query.url;
    console.log('imageUrl',imageUrl)
    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required." });
    }

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image. Status: ${response.status}`);
        }

        res.setHeader('Content-Disposition', 'attachment; filename="image.jpg"');
        res.setHeader('Content-Type', response.headers.get('content-type'));
        response.body.pipe(res);
    } catch (err) {
        res.status(500).json({ error: "Failed to download image." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
