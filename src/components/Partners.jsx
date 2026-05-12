import './Partners.css'
import { motion } from 'framer-motion'
import { useImageSlot } from '../lib/useImageSlot'

const ACTIVE_LANG = 'LAT'

const EMAIL_LINK = 'mailto:info@canadasleigh.com?subject=Sadarb%C4%ABba%20ar%20Canada&body=Labdien%2C%0A%0AV%C4%93los%20pieteikties%20sadarb%C4%ABbai%20ar%20Canada.%0A%0AUz%C5%86%C4%93mums%20%2F%20organiz%C4%81cija%3A%0AT%C4%81lrunis%3A%0APils%C4%93ta%20%2F%20valsts%3A%0ASadarb%C4%ABbas%20ideja%3A'
const WHATSAPP_LINK = 'https://wa.me/37129206554?text=Labdien%2C%20v%C4%93los%20pieteikties%20sadarb%C4%ABbai%20ar%20Canada.'
const PHONE_LINK = 'tel:+37129206554'

const partnerContent = {
  LAT: {
    eyebrow: 'Sadarbība Baltijā',
    title: 'Kļūsti par Canada sadarbības partneri',
    intro: [
      'Meklējam sadarbības partnerus Latvijā, Lietuvā un Igaunijā, kuri strādā ar medniekiem, makšķerniekiem, lauksaimniekiem, mežsaimniecībām, outdoor inventāru vai bezceļu tehniku.',
      'Ja jums ir veikals, mednieku klubs, aktīva kopiena, klientu bāze vai pieredze šajā nozarē — sazinieties ar mums. Izskatām sadarbību ar izplatītājiem, pārdevējiem, nozares speciālistiem un partneriem, kuri var palīdzēt Canada ragavām nonākt pie īstajiem cilvēkiem.',
    ],
    highlight: 'Canada apvidus ragavas ir praktisks produkts ar skaidru pielietojumu — medībām, makšķerēšanai, mežam, lauksaimniecībai un smagu kravu pārvadāšanai bezceļa apstākļos. Tieši tāpēc meklējam partnerus, kuri saprot šo auditoriju.',
    badge: 'Reāls produkts. Skaidra auditorija.',
    imageAlt: 'Canada ragavas sadarbības un praktiskas lietošanas vidē',
    contactPrefix: 'Tiešai saziņai',
    cta: {
      email: 'Pieteikt sadarbību',
      whatsapp: 'Rakstīt WhatsApp',
      phone: 'Zvanīt +371 29206554',
    },
    cards: [
      {
        title: 'Kam šī sadarbība piemērota?',
        items: [
          'Medību un makšķerēšanas veikaliem',
          'Outdoor un tūrisma inventāra tirgotājiem',
          'ATV, sniega motociklu un bezceļu tehnikas tirgotājiem',
          'Mednieku klubiem un nozares kopienām',
          'Lauksaimniecības un mežsaimniecības preču pārdevējiem',
          'Cilvēkiem ar pieeju aktīvai mērķauditorijai Baltijā',
        ],
      },
      {
        title: 'Ko partneris iegūst?',
        items: [
          'Oficiālu Canada produktu pārstāvniecības iespēju',
          'Pieeju Zviedrijā ražotam, nišas produktam ar skaidru pielietojumu',
          'Produktu informāciju, foto un video materiālus pārdošanai',
          'Konsultāciju par modeļiem un pielietojumu',
          'Individuālus nosacījumus regulāriem vai lielākiem pasūtījumiem',
          'Iespēju attīstīt pieprasītu produktu savā reģionā vai kopienā',
        ],
      },
      {
        title: 'Kā sākt?',
        text: 'Uzrakstiet mums e-pastā, WhatsApp vai piezvaniet. Īsi pastāstiet, kas jūs esat, kurā valstī vai reģionā darbojaties un kādu sadarbības veidu redzat.',
      },
    ],
  },
  LIT: {
    eyebrow: 'Bendradarbiavimas Baltijos šalyse',
    title: 'Tapkite Canada bendradarbiavimo partneriu',
    intro: [
      'Ieškome partnerių Latvijoje, Lietuvoje ir Estijoje, kurie dirba su medžiotojais, žvejais, ūkininkais, miškininkystės įmonėmis, lauko įranga arba bekelei skirta technika.',
      'Jeigu turite parduotuvę, medžiotojų klubą, aktyvią bendruomenę, klientų bazę arba patirties šioje srityje — susisiekite su mumis. Svarstome bendradarbiavimą su platintojais, pardavėjais, srities specialistais ir partneriais, kurie gali padėti Canada rogėms pasiekti tinkamą auditoriją.',
    ],
    highlight: 'Canada bekelės rogės yra praktiškas produktas su aiškiu pritaikymu — medžioklei, žvejybai, miškui, žemės ūkiui ir sunkių krovinių transportavimui bekelės sąlygomis. Todėl ieškome partnerių, kurie supranta šią auditoriją.',
    badge: 'Realus produktas. Aiški auditorija.',
    imageAlt: 'Canada rogės praktinio naudojimo aplinkoje',
    contactPrefix: 'Tiesioginis kontaktas',
    cta: {
      email: 'Pasiūlyti bendradarbiavimą',
      whatsapp: 'Rašyti per WhatsApp',
      phone: 'Skambinti +371 29206554',
    },
    cards: [
      {
        title: 'Kam tinka šis bendradarbiavimas?',
        items: [
          'Medžioklės ir žvejybos parduotuvėms',
          'Outdoor ir turizmo inventoriaus pardavėjams',
          'ATV, sniego motociklų ir bekelės technikos pardavėjams',
          'Medžiotojų klubams ir srities bendruomenėms',
          'Žemės ūkio ir miškininkystės prekių pardavėjams',
          'Žmonėms, turintiems prieigą prie aktyvios auditorijos Baltijos šalyse',
        ],
      },
      {
        title: 'Ką gauna partneris?',
        items: [
          'Oficialią galimybę atstovauti Canada produktams',
          'Prieigą prie Švedijoje gaminamo nišinio produkto su aiškiu pritaikymu',
          'Produktų informaciją, nuotraukas ir vaizdo medžiagą pardavimams',
          'Konsultacijas apie modelius ir naudojimą',
          'Individualias sąlygas reguliariems arba didesniems užsakymams',
          'Galimybę vystyti paklausų produktą savo regione ar bendruomenėje',
        ],
      },
      {
        title: 'Kaip pradėti?',
        text: 'Parašykite mums el. paštu, per WhatsApp arba paskambinkite. Trumpai papasakokite, kas esate, kurioje šalyje ar regione dirbate ir kokį bendradarbiavimą matote.',
      },
    ],
  },
  EST: {
    eyebrow: 'Koostöö Baltikumis',
    title: 'Hakka Canada koostööpartneriks',
    intro: [
      'Otsime koostööpartnereid Lätis, Leedus ja Eestis, kes töötavad jahimeeste, kalastajate, põllumajanduse, metsanduse, outdoor-varustuse või maastikusõidukite valdkonnas.',
      'Kui teil on kauplus, jahiklubi, aktiivne kogukond, kliendibaas või kogemus selles valdkonnas, võtke meiega ühendust. Oleme avatud koostööle edasimüüjate, müüjate, valdkonna spetsialistide ja partneritega, kes aitavad Canada kelkudel jõuda õige sihtrühmani.',
    ],
    highlight: 'Canada maastikukelgud on praktiline toode selge kasutusega — jahindus, kalapüük, metsandus, põllumajandus ja raskete koormate vedu maastikutingimustes. Seetõttu otsime partnereid, kes seda sihtrühma mõistavad.',
    badge: 'Päris toode. Selge sihtrühm.',
    imageAlt: 'Canada kelgud praktilises välitingimustes kasutuses',
    contactPrefix: 'Otsekontakt',
    cta: {
      email: 'Paku koostööd',
      whatsapp: 'Kirjuta WhatsAppis',
      phone: 'Helista +371 29206554',
    },
    cards: [
      {
        title: 'Kellele see koostöö sobib?',
        items: [
          'Jahi- ja kalastustarvete kauplustele',
          'Outdoor- ja matkavarustuse müüjatele',
          'ATV, mootorsaanide ja maastikutehnika müüjatele',
          'Jahiklubidele ja valdkonna kogukondadele',
          'Põllumajandus- ja metsandustarvete müüjatele',
          'Inimestele, kellel on ligipääs aktiivsele sihtrühmale Baltikumis',
        ],
      },
      {
        title: 'Mida partner saab?',
        items: [
          'Ametliku võimaluse esindada Canada tooteid',
          'Ligipääsu Rootsis toodetud nišitootele selge kasutusvaldkonnaga',
          'Tooteinfot, fotosid ja videomaterjale müügiks',
          'Konsultatsiooni mudelite ja kasutusvõimaluste kohta',
          'Individuaalsed tingimused regulaarsetele või suurematele tellimustele',
          'Võimaluse arendada nõutud toodet oma piirkonnas või kogukonnas',
        ],
      },
      {
        title: 'Kuidas alustada?',
        text: 'Kirjutage meile e-posti või WhatsAppi teel või helistage. Rääkige lühidalt, kes te olete, millises riigis või piirkonnas tegutsete ja millist koostööd näete.',
      },
    ],
  },
  ENG: {
    eyebrow: 'Baltic cooperation',
    title: 'Become a Canada cooperation partner',
    intro: [
      'We are looking for cooperation partners in Latvia, Lithuania and Estonia who work with hunters, fishermen, farmers, forestry businesses, outdoor equipment or off-road machinery.',
      'If you have a store, hunting club, active community, customer base or experience in this field, contact us. We are open to cooperation with distributors, sellers, industry specialists and partners who can help Canada sleds reach the right people.',
    ],
    highlight: 'Canada off-road sleds are a practical product with a clear purpose — hunting, fishing, forestry, agriculture and heavy load transport in off-road conditions. That is why we are looking for partners who understand this audience.',
    badge: 'Real product. Clear audience.',
    imageAlt: 'Canada sleds in practical outdoor use',
    contactPrefix: 'Direct contact',
    cta: {
      email: 'Apply for cooperation',
      whatsapp: 'Write on WhatsApp',
      phone: 'Call +371 29206554',
    },
    cards: [
      {
        title: 'Who is this cooperation for?',
        items: [
          'Hunting and fishing stores',
          'Outdoor and tourism equipment retailers',
          'ATV, snowmobile and off-road machinery dealers',
          'Hunting clubs and industry communities',
          'Agriculture and forestry supply sellers',
          'People with access to an active target audience in the Baltics',
        ],
      },
      {
        title: 'What does the partner receive?',
        items: [
          'An official opportunity to represent Canada products',
          'Access to a Swedish-made niche product with a clear use case',
          'Product information, photos and videos for sales',
          'Consultation about models and applications',
          'Individual terms for regular or larger orders',
          'The opportunity to develop a sought-after product in your region or community',
        ],
      },
      {
        title: 'How to start?',
        text: 'Write to us by email, WhatsApp or call us. Briefly tell us who you are, which country or region you operate in and what type of cooperation you see.',
      },
    ],
  },
  RUS: {
    eyebrow: 'Сотрудничество в Балтии',
    title: 'Станьте партнёром Canada',
    intro: [
      'Мы ищем партнёров в Латвии, Литве и Эстонии, которые работают с охотниками, рыбаками, фермерами, лесным хозяйством, outdoor-инвентарём или внедорожной техникой.',
      'Если у вас есть магазин, охотничий клуб, активное сообщество, клиентская база или опыт в этой сфере — свяжитесь с нами. Мы рассматриваем сотрудничество с дистрибьюторами, продавцами, отраслевыми специалистами и партнёрами, которые помогут саням Canada дойти до нужной аудитории.',
    ],
    highlight: 'Внедорожные сани Canada — это практичный продукт с понятным применением: охота, рыбалка, лес, сельское хозяйство и перевозка тяжёлых грузов в условиях бездорожья. Поэтому мы ищем партнёров, которые понимают эту аудиторию.',
    badge: 'Реальный продукт. Понятная аудитория.',
    imageAlt: 'Сани Canada в практическом outdoor-использовании',
    contactPrefix: 'Прямой контакт',
    cta: {
      email: 'Предложить сотрудничество',
      whatsapp: 'Написать в WhatsApp',
      phone: 'Позвонить +371 29206554',
    },
    cards: [
      {
        title: 'Кому подходит сотрудничество?',
        items: [
          'Магазинам товаров для охоты и рыбалки',
          'Продавцам outdoor- и туристического снаряжения',
          'Дилерам ATV, снегоходов и внедорожной техники',
          'Охотничьим клубам и отраслевым сообществам',
          'Продавцам товаров для сельского и лесного хозяйства',
          'Людям с доступом к активной целевой аудитории в Балтии',
        ],
      },
      {
        title: 'Что получает партнёр?',
        items: [
          'Официальную возможность представлять продукцию Canada',
          'Доступ к шведскому нишевому продукту с понятным применением',
          'Информацию о продукте, фото и видео материалы для продаж',
          'Консультации по моделям и вариантам применения',
          'Индивидуальные условия для регулярных или крупных заказов',
          'Возможность развивать востребованный продукт в своём регионе или сообществе',
        ],
      },
      {
        title: 'Как начать?',
        text: 'Напишите нам по e-mail, в WhatsApp или позвоните. Кратко расскажите, кто вы, в какой стране или регионе работаете и какой формат сотрудничества видите.',
      },
    ],
  },
}

