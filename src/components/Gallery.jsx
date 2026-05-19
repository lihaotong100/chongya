import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n.jsx';
import manifest from 'virtual:gallery-manifest';

const PER_PAGE_IMAGES = 8;
const PER_PAGE_VIDEOS = 4;

function fileName(src) {
  return decodeURIComponent(src.split('/').pop());
}

export default function Gallery() {
  const { t } = useLang();
  const [tab, setTab] = useState('images');

  return (
    <div className="gallery-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <span className="dot" />
            {t('gallery.eyebrow')}
          </span>
          <h2 className="section-title">
            {t('gallery.title')}
            <span className="gold">{t('gallery.titleGold')}</span>
          </h2>
          <p className="section-sub">{t('gallery.sub')}</p>
        </div>

        <div className="gallery-tabs">
          <button
            className={`gallery-tab${tab === 'images' ? ' is-active' : ''}`}
            onClick={() => setTab('images')}
          >
            {t('gallery.tabImages')}
          </button>
          <button
            className={`gallery-tab${tab === 'videos' ? ' is-active' : ''}`}
            onClick={() => setTab('videos')}
          >
            {t('gallery.tabVideos')}
          </button>
          <button
            className={`gallery-tab${tab === 'music' ? ' is-active' : ''}`}
            onClick={() => setTab('music')}
          >
            {t('gallery.tabMusic')}
          </button>
        </div>

        {tab === 'images' && <ImageGrid images={manifest.images} t={t} />}
        {tab === 'videos' && <VideoGrid videos={manifest.videos} t={t} />}
        {tab === 'music' && <MusicList tracks={manifest.music} t={t} />}
      </div>
    </div>
  );
}

/* ────── Image Grid with Pagination ────── */

function ImageGrid({ images, t }) {
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState(-1);
  const totalPages = Math.ceil(images.length / PER_PAGE_IMAGES);
  const start = page * PER_PAGE_IMAGES;
  const visible = images.slice(start, start + PER_PAGE_IMAGES);

  useEffect(() => { setPage(0); }, [images]);

  const openLightbox = (gridIdx) => setLightbox(start + gridIdx);
  const closeLightbox = () => setLightbox(-1);

  return (
    <>
      <div className="gallery-grid" key={page}>
        {visible.map((src, i) => (
          <button
            key={src}
            className="gallery-item"
            onClick={() => openLightbox(i)}
            aria-label={fileName(src)}
          >
            <img src={src} alt={fileName(src)} loading="lazy" decoding="async" />
            <span className="gallery-item-name">{fileName(src)}</span>
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} t={t} />
      )}

      {lightbox >= 0 && (
        <Lightbox
          images={images}
          index={lightbox}
          onClose={closeLightbox}
          onChange={setLightbox}
        />
      )}
    </>
  );
}

/* ────── Video Grid with Pagination ────── */

function VideoGrid({ videos, t }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(videos.length / PER_PAGE_VIDEOS);
  const start = page * PER_PAGE_VIDEOS;
  const visible = videos.slice(start, start + PER_PAGE_VIDEOS);

  useEffect(() => { setPage(0); }, [videos]);

  if (!videos.length) return <p className="gallery-empty">{t('gallery.noVideos')}</p>;

  return (
    <>
      <div className="video-grid" key={page}>
        {visible.map((v) => (
          <VideoCard key={v.src} video={v} t={t} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} t={t} />
      )}
    </>
  );
}

function VideoCard({ video, t }) {
  const { src, size } = video;
  const videoRef = useRef(null);
  const [state, setState] = useState('idle');

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('loading');
  };

  const onCanPlay = () => {
    setState('ready');
    if (videoRef.current) videoRef.current.play();
  };

  const onError = () => {
    setState('idle');
  };

  return (
    <div className={`video-card video-card--${state}`}>
      {state === 'idle' && (
        <button className="video-card-idle" onClick={handleClick}>
          <div className="video-card-play">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="video-card-meta">
            <span className="video-card-name">{fileName(src)}</span>
            <span className="video-card-size">{size}</span>
          </div>
        </button>
      )}

      {state === 'loading' && (
        <div className="video-card-loading">
          <div className="video-card-spinner" />
          <span className="video-card-loading-text">{t('gallery.videoLoading')}</span>
          <video
            ref={videoRef}
            src={src}
            controls
            preload="auto"
            onCanPlay={onCanPlay}
            onError={onError}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {state === 'ready' && (
        <>
          <video
            ref={videoRef}
            src={src}
            controls
            autoPlay
            className="video-card-player is-visible"
          />
          <span className="video-card-name video-card-name--below">{fileName(src)}</span>
        </>
      )}
    </div>
  );
}

/* ────── Pagination ────── */

function Pagination({ page, totalPages, setPage, t }) {
  return (
    <div className="gallery-pagination">
      <button
        className="gallery-page-btn"
        disabled={page === 0}
        onClick={() => setPage((p) => p - 1)}
        aria-label={t('gallery.prev')}
      >
        ‹
      </button>
      <span className="gallery-page-info">
        {page + 1} / {totalPages}
      </span>
      <button
        className="gallery-page-btn"
        disabled={page === totalPages - 1}
        onClick={() => setPage((p) => p + 1)}
        aria-label={t('gallery.next')}
      >
        ›
      </button>
    </div>
  );
}

/* ────── Lightbox ────── */

function Lightbox({ images, index, onClose, onChange }) {
  const prev = useCallback(() => onChange(index > 0 ? index - 1 : images.length - 1), [index, images.length, onChange]);
  const next = useCallback(() => onChange(index < images.length - 1 ? index + 1 : 0), [index, images.length, onChange]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">×</button>
        <button className="lightbox-arrow lightbox-prev" onClick={prev} aria-label="Previous">‹</button>
        <img src={images[index]} alt={fileName(images[index])} />
        <button className="lightbox-arrow lightbox-next" onClick={next} aria-label="Next">›</button>
        <span className="lightbox-caption">
          {fileName(images[index])}
          <span className="lightbox-counter">{index + 1} / {images.length}</span>
        </span>
      </div>
    </div>
  );
}

/* ────── Music List ────── */

function MusicList({ tracks }) {
  if (!tracks.length) return <p className="gallery-empty">No music yet.</p>;

  return (
    <div className="music-list">
      {tracks.map((src) => (
        <MusicPlayer key={src} src={src} />
      ))}
    </div>
  );
}

function MusicPlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); } else { a.play(); }
    setPlaying(!playing);
  };

  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setCurrentTime(a.currentTime);
    setProgress(a.currentTime / a.duration);
  };

  const onLoaded = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const onEnded = () => { setPlaying(false); setProgress(0); setCurrentTime(0); };

  const seek = (e) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * a.duration;
  };

  const fmt = (s) => {
    if (!s || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoaded}
        onEnded={onEnded}
      />
      <button className={`music-play-btn${playing ? ' is-playing' : ''}`} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
      <div className="music-info">
        <span className="music-name">{fileName(src)}</span>
        <div className="music-progress-wrap" onClick={seek}>
          <div className="music-progress-bar">
            <div className="music-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <div className="music-time">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}
