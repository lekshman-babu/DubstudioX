const fs = require('fs');
const ytdl = require('ytdl-core');


async function downloadVideo(url, req, callback) {
    const outPath = `./Uploads/` + req.body.reqID + '.mp4';
    try {
        const videoInfo = await ytdl.getInfo(url);
        const videoTitle = videoInfo.videoDetails.title.replace(/[/\\?%*:|"<>]/g, '-');
        const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });
        const videoStream = ytdl(videoInfo.videoDetails.video_url, { filter: 'videoandaudio' });
        const fileStream = fs.createWriteStream(outPath);
        videoStream.pipe(fileStream);

        fileStream.on('finish', () => {
            console.log(`Video downloaded and saved to ${outPath}`);
            callback(outPath);
        });

        fileStream.on('error', (err) => {
            console.error('Error saving video:', err);
        });

        // Handle errors during the download process
        videoStream.on('error', (err) => {
            console.error('Error downloading video:', err);
        });
    } catch (err) {
        console.error('Error:', err);
    }
}

module.exports = downloadVideo;