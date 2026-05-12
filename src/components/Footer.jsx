import { XIcon, TelegramIcon, DiscordIcon, DuckIcon } from '../icons/Icon.jsx';
import { LINKS } from '../config.js';
import { useLang } from '../i18n.jsx';

export default function Footer() {
  const { t } = useLang();
  const socials = [
    { url: LINKS.twitter, icon: <XIcon size={16} />, label: 'X' },
    { url: LINKS.telegram, icon: <TelegramIcon size={18} />, label: 'Telegram' },
    { url: LINKS.discord, icon: <DiscordIcon size={18} />, label: 'Discord' },
  ].filter((s) => s.url);

  return (
    <footer>
      <div className="container">
        <div
          className="footer-brand"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
        >
          <DuckIcon size={26} /> CHONGYA <span className="cn" lang="zh-Hans">冲鸭</span>
        </div>
        {socials.length > 0 && (
          <div className="socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        )}
        <div>&copy; {new Date().getFullYear()} CHONGYA. {t('footer.copyright')}</div>
        <p className="disclaimer">{t('footer.disclaimer')}</p>
      </div>
    </footer>
  );
}
