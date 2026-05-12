import LegalContentPage from '../components/LegalContentPage'
import purchaseTermsLV from '../content/legal/lv/purchase-terms'
import purchaseTermsEN from '../content/legal/lv/purchase-terms_en'
import purchaseTermsRU from '../content/legal/lv/purchase-terms_ru'
import { useLocale } from '../lib/publicI18n.jsx'

const contentByLocale = {
  lv: purchaseTermsLV,
  en: purchaseTermsEN,
  ru: purchaseTermsRU,
}

export default function PirksanasNoteikumi() {
  const { locale, text } = useLocale()
  return <LegalContentPage content={{ ...(contentByLocale[locale] ?? purchaseTermsLV), title: text.legal.titles.purchaseTerms }} />
}
