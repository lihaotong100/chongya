import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n.jsx';
import { XIcon, ArrowRightIcon } from '../icons/Icon.jsx';

const portraits = [
  '/character/duck-gold.png',
  '/character/duck-snow.png',
  '/character/duck-rose.png',
  '/character/duck-violet.png',
  '/character/duck-sky.png',
  '/character/duck-mint.jpg',
  '/character/duck-onyx.png',
  '', // mystery — rendered as ?
];

const fallbackColors = ['#F0B90B', '#F5F5F7', '#FF9EC4', '#B189FF', '#7CB7FF', '#7CE4A2', '#2A2A33', '#3a3a45'];
const shareSlugs = ['gold', 'snow', 'rose', 'violet', 'sky', 'mint', 'onyx', ''];

const PHASE_GALLERY = 'gallery';
const PHASE_QUIZ = 'quiz';
const PHASE_RESULT = 'result';

export default function Squad() {
  const { t } = useLang();
  const members = t('squad.members') || [];
  const questions = t('quiz.questions') || [];
  const codes = t('quiz.codes') || [];

  const [phase, setPhase] = useState(PHASE_GALLERY);
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState([]);
  const [pendingPick, setPendingPick] = useState(null);
  const stripRef = useRef(null);

  const totalQuestions = questions.length;
  const safeActive = Math.min(active, Math.max(members.length - 1, 0));
  const currentMember = members[safeActive] || {};
  const galleryAccent = currentMember.color || fallbackColors[safeActive] || '#F0B90B';
  const galleryStats = currentMember.stats || [];

  const goTo = useCallback((i) => setActive(i), []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const node = strip.querySelector('[data-active="true"]');
    if (node && typeof node.scrollIntoView === 'function') {
      node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [safeActive]);

  const onStripKeyDown = (e) => {
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

  const startQuiz = useCallback(() => {
    setStep(0);
    setPicks([]);
    setPendingPick(null);
    setPhase(PHASE_QUIZ);
  }, []);

  const backToGallery = useCallback(() => {
    setPhase(PHASE_GALLERY);
  }, []);

  const resetQuiz = useCallback(() => {
    setStep(0);
    setPicks([]);
    setPendingPick(null);
    setPhase(PHASE_QUIZ);
  }, []);

  const choose = useCallback(
    (duckIdx) => {
      if (pendingPick !== null) return;
      setPendingPick(duckIdx);
      window.setTimeout(() => {
        setPicks((prev) => {
          const next = [...prev, duckIdx];
          if (next.length >= totalQuestions) {
            const counts = new Array(members.length).fill(0);
            next.forEach((d) => {
              if (typeof d === 'number' && d >= 0 && d < counts.length) counts[d] += 1;
            });
            let best = 0;
            for (let i = 1; i < counts.length; i += 1) {
              if (counts[i] > counts[best]) best = i;
            }
            setActive(best);
            setPhase(PHASE_RESULT);
          } else {
            setStep((s) => s + 1);
          }
          return next;
        });
        setPendingPick(null);
      }, 260);
    },
    [pendingPick, totalQuestions, members.length]
  );

  // Keyboard for quiz phase
  useEffect(() => {
    if (phase !== PHASE_QUIZ) return;
    if (!questions[step]) return;
    const onKey = (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key >= '1' && e.key <= '9') {
        const idx = Number(e.key) - 1;
        const opt = questions[step].options[idx];
        if (opt) {
          e.preventDefault();
          choose(opt.duck);
        }
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetQuiz();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, step, questions, choose, resetQuiz]);

  // Keyboard for result phase (R to retake)
  useEffect(() => {
    if (phase !== PHASE_RESULT) return;
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetQuiz();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, resetQuiz]);

  const handleShare = () => {
    const member = members[safeActive];
    if (!member) return;
    const template = t('quiz.shareTemplate') || '';
    const statsLine = (member.stats || [])
      .map((s) => `▸ ${s.label} ${s.value}`)
      .join('\n');
    const text = template
      .replace('{name}', member.name || '')
      .replace('{code}', codes[safeActive] || '')
      .replace('{tagline}', member.tagline || '')
      .replace('{stats}', statsLine);
    const slug = shareSlugs[safeActive];
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = slug ? `${origin}/share/duck-${slug}.html` : origin;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
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

        {phase === PHASE_GALLERY && (
          <>
            <div
              className="squad-stage"
              style={{ '--accent': galleryAccent }}
              role="region"
              aria-label={t('squad.eyebrow')}
            >
              <div className={`squad-stage-portrait${currentMember.mystery ? ' is-mystery' : ''}`}>
                <div className="squad-stage-glow" aria-hidden="true" />
                <div className="squad-stage-frame">
                  {portraits.map((src, i) =>
                    src ? (
                      <img
                        key={i}
                        src={src}
                        alt={members[i] ? members[i].name : `Chongya duck ${i + 1}`}
                        className={`squad-stage-img${i === safeActive ? ' is-active' : ''}`}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        draggable="false"
                      />
                    ) : null
                  )}
                  {currentMember.mystery && (
                    <span className="squad-stage-mystery" aria-hidden="true">?</span>
                  )}
                  <div className="squad-stage-ring" aria-hidden="true" />
                </div>
                <div className="squad-stage-index" aria-live="polite">
                  <span>{String(safeActive + 1).padStart(2, '0')}</span>
                  <span className="sep">/</span>
                  <span className="total">{String(members.length).padStart(2, '0')}</span>
                </div>
              </div>

              <div className="squad-stage-info">
                <span className="squad-stage-chip" style={{ background: galleryAccent }}>
                  <span className="squad-stage-chip-dot" />
                  {currentMember.mystery ? t('squad.mysteryChip') : currentMember.name}
                </span>
                <h3 className="squad-stage-name">{currentMember.name}</h3>
                <p className="squad-stage-tagline">{currentMember.tagline}</p>

                {!currentMember.mystery && galleryStats.length > 0 && (
                  <ul className="squad-stats" aria-label={`${currentMember.name} stats`}>
                    {galleryStats.map((s) => (
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
                    className="squad-take-quiz"
                    onClick={startQuiz}
                  >
                    <span>{t('squad.takeQuizCta')}</span>
                    <ArrowRightIcon size={14} />
                  </button>
                  <span className="squad-stage-hint">{t('squad.tapHint')}</span>
                </div>
              </div>
            </div>

            <div
              className="squad-strip"
              ref={stripRef}
              role="tablist"
              aria-label={t('squad.eyebrow')}
              onKeyDown={onStripKeyDown}
            >
              {members.map((d, i) => {
                const isActive = i === safeActive;
                const color = d.color || fallbackColors[i];
                const isMystery = !!d.mystery;
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={isMystery ? t('squad.mysteryAria') : d.name}
                    data-active={isActive}
                    tabIndex={isActive ? 0 : -1}
                    className={`squad-thumb${isActive ? ' is-active' : ''}${isMystery ? ' squad-thumb--mystery' : ''}`}
                    style={{ '--thumb-accent': color }}
                    onClick={() => goTo(i)}
                    onMouseEnter={() => goTo(i)}
                    onFocus={() => goTo(i)}
                  >
                    <span className="squad-thumb-ring" aria-hidden="true" />
                    {isMystery ? (
                      <span className="squad-thumb-mystery" aria-hidden="true">?</span>
                    ) : (
                      <img
                        src={portraits[i]}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                      />
                    )}
                    <span className="squad-thumb-name">{isMystery ? t('squad.mysteryThumbName') : d.name}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {phase === PHASE_QUIZ && questions[step] && (
          <div className="quiz-card reveal in">
            <div className="quiz-card-head">
              <span className="quiz-progress">
                {(t('quiz.progress') || '')
                  .replace('{n}', String(step + 1))
                  .replace('{total}', String(totalQuestions))}
              </span>
              <button
                type="button"
                className="quiz-bail"
                onClick={backToGallery}
                aria-label={t('squad.backToGalleryCta')}
              >
                {t('squad.backToGalleryCta')}
              </button>
            </div>

            <div className="quiz-progress-bar" aria-hidden="true">
              <span style={{ width: `${(step / totalQuestions) * 100}%` }} />
            </div>

            <div className="quiz-stage" key={step}>
              <p className="quiz-question">{questions[step].q}</p>
              <div className="quiz-options" role="radiogroup" aria-label={questions[step].q}>
                {questions[step].options.map((opt, i) => {
                  const isPending = pendingPick !== null && pendingPick === opt.duck;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={false}
                      className={`quiz-option${isPending ? ' is-pending' : ''}`}
                      onClick={() => choose(opt.duck)}
                      disabled={pendingPick !== null}
                    >
                      <span className="quiz-option-key" aria-hidden="true">{i + 1}</span>
                      <span className="quiz-option-text">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
              <p className="quiz-hint-inline" aria-hidden="true">{t('quiz.hint')}</p>
            </div>
          </div>
        )}

        {phase === PHASE_RESULT && (
          <div
            className="quiz-result reveal in"
            style={{ '--accent': galleryAccent }}
            role="region"
            aria-live="polite"
          >
            <div className="quiz-result-portrait">
              <div className="quiz-result-glow" aria-hidden="true" />
              <div className="quiz-result-frame">
                <img
                  src={portraits[safeActive]}
                  alt={currentMember.name || 'Your duck'}
                  width="420"
                  height="420"
                  decoding="async"
                />
                <span className="quiz-result-ring" aria-hidden="true" />
              </div>
              <span className="quiz-result-code">{codes[safeActive] || ''}</span>
            </div>

            <div className="quiz-result-info">
              <span className="quiz-result-label">{t('quiz.resultLabel')}</span>
              <h3 className="quiz-result-name">{currentMember.name}</h3>
              <p className="quiz-result-tagline">{currentMember.tagline}</p>

              {galleryStats.length > 0 && (
                <div className="quiz-result-traits">
                  <span className="quiz-result-traits-label">{t('quiz.traitsLabel')}</span>
                  <ul>
                    {galleryStats.map((s) => (
                      <li key={s.label}>
                        <span className="quiz-trait-label">{s.label}</span>
                        <span className="quiz-trait-value">{s.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="quiz-result-sub">{t('quiz.resultSub')}</p>

              <div className="quiz-actions">
                <button
                  type="button"
                  className="quiz-share"
                  onClick={handleShare}
                  aria-label={t('quiz.shareCta')}
                >
                  <XIcon size={16} />
                  <span>{t('quiz.shareCta')}</span>
                </button>
                <button
                  type="button"
                  className="quiz-retake"
                  onClick={resetQuiz}
                  aria-label={t('quiz.retakeCta')}
                >
                  <span>{t('quiz.retakeCta')}</span>
                  <ArrowRightIcon size={14} />
                </button>
                <button
                  type="button"
                  className="quiz-retake"
                  onClick={backToGallery}
                  aria-label={t('squad.backToGalleryCta')}
                >
                  <span>{t('squad.backToGalleryCta')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
