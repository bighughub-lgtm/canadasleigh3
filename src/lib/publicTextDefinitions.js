import { translations } from '../content/publicTranslations'

export const TEXT_GROUPS = [
  { id: 'common', label_lv: 'Kopīgie teksti' },
  { id: 'header', label_lv: 'Navigācija' },
  { id: 'hero', label_lv: 'Sākuma skats' },
  { id: 'trust_strip', label_lv: 'Uzticamības josla' },
  { id: 'use_cases', label_lv: 'Pielietojums' },
  { id: 'benefits', label_lv: 'Priekšrocības' },
  { id: 'product_overview', label_lv: 'Produktu pārskats' },
  { id: 'apvidus_feature', label_lv: 'Apvidus sadaļa' },
  { id: 'product_catalog', label_lv: 'Produktu katalogs' },
  { id: 'product_details', label_lv: 'Produktu detaļas' },
  { id: 'gallery', label_lv: 'Galerija' },
  { id: 'videos', label_lv: 'Videoklipi' },
  { id: 'order_steps', label_lv: 'Pasūtīšana' },
  { id: 'delivery_payment', label_lv: 'Piegāde un apmaksa' },
  { id: 'about', label_lv: 'Par mums' },
  { id: 'partners', label_lv: 'Partneriem' },
  { id: 'faq', label_lv: 'BUJ' },
  { id: 'contact', label_lv: 'Kontakti' },
  { id: 'footer', label_lv: 'Kājene' },
  { id: 'cookies', label_lv: 'Sīkdatnes' },
  { id: 'legal_ui', label_lv: 'Juridisko lapu saskarne' },
  { id: 'scroll', label_lv: 'Ritināšana' },
]

const GROUP_LABELS = TEXT_GROUPS.reduce((labels, group) => {
  labels[group.id] = group.label_lv
  return labels
}, {})

const TOP_LEVEL_GROUPS = {
  common: 'common',
  header: 'header',
  hero: 'hero',
  trustStrip: 'trust_strip',
  useCases: 'use_cases',
  benefits: 'benefits',
  productOverview: 'product_overview',
  apvidusFeature: 'apvidus_feature',
  productCatalog: 'product_catalog',
  gallery: 'gallery',
  videos: 'videos',
  orderSteps: 'order_steps',
  deliveryPayment: 'delivery_payment',
  about: 'about',
  partners: 'partners',
  faq: 'faq',
  contact: 'contact',
  footer: 'footer',
  legal: 'legal_ui',
  cookies: 'cookies',
  scrollToTop: 'scroll',
}

const SKIPPED_FIELD_NAMES = new Set([
  'href',
  'buyUrl',
  'src',
  'thumb',
  'poster',
  'image',
  'url',
  'video_url',
  'thumbnail_url',
  'thumbnailUrl',
  'id',
  'type',
  'previewTime',
  'price',
  'localeName',
])

const TEXTAREA_FIELD_NAMES = new Set([
  'answer',
  'a',
  'bannerText',
  'body',
  'description',
  'desc',
  'detail',
  'emailBody',
  'intro',
  'lead',
  'note',
  'summary',
  'subtitle',
  'text',
  'whatsappText',
])

