import './ProductCatalog.css'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const compactMedia = [
  {
    id: 'sm1',
    type: 'image',
    src: '/sm1.jpeg',
    thumb: '/sm1.jpeg',
    alt: 'TERRAINSLEIGH CANADA COMPACT ragavas no sāna',
    label: 'Kompaktais modelis darbībā',
  },
  {
    id: 'sm2',
    type: 'image',
    src: '/sm2.jpeg',
    thumb: '/sm2.jpeg',
    alt: 'TERRAINSLEIGH CANADA COMPACT ragavas mežā',
    label: 'Forma un dziļums smagai vilkšanai',
  },
  {
    id: 'sm3',
    type: 'image',
    src: '/sm3.jpeg',
    thumb: '/sm3.jpeg',
    alt: 'TERRAINSLEIGH CANADA COMPACT ragavas tuvplānā',
    label: 'Kompakts profils ikdienas lietošanai',
  },
  {
    id: 'sm4',
    type: 'image',
    src: '/sm4.jpeg',
    thumb: '/sm4.jpeg',
    alt: 'TERRAINSLEIGH CANADA COMPACT ragavas ar aprīkojumu',
    label: 'Praktiska kravnesība medībām un makšķerēšanai',
  },
  {
    id: 'sm5',
    type: 'image',
    src: '/sm5.jpeg',
    thumb: '/sm5.jpeg',
    alt: 'TERRAINSLEIGH CANADA COMPACT ragavas uz zemes',
    label: 'Viegli kopjams HD materiāls',
  },
  {
    id: 'sm6',
    type: 'image',
    src: '/sm6.jpg',
    thumb: '/sm6.jpg',
    alt: 'TERRAINSLEIGH CANADA COMPACT ragavas transportēšanā',
    label: 'Elastība sarežģītā apvidū',
  },
  {
    id: 'sm7',
    type: 'image',
    src: '/sm7.jpg',
    thumb: '/sm7.jpg',
    alt: 'TERRAINSLEIGH CANADA COMPACT ragavas no augšas',
    label: 'Kompakts izmērs ar pilnvērtīgu lietderību',
  },
  {
    id: 'sm8',
    type: 'image',
    src: '/sm8.jpg',
    thumb: '/sm8.jpg',
    alt: 'TERRAINSLEIGH CANADA COMPACT ragavas lietošanā',
    label: 'Piemērotas bezceļu darbam Baltijā',
  },
  {
    id: 'compact-video',
    type: 'video',
    src: '/small vid.mp4',
    thumb: '/sm4.jpeg',
    poster: '/sm4.jpeg',
    alt: 'TERRAINSLEIGH CANADA COMPACT video',
    label: 'Video: ragavu kustība un lietojums apvidū',
  },
]

const classicMedia = [
  {
    id: 'b1',
    type: 'image',
    src: '/b1.jpeg',
    thumb: '/b1.jpeg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC ragavas darbībā',
    label: 'Pilnā izmēra korpuss smagām slodzēm',
  },
  {
    id: 'b2',
    type: 'image',
    src: '/b2.jpeg',
    thumb: '/b2.jpeg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC ragavas meža apvidū',
    label: 'Stabila vilkšana sarežģītā apvidū',
  },
  {
    id: 'b3',
    type: 'image',
    src: '/b3.jpg',
    thumb: '/b3.jpg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC ragavas tuvplānā',
    label: 'Izturīgs 8 mm HD materiāls',
  },
  {
    id: 'b4',
    type: 'image',
    src: '/b4.jpeg',
    thumb: '/b4.jpeg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC ragavas ar kravu',
    label: 'Piemērotas lielam medījumam un aprīkojumam',
  },
  {
    id: 'b5',
    type: 'image',
    src: '/b5.jpeg',
    thumb: '/b5.jpeg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC ragavas no sāna',
    label: 'Elastība starp celmiem un akmeņiem',
  },
  {
    id: 'b6',
    type: 'image',
    src: '/b6.jpeg',
    thumb: '/b6.jpeg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC ragavas izmēra salīdzinājumā',
    label: 'Papildu ietilpība smagam transportam',
  },
  {
    id: 'b7',
    type: 'image',
    src: '/b7.jpg',
    thumb: '/b7.jpg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC ragavas bezceļu apstākļos',
    label: 'Modelis garākiem maršrutiem Baltijā',
  },
]

