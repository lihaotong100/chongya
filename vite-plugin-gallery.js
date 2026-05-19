import fs from 'node:fs';
import path from 'node:path';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.flac']);
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov']);

function scanDir(dir, baseUrl) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `${baseUrl}/${f}`);
}

function isImage(filePath) {
  return IMAGE_EXTS.has(path.extname(filePath).toLowerCase());
}

function isAudio(filePath) {
  return AUDIO_EXTS.has(path.extname(filePath).toLowerCase());
}

function isVideo(filePath) {
  return VIDEO_EXTS.has(path.extname(filePath).toLowerCase());
}

function fileSize(publicDir, urlPath) {
  const abs = path.join(publicDir, urlPath);
  try {
    const stat = fs.statSync(abs);
    return stat.size;
  } catch {
    return 0;
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function buildManifest(publicDir) {
  const galleryImagesDir = path.join(publicDir, 'gallery/images');
  const galleryMusicDir = path.join(publicDir, 'gallery/music');
  const galleryVideosDir = path.join(publicDir, 'gallery/videos');
  const characterDir = path.join(publicDir, 'character');
  const imagesDir = path.join(publicDir, 'images');

  const images = [];
  const characterImages = [];
  const music = [];
  const videos = [];

  const legacyImageFiles = scanDir(imagesDir, '/images');
  legacyImageFiles.forEach((f) => { if (isImage(f)) images.push(f); });

  const galleryImageFiles = scanDir(galleryImagesDir, '/gallery/images');
  galleryImageFiles.forEach((f) => { if (isImage(f)) images.push(f); });

  const legacyCharFiles = scanDir(characterDir, '/character');
  legacyCharFiles.forEach((f) => { if (isImage(f)) characterImages.push(f); });

  images.push(...characterImages);

  const bgmPath = path.join(publicDir, '冲鸭主题曲.mp3');
  if (fs.existsSync(bgmPath)) music.push('/冲鸭主题曲.mp3');

  const galleryMusicFiles = scanDir(galleryMusicDir, '/gallery/music');
  galleryMusicFiles.forEach((f) => { if (isAudio(f)) music.push(f); });

  const galleryVideoFiles = scanDir(galleryVideosDir, '/gallery/videos');
  galleryVideoFiles.forEach((f) => {
    if (isVideo(f)) {
      const size = fileSize(publicDir, f);
      videos.push({ src: f, size: formatSize(size) });
    }
  });

  return { images, music, videos };
}

const VIRTUAL_ID = 'virtual:gallery-manifest';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

export default function galleryPlugin() {
  let publicDir;

  return {
    name: 'vite-plugin-gallery',

    configResolved(config) {
      publicDir = config.publicDir;
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id === RESOLVED_ID) {
        const manifest = buildManifest(publicDir);
        return `export default ${JSON.stringify(manifest, null, 2)};`;
      }
    },

    handleHotUpdate({ file, server }) {
      const rel = path.relative(publicDir, file);
      if (
        rel.startsWith('gallery/') ||
        rel.startsWith('character/') ||
        rel.startsWith('images/') ||
        rel === '冲鸭主题曲.mp3'
      ) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      }
    },
  };
}
