const ffmpeg = require('ffmpeg');
const ffmpegFluent = require('fluent-ffmpeg');
const fs = require('fs');
const { exec } = require('child_process');
const axios = require('axios');
require('node:dns').setDefaultResultOrder('ipv4first')

function convertMP3ToWAV(videoPath, mp3FilePath, body, req, res) {
    const wavFilePath = mp3FilePath + '.wav'; // Output WAV file path
    const command = ffmpegFluent()
        .input(mp3FilePath)
        .audioCodec('pcm_s16le') // Set audio codec to WAV  
        .toFormat('wav')
        .on('end', function () {
            console.log('WAV Audio file: ' + wavFilePath);
            fs.unlinkSync(mp3FilePath);
        })
        .on('error', function (err) {
            console.error('Error converting to WAV: ' + err);
            res.status(500).send('Error converting to WAV');
        });

    command.save(wavFilePath);
}

function convertMP4ToMp3(filePath, body, req, res) {
    try {
        var process = new ffmpeg(filePath);
        process.then(function (video) {
            // Callback mode
            video.fnExtractSoundToMP3('./Input/'+req.body.reqID + '.mp3', function (error, file) {
                if (!error) {
                    console.log('Audio file MP3: ' + file);
                    // convertMP3ToWAV(filePath, file, body, req, res);
                    getDubbedAudio('./Input/'+req.body.reqID + '.mp3', req, res);
                }
                else {
                    console.error(error);
                    res.status(500).send('Error extracting audio to MP3');
                }
            });

        }, function (err) {
            console.error('Error: ' + err);
            res.status(500).send('Error processing MP4');
        });
    } catch (e) {
        console.error(e.code);
        console.error(e.msg);
        res.status(500).send('Error processing MP4');
    }
}

function getDubbedAudio(filePath, req, res) {
    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath);
    console.log("Audio Sent For Dubbing");
    // Make a POST request to the Flask server  
    axios.post('http://127.0.0.1:6000/upload', fileBuffer, {
        headers: {
            'Content-Type': 'application/octet-stream', // Set the content type as binary data
            'target': `${req.body.target}`
        },
        responseType: 'stream', // Set the response type to stream
    })
        .then((response) => {
            // Handle the response
            if (response.status === 200) {
                // Create a writable stream to save the received audio file
                const outputPath = './DubbedVideo/' + req.body.reqID + '_dubbed.mp3';
                const writer = fs.createWriteStream(outputPath);

                // Pipe the response stream to the writer
                response.data.pipe(writer);

                writer.on('finish', () => {
                    console.log('Audio file received and saved:', outputPath);
                    const sourceText = response.headers['sourcetext'];
                    const targetText = response.headers['targettext']
                    fs.writeFileSync(req.body.reqID + '_sourceText.txt', sourceText);
                    fs.writeFileSync(req.body.reqID + '_targetText.txt', targetText, 'utf-8');
                    console.log(sourceText);
                    mergeVideoAudio('./Uploads/' + req.body.reqID + '.mp4', outputPath, req, res, sourceText)
                });

                writer.on('error', (err) => {
                    console.error('Error saving file:', err);
                    res.status(500).send('Error saving audio file');
                });
            } else {
                console.error('Failed to upload file:', response.statusText);
                res.status(500).send('Failed to upload audio file');
            }
        })
        .catch((error) => {
            console.error('Error:', error.message);
            res.status(500).send('Error making POST request');
        });
}

function mergeVideoAudio(videoPath, audioPath, req, res, sourceText) {
    ffmpegFluent.ffprobe(videoPath, (err, videoInfo) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            res.status(500).send('Error probing video file');
            return;
        }

        ffmpegFluent.ffprobe(audioPath, (err, audioInfo) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                res.status(500).send('Error probing audio file');
                return;
            }

            const videoDuration = videoInfo.format.duration;
            const audioDuration = audioInfo.format.duration;
            // Calculate the speed ratio to match audio duration with video duration
            const speedRatio = audioDuration / videoDuration;
            // Adjust playback speed of the audio
            const adjustedAudio = `./Adjusted/${req.body.reqID}_adjusted_audio.mp3`; // Replace with the adjusted audio file name
            console.log(speedRatio, audioPath);
            const command = ffmpegFluent()
                .input(audioPath)
                .audioFilters(`atempo=${speedRatio}`)
                // .audioCodec('aac')
                .on('end', () => {
                    console.log('Audio adjusted successfully!');
                    while (fs.existsSync(`./Converted/${req.body.reqID}_converted.mp4`)) {
                        req.body.reqID = Math.random().toString(36).substring(7);
                    }
                    const ffmpegCommand = `ffmpeg -i ${videoPath} -i ${adjustedAudio} -c:v copy -map 0:v:0 -map 1:a:0 "./Converted/${req.body.reqID}_converted.mp4"`;
                    exec(ffmpegCommand, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error: ${error.message}`);
                            res.status(500).send('Error merging audio and video');
                            return;
                        }
                        console.log('Audio and video merged successfully!');
                        sendResponse(`./Converted/${req.body.reqID}_converted.mp4`, req, res, sourceText);
                    });
                })
                .on('error', (err) => {
                    console.error(`Error: ${err.message}`);
                    res.status(500).send('Error adjusting audio');
                });

            command.save(adjustedAudio);
        });
    });
}

function sendResponse(videoPath, req, res, sourceText) {
    // Check if the video file exists
    if (fs.existsSync(videoPath)) {
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunksize = end - start + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4",
                "sourcetxt": sourceText
            };

            // Set the custom sourceText header
            head["X-Source-Text"] = sourceText;

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
                "sourcetxt1": "sourceText",
                "sourcetxt": sourceText
            };
            head["X-Source-Text"] = sourceText;

            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } else {
        res.status(404).send("Video not found");
    }
}

module.exports = {
    convertMP4ToMp3
}