const classicOpenMedia = [
  {
    id: 'a1',
    type: 'image',
    src: '/a1.jpeg',
    thumb: '/a1.jpeg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC OPEN ragavas darbībā',
    label: 'Atvērtais modelis ar plašu kravēšanas laukumu',
  },
  {
    id: 'a2',
    type: 'image',
    src: '/a2.jpeg',
    thumb: '/a2.jpeg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC OPEN ragavas bezceļu apstākļos',
    label: 'Viegla piekļuve aprīkojumam un medījumam',
  },
  {
    id: 'a3',
    type: 'image',
    src: '/a3.jpeg',
    thumb: '/a3.jpeg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC OPEN ragavas tuvplānā',
    label: 'Saderīgas ar Xtension pagarinājumu līdz 3,5 m',
  },
  {
    id: 'a4',
    type: 'image',
    src: '/a4.jpeg',
    thumb: '/a4.jpeg',
    alt: 'TERRAINSLEIGH CANADA CLASSIC OPEN ragavas ar kravu',
    label: 'Pilna izmēra risinājums smagām kravām Baltijā',
  },
]

const products = [
  {
    id: 'compact',
    name: 'CANADA COMPACT APVIDUS RAGAVAS',
    subtitle: '1.40 × 0.65 m · 5 kg',
    image: '/mazasragavas.jpg',
    price: '€260.00',
    availability: 'Ir uz vietas',
    tag: 'Kompakts',
    tagFeatured: true,
    summary:
      'Viegls un uzticams modelis medniekiem un ziemas makšķerniekiem, kuriem vajadzīgas kompaktas un izturīgas ragavas bezceļu apstākļiem.',
    features: [
      'Ražots Zviedrijā',
      '8 mm HD polietilēns',
      'Viegli kopjamas',
      'Piemērotas vidēja un neliela, un vidēja izmēra medījumiem un aprīkojumam',
    ],
    buyUrl: 'https://buy.stripe.com/8x2eV7cZx8dAfCxaJy6Vq00',
    expandable: true,
    media: compactMedia,
    details: {
      intro:
        'CANADA COMPACT APVIDUS RAGAVAS ir kompakta izmēra mednieku un ziemas makšķernieku ragavas medījumu un aprīkojuma pārvietošanai bezceļa apvidos, kur vajadzīgs ātrums atpūtai, pastāvot un vienkāršā kopšanā. Tās ir gadiem testētas Skandināvijas kalnainos apvidos. VS Home SIA ir officiālais ražotāja pārstāvis Baltijā.',
      specs: [
        { label: 'Izmēri', value: 'Garums 1.40 m × platums 0.65 m' },
        { label: 'Svars', value: '5 kg' },
        { label: 'Materiāls', value: '8 mm HD polietilēns' },
        { label: 'Kopšana', value: 'Viegli kopjamas ar ūdeni' },
        { label: 'Ražošana', value: 'Ražots Zviedrijā' },
      ],
      useCases: [
        'Piemērotas medībām, makšķerēšanai, lauksaimniecības darbiem, ekspedīcijām un mežistrādei.',
        'Ragavāas perfekti piemērotas  vidēja un maza izmēra medījumu pārvietošanai bezceļa apstākļos jebkurā gadalaikā, ieskaitot brieža govi, jaunu briežu bulli, alņa teļu, brieža teļu, mežacūku, stirnu.',
        'Ērti pārvadāt medījumus, tos nesasmērējot, kā arī malku, lauksaimniecības un citu smagu aprīkojumu.',
      ],
      importantTitle: 'Svarīga piezīme',
      importantNote:
        'Ragavas nav vēlams vilkt pa grants jeb asfalta ceļiem. Ja šo nosacījumu ievēro, tās ir praktiski nenolietojamas un saglabā savu elastību un izturību arī pie ļoti smagas slodzes.',
      deliveryTitle: 'Piegādes piezīme',
      deliveryNote:
        'Cenā nav ierēķināta piegāde. Lūdzu, sazinieties ar mums, lai noskaidrotu piegādes izmaksas un piemērotāko saņemšanas variantu.',
      footerNote:
        'Pateicoties īpaši izstrādātam dizainam un materiāla elastībai, ragavas izlokās starp kokiem, celmiem un akmeņiem, nevis plaisā vai lūst.',
    },
  },
  {
    id: 'classic',
    name: 'CANADA CLASSIC APVIDUS RAGAVAS',
    subtitle: '2.33 × 0.85 m · 14 kg',
    image: '/canadaplukan.jpg',
    price: '€550.00',
    availability: 'Ir uz vietas',
    tag: 'Lielākai slodzei',
    tagFeatured: false,
    summary:
      'Pilna izmēra modelis ar aizmugurējo bortu lieliem medījumiem un smagam aprīkojumam, kad vajadzīga maksimāla kravnesība, lokanība un stabila vilkšana bezceļu apstākļos.',
    features: [
      'Ražots Zviedrijā',
      '8 mm HD polietilēns',
      'Vienlaicīgi līdz 2 lieliem alņiem',
      'Piemērots liela izmēra medījumiem, aprīkojumam un beramām kravām',
    ],
    buyUrl: 'https://buy.stripe.com/14A3cpgbJ8dA8a5cRG6Vq01',
    expandable: true,
    media: classicMedia,
    details: {
      intro:
        'CANADA CLASSIC APVIDUS RAGAVAS ir pilna izmēra modelis smagumu transportēšanai bezceļu apstākļos, kad svarīga ir maksimāla praktiska ekspozīcija. Modelis ir gadiem testēts Skandināvijas kalnainos un akmeņainos apvidos, un tas saglabā to pašu materiāla elastību un triecienizturību kā pārējās Canada Pulkan ragavas.',
      specs: [
        { label: 'Izmēri', value: 'Garums 2.33 m × platums 0.85 m' },
        { label: 'Svars', value: '14 kg' },
        { label: 'Materiāls', value: '8 mm HD polietilēns' },
        { label: 'Kopšana', value: 'Viegli kopjamas un piemērotas intensīvai lietošanai' },
        { label: 'Ražošana', value: 'Ražots Zviedrijā' },
      ],
      useCases: [
        'Kamanās var vilkt vienlaicīgi 2 lielus alņus, 2 brieža buļļus vai 3 brieža govis.',
        'Ērti pārvaadāt medījumus, tos nesasmērējot, kā arī lauksaimniecības un citu smagu aprīkojumu un beramas kravas.',
        'Piemērotas medībām, lauksaimniecības darbiem, ekspedīcijām, mežistrādei.',
      ],
      importantTitle: 'Svarīga piezīme',
      importantNote:
        'Ragavas nav vēlams vilkt pa grants jeb asfalta ceļiem. Ja šo nosacījumu ievēro, tās ir praktiski nenolietojamas un saglabā savu elastību un izturību arī pie ļoti smagas slodzes.',
      deliveryTitle: 'Piegādes / pārstāvja piezīme',
      deliveryNote:
        'Cenā nav ierēķināta piegāde. VS Home SIA ir oficiālais ražotāja pārstāvis Baltijas valstīs un nodrošina konsultāciju par piemērotāko modeli un piegādes risinājumu.',
      footerNote:
        'Pilnā izmēra korpuss ļauj stabili vilkt ļoti lielas slodzes, saglabājot materiāla elastību starp kokiem, celmiem un akmeņiem.',
    },
  },
  {
    id: 'classic-open',
    name: 'CANADA CLASSIC OPEN APVIDUS RAGAVAS',
    subtitle: '2.33 × 0.85 m · 14 kg',
    image: '/ragavasbig.png',
    price: '€550.00',
    availability: 'Ir uz vietas',
    tag: 'Atvērts dizains',
    tagFeatured: false,
    summary:
      'Pilna izmēra modelis bez aizmugurējā borta lieliem medījumiem un apjomīgām kravām, saglabājot to pašu bezceļu izturību, lokanību un vilkšanas kvalitāti.',
    features: [
      'Ražots Zviedrijā',
      'Bez aizmugurējā borta',
      '8 mm HD polietilēns',
      'Piemērots liela izmēra medījumiem, aprīkojumam un baļķu vilkšanai',
    ],
    buyUrl: 'https://buy.stripe.com/cNi5kxcZx0L88a5dVK6Vq02',
    expandable: true,
    media: classicOpenMedia,
    details: {
      intro:
        'CANADA CLASSIC OPEN APVIDUS RAGAVAS ir pilna izmēra modelis bez aizmugurējā borta smagumu transportēšanai bezceļu apstākļos. Modelis ir gadiem testēts Skandināvijas kalnainajos un akmeņainajos apvidos, un tas saglabā to pašu materiāla elastību, lokanību un triecienizturību kā pārējās Canada apvidus ragavas.',
      specs: [
        { label: 'Izmēri', value: 'Garums 2.33 m × platums 0.85 m' },
        { label: 'Svars', value: '14 kg' },
        { label: 'Materiāls', value: '8 mm HD polietilēns' },
        { label: 'Kopšana', value: 'Viegli kopjamas un piemērotas intensīvai lietošanai' },
        { label: 'Ražošana', value: 'Ražots Zviedrijā' },
      ],
      useCases: [
        'Kamanās var vilkt vienlaicīgi 2 lielus alņus, 2 brieža buļļus vai 3 brieža govis.',
        'Tajās ir ērti pārvadāt smagus medījumus, tos nesasmērējot, kā arī baļķus, lauksaimniecības un citu smagu aprīkojumu.',
        'Piemērotas medībām, makšķerēšanai, lauksaimniecības darbiem, ekspedīcijām un mežistrādei.',
      ],
      extraPanels: [
        {
          title: 'Pārstāvja piezīme',
          content:
            'VS Home SIA ir oficiālais ražotāja pārstāvis Baltijas valstīs un nodrošina konsultāciju par piemērotāko modeli un piegādes risinājumu.',
        },
      ],
      importantTitle: 'Svarīga piezīme',
      importantNote:
        'Ragavas nav vēlams vilkt pa grants ceļiem. Ja šo nosacījumu ievēro, tās ir praktiski nenolietojamas un saglabā savu elastību arī pie ļoti smagas slodzes.',
      deliveryTitle: 'Piegādes piezīme',
      deliveryNote:
        'Cenā nav ierēķināta piegāde. Lūdzu, sazinieties ar mums, lai noskaidrotu piegādes izmaksas un piemērotāko saņemšanas variantu.',
      footerNote:
        'Atvērtais korpuss ļauj ērtāk iekraut lielu medījumu un aprīkojumu, vienlaikus saglabājot izturību starp kokiem, celmiem un akmeņiem.',
    },
  },
]

