export const editableImageSlots = [
  {
    id: 'hero',
    label_lv: 'Sākuma skats',
    description_lv: 'Hero sadaļas fona attēls un video postera attēls.',
    fallbackUrl: '/statiska bilde.jpg',
    alt_lv: 'Canada apvidus ragavas sākuma skatā',
    usage_lv: 'Plašs horizontāls attēls.',
  },
  {
    id: 'benefits',
    label_lv: 'Priekšrocības',
    description_lv: 'Attēls blakus priekšrocību sarakstam.',
    fallbackUrl: '/KRJ01720.jpg',
    alt_lv: 'Canada Pulkan apvidus ragavas lietošanā',
    usage_lv: 'Vertikāls vai 4:3 lietošanas kadrs.',
  },
  {
    id: 'product_overview',
    label_lv: 'Produkta pārskats',
    description_lv: 'Produkta pārskata noklusējuma modeļa attēls.',
    fallbackUrl: '/mazasragavas.jpg',
    alt_lv: 'CANADA COMPACT ragavas produkta pārskatā',
    usage_lv: 'Attēls uz tumša produkta paneļa.',
  },
  {
    id: 'product_compact',
    label_lv: 'COMPACT produkts',
    description_lv: 'COMPACT produkta kartītes attēls.',
    fallbackUrl: '/mazasragavas.jpg',
    alt_lv: 'CANADA COMPACT ragavas',
    usage_lv: 'Tīrs produkta attēls.',
  },
  {
    id: 'product_classic',
    label_lv: 'CLASSIC produkts',
    description_lv: 'CLASSIC produkta kartītes un pārskata attēls.',
    fallbackUrl: '/canadaplukan.jpg',
    alt_lv: 'CANADA CLASSIC ragavas',
    usage_lv: 'Tīrs produkta attēls.',
  },
  {
    id: 'product_classic_open',
    label_lv: 'CLASSIC OPEN produkts',
    description_lv: 'CLASSIC OPEN produkta kartītes un pārskata attēls.',
    fallbackUrl: '/ragavasbig.png',
    alt_lv: 'CANADA CLASSIC OPEN ragavas',
    usage_lv: 'Tīrs produkta attēls.',
  },
  {
    id: 'apvidus_feature',
    label_lv: 'Apvidus sadaļa',
    description_lv: 'Attēls gaišajā apvidus kamanu sadaļā.',
    fallbackUrl: '/apvidus kamanas.png',
    alt_lv: 'Apvidus kamanas',
    usage_lv: 'PNG vai attēls, kas labi strādā uz gaiša fona.',
  },
  {
    id: 'about',
    label_lv: 'Par mums',
    description_lv: 'Attēls VS Home SIA un pārstāvniecības sadaļā.',
    fallbackUrl: '/KRJ02427.jpg',
    alt_lv: 'Canada Pulkan Baltijā',
    usage_lv: 'Reāls lietošanas vai zīmola uzticamības kadrs.',
  },
  {
    id: 'contact',
    label_lv: 'Kontakti',
    description_lv: 'Attēls kontaktu sadaļas labajā pusē.',
    fallbackUrl: '/KRJ02364.jpg',
    alt_lv: 'Canada Pulkan apvidus ragavas',
    usage_lv: 'Horizontāls vai 4:3 lietošanas kadrs.',
  },
  {
    id: 'partners',
    label_lv: 'Partneriem',
    description_lv: 'Partneru sadarbības sadaļas attēls.',
    fallbackUrl: '/PARTNERISSS.jpg',
    alt_lv: 'Canada ragavas praktiskas lietošanas vidē',
    usage_lv: 'Reāls praktiskas lietošanas kadrs.',
  },
]

export const editableImageSlotIds = editableImageSlots.map((slot) => slot.id)

export function getImageSlotDefinition(slotId) {
  return editableImageSlots.find((slot) => slot.id === slotId) ?? null
}
