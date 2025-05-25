Thanks for the clarification. Here's an updated and complete README.md tailored for your Node.js project, now including:

Node-specific instructions

Clickable Table of Contents

App icon (logo)

Direct usage examples


You can replace the placeholder icon URL with your actual image or logo path.


---

<p align="center">
  <img src="https://yourdomain.com/icon.png" alt="App Logo" width="120"/>
</p>

<h1 align="center">YouTube Media Downloader API</h1>

<p align="center">
  A lightweight Node.js API built with Express.js for fetching YouTube metadata and downloading video/audio using <code>yt-dlp</code>.
</p>

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Start the Server](#start-the-server)
  - [API Endpoints](#api-endpoints)
    - [GET /info](#1-get-info---fetch-video-metadata)
    - [POST /download](#2-post-download---download-video-or-audio)
- [Rate Limiting](#rate-limiting)
- [Example Client Usage](#example-client-usage)
- [License](#license)
- [Author](#author)

---

## Features

- Fetch metadata of YouTube videos including format options
- Download selected formats as video or extract audio (MP3)
- Automatically manages and deletes temporary files
- CORS enabled for frontend usage
- Rate limiting middleware to prevent API abuse

---

## Requirements

- [Node.js](https://nodejs.org/) (v16 or later)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [ffmpeg](https://ffmpeg.org/) (required for audio extraction)

### Install yt-dlp and ffmpeg

**macOS/Linux:**
```bash
brew install yt-dlp ffmpeg
# or
sudo apt install yt-dlp ffmpeg

Windows:

Download yt-dlp.exe

Download ffmpeg and add to PATH



---

Installation

git clone https://github.com/yourusername/yt-dlp-api.git
cd yt-dlp-api
npm install


---

Usage

Start the Server

npm start
# Or for development with auto-reload:
npm run dev

Server will run on: http://localhost:5000


---

API Endpoints

1. GET /info – Fetch Video Metadata

Query Params:

url: YouTube video URL (required)


Example:

GET /info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ

Response:

{
  "id": "dQw4w9WgXcQ",
  "title": "Never Gonna Give You Up",
  "thumbnail": "...",
  "duration": 212,
  "formats": [ ... ]
}


---

2. POST /download – Download Video or Audio

POST Body:

url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
format_id=18
type=audio  # or video

Returns:

A downloadable media stream (audio or video)



---

Rate Limiting

To prevent abuse, each IP is limited to:

100 requests per 15 minutes


Exceeding the limit returns:

{ "error": "Too many requests, please try again later." }


---

Example Client Usage

Here’s a simple fetch example (HTML + JS):

<script>
  async function getInfo() {
    const res = await fetch('/info?url=https://youtube.com/watch?v=abc123');
    const data = await res.json();
    console.log(data);
  }

  async function download() {
    const form = new URLSearchParams({
      url: 'https://youtube.com/watch?v=abc123',
      format_id: '18',
      type: 'video'
    });
    const res = await fetch('/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form
    });
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = "download.mp4";
    a.click();
  }
</script>


---

License

MIT © 2025 Your Name


---

Author

Your Name
GitHub: @yourhandle
Twitter: @yourtwitter

---

Would you like me to:

- Auto-generate this in `README.md` file format?
- Create a simple UI frontend for it?
- Bundle everything into a deployable zip or Docker container?

Let me know!

