import { RocketIcon, DuckIcon } from '../icons/Icon.jsx';
import { useLang } from '../i18n.jsx';

export default function Meaning() {
  const { t } = useLang();
  const titleAfter = t('meaning.titleAfter');
  const note = t('meaning.note') || [];

  return (
    <section className="meaning" id="meaning">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="dot" />
            {t('meaning.eyebrow')}
          </span>
          <h2 className="section-title">
            {t('meaning.title')}
            <span className="gold">{t('meaning.titleGold')}</span>
            {titleAfter}
          </h2>
          <p className="section-sub">
            <strong style={{ color: 'var(--text)' }}>
              <span lang="zh-Hans">{t('meaning.sub1')}</span>
            </strong>
            {t('meaning.sub2')}
            <br />
            {t('meaning.sub3')}
            <strong style={{ color: 'var(--gold)' }}>{t('meaning.sub3Gold')}</strong>
            {t('meaning.sub3End')}
          </p>
        </div>

        <div className="meaning-grid">
          <div className="char-card reveal">
            <div className="char-glyph" lang="zh-Hans">冲</div>
            <div className="char-pinyin">chōng</div>
            <div className="char-meaning">
              <span className="char-icon">
                <RocketIcon size={18} />
              </span>
              {t('meaning.chongMeaning')}
            </div>
          </div>

          <div className="char-plus" aria-hidden="true">+</div>

          <div className="char-card reveal">
            <div className="char-glyph" lang="zh-Hans">鸭</div>
            <div className="char-pinyin">yā</div>
            <div className="char-meaning">
              <span className="char-icon">
                <DuckIcon size={20} />
              </span>
              {t('meaning.yaMeaning')}
            </div>
          </div>

          <div className="char-equals" aria-hidden="true">=</div>

          <div className="char-card char-card-result reveal">
            <div className="char-glyph" lang="zh-Hans">冲鸭</div>
            <div className="char-pinyin">Chōng Yā</div>
            <div className="char-meaning">
              <span className="char-icon">
                <RocketIcon size={18} />
              </span>
              <strong>{t('meaning.resultMeaning')}</strong>
            </div>
          </div>
        </div>

        <div className="meaning-note reveal">
          <p>
            {note.map((part, i) => {
              if (typeof part === 'string') return <span key={i}>{part}</span>;
              if (part.zh) return <span key={i} lang="zh-Hans">{part.zh}</span>;
              if (part.hl) return <span key={i} className="hl">{part.hl}</span>;
              return null;
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
