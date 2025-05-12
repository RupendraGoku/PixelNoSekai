const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.accessKey;

app.use(cors());

app.get('/api/search', async (req, res) => {
    const { query, page, per_page } = req.query;

    try {
        const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&per_page=${per_page}&client_id=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("Unsplash API response:", data);

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching from Unsplash' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
