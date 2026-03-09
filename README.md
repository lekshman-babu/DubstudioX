# 🎙️ **DubStudioX – AI Video Dubbing Studio**

![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)
![Node](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Flask](https://img.shields.io/badge/Service-Flask-black?logo=flask)
![FFmpeg](https://img.shields.io/badge/Media-FFmpeg-orange?logo=ffmpeg)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Overview

**DubStudioX** is a **full-stack AI-powered video dubbing prototype** that translates English videos into Indian regional languages — automatically.  
Upload a video or paste a YouTube link, pick a target language, and DubStudioX handles transcription, translation, voice synthesis, and audio-video merging end-to-end — *"Your content. Every language. One click."*

---

## 🎯 Problem Statement

- 🌐 **Language barriers:** English-only video content excludes hundreds of millions of regional language speakers.
- ✂️ **Manual dubbing is expensive:** Professional dubbing studios are slow, costly, and inaccessible for indie creators.
- 🎬 **No plug-and-play pipeline:** Transcription, translation, TTS, and video merging require separate tools with no unified workflow.
- 📺 **YouTube content is locked:** No easy way to dub and repurpose online video content in regional languages.

---

## 💡 Solution: *DubStudioX – AI Video Dubbing Studio*

| Feature | Description |
|----------|--------------|
| 📤 **Video Upload / YouTube URL** | Accept local `.mp4` uploads or YouTube links for direct processing. |
| 🔊 **Audio Extraction** | FFmpeg strips audio from the source video into a clean MP3. |
| 📝 **Speech-to-Text** | Python `speech_recognition` transcribes spoken English to text. |
| 🌍 **AI Translation** | `googletrans` translates the transcript into the selected regional language. |
| 🗣️ **Text-to-Speech Voiceover** | `gTTS` synthesizes a natural-sounding dubbed audio track. |
| 🎞️ **Audio-Video Merge** | FFmpeg blends the dubbed audio back into the original video seamlessly. |

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Vite, Axios |
| **Backend** | Node.js, Express, Multer, FFmpeg, fluent-ffmpeg, ytdl-core |
| **Python Service** | Flask, SpeechRecognition, googletrans, gTTS, pydub |
| **Media Processing** | FFmpeg (audio extraction, tempo adjustment, A/V merge) |
| **YouTube Support** | ytdl-core (download + process YouTube videos) |

---

## 🏗️ How It Works
```
Frontend → Backend (Node/Express)
       → Extracts MP3 via FFmpeg
       → Sends MP3 to Python Flask Service
       → Transcription → Translation → TTS (Dubbed MP3)
       → Backend tempo-adjusts audio
       → Merges dubbed audio into original video via FFmpeg
       → Returns final dubbed MP4 to Frontend
```

---

## ⚙️ Setup Guide

### 1️⃣ Prerequisites

- **Node.js** 18+
- **Python** 3.9+
- **FFmpeg** installed and in PATH
```bash
ffmpeg -version   # verify FFmpeg is available
```

> ⚠️ The Python pipeline uses online services (speech recognition, translation, TTS), so an **internet connection is required**.

---

### 2️⃣ Start the Python Dubbing Service (Flask)
```bash
python -m venv .venv

# Activate virtual environment:
# macOS/Linux:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

pip install flask SpeechRecognition pydub gTTS googletrans==4.0.0-rc1
python Python/flaskApp.py
```

Flask service runs on: `http://127.0.0.1:6000`

---

### 3️⃣ Start the Backend (Node/Express)
```bash
cd Backend
npm install
node app.js
```

Backend runs on: `http://localhost:3000`

The following folders are auto-created inside `Backend/`:

| Folder | Purpose |
|--------|---------|
| `Uploads/` | Uploaded / downloaded MP4s |
| `Input/` | Extracted MP3 audio |
| `DubbedVideo/` | Dubbed MP3 from Python service |
| `Adjusted/` | Tempo-adjusted MP3 |
| `Converted/` | Final dubbed MP4 output |

---

### 4️⃣ Start the Frontend (React + Vite)
```bash
cd Frontend
npm install
npm run dev
```

Open in browser: `http://localhost:5173`

---

## 🧪 Usage

1. Open the frontend in your browser
2. Select a **target language** (e.g. `hi`, `ta`, `ml`, `mr`, `te`)
3. **Upload** a `.mp4` video or paste a **YouTube URL**
4. Hit **Submit** and wait for processing
5. **Play or download** your dubbed video directly from the UI

---

## 🔌 API Reference

### Backend (Node) — `http://localhost:3000`

**`POST /upload`** — Upload an MP4 file for dubbing
```
Content-Type: multipart/form-data
Fields:
  mp4File  →  MP4 video file
  source   →  source language
  target   →  target language code (e.g. hi, ta)

Response: 200 OK — video/mp4 stream (dubbed video)
```

**`POST /youtubeUpload`** — Dub a YouTube video by URL
```json
{
  "youtubeURL": "https://www.youtube.com/watch?v=xxxx",
  "source": "en",
  "target": "hi"
}
```

### Python Service (Flask) — `http://127.0.0.1:6000`

**`POST /upload`** — Receives extracted MP3, returns dubbed MP3
```
Content-Type: application/octet-stream
Headers:
  Target: target language code (e.g. hi)

Response: MP3 audio stream (audio/mpeg)
Response Headers:
  sourceText: recognized transcript
  targetText: translated text
```

---

## ⚠️ Known Issues & Fixes

**Path issue in `Python/processing.py`:** Audio is saved to `Python\\processedFile.mp3` but the return path may mismatch. Fix:
```python
# Use os.path.join for cross-platform support
import os
tts.save(os.path.join("Python", "processedFile.mp3"))
return os.path.join("Python", "processedFile.mp3"), source, target.text
```

---

## 📈 Current Limitations

| Area | Limitation |
|------|------------|
| 🗣️ **Source Language** | Transcription is currently hard-coded to English (`en-us`) |
| ⏱️ **Long Videos** | Processing time scales with video length; audio is chunked by silence |
| 🎚️ **Tempo Adjustment** | FFmpeg may fail if computed tempo ratio is too extreme |
| 🔐 **Production Readiness** | Prototype only — no auth, no job queuing, minimal error handling |

---

## 🚀 DubStudioX 2.0 (Roadmap)

- 📜 Subtitle & transcript display (source + translated) in the UI
- 🎤 Voice cloning and speaker voice preservation
- 🌐 Multi-source language support beyond English
- 🐳 Docker setup for one-command run
- 📊 Job persistence and real-time progress tracking
- 🔁 A/B testing for TTS voice options

---

## 🗂️ Repo Structure
```
DubStudioX/
├── Backend/      # Node/Express API + FFmpeg pipeline
├── Frontend/     # React + Vite UI
└── Python/       # Flask service: transcription + translation + TTS
```

---

## 🪪 License

This project is licensed under the **MIT License**.  
See `LICENSE` for details.

---

> 🌍 *"Your content. Every language. One click." — DubStudioX*
