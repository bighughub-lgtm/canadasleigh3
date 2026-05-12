import LegalContentPage from '../components/LegalContentPage'
import deliveryReturnsLV from '../content/legal/lv/delivery-returns'
import deliveryReturnsEN from '../content/legal/lv/delivery-returns_en'
import deliveryReturnsRU from '../content/legal/lv/delivery-returns_ru'
import { useLocale } from '../lib/publicI18n.jsx'

const contentByLocale = {
  lv: deliveryReturnsLV,
  en: deliveryReturnsEN,
  ru: deliveryReturnsRU,
}

export default function PiegadeAtgriešana() {
  const { locale, text } = useLocale()
  return <LegalContentPage content={{ ...(contentByLocale[locale] ?? deliveryReturnsLV), title: text.legal.titles.deliveryReturns }} />
}
