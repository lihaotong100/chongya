import { useLang } from '../i18n.jsx';

const colors = ['#F0B90B', '#F5F5F7', '#7CB7FF', '#FF9EC4', '#B189FF', '#7CE4A2'];

export default function Squad() {
  const { t } = useLang();
  const members = t('squad.members') || [];

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
        <div className="squad-hero reveal">
          <img
            src="/images/squad-colors.jpg"
            alt="Colored astronaut ducks of the Chongya squad on the moon"
            width="719"
            height="714"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="squad-grid">
          {members.map((d, i) => (
            <div className="duck-card reveal" key={i}>
              <div
                className="duck-color"
                style={{ background: colors[i], color: colors[i] }}
              />
              <h4>{d.name}</h4>
              <p>{d.tagline}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
