import fs from 'node:fs';
import path from 'node:path';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.flac']);

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

function buildManifest(publicDir) {
  const galleryImagesDir = path.join(publicDir, 'gallery/images');
  const galleryMusicDir = path.join(publicDir, 'gallery/music');
  const characterDir = path.join(publicDir, 'character');
  const imagesDir = path.join(publicDir, 'images');

  const images = [];
  const music = [];

  const legacyCharFiles = scanDir(characterDir, '/character');
  legacyCharFiles.forEach((f) => { if (isImage(f)) images.push(f); });

  const legacyImageFiles = scanDir(imagesDir, '/images');
  legacyImageFiles.forEach((f) => { if (isImage(f)) images.push(f); });

  const galleryImageFiles = scanDir(galleryImagesDir, '/gallery/images');
  galleryImageFiles.forEach((f) => { if (isImage(f)) images.push(f); });

  const bgmPath = path.join(publicDir, 'BGM.MP3');
  if (fs.existsSync(bgmPath)) music.push('/BGM.MP3');

  const galleryMusicFiles = scanDir(galleryMusicDir, '/gallery/music');
  galleryMusicFiles.forEach((f) => { if (isAudio(f)) music.push(f); });

  return { images, music };
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
        rel === 'BGM.MP3'
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
