import { useState } from 'react';
import { useLang } from '../i18n.jsx';
import contributors from '../contributors.json';

function ContributorCard({ twitter, role_en, role_zh }) {
  const { lang } = useLang();
  const [imgError, setImgError] = useState(false);
  const role = lang === 'zh' ? role_zh : role_en;
  const avatarUrl = `https://unavatar.io/x/${twitter}`;
  const initials = twitter.slice(0, 2).toUpperCase();

  return (
    <a
      href={`https://x.com/${twitter}`}
      target="_blank"
      rel="noreferrer"
      className="contributor-card"
      aria-label={`@${twitter} — ${role}`}
    >
      <div className="contributor-avatar">
        {!imgError ? (
          <img
            src={avatarUrl}
            alt={`@${twitter}`}
            onError={() => setImgError(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="contributor-avatar-fallback" aria-hidden="true">
            {initials}
          </span>
        )}
      </div>
      <div className="contributor-info">
        <span className="contributor-handle">@{twitter}</span>
        <span className="contributor-role">{role}</span>
      </div>
    </a>
  );
}

export default function Contributors() {
  const { t } = useLang();
  if (!contributors.length) return null;

  return (
    <section className="contributors" id="contributors">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="dot" />
            {t('contributors.eyebrow')}
          </span>
          <h2 className="section-title">
            {t('contributors.title')}
            <span className="gold">{t('contributors.titleGold')}</span>
          </h2>
          <p className="section-sub">{t('contributors.sub')}</p>
        </div>

        <div className="contributors-grid reveal">
          {contributors.map((c) => (
            <ContributorCard key={c.twitter} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}
