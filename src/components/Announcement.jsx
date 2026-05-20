import { useLang } from '../i18n.jsx';

export default function Announcement() {
  const { t } = useLang();

  return (
    <div className="announcement-page">
      <div className="container">
        <article className="announcement-article">
          <div className="announcement-hero">
            <img
              src="/images/IMG_1842.jpeg"
              alt={t('announcement.title')}
              className="announcement-hero-img"
            />
            <div className="announcement-hero-overlay" />
            <div className="announcement-hero-content">
              <span className="eyebrow">
                <span className="dot" />
                {t('announcement.eyebrow')}
              </span>
              <h1 className="announcement-title">{t('announcement.title')}</h1>
            </div>
          </div>

          <div className="announcement-body">
            {(t('announcement.paragraphs') || []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <div className="announcement-sign">
              <p className="announcement-sign-name">{t('announcement.signName')}</p>
              <p className="announcement-sign-date">{t('announcement.signDate')}</p>
            </div>

            <div className="announcement-hashtag">
              {t('announcement.hashtag')}
            </div>
          </div>
        </article>

        <div className="announcement-back">
          <a href="#top" className="btn btn-ghost">{t('announcement.backHome')}</a>
        </div>
      </div>
    </div>
  );
}
