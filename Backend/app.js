const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { convertMP4ToMp3 } = require('./converter');
const cors = require("cors");
const downloadVideo = require('./download');
const app = express();
const port = process.env.PORT || 3000;
const { v4: uuidv4 } = require('uuid');

// Define the storage location for uploaded MP4 files
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadDir = './Uploads'; // Create an 'uploads' directory in your project
        fs.mkdirSync(uploadDir, { recursive: true });
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        const extname = path.extname(file.originalname);
        const filename = `${Date.now()}${extname}`;
        callback(null, filename);
    },
});

const upload = multer({ storage });
app.use(cors());

app.use(express.json());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5174');
//     next();
// });

// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static('uploads'));

// Define the file upload endpoint
app.post('/upload', upload.single('mp4File'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename.split('.')[0];
    req.body.reqID = fileName
    console.log("Received file: " + filePath)
    convertMP4ToMp3(filePath, req.body, req, res);
    // You can save the file information to a database or perform any other necessary actions here

});
app.post('/youtubeUpload', async (req, res) => {
    if (!req.body.youtubeURL) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    req.body.reqID = uuidv4();
    await downloadVideo(req.body.youtubeURL, req, (filePath) => {
        const fileName = req.body.youtubeURL.split('v=')[1];
        console.log("Received file: " + filePath)
        convertMP4ToMp3(filePath, req.body, req, res);
    })
    // You can save the file information to a database or perform any other necessary actions here

});

app.listen(port, () => {
    if (!fs.existsSync('./Uploads'))
        fs.mkdirSync('./Uploads');
    if (!fs.existsSync('./Adjusted'))
        fs.mkdirSync('./Adjusted');
    if (!fs.existsSync('./Converted'))
        fs.mkdirSync('./Converted');
    if (!fs.existsSync('./DubbedVideo'))
        fs.mkdirSync('./DubbedVideo');
    if (!fs.existsSync('./Input'))
        fs.mkdirSync('./Input')
    console.log(`Server is running on port ${port}`);
});
