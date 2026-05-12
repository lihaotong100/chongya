import { useState } from 'react';
import {
  CoinIcon,
  LockIcon,
  UsersIcon,
  FlameIcon,
  CopyIcon,
  CheckIcon,
  ChartIcon,
  SwapIcon,
} from '../icons/Icon.jsx';
import { CONTRACT, LINKS, TOKEN } from '../config.js';
import { useLang } from '../i18n.jsx';

const cardIcons = [<CoinIcon />, <FlameIcon />, <LockIcon />, <UsersIcon />];

const truncate = (addr) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

async function addToWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: CONTRACT,
            symbol: TOKEN.symbol,
            decimals: TOKEN.decimals,
            image: `${window.location.origin}${TOKEN.image}`,
          },
        },
      });
      return;
    } catch {
      return;
    }
  }
  const host = window.location.host;
  const isIOSAndroid = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isIOSAndroid) {
    window.location.href = `https://metamask.app.link/dapp/${host}/`;
    return;
  }
  window.open(LINKS.pancakeswap, '_blank', 'noreferrer');
}

export default function Tokenomics() {
  const { t } = useLang();
  const cards = t('tokenomics.cards') || [];
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <section id="tokenomics">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">
            <span className="dot" />
            {t('tokenomics.eyebrow')}
          </span>
          <h2 className="section-title">
            {t('tokenomics.title')}
            <span className="gold">{t('tokenomics.titleGold')}</span>
          </h2>
          <p className="section-sub">{t('tokenomics.sub')}</p>
        </div>
        <div className="tokenomics-grid">
          {cards.map((c, i) => (
            <div className="token-card reveal" key={i}>
              <div className="icon">{cardIcons[i]}</div>
              <div className="label">{c.label}</div>
              <div className="value">{c.value}</div>
              <div className="desc">{c.desc}</div>
            </div>
          ))}
        </div>

        <div className="contract reveal">
          <div className="contract-info">
            <div className="label">{t('tokenomics.contractLabel')}</div>
            <div className="addr" title={CONTRACT}>
              <span className="addr-full">{CONTRACT}</span>
              <span className="addr-short">{truncate(CONTRACT)}</span>
            </div>
          </div>
          <div className="contract-actions">
            <button onClick={copy} aria-label={t('tokenomics.copyAria')}>
              {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              {copied ? t('tokenomics.copied') : t('tokenomics.copy')}
            </button>
            <button onClick={addToWallet} aria-label={t('tokenomics.addAria')}>
              <CoinIcon size={16} /> {t('tokenomics.addToWallet')}
            </button>
          </div>
        </div>

        <div className="explorer-row reveal">
          <a className="explorer-link" href={LINKS.pancakeswap} target="_blank" rel="noreferrer">
            <SwapIcon size={18} />
            <span>PancakeSwap</span>
          </a>
          <a className="explorer-link" href={LINKS.bscscan} target="_blank" rel="noreferrer">
            <CheckIcon size={18} />
            <span>BscScan</span>
          </a>
          <a className="explorer-link" href={LINKS.dexscreener} target="_blank" rel="noreferrer">
            <ChartIcon size={18} />
            <span>DexScreener</span>
          </a>
          <a className="explorer-link" href={LINKS.dextools} target="_blank" rel="noreferrer">
            <ChartIcon size={18} />
            <span>DexTools</span>
          </a>
        </div>
      </div>
    </section>
  );
}
