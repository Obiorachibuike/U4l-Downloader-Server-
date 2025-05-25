
![App Logo](https://yourdomain.com/icon.png)

# YouTube Media Downloader API 🧡

A lightweight Node.js API built with Express.js for fetching YouTube metadata and downloading video/audio using `yt-dlp`.

---

## Table of Contents 📚

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Start the Server](#start-the-server)
  - [API Endpoints](#api-endpoints)
    - [GET /info](#1-get-info--fetch-video-metadata)
    - [POST /download](#2-post-download--download-video-or-audio)
- [Rate Limiting](#rate-limiting)
- [Example Client Usage](#example-client-usage)
- [License](#license)
- [Author](#author)

---

## Features ✨

- Fetch metadata of YouTube videos including available formats
- Download videos or extract audio as MP3
- Temporary files are cleaned up automatically
- CORS enabled for frontend integration
- Rate limiting to prevent abuse

---

## Requirements ⚙️

- Node.js (v16+)
- yt-dlp
- ffmpeg

### Install yt-dlp and ffmpeg

**macOS/Linux:**
```bash
brew install yt-dlp ffmpeg
# or
sudo apt install yt-dlp ffmpeg
```

**Windows:**

- Download `yt-dlp.exe`
- Download `ffmpeg` and add it to your PATH

---

## Installation 🚀

```bash
git clone https://github.com/yourusername/yt-dlp-api.git
cd yt-dlp-api
npm install
```

---

## Usage 💻

### Start the Server

```bash
npm start
# Or for development:
npm run dev
```

> The server runs at http://localhost:5000

---

## API Endpoints 📡

1. **GET /info** — Fetch Video Metadata

   **Query Parameters:**

   - `url`: (required) YouTube video URL

   **Example:**

   ```
   GET /info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

   **Response:**

   ```json
   {
     "id": "dQw4w9WgXcQ",
     "title": "Never Gonna Give You Up",
     "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
     "duration": 213,
     "formats": [
       {
         "format_id": "18",
         "ext": "mp4",
         "resolution": "360p",
         "filesize": 48762132
       }
       ...
     ]
   }
   ```

---

2. **POST /download** — Download Video or Audio

   **Headers:**

   - `Content-Type: application/x-www-form-urlencoded`

   **Body Parameters:**

   - `url`: YouTube video URL
   - `format_id`: Format to download (from /info)
   - `type`: video or audio

   **Example Request:**

   ```bash
   curl -X POST http://localhost:5000/download \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "url=https://youtube.com/watch?v=dQw4w9WgXcQ&format_id=18&type=audio"
   ```

   **Response:**

   Returns a downloadable stream

---

## Rate Limiting ⏳

Max 100 requests per 15 minutes per IP

Exceeding returns:

```json
{ "error": "Too many requests, please try again later." }
```

---

## Example Client Usage 📝

```html
<script>
  async function fetchInfo() {
    const response = await fetch('/info?url=https://youtube.com/watch?v=dQw4w9WgXcQ');
    const data = await response.json();
    console.log(data);
  }

  async function downloadMedia() {
    const formData = new URLSearchParams({
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      format_id: '18',
      type: 'video'
    });

    const response = await fetch('/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'media.mp4';
    a.click();
    window.URL.revokeObjectURL(url);
  }
</script>
```

---

## License 📜

MIT License © 2025 [Your Name]

---

## Author ✍️

Your Name  
GitHub: [@yourgithub](https://github.com/yourgithub)  
Twitter: [@yourtwitter](https://twitter.com/yourtwitter)  
Email: your.email@example.com

---

Let me know if you'd like:

- A Dockerfile for deployment  
- Instructions for integrating this API with a React frontend  
- README translated to another language  
- An OpenAPI/Swagger spec for this API  

Just say the word! 🗣️
```

Feel free to modify any sections as needed!