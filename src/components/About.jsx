import { CheckIcon } from '../icons/Icon.jsx';
import { useLang } from '../i18n.jsx';

export default function About() {
  const { t } = useLang();
  const points = t('about.points') || [];

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-art reveal">
            <img
              src="/images/squad-colors.jpg"
              alt="The Chongya flock — seven colored astronaut ducks, the whole duck universe on the moon"
              width="719"
              height="714"
              loading="lazy"
              decoding="async"
            />
            <span className="about-art-tag">
              <span className="about-art-tag-dot" />
              {t('about.eyebrow')}
            </span>
          </div>
          <div className="reveal">
            <span className="eyebrow">
              <span className="dot" />
              {t('about.eyebrow')}
            </span>
            <h2 className="section-title">
              {t('about.title')}
              <span className="gold">{t('about.titleGold')}</span>
            </h2>
            <p className="section-sub">{t('about.sub')}</p>
            <ul>
              {points.map((p, i) => (
                <li key={i}>
                  <span className="check">
                    <CheckIcon size={16} />
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
