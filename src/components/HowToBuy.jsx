import { WalletIcon, CoinIcon, SwapIcon, RocketIcon } from '../icons/Icon.jsx';
import { useLang } from '../i18n.jsx';

const stepIcons = [<WalletIcon />, <CoinIcon />, <SwapIcon />, <RocketIcon />];

export default function HowToBuy() {
  const { t } = useLang();
  const steps = t('howToBuy.steps') || [];

  return (
    <section id="buy">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="dot" />
            {t('howToBuy.eyebrow')}
          </span>
          <h2 className="section-title">
            {t('howToBuy.title')}
            <span className="gold">{t('howToBuy.titleGold')}</span>
          </h2>
          <p className="section-sub">{t('howToBuy.sub')}</p>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step reveal" key={i}>
              <div className="step-num">0{i + 1}</div>
              <div className="step-icon">{stepIcons[i]}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
