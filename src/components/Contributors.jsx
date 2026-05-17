import { useState } from 'react';
import { useLang } from '../i18n.jsx';
import contributors from '../data/contributors.json';

function avatarUrl(username) {
  return `https://unavatar.io/x/${username}`;
}

function profileUrl(username) {
  return `https://x.com/${username}`;
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
            <ContributorItem key={c.username} contributor={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContributorItem({ contributor }) {
  const { username, role } = contributor;
  const { lang } = useLang();
  const [imgError, setImgError] = useState(false);
  const displayRole = role?.[lang] || role?.en || '';

  return (
    <a
      className="contributor-item"
      href={profileUrl(username)}
      target="_blank"
      rel="noreferrer"
      aria-label={`@${username} on X`}
    >
      <div className="contributor-avatar">
        {imgError ? (
          <div className="contributor-avatar-fallback">
            {username.charAt(0).toUpperCase()}
          </div>
        ) : (
          <img
            src={avatarUrl(username)}
            alt={`@${username}`}
            width="88"
            height="88"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <span className="contributor-role">{displayRole}</span>
      <span className="contributor-handle">@{username}</span>
    </a>
  );
}
