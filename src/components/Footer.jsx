import { useLang } from '../i18n.jsx';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer>
      <div className="container">
        <div
          className="footer-brand"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
        >
          CHONGYA <span className="cn" lang="zh-Hans">冲鸭</span>
        </div>
        <div>&copy; {new Date().getFullYear()} CHONGYA. {t('footer.copyright')}</div>
      </div>
    </footer>
  );
}
