import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n.jsx';

const GAME_DURATION = 60;
const TAP_BOOST = 95;
const MAX_VEL = 950;
const DRAG_PER_FRAME = 0.965;
const STORAGE_KEY = 'chongya:bestDistance';
const PROGRESS_DENOM = 50000;

export default function ChongGame() {
  const { t } = useLang();
  const tiers = t('chong.tiers') || [];

  const [phase, setPhase] = useState('idle');
  const [distance, setDistance] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [best, setBest] = useState(0);
  const [tierIdx, setTierIdx] = useState(0);
  const [tierPop, setTierPop] = useState(false);
  const [pulse, setPulse] = useState(0);

  const velRef = useRef(0);
  const distRef = useRef(0);
  const timeRef = useRef(GAME_DURATION);
  const tiersRef = useRef(tiers);
  const popTimerRef = useRef(0);

  useEffect(() => {
    tiersRef.current = tiers;
  }, [tiers]);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY));
      if (Number.isFinite(saved) && saved > 0) setBest(Math.floor(saved));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return undefined;
    let raf = 0;
    let last = 0;

    const step = (now) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      velRef.current *= Math.pow(DRAG_PER_FRAME, dt * 60);
      distRef.current += velRef.current * dt;
      timeRef.current -= dt;

      const list = tiersRef.current;
      let newTier = 0;
      for (let i = 0; i < list.length; i += 1) {
        if (distRef.current >= list[i].from) newTier = i;
      }

      setDistance(Math.floor(distRef.current));
      setVelocity(velRef.current);
      setTimeLeft(Math.max(0, timeRef.current));
      setTierIdx((prev) => {
        if (newTier > prev) {
          setTierPop(true);
          clearTimeout(popTimerRef.current);
          popTimerRef.current = setTimeout(() => setTierPop(false), 1400);
        }
        return newTier;
      });

      if (timeRef.current <= 0) {
        const final = Math.floor(distRef.current);
        setBest((b) => {
          if (final > b) {
            try {
              localStorage.setItem(STORAGE_KEY, String(final));
            } catch {
              /* ignore */
            }
            return final;
          }
          return b;
        });
        setPhase('done');
        return;
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [phase]);

  useEffect(() => () => clearTimeout(popTimerRef.current), []);

  useEffect(() => {
    if (phase !== 'playing') return undefined;
    const onKey = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        velRef.current = Math.min(MAX_VEL, velRef.current + TAP_BOOST);
        setPulse((p) => p + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  const start = () => {
    velRef.current = 0;
    distRef.current = 0;
    timeRef.current = GAME_DURATION;
    setDistance(0);
    setVelocity(0);
    setTimeLeft(GAME_DURATION);
    setTierIdx(0);
    setTierPop(false);
    setPulse(0);
    setPhase('playing');
  };

  const tap = (e) => {
    if (phase !== 'playing') return;
    if (e && e.preventDefault) e.preventDefault();
    velRef.current = Math.min(MAX_VEL, velRef.current + TAP_BOOST);
    setPulse((p) => p + 1);
  };

  const share = () => {
    const tpl = t('chong.shareText') || '';
    const tierName = tiers[tierIdx]?.name || '';
    const text = tpl
      .replace('{distance}', distance.toLocaleString())
      .replace('{tier}', tierName);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const progress = Math.min(1, distance / PROGRESS_DENOM);
  const velPct = Math.min(1, velocity / MAX_VEL);
  const unit = t('chong.unit') || 'm';
  const tierName = tiers[tierIdx]?.name || '';
  const isMaxTier = tierIdx === tiers.length - 1;

  return (
    <section className="chong" id="chong">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="dot" />
            {t('chong.eyebrow')}
          </span>
          <h2 className="section-title">
            {t('chong.title')}
            <span className="gold">{t('chong.titleGold')}</span>
          </h2>
          <p className="section-sub">{t('chong.sub')}</p>
        </div>

        <div
          className={`chong-card reveal chong-phase-${phase}`}
          style={{ '--chong-p': progress, '--chong-v': velPct }}
        >
          <div className="chong-stage" aria-hidden="true">
            <div className="chong-layer chong-space" />
            <div className="chong-layer chong-sky" />
            <div className="chong-layer chong-stars" />
            <div className="chong-layer chong-clouds chong-clouds--far" />
            <div className="chong-layer chong-clouds chong-clouds--near" />
            <div className="chong-moon" />
            <div className="chong-ground" />
            <div className={`chong-duck${velPct > 0.4 ? ' chong-duck--fast' : ''}`}>
              <div className="chong-flame" />
              <span className="chong-duck-body" role="img" aria-hidden="true">🦆</span>
            </div>
            <div className="chong-hud" aria-hidden="true">
              <div className="chong-hud-row">
                <span className="chong-hud-label">{t('chong.distanceLabel')}</span>
                <span className="chong-hud-value chong-hud-value--big">
                  {distance.toLocaleString()}
                  <span className="chong-hud-unit"> {unit}</span>
                </span>
              </div>
              <div className="chong-hud-side">
                <div className="chong-hud-row">
                  <span className="chong-hud-label">{t('chong.timerLabel')}</span>
                  <span className="chong-hud-value chong-timer">
                    {timeLeft.toFixed(1)}s
                  </span>
                </div>
                <div className="chong-hud-row">
                  <span className="chong-hud-label">{t('chong.bestLabel')}</span>
                  <span className="chong-hud-value">
                    {best.toLocaleString()} {unit}
                  </span>
                </div>
              </div>
            </div>
            {tierPop && (
              <div className="chong-tier-pop">
                <span className="chong-tier-pop-label">{t('chong.newTier')}</span>
                <span className="chong-tier-pop-name">{tierName}</span>
              </div>
            )}
          </div>

          <div className="chong-bar">
            <div className="chong-bar-track">
              <div
                className="chong-bar-fill"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="chong-bar-meta">
              <span className={`chong-bar-tier${isMaxTier ? ' chong-bar-tier--max' : ''}`}>
                {tierName}
              </span>
              <span className="chong-bar-vel" aria-hidden="true">
                <span
                  className="chong-bar-vel-bar"
                  style={{ width: `${velPct * 100}%` }}
                />
              </span>
            </div>
          </div>

          {phase === 'idle' && (
            <div className="chong-actions">
              <button
                type="button"
                className="btn btn-primary chong-cta-start"
                onClick={start}
              >
                {t('chong.startCta')}
              </button>
              <p className="chong-hint">{t('chong.tapHint')}</p>
            </div>
          )}

          {phase === 'playing' && (
            <div className="chong-actions">
              <button
                type="button"
                className="chong-tap-btn"
                onPointerDown={tap}
                data-pulse={pulse}
              >
                {t('chong.tapCta')}
              </button>
              <p className="chong-hint">{t('chong.tapHint')}</p>
            </div>
          )}

          {phase === 'done' && (
            <div className="chong-result">
              <p className="chong-result-eyebrow">{t('chong.resultEyebrow')}</p>
              <p className="chong-result-headline">
                {t('chong.resultTitle')}{' '}
                <span className="gold">
                  {distance.toLocaleString()} {unit}
                </span>{' '}
                {t('chong.resultSubLine')}
              </p>
              <p className="chong-result-tier">{tierName}</p>
              <div className="chong-actions">
                <button type="button" className="btn btn-primary" onClick={share}>
                  {t('chong.shareCta')}
                </button>
                <button type="button" className="btn btn-ghost" onClick={start}>
                  {t('chong.retryCta')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
