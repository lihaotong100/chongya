import { useEffect, useRef, useState } from 'react';
import { MenuIcon, CloseIcon } from '../icons/Icon.jsx';
import { LINKS } from '../config.js';
import { useLang } from '../i18n.jsx';

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef(null);
  const togglerRef = useRef(null);

  const links = [
    { href: '#meaning', label: t('nav.meaning') },
    { href: '#tokenomics', label: t('nav.tokenomics') },
    { href: '#buy', label: t('nav.howToBuy') },
    { href: '#about', label: t('nav.about') },
    { href: '#squad', label: t('nav.squad') },
  ];

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return undefined;
    }
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        togglerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    firstLinkRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);
  const toggleLang = () => setLang(lang === 'en' ? 'zh' : 'en');

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="#top" className="nav-brand" aria-label={t('nav.home')}>
            <span>CHONGYA</span>
            <span className="cn" lang="zh-Hans">冲鸭</span>
          </a>
          <div className="nav-links">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="nav-cta">
            <button
              className="lang-toggle"
              onClick={toggleLang}
              aria-label={t('nav.langSwitch')}
            >
              <span className={lang === 'en' ? 'on' : ''}>EN</span>
              <span className="lang-divider" aria-hidden="true">/</span>
              <span className={lang === 'zh' ? 'on' : ''} lang="zh-Hans">中</span>
            </button>
            <a
              className="btn btn-primary"
              href={LINKS.pancakeswap}
              target="_blank"
              rel="noreferrer"
            >
              {t('nav.buyCta')}
            </a>
          </div>
          <button
            ref={togglerRef}
            className="nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
      {open && (
        <>
          <div className="mobile-menu-backdrop" onClick={close} aria-hidden="true" />
          <div
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                ref={i === 0 ? firstLinkRef : undefined}
                onClick={close}
              >
                {l.label}
              </a>
            ))}
            <button
              className="lang-toggle lang-toggle-mobile"
              onClick={toggleLang}
              aria-label={t('nav.langSwitch')}
            >
              <span className={lang === 'en' ? 'on' : ''}>EN</span>
              <span className="lang-divider" aria-hidden="true">/</span>
              <span className={lang === 'zh' ? 'on' : ''} lang="zh-Hans">中</span>
            </button>
            <a
              className="btn btn-primary"
              href={LINKS.pancakeswap}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              style={{ justifyContent: 'center' }}
            >
              {t('nav.buyCta')}
            </a>
          </div>
        </>
      )}
    </>
  );
}
