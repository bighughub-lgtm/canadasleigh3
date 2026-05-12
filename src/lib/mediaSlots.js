export const mediaSlotGroups = [
  {
    groupId: 'page_sections',
    groupLabel_lv: 'Lapas sadaļas',
    description_lv: 'Fiksēti attēli galvenajām publiskās lapas sadaļām. Katram slotam ir viens aktīvs attēls.',
    type: 'single',
    slots: [
      {
        id: 'hero',
        label_lv: 'Sākuma skats',
        description_lv: 'Hero sadaļas fona attēls un video postera attēls.',
        fallbackUrl: '/statiska bilde.jpg',
        alt_lv: 'Canada apvidus ragavas sākuma skatā',
        usage_lv: 'Plašs horizontāls attēls sākuma ekrānam.',
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
    ],
  },
  {
    groupId: 'product_overview',
    groupLabel_lv: 'Produktu pārskats',
    description_lv: 'Trīs attēli ProductOverview sadaļas modeļu pārslēdzējam.',
    type: 'single',
    slots: [
      {
        id: 'product_overview_compact',
        label_lv: 'Produkta pārskats — COMPACT',
        description_lv: 'COMPACT attēls produkta pārskata modeļu pārslēdzējā.',
        fallbackUrl: '/mazasragavas.jpg',
        alt_lv: 'CANADA COMPACT ragavas produkta pārskatā',
        usage_lv: 'Attēls uz tumša produkta paneļa.',
      },
      {
        id: 'product_overview_classic',
        label_lv: 'Produkta pārskats — CLASSIC',
        description_lv: 'CLASSIC attēls produkta pārskata modeļu pārslēdzējā.',
        fallbackUrl: '/canadaplukan.jpg',
        alt_lv: 'CANADA CLASSIC ragavas produkta pārskatā',
        usage_lv: 'Attēls uz tumša produkta paneļa.',
      },
      {
        id: 'product_overview_classic_open',
        label_lv: 'Produkta pārskats — CLASSIC OPEN',
        description_lv: 'CLASSIC OPEN attēls produkta pārskata modeļu pārslēdzējā.',
        fallbackUrl: '/ragavasbig.png',
        alt_lv: 'CANADA CLASSIC OPEN ragavas produkta pārskatā',
        usage_lv: 'Attēls uz tumša produkta paneļa.',
      },
    ],
  },
  {
    groupId: 'product_images',
    groupLabel_lv: 'Produktu kartītes',
    description_lv: 'Fiksēti produktu attēli katalogā redzamajām produktu kartītēm.',
    type: 'single',
    slots: [
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
        description_lv: 'CLASSIC produkta kartītes attēls.',
        fallbackUrl: '/canadaplukan.jpg',
        alt_lv: 'CANADA CLASSIC ragavas',
        usage_lv: 'Tīrs produkta attēls.',
      },
      {
        id: 'product_classic_open',
        label_lv: 'CLASSIC OPEN produkts',
        description_lv: 'CLASSIC OPEN produkta kartītes attēls.',
        fallbackUrl: '/ragavasbig.png',
        alt_lv: 'CANADA CLASSIC OPEN ragavas',
        usage_lv: 'Tīrs produkta attēls.',
      },
    ],
  },
  {
    groupId: 'product_galleries',
    groupLabel_lv: 'Produktu galerijas',
    description_lv: 'Attēlu rindas produktu detalizētajās galerijās. Šeit drīkst būt vairāki attēli ar secību.',
    type: 'gallery',
    slots: [
      {
        id: 'product_compact_gallery',
        label_lv: 'COMPACT detalizētā galerija',
        description_lv: 'Attēli COMPACT produkta pilnās informācijas blokā.',
        fallbackUrl: '/sm1.jpeg',
        alt_lv: 'TERRAINSLEIGH CANADA COMPACT ragavas',
        usage_lv: 'Produkta lietošanas un detaļu kadri.',
      },
      {
        id: 'product_classic_gallery',
        label_lv: 'CLASSIC detalizētā galerija',
        description_lv: 'Attēli CLASSIC produkta pilnās informācijas blokā.',
        fallbackUrl: '/b1.jpeg',
        alt_lv: 'TERRAINSLEIGH CANADA CLASSIC ragavas',
        usage_lv: 'Produkta lietošanas un detaļu kadri.',
      },
      {
        id: 'product_classic_open_gallery',
        label_lv: 'CLASSIC OPEN detalizētā galerija',
        description_lv: 'Attēli CLASSIC OPEN produkta pilnās informācijas blokā.',
        fallbackUrl: '/a1.jpeg',
        alt_lv: 'TERRAINSLEIGH CANADA CLASSIC OPEN ragavas',
        usage_lv: 'Produkta lietošanas un detaļu kadri.',
      },
    ],
  },
  {
    groupId: 'main_gallery',
    groupLabel_lv: 'Galvenā galerija',
    description_lv: 'Publiskās lapas lielā galerija. Tā izmanto daudzus aktīvus attēlus ar secību.',
    type: 'gallery',
    slots: [
      {
        id: 'gallery',
        label_lv: 'Publiskā galerija',
        description_lv: 'Visi attēli publiskajā galerijas pārlūkā.',
        fallbackUrl: '/DSC06432.jpg',
        alt_lv: 'Canada Pulkan ragavas reālā lietošanā',
        usage_lv: 'Reāli lietošanas kadri no publiskās galerijas.',
      },
    ],
  },
]

export const editableImageSlots = mediaSlotGroups
  .filter((group) => group.type === 'single')
  .flatMap((group) => group.slots.map((slot) => ({ ...slot, groupId: group.groupId, groupLabel_lv: group.groupLabel_lv })))

export const editableImageSlotIds = editableImageSlots.map((slot) => slot.id)

export const editableGallerySections = mediaSlotGroups
  .filter((group) => group.type === 'gallery')
  .flatMap((group) => group.slots.map((slot) => ({ ...slot, groupId: group.groupId, groupLabel_lv: group.groupLabel_lv })))

export const productGallerySections = editableGallerySections.filter((slot) => slot.groupId === 'product_galleries')

export function getImageSlotDefinition(slotId) {
  return editableImageSlots.find((slot) => slot.id === slotId) ?? null
}

export function getGallerySectionDefinition(sectionId) {
  return editableGallerySections.find((slot) => slot.id === sectionId) ?? null
}
