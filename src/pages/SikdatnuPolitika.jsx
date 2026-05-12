import LegalContentPage from '../components/LegalContentPage'
import cookiesLV from '../content/legal/lv/cookies'
import cookiesEN from '../content/legal/lv/cookiesEN'
import cookiesRU from '../content/legal/lv/cookiesRU'
import { useLocale } from '../lib/publicI18n.jsx'

const contentByLocale = {
  lv: cookiesLV,
  en: cookiesEN,
  ru: cookiesRU,
}

export default function SikdatnuPolitika() {
  const { locale, text } = useLocale()
  return <LegalContentPage content={{ ...(contentByLocale[locale] ?? cookiesLV), title: text.legal.titles.cookies }} />
}
