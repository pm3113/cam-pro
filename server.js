const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Accept large image data
app.use(express.static('public')); // Serve frontend

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Upload endpoint
app.post('/upload', (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ error: 'No image provided' });
    }

    // Convert base64 image to buffer
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const fileName = `photo_${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);

    // Save image to local folder
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save image' });
        }
        res.json({ success: true, message: 'Image saved locally', filePath });
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