const initialActiveMedia = Object.fromEntries(
  products
    .filter((product) => product.media?.length)
    .map((product) => [product.id, product.media[0].id])
)

const expandTransition = {
  duration: 0.3,
  ease: [0.22, 0.61, 0.36, 1],
}

function getMediaCountLabel(media) {
  const imageCount = media.filter((item) => item.type === 'image').length
  const videoCount = media.filter((item) => item.type === 'video').length

  if (videoCount === 0) {
    return `${imageCount} foto`
  }

  return `${imageCount} foto + ${videoCount} video`
}

function ProductMediaViewer({ product, activeMediaId, onSelect }) {
  const activeMedia =
    product.media.find((item) => item.id === activeMediaId) ?? product.media[0]

  return (
    <aside className="catalog-media-viewer">
      <div className="catalog-media-stage">
        {activeMedia.type === 'video' ? (
          <video
            key={activeMedia.id}
            controls
            playsInline
            preload="metadata"
            poster={activeMedia.poster}
          >
            <source src={activeMedia.src} type="video/mp4" />
            Jūsu pārlūks neatbalsta video atskaņošanu.
          </video>
        ) : (
          <img
            key={activeMedia.id}
            src={activeMedia.src}
            alt={activeMedia.alt}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <div className="catalog-media-meta">
        <div>
          <span className="catalog-detail-label">
            {activeMedia.type === 'video' ? 'Video' : 'Foto'}
          </span>
          <p>{activeMedia.label}</p>
        </div>
        <span className="catalog-media-count">{getMediaCountLabel(product.media)}</span>
      </div>

      <div className="catalog-media-thumbnails" role="list" aria-label={`${product.name} mediji`}>
        {product.media.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`catalog-thumb${activeMedia.id === item.id ? ' catalog-thumb--active' : ''}`}
            onClick={() => onSelect(item.id)}
            aria-pressed={activeMedia.id === item.id}
          >
            <img
              src={item.thumb ?? item.poster ?? item.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            {item.type === 'video' ? (
              <span className="catalog-thumb-badge">Video</span>
            ) : null}
          </button>
        ))}
      </div>
    </aside>
  )
}

