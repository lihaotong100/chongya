import { Fragment } from 'react';
import { XIcon, TelegramIcon, DiscordIcon, RocketIcon } from '../icons/Icon.jsx';
import { LINKS } from '../config.js';
import { useLang } from '../i18n.jsx';

export default function Community() {
  const { t } = useLang();
  const parts = t('community.bannerParts') || [];

  const socials = [
    { url: LINKS.telegram, icon: <TelegramIcon size={18} />, label: t('community.tgCta') },
    { url: LINKS.twitter, icon: <XIcon size={16} />, label: t('community.xCta') },
    { url: LINKS.discord, icon: <DiscordIcon size={18} />, label: t('community.discordCta') },
  ].filter((s) => s.url);

  return (
    <section className="community" id="community">
      <div className="community-bg" aria-hidden="true">
        <img
          src="/images/moon-squad.jpg"
          alt=""
          width="721"
          height="725"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="container">
        <span className="eyebrow">
          <span className="dot" />
          {t('community.eyebrow')}
        </span>
        <div className="community-banner">
          {parts.map((p, i) => (
            <Fragment key={p + i}>
              <span {...(/[一-鿿]/.test(p) ? { lang: 'zh-Hans' } : {})}>{p}</span>
              {i < parts.length - 1 && <span className="dot-sep" aria-hidden="true" />}
            </Fragment>
          ))}
        </div>
        <p className="section-sub" style={{ margin: '0 auto 32px' }}>
          {t('community.sub')}
        </p>
        <div className="btn-row">
          <a className="btn btn-primary" href={LINKS.pancakeswap} target="_blank" rel="noreferrer">
            <RocketIcon size={18} /> {t('community.buyCta')}
          </a>
          {socials.map((s) => (
            <a
              className="btn btn-ghost"
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
