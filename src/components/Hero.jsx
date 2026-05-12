import { RocketIcon, ArrowRightIcon, ChartIcon } from '../icons/Icon.jsx';
import { LINKS } from '../config.js';
import { useLang } from '../i18n.jsx';

function Star() {
  return (
    <svg
      className="mq-star"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
    </svg>
  );
}

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="eyebrow">
              <span className="dot" />
              {t('hero.eyebrow')}
            </span>
            <h1>
              <span className="cn" lang="zh-Hans">冲鸭</span>
              <span>{t('hero.tagline')}</span>
            </h1>
            <p className="lead">
              {t('hero.lead')}
              <strong style={{ color: 'var(--gold)' }}>{t('hero.leadEm')}</strong>
            </p>
            <div className="hero-cta">
              <a
                className="btn btn-primary"
                href={LINKS.pancakeswap}
                target="_blank"
                rel="noreferrer"
              >
                <RocketIcon size={18} /> {t('hero.ctaBuy')}
              </a>
              <a className="btn btn-ghost" href="#buy">
                {t('hero.ctaHowTo')} <ArrowRightIcon size={16} />
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="label">{t('hero.statChain')}</div>
                <div className="value">BNB</div>
              </div>
              <div className="stat">
                <div className="label">{t('hero.statSupply')}</div>
                <div className="value" title="1,000,000,000">1B</div>
              </div>
              <div className="stat">
                <div className="label">{t('hero.statTax')}</div>
                <div className="value">0 / 0</div>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <img
              src="/images/hero-rocket.jpg"
              alt="Chongya duck riding a rocket fueled by a gold candlestick chart toward the moon"
              width="720"
              height="720"
              fetchpriority="high"
              decoding="async"
            />
            <div className="moon-glow" />
            <div className="badge">
              <ChartIcon size={16} /> <span>{t('hero.badge')}</span>
              <span className="live-dot" />
            </div>
          </div>
        </div>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span className="marquee-group" key={i}>
              <span className="mq solid">CHONGYA</span>
              <Star />
              <span className="mq duck" lang="zh-Hans">冲鸭</span>
              <Star />
              <span className="mq outline">TO THE MOON</span>
              <Star />
              <span className="mq solid">WAGMI</span>
              <Star />
              <span className="mq duck" lang="zh-Hans">一起冲</span>
              <Star />
              <span className="mq outline">BNB CHAIN</span>
              <Star />
              <span className="mq solid">$CHONGYA</span>
              <Star />
              <span className="mq outline">HOLD TIGHT</span>
              <Star />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