function ExpandedProductDetails({ product, activeMediaId, onSelect }) {
  return (
    <motion.div
      className="catalog-expanded"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={expandTransition}
    >
      <div className="catalog-expanded-inner">
        <div className="catalog-expanded-copy">
          <section className="catalog-intro-card">
            <span className="catalog-detail-label">Īss ievads</span>
            <p>{product.details.intro}</p>
          </section>

          <div className="catalog-detail-grid">
            <section className="catalog-detail-panel">
              <h4>Tehniskā specifikācija</h4>
              <dl className="catalog-spec-list">
                {product.details.specs.map((spec) => (
                  <div key={spec.label} className="catalog-spec-line">
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="catalog-detail-panel">
              <h4>Pielietojums</h4>
              <ul className="catalog-detail-list">
                {product.details.useCases.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="catalog-detail-panel">
              <h4>{product.details.importantTitle}</h4>
              <p>{product.details.importantNote}</p>
            </section>

            <section className="catalog-detail-panel">
              <h4>{product.details.deliveryTitle}</h4>
              <p>{product.details.deliveryNote}</p>
            </section>

            {product.details.extraPanels?.map((panel) => (
              <section key={panel.title} className="catalog-detail-panel">
                <h4>{panel.title}</h4>
                <p>{panel.content}</p>
              </section>
            ))}
          </div>

          <div className="catalog-expanded-footer">
            <p>{product.details.footerNote}</p>
            <a
              href={product.buyUrl}
              className="catalog-action-btn catalog-action-btn--primary catalog-action-btn--compact"
            >
              Pirkt
            </a>
          </div>
        </div>

        <ProductMediaViewer
          product={product}
          activeMediaId={activeMediaId}
          onSelect={onSelect}
        />
      </div>
    </motion.div>
  )
}

export default function ProductCatalog() {
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [activeMediaByProduct, setActiveMediaByProduct] = useState(initialActiveMedia)

  return (
    <section className="section product-catalog" id="produkti">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-label">Katalogs</span>
          <h2 className="section-title">Izvēlieties savu modeli</h2>
          <p className="section-subtitle">
            Trīs Zviedrijā ražoti modeļi dažādām vajadzībām. Visi paredzēti smagumu
            transportēšanai bezceļu apstākļos un pieejami ar konsultāciju no oficiālā
            pārstāvja Baltijā.
          </p>
        </motion.div>

        <div className="catalog-grid">
          {products.map((product, index) => {
            const isExpanded = product.expandable && expandedProduct === product.id

            return (
              <motion.article
                key={product.id}
                className={`catalog-card${product.tagFeatured ? ' catalog-card--featured' : ''}${isExpanded ? ' catalog-card--expanded' : ''}`}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
              >
                <span className={`catalog-tag${product.tagFeatured ? ' catalog-tag--gold' : ''}`}>
                  {product.tag}
                </span>

                <div className="catalog-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="catalog-body">
                  <div className="catalog-copy">
                    <h3 className="catalog-name">{product.name}</h3>
                    <p className="catalog-subtitle">{product.subtitle}</p>

                    <div className="catalog-price-row">
                      <div className="catalog-price">{product.price}</div>
                      {product.availability ? (
                        <span className="catalog-availability">{product.availability}</span>
                      ) : null}
                    </div>

                    <p className="catalog-summary">{product.summary}</p>

                    <ul className="catalog-features">
                      {product.features.map((feature) => (
                        <li key={feature}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M2.5 7l3 3 6-6"
                              stroke="var(--gold)"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`catalog-actions${product.expandable ? ' catalog-actions--dual' : ''}`}>
                    <a
                      href={product.buyUrl}
                      className="catalog-action-btn catalog-action-btn--primary"
                    >
                      Pirkt
                    </a>

                    {product.expandable ? (
                      <button
                        type="button"
                        className="catalog-action-btn catalog-action-btn--secondary"
                        onClick={() =>
                          setExpandedProduct((current) =>
                            current === product.id ? null : product.id
                          )
                        }
                        aria-expanded={isExpanded}
                        aria-controls={`${product.id}-details`}
                      >
                        Pilna informācija
                        <svg
                          className="catalog-action-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : null}
                  </div>

                  {product.expandable ? (
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <div id={`${product.id}-details`}>
                          <ExpandedProductDetails
                            product={product}
                            activeMediaId={activeMediaByProduct[product.id]}
                            onSelect={(mediaId) =>
                              setActiveMediaByProduct((current) => ({
                                ...current,
                                [product.id]: mediaId,
                              }))
                            }
                          />
                        </div>
                      )}
                    </AnimatePresence>
                  ) : null}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
