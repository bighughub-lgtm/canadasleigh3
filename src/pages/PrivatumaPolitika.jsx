import LegalContentPage from '../components/LegalContentPage'
import privacyLV from '../content/legal/lv/privacy'
import privacyEN from '../content/legal/lv/privacy_en'
import privacyRU from '../content/legal/lv/privacy_ru'
import { useLocale } from '../lib/publicI18n.jsx'

const contentByLocale = {
  lv: privacyLV,
  en: privacyEN,
  ru: privacyRU,
}

export default function PrivatumaPolitika() {
  const { locale, text } = useLocale()
  return <LegalContentPage content={{ ...(contentByLocale[locale] ?? privacyLV), title: text.legal.titles.privacy }} />
}