const FIELD_LABELS = {
  a: 'Atbilde',
  about: 'Par tekstu',
  acceptAll: 'Poga - pieņemt visu',
  alt: 'Alternatīvais teksts',
  answer: 'Atbilde',
  aria: 'Pieejamības teksts',
  badgeLabel: 'Žetona virsraksts',
  badgeText: 'Žetona teksts',
  bannerAria: 'Sīkdatņu paziņojuma pieejamība',
  bannerText: 'Sīkdatņu paziņojuma teksts',
  bannerTitle: 'Sīkdatņu paziņojuma virsraksts',
  browserVideoUnsupported: 'Video kļūdas teksts',
  button: 'Poga',
  close: 'Aizvērt',
  closeInfo: 'Aizvērt informāciju',
  closeMenu: 'Aizvērt izvēlni',
  contact: 'Kontaktu poga',
  cookiesShort: 'Īsā sīkdatņu saite',
  cookieSettings: 'Sīkdatņu iestatījumi',
  customize: 'Poga - pielāgot',
  deliveryShort: 'Īsā piegādes saite',
  desc: 'Apraksts',
  description: 'Apraksts',
  detail: 'Papildu teksts',
  effectiveFrom: 'Spēkā no',
  emailBody: 'E-pasta teksts',
  essential: 'Poga - tikai nepieciešamās',
  eyebrow: 'Virsraksta etiķete',
  fullInfo: 'Pilnas informācijas poga',
  fullscreen: 'Pilnekrāna teksts',
  heading: 'Virsraksts',
  imageAlt: 'Attēla alternatīvais teksts',
  intro: 'Ievadteksts',
  label: 'Etiķete',
  languageMenu: 'Valodas izvēlnes teksts',
  learnMore: 'Uzzināt vairāk',
  line1: 'Virsraksta 1. rinda',
  line2: 'Virsraksta 2. rinda',
  mainNavigation: 'Galvenās navigācijas teksts',
  madeInSweden: 'Ražots Zviedrijā teksts',
  mediaLabel: 'Mediju etiķete',
  mobileLanguageGroup: 'Mobilās valodas izvēles teksts',
  name: 'Nosaukums',
  navigationMenu: 'Navigācijas izvēlnes teksts',
  note: 'Piezīme',
  officialBaltics: 'Baltijas pārstāvja teksts',
  openMenu: 'Atvērt izvēlni',
  optional: 'Pēc izvēles teksts',
  pause: 'Pauze',
  photo: 'Foto teksts',
  play: 'Atskaņot',
  policyLink: 'Politikas saites teksts',
  primaryCta: 'Galvenā poga',
  q: 'Jautājums',
  question: 'Jautājums',
  required: 'Obligāti teksts',
  save: 'Poga - saglabāt',
  scroll: 'Ritināšanas teksts',
  secondaryCta: 'Sekundārā poga',
  slogan: 'Sauklis',
  spec: 'Specifikācija',
  sub: 'Papildu teksts',
  subtitle: 'Apakšvirsraksts',
  tabLabel: 'Cilnes teksts',
  text: 'Teksts',
  title: 'Virsraksts',
  unmute: 'Ieslēgt skaņu',
  value: 'Vērtība',
  video: 'Video teksts',
  whatsappText: 'WhatsApp teksts',
}

const CONTAINER_LABELS = {
  analytics: 'Analītika',
  bottom: 'Apakšējā josla',
  buttons: 'Pogas',
  cards: 'Kartīte',
  cases: 'Pielietojums',
  company: 'Uzņēmums',
  details: 'Detaļas',
  fallbackImages: 'Rezerves attēls',
  fallbackVideos: 'Rezerves video',
  features: 'Īpašība',
  items: 'Ieraksts',
  links: 'Saite',
  marketing: 'Mārketings',
  media: 'Medijs',
  models: 'Modelis',
  nav: 'Navigācija',
  necessary: 'Nepieciešamās sīkdatnes',
  options: 'Sīkdatņu opcija',
  products: 'Produkts',
  specs: 'Parametrs',
  steps: 'Solis',
  titles: 'Nosaukums',
}

function isNumericSegment(segment) {
  return /^\d+$/.test(segment)
}

function getPathValue(source, segments) {
  return segments.reduce((value, segment) => {
    if (value == null) return undefined
    return value[isNumericSegment(segment) ? Number(segment) : segment]
  }, source)
}

function getGroupId(segments) {
  if (segments[0] === 'productCatalog' && segments.includes('details')) {
    return 'product_details'
  }

  return TOP_LEVEL_GROUPS[segments[0]] ?? 'common'
}

