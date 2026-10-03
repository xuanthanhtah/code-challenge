import { useTranslation } from '../hooks/useTranslation';

export const LanguageToggle = () => {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="lang-toggle" role="group" aria-label="Language selector">
      <button
        type="button"
        className={`lang-toggle__btn ${locale === 'en' ? 'is-active' : ''}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        title="English"
      >
        <span className="lang-toggle__flag" aria-hidden="true">🇬🇧</span>
        <span>EN</span>
      </button>
      <button
        type="button"
        className={`lang-toggle__btn ${locale === 'vi' ? 'is-active' : ''}`}
        onClick={() => setLocale('vi')}
        aria-pressed={locale === 'vi'}
        title="Tiếng Việt"
      >
        <span className="lang-toggle__flag" aria-hidden="true">🇻🇳</span>
        <span>VI</span>
      </button>
    </div>
  );
};
