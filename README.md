
![App Logo](https://yourdomain.com/icon.png)

# YouTube Media Downloader API 🧡

A lightweight Node.js API built with Express.js for fetching YouTube metadata and downloading video/audio using `yt-dlp`.

---

## Table of Contents 📚

- [Features ✨](#features)
- [Requirements ⚙️](#requirements)
- [Installation 🚀](#installation)
- [Usage 💻](#usage)
  - [Start the Server](#start-the-server)
  - [API Endpoints 📡](#api-endpoints)
    - [GET /info](#1-get-info--fetch-video-metadata)
    - [POST /download](#2-post-download--download-video-or-audio)
- [Rate Limiting ⏳](#rate-limiting)
- [Example Client Usage 📝](#example-client-usage)
- [Swagger UI Documentation 📖](#swagger-ui-documentation)
- [Dockerfile for Deployment 🐳](#dockerfile-for-deployment)
- [Integrating with a React Frontend ⚛️](#integrating-with-a-react-frontend)
- [License 📜](#license)
- [Author ✍️](#author)
- [Additional Features 🌟](#additional-features)

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

> The server runs at [http://localhost:5000](http://localhost:5000)

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

## Swagger UI Documentation 📖

You can explore and interact with the API using the Swagger UI. Visit the following link to access the documentation:

[Swagger UI for YouTube Media Downloader API](https://app.swaggerhub.com/apis/codeverse-8f8/Url_media_downloader/1.0.0#/default/post_download)

---

## Dockerfile for Deployment 🐳

To deploy the API using Docker, create a file named `Dockerfile` in the root of your project with the following content:

```dockerfile
# Use the official Node.js image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
```

### Build and Run the Docker Container

1. Build the Docker image:

   ```bash
   docker build -t yt-dlp-api .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 5000:5000 yt-dlp-api
   ```

Your API will now be accessible at [http://localhost:5000](http://localhost:5000).

---

## Integrating with a React Frontend ⚛️

To integrate this API with a React frontend, follow these steps:

1. **Set Up Your React App**: If you haven't already, create a new React app using Create React App:

   ```bash
   npx create-react-app my-app
   cd my-app
   ```

2. **Install Axios**: You can use Axios to make HTTP requests to your API:

   ```bash
   npm install axios
   ```

3. **Create API Functions**: In your React app, create a file (e.g., `api.js`) to handle API requests:

   ```javascript
   import axios from 'axios';

   const API_URL = 'http://localhost:5000'; // Update this if your API is hosted elsewhere

   export const fetchVideoInfo = async (url) => {
     const response = await axios.get(`${API_URL}/info`, { params: { url } });
     return response.data;
   };

   export const downloadMedia = async (url, format_id, type) => {
     const response = await axios.post(`${API_URL}/download`, new URLSearchParams({ url, format_id, type }), {
       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
       responseType: 'blob',
     });
     return response.data;
   };
   ```

4. **Use API Functions in Your Components**: You can now use these functions in your React components to fetch video info and download media.

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

## Additional Features 🌟

Let me know if you'd like:

- A **Dockerfile** for deployment
- Instructions for **integrating this API with a React frontend**
- **README** translated to another language  

Just say the word! 🗣️
```

### Summary of Enhancements
- **More Icons**: Added icons to various sections to enhance visual appeal.
- **Clickable Table of Contents**: Made the Table of Contents clickable for easier navigation.
- **Polished Layout**: Improved formatting for better readability.

Feel free to modify any sections as needed! If you have any more requests or questions, just let me know!