import { useCallback, useEffect, useMemo, useState } from 'react';
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
];

const fallbackColors = ['#F0B90B', '#F5F5F7', '#FF9EC4', '#B189FF', '#7CB7FF', '#7CE4A2', '#2A2A33'];
const shareSlugs = ['gold', 'snow', 'rose', 'violet', 'sky', 'mint', 'onyx'];

export default function WhichDuck() {
  const { t } = useLang();
  const questions = t('quiz.questions') || [];
  const members = t('squad.members') || [];
  const codes = t('quiz.codes') || [];

  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState([]);
  const [pendingPick, setPendingPick] = useState(null);

  const totalQuestions = questions.length;

  const result = useMemo(() => {
    if (picks.length < totalQuestions || totalQuestions === 0) return null;
    const counts = new Array(members.length).fill(0);
    picks.forEach((d) => {
      if (typeof d === 'number' && d >= 0 && d < counts.length) counts[d] += 1;
    });
    let best = 0;
    for (let i = 1; i < counts.length; i += 1) {
      if (counts[i] > counts[best]) best = i;
    }
    return best;
  }, [picks, totalQuestions, members.length]);

  const reset = useCallback(() => {
    setPicks([]);
    setStep(0);
    setPendingPick(null);
  }, []);

  const choose = useCallback(
    (duckIdx) => {
      if (pendingPick !== null) return;
      setPendingPick(duckIdx);
      window.setTimeout(() => {
        setPicks((prev) => [...prev, duckIdx]);
        setStep((s) => s + 1);
        setPendingPick(null);
      }, 260);
    },
    [pendingPick]
  );

  useEffect(() => {
    if (result !== null) return;
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
        reset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, result, questions, choose, reset]);

  useEffect(() => {
    if (result === null) return;
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [result, reset]);

  const handleShare = () => {
    if (result === null) return;
    const member = members[result];
    if (!member) return;
    const template = t('quiz.shareTemplate') || '';
    const statsLine = (member.stats || [])
      .map((s) => `▸ ${s.label} ${s.value}`)
      .join('\n');
    const text = template
      .replace('{name}', member.name || '')
      .replace('{code}', codes[result] || '')
      .replace('{tagline}', member.tagline || '')
      .replace('{stats}', statsLine);
    const slug = shareSlugs[result];
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = slug ? `${origin}/share/duck-${slug}.html` : origin;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    if (typeof window !== 'undefined') {
      window.open(intent, '_blank', 'noopener,noreferrer');
    }
  };

  if (totalQuestions === 0) return null;

  if (result !== null) {
    const member = members[result] || {};
    const accent = member.color || fallbackColors[result] || '#F0B90B';
    const code = codes[result] || '';
    const stats = member.stats || [];
    const progressPct = 100;

    return (
      <section className="quiz" id="quiz">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">
              <span className="dot" />
              {t('quiz.eyebrow')}
            </span>
            <h2 className="section-title">
              {t('quiz.title')}
              <span className="gold">{t('quiz.titleGold')}</span>
            </h2>
            <p className="section-sub">{t('quiz.sub')}</p>
          </div>

          <div
            className="quiz-result reveal in"
            style={{ '--accent': accent }}
            role="region"
            aria-live="polite"
          >
            <div className="quiz-result-portrait">
              <div className="quiz-result-glow" aria-hidden="true" />
              <div className="quiz-result-frame">
                <img
                  src={portraits[result]}
                  alt={member.name || 'Your duck'}
                  width="420"
                  height="420"
                  decoding="async"
                />
                <span className="quiz-result-ring" aria-hidden="true" />
              </div>
              <span className="quiz-result-code">{code}</span>
            </div>

            <div className="quiz-result-info">
              <span className="quiz-result-label">{t('quiz.resultLabel')}</span>
              <h3 className="quiz-result-name">{member.name}</h3>
              <p className="quiz-result-tagline">{member.tagline}</p>

              {stats.length > 0 && (
                <div className="quiz-result-traits">
                  <span className="quiz-result-traits-label">{t('quiz.traitsLabel')}</span>
                  <ul>
                    {stats.map((s) => (
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
                  onClick={reset}
                  aria-label={t('quiz.retakeCta')}
                >
                  <span>{t('quiz.retakeCta')}</span>
                  <ArrowRightIcon size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const safeStep = Math.min(step, totalQuestions - 1);
  const question = questions[safeStep];
  const progressPct = (safeStep / totalQuestions) * 100;

  return (
    <section className="quiz" id="quiz">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="dot" />
            {t('quiz.eyebrow')}
          </span>
          <h2 className="section-title">
            {t('quiz.title')}
            <span className="gold">{t('quiz.titleGold')}</span>
          </h2>
          <p className="section-sub">{t('quiz.sub')}</p>
        </div>

        <div className="quiz-card reveal">
          <div className="quiz-card-head">
            <span className="quiz-progress">
              {(t('quiz.progress') || '')
                .replace('{n}', String(safeStep + 1))
                .replace('{total}', String(totalQuestions))}
            </span>
            <span className="quiz-hint" aria-hidden="true">{t('quiz.hint')}</span>
          </div>

          <div className="quiz-progress-bar" aria-hidden="true">
            <span style={{ width: `${progressPct}%` }} />
          </div>

          <div className="quiz-stage" key={safeStep}>
            <p className="quiz-question">{question.q}</p>
            <div className="quiz-options" role="radiogroup" aria-label={question.q}>
              {question.options.map((opt, i) => {
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
          </div>
        </div>
      </div>
    </section>
  );
}
