import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { XIcon } from '../icons/Icon.jsx';

const portraits = [
  '/character/duck-gold.png',
  '/character/duck-snow.png',
  '/character/duck-rose.png',
  '/character/duck-violet.png',
  '/character/duck-sky.png',
  '/character/duck-mint.jpg',
  '/character/duck-onyx.png',
];

const fallbackColors = ['#F0B90B', '#F5F5F7', '#FF9EC4', '#B189FF', '#7CB7FF', '#7CE4A2', '#2A2A33'];
const AUTOPLAY_MS = 3500;

export default function Squad() {
  const { t } = useLang();
  const members = t('squad.members') || [];
  const shareTemplate = t('squad.shareTemplate') || '';
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stripRef = useRef(null);

  const safeIndex = Math.min(active, Math.max(members.length - 1, 0));
  const current = members[safeIndex] || {};
  const accent = current.color || fallbackColors[safeIndex] || '#F0B90B';
  const stats = current.stats || [];

  const goTo = useCallback((i) => setActive(i), []);

  useEffect(() => {
    if (paused || members.length < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const id = window.setTimeout(() => {
      setActive((i) => (i + 1) % members.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, members.length]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const node = strip.querySelector('[data-active="true"]');
    if (node && typeof node.scrollIntoView === 'function') {
      node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [safeIndex]);

  const onKeyDown = (e) => {
    if (!members.length) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % members.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + members.length) % members.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(members.length - 1);
    }
  };

  const onShare = () => {
    if (!current.name) return;
    const text = shareTemplate
      .replace('{name}', current.name)
      .replace('{tagline}', current.tagline || '');
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}${url ? `&url=${encodeURIComponent(url)}` : ''}`;
    if (typeof window !== 'undefined') {
      window.open(intent, '_blank', 'noopener,noreferrer');
    }
  };

  if (!members.length) return null;

  return (
    <section className="squad" id="squad">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="dot" />
            {t('squad.eyebrow')}
          </span>
          <h2 className="section-title">
            {t('squad.title')}
            <span className="gold">{t('squad.titleGold')}</span>
          </h2>
          <p className="section-sub">{t('squad.sub')}</p>
        </div>

        <div
          className="squad-stage reveal"
          style={{ '--accent': accent }}
          role="region"
          aria-label={t('squad.eyebrow')}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
          }}
        >
          <div className="squad-stage-portrait">
            <div className="squad-stage-glow" aria-hidden="true" />
            <div className="squad-stage-frame">
              {portraits.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={members[i] ? members[i].name : `Chongya duck ${i + 1}`}
                  className={`squad-stage-img${i === safeIndex ? ' is-active' : ''}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable="false"
                />
              ))}
              <div className="squad-stage-ring" aria-hidden="true" />
            </div>
            <div className="squad-stage-index" aria-live="polite">
              <span>{String(safeIndex + 1).padStart(2, '0')}</span>
              <span className="sep">/</span>
              <span className="total">{String(members.length).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="squad-stage-info">
            <span className="squad-stage-chip" style={{ background: accent }}>
              <span className="squad-stage-chip-dot" />
              {current.name}
            </span>
            <h3 className="squad-stage-name">{current.name}</h3>
            <p className="squad-stage-tagline">{current.tagline}</p>

            {stats.length > 0 && (
              <ul className="squad-stats" aria-label={`${current.name} stats`}>
                {stats.map((s) => (
                  <li key={s.label} className="squad-stat">
                    <span className="squad-stat-label">{s.label}</span>
                    <span className="squad-stat-value">{s.value}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="squad-stage-actions">
              <button
                type="button"
                className="squad-share"
                onClick={onShare}
                aria-label={t('squad.shareCta')}
              >
                <XIcon size={16} />
                <span>{t('squad.shareCta')}</span>
              </button>
              <span className="squad-stage-hint">{t('squad.tapHint')}</span>
            </div>
          </div>
        </div>

        <div
          className="squad-strip reveal"
          ref={stripRef}
          role="tablist"
          aria-label={t('squad.eyebrow')}
          onKeyDown={onKeyDown}
        >
          {members.map((d, i) => {
            const isActive = i === safeIndex;
            const color = d.color || fallbackColors[i];
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={d.name}
                data-active={isActive}
                tabIndex={isActive ? 0 : -1}
                className={`squad-thumb${isActive ? ' is-active' : ''}`}
                style={{ '--thumb-accent': color }}
                onClick={() => goTo(i)}
                onMouseEnter={() => goTo(i)}
                onFocus={() => goTo(i)}
              >
                <span className="squad-thumb-ring" aria-hidden="true" />
                <img
                  src={portraits[i]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
                <span className="squad-thumb-name">{d.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
