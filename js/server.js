// server.js
const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
app.use(cors()); 
app.use(express.json());

app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Video URL is required' });
    }

    try {
        
        const output = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ]
        });

        res.json({
            title: output.title,
            thumbnail: output.thumbnail,
            downloadUrl: output.url 
        });

    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ error: 'Failed to fetch video. The link might be private or invalid.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ToolEz Backend running on http://localhost:${PORT}`);
});
