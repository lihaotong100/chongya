import { useEffect, useRef, useState } from 'react';
import { VolumeOnIcon, VolumeOffIcon } from '../icons/Icon.jsx';
import { useLang } from '../i18n.jsx';

const STORAGE_KEY = 'chongya:bgm';
const SRC = '/BGM.MP3';

export default function BGMToggle() {
  const { t } = useLang();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [primed, setPrimed] = useState(false);

  const labelOn = t('bgm.muteAria') || 'Mute background music';
  const labelOff = t('bgm.playAria') || 'Play background music';

  useEffect(() => {
    if (primed) return;
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* noop */ }
    if (saved !== 'on') return;
    const onGesture = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().then(() => setPlaying(true)).catch(() => {});
      setPrimed(true);
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
    window.addEventListener('pointerdown', onGesture, { once: false });
    window.addEventListener('keydown', onGesture, { once: false });
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, [primed]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      try { localStorage.setItem(STORAGE_KEY, 'off'); } catch { /* noop */ }
    } else {
      audio.play()
        .then(() => {
          setPlaying(true);
          setPrimed(true);
          try { localStorage.setItem(STORAGE_KEY, 'on'); } catch { /* noop */ }
        })
        .catch(() => setPlaying(false));
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className={`bgm-toggle${playing ? ' is-playing' : ''}`}
        onClick={toggle}
        aria-label={playing ? labelOn : labelOff}
        aria-pressed={playing}
      >
        <span className="bgm-toggle-icon">
          {playing ? <VolumeOnIcon size={18} /> : <VolumeOffIcon size={18} />}
        </span>
        {playing && (
          <span className="bgm-eq" aria-hidden="true">
            <span /><span /><span />
          </span>
        )}
      </button>
    </>
  );
}