const content = partnerContent[ACTIVE_LANG]

function PartnerCard({ card, index }) {
  return (
    <motion.article
      className="partner-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <span className="partner-card-index">{String(index + 1).padStart(2, '0')}</span>
      <h3>{card.title}</h3>
      {card.items ? (
        <ul>
          {card.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{card.text}</p>
      )}
    </motion.article>
  )
}

export default function Partners() {
  const partnersImage = useImageSlot('partners', '/PARTNERISSS.jpg', content.imageAlt)

  return (
    <section className="section partners" id="partners">
      <div className="container">
        <div className="partners-grid">
          <div className="partners-left">
            <motion.div
              className="partners-copy"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65 }}
            >
              <span className="section-label">{content.eyebrow}</span>
              <h2 className="section-title">{content.title}</h2>
              <div className="partners-intro">
                {content.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="partners-highlight">{content.highlight}</p>
            </motion.div>

            <motion.div
              className="partners-actions"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              <div className="partners-cta-row">
                <a href={EMAIL_LINK} className="btn-primary partners-primary">
                  {content.cta.email}
                </a>
                <a
                  href={WHATSAPP_LINK}
                  className="btn-outline partners-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.cta.whatsapp}
                </a>
                <a href={PHONE_LINK} className="btn-outline partners-secondary">
                  {content.cta.phone}
                </a>
              </div>

              <p className="partners-contact-line">
                <span>{content.contactPrefix}:</span>
                <a href="tel:+37129206554">+371 29206554</a>
                <a href="tel:+37125715536">+371 25715536</a>
                <a href="mailto:info@canadasleigh.com">info@canadasleigh.com</a>
              </p>
            </motion.div>
          </div>

          <div className="partners-right">
            <motion.figure
              className="partners-media"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >
              <img
                src={partnersImage.src}
                alt={partnersImage.alt}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{content.badge}</figcaption>
            </motion.figure>

            <div className="partners-cards">
              {content.cards.map((card, index) => (
                <PartnerCard key={card.title} card={card} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