function looksLikeTechnicalValue(value) {
  const normalized = value.trim()

  return (
    normalized.startsWith('/') ||
    normalized.startsWith('#') ||
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('mailto:') ||
    normalized.startsWith('tel:') ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ||
    /^\+?\d[\d\s()-]{6,}$/.test(normalized)
  )
}

function shouldSkipPath(segments, value) {
  const last = segments[segments.length - 1]
  if (SKIPPED_FIELD_NAMES.has(last)) return true
  if (typeof value !== 'string') return true
  if (looksLikeTechnicalValue(value)) return true
  if (segments.includes('contactLinks')) return true

  return false
}

function humanizeSegment(segment) {
  return FIELD_LABELS[segment] ?? CONTAINER_LABELS[segment] ?? segment
}

function getPathContext(segments) {
  const parts = []

  for (let index = 1; index < segments.length - 1; index += 1) {
    const segment = segments[index]
    const next = segments[index + 1]

    if (isNumericSegment(segment)) continue

    if (isNumericSegment(next)) {
      parts.push(`${humanizeSegment(segment)} ${Number(next) + 1}`)
      index += 1
    } else if (CONTAINER_LABELS[segment]) {
      parts.push(CONTAINER_LABELS[segment])
    }
  }

  const last = segments[segments.length - 1]
  parts.push(humanizeSegment(last))

  return parts.filter(Boolean).join(' / ')
}

function getInputType(segments, defaults) {
  const last = segments[segments.length - 1]
  const longestDefault = defaults.reduce((length, value) => {
    return Math.max(length, typeof value === 'string' ? value.length : 0)
  }, 0)

  if (TEXTAREA_FIELD_NAMES.has(last) || longestDefault > 90) {
    return 'textarea'
  }

  return 'text'
}

function flattenStringLeaves(value, path, results) {
  if (typeof value === 'function') return

  if (typeof value === 'string') {
    const segments = path.split('.')
    if (shouldSkipPath(segments, value)) return

    const default_lv = value
    const default_en = getPathValue(translations.en, segments)
    const default_ru = getPathValue(translations.ru, segments)

    const defaults = [default_lv, default_en, default_ru]
    if (!defaults.some((item) => typeof item === 'string' && item.length > 0)) return

    const group_id = getGroupId(segments)
    const groupLabel = GROUP_LABELS[group_id] ?? 'Teksti'
    const labelContext = getPathContext(segments)

    results.push({
      key: path,
      group_id,
      label_lv: `${groupLabel}: ${labelContext}`,
      description_lv:
        'Publiskās vietnes teksts. Ja lauks ir atjaunots uz noklusējumu, vietne izmanto kodā esošo tulkojumu.',
      input_type: getInputType(segments, defaults),
      default_lv: typeof default_lv === 'string' ? default_lv : '',
      default_en: typeof default_en === 'string' ? default_en : '',
      default_ru: typeof default_ru === 'string' ? default_ru : '',
    })
    return
  }

  if (!value || typeof value !== 'object') return

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenStringLeaves(item, path ? `${path}.${index}` : String(index), results)
    })
    return
  }

  Object.entries(value).forEach(([key, child]) => {
    flattenStringLeaves(child, path ? `${path}.${key}` : key, results)
  })
}

function buildPublicTextDefinitions() {
  const results = []
  flattenStringLeaves(translations.lv, '', results)
  return results.sort((a, b) => {
    const groupDiff = TEXT_GROUPS.findIndex((group) => group.id === a.group_id)
      - TEXT_GROUPS.findIndex((group) => group.id === b.group_id)

    if (groupDiff !== 0) return groupDiff
    return a.key.localeCompare(b.key)
  })
}

export const PUBLIC_TEXT_DEFINITIONS = buildPublicTextDefinitions()

export function getPublicTextDefinitions() {
  return PUBLIC_TEXT_DEFINITIONS
}

export function getTextGroup(groupId) {
  return TEXT_GROUPS.find((group) => group.id === groupId)
}
