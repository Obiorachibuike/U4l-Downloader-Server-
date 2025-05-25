import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';  // <-- import rateLimit
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import ytDlpExec from 'yt-dlp-exec';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const unlinkAsync = promisify(fs.unlink);
const rmdirAsync = promisify(fs.rmdir);

// Rate limiter middleware config: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiter to all routes
app.use(limiter);

// Helper to create a temporary directory
async function createTempDir() {
  return await fs.promises.mkdtemp(path.join(os.tmpdir(), 'yt-dlp-'));
}

app.get('/info', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  try {
    // Extract info JSON without downloading
    const info = await ytDlpExec(url, {
      dumpSingleJson: true,
      skipDownload: true,
      quiet: true,
      noWarnings: true,
    });

    const formats = (info.formats || []).filter(f => f.url).map(f => ({
      format_id: f.format_id,
      ext: f.ext,
      format_note: f.format_note,
      height: f.height,
      width: f.width,
      filesize: f.filesize,
      fps: f.fps,
      tbr: f.tbr,
      acodec: f.acodec,
      vcodec: f.vcodec,
      asr: f.asr,
      abr: f.abr,
    }));

    res.json({
      id: info.id,
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      formats,
    });
  } catch (e) {
    let errorMessage = e.message || String(e);
    if (/403|login|private/i.test(errorMessage)) {
      errorMessage = 'This video appears to require login or is private. Only public videos can be accessed.';
    }
    res.status(500).json({ error: errorMessage });
  }
});

app.post('/download', async (req, res) => {
  const url = req.body.url;
  const format_id = req.body.format_id;
  const media_type = req.body.type || 'video';

  if (!url || !format_id) {
    return res.status(400).json({ error: 'Missing url or format_id' });
  }

  let tmpDir;
  try {
    tmpDir = await createTempDir();

    const outTemplate = path.join(tmpDir, '%(title)s.%(ext)s');

    const ytdlpArgs = [
      url,
      '-f', format_id,
      '-o', outTemplate,
      '--quiet',
      '--no-playlist',
    ];

    if (media_type === 'audio') {
      ytdlpArgs.push(
        '--extract-audio',
        '--audio-format', 'mp3',
        '--audio-quality', '192K',
        '--prefer-ffmpeg'
      );
    }

    // Run yt-dlp process
    await ytDlpExec(ytdlpArgs, { stdio: 'ignore' });

    // Find the downloaded file (the only file in tmpDir)
    const files = await fs.promises.readdir(tmpDir);
    if (files.length === 0) {
      throw new Error('No file was downloaded');
    }
    const filePath = path.join(tmpDir, files[0]);

    // Stream file as attachment
    res.download(filePath, files[0], async (err) => {
      // Cleanup tmp files after sending
      try {
        if (fs.existsSync(filePath)) {
          await unlinkAsync(filePath);
        }
        if (tmpDir) {
          await rmdirAsync(tmpDir);
        }
      } catch (_) {
        // ignore cleanup errors
      }
      if (err && !res.headersSent) {
        res.status(500).json({ error: 'Failed to send file' });
      }
    });
  } catch (e) {
    if (tmpDir) {
      // Cleanup on error
      try {
        const files = await fs.promises.readdir(tmpDir);
        for (const file of files) {
          await unlinkAsync(path.join(tmpDir, file));
        }
        await rmdirAsync(tmpDir);
      } catch (_) {}
    }
    let errorMessage = e.message || String(e);
    if (/403|login|private/i.test(errorMessage)) {
      errorMessage = 'This media appears to require login or is private. Only public content can be downloaded.';
    }
    res.status(500).json({ error: errorMessage });
  }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});