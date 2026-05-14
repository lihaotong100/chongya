import { useMemo, useState } from 'react';
import { useLang } from '../i18n.jsx';

const DUCK_COLORS = [
  '#F0B90B',
  '#F5F5F7',
  '#7CB7FF',
  '#FF9EC4',
  '#B189FF',
  '#7CE4A2',
  '#1a1a1a',
];

export default function WhichDuck() {
  const { t } = useLang();
  const questions = t('quiz.questions') || [];
  const members = t('squad.members') || [];

  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState([]);

  const result = useMemo(() => {
    if (picks.length < questions.length || questions.length === 0) return null;
    const counts = new Array(members.length).fill(0);
    picks.forEach((d) => {
      counts[d] += 1;
    });
    let best = 0;
    for (let i = 1; i < counts.length; i += 1) {
      if (counts[i] > counts[best]) best = i;
    }
    return best;
  }, [picks, questions.length, members.length]);

  const handlePick = (duckIdx) => {
    const next = [...picks, duckIdx];
    setPicks(next);
    if (next.length < questions.length) {
      setStep(step + 1);
    }
  };

  const handleRetake = () => {
    setPicks([]);
    setStep(0);
  };

  const handleShare = () => {
    if (result === null) return;
    const member = members[result];
    const template = t('quiz.shareText') || '';
    const text = template.replace('{name}', member?.name || '???');
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (questions.length === 0) return null;

  const isRare = result !== null && result === members.length - 1;

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

        {result === null ? (
          <div className="quiz-card reveal" key={step}>
            <div className="quiz-progress">
              {(t('quiz.progress') || '')
                .replace('{n}', String(step + 1))
                .replace('{total}', String(questions.length))}
            </div>
            <div
              className="quiz-progress-bar"
              aria-hidden="true"
            >
              <span
                style={{
                  width: `${((step + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
            <p className="quiz-question">{questions[step].q}</p>
            <div className="quiz-options">
              {questions[step].options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className="quiz-option"
                  onClick={() => handlePick(opt.duck)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={`quiz-result reveal in${isRare ? ' quiz-result--rare' : ''}`}>
            <div
              className="quiz-result-swatch"
              style={{ background: DUCK_COLORS[result] }}
            />
            {isRare && (
              <span className="quiz-rare-badge">{t('quiz.rareBadge')}</span>
            )}
            <p className="quiz-result-label">{t('quiz.resultTitle')}</p>
            <h3 className="quiz-result-name">{members[result]?.name}</h3>
            <p className="quiz-result-tag">{members[result]?.tagline}</p>
            <p className="quiz-result-sub">{t('quiz.resultSub')}</p>
            <div className="quiz-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleShare}
              >
                {t('quiz.shareCta')}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleRetake}
              >
                {t('quiz.retakeCta')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
