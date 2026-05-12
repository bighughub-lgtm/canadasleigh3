# Admin Media Map

Šis dokuments kartē publiskās sākumlapas attēlus uz admin paneli. Attēli tiek glabāti `site_media.section` vērtībās.

## 1. Lapas galvenās bildes

| Admin nosaukums | Slot ID | Komponents | Fallback URL | Tips |
| --- | --- | --- | --- | --- |
| Sākuma skats | `hero` | `Hero.jsx` | `/statiska bilde.jpg` | viens fiksēts attēls |
| Priekšrocības | `benefits` | `Benefits.jsx` | `/KRJ01720.jpg` | viens fiksēts attēls |
| Apvidus sadaļa | `apvidus_feature` | `ApvidusFeature.jsx` | `/apvidus kamanas.png` | viens fiksēts attēls |
| Par mums | `about` | `About.jsx` | `/KRJ02427.jpg` | viens fiksēts attēls |
| Kontakti | `contact` | `Contact.jsx` | `/KRJ02364.jpg` | viens fiksēts attēls |
| Partneriem | `partners` | `Partners.jsx` | `/PARTNERISSS.jpg` | viens fiksēts attēls |

Admin sadaļa: `Sadaļu bildes` → `Lapas sadaļas`.

## 2. Produktu pārskata bildes

| Admin nosaukums | Slot ID | Komponents | Fallback URL | Tips |
| --- | --- | --- | --- | --- |
| Produkta pārskats — COMPACT | `product_overview_compact` | `ProductOverview.jsx` | `/mazasragavas.jpg` | viens fiksēts attēls |
| Produkta pārskats — CLASSIC | `product_overview_classic` | `ProductOverview.jsx` | `/canadaplukan.jpg` | viens fiksēts attēls |
| Produkta pārskats — CLASSIC OPEN | `product_overview_classic_open` | `ProductOverview.jsx` | `/ragavasbig.png` | viens fiksēts attēls |

Admin sadaļa: `Sadaļu bildes` → `Produktu pārskats`.

Piezīme: vecais `product_overview` slots tiek atbalstīts tikai kā COMPACT pārskata legacy fallback, lai esošs CMS attēls nepazustu pirms seeda atkārtotas palaišanas.

## 3. Produktu kartīšu bildes

| Admin nosaukums | Slot ID | Komponents | Fallback URL | Tips |
| --- | --- | --- | --- | --- |
| COMPACT produkts | `product_compact` | `ProductCatalog.jsx` | `/mazasragavas.jpg` | viens fiksēts attēls |
| CLASSIC produkts | `product_classic` | `ProductCatalog.jsx` | `/canadaplukan.jpg` | viens fiksēts attēls |
| CLASSIC OPEN produkts | `product_classic_open` | `ProductCatalog.jsx` | `/ragavasbig.png` | viens fiksēts attēls |

Admin sadaļa: `Sadaļu bildes` → `Produktu kartītes`.

## 4. Produktu detalizētās galerijas

| Admin nosaukums | Section ID | Komponents | Fallback URL piemēri | Tips |
| --- | --- | --- | --- | --- |
| COMPACT detalizētā galerija | `product_compact_gallery` | `ProductCatalog.jsx` | `/sm1.jpeg` līdz `/sm8.jpg` | vairāku attēlu galerija |
| CLASSIC detalizētā galerija | `product_classic_gallery` | `ProductCatalog.jsx` | `/b1.jpeg` līdz `/b7.jpg` | vairāku attēlu galerija |
| CLASSIC OPEN detalizētā galerija | `product_classic_open_gallery` | `ProductCatalog.jsx` | `/a1.jpeg` līdz `/a4.jpeg` | vairāku attēlu galerija |

Admin sadaļa: `Produktu galerijas`.

Piezīme: COMPACT detalizētajā media viewer paliek lokālais video `/small vid.mp4`. Tā postera/sīktēla attēls izmanto pirmo aktīvo COMPACT galerijas attēlu, ja CMS galerija ir importēta. Ja CMS nav datu, publiskā lapa izmanto esošo fallback video posteri `/sm4.jpeg`.

## 5. Galvenā galerija

| Admin nosaukums | Section ID | Komponents | Fallback URL piemēri | Tips |
| --- | --- | --- | --- | --- |
| Publiskā galerija | `gallery` | `Gallery.jsx` | `/DSC06432.jpg`, `/KRJ02427.jpg`, `/KRJ02257.jpg`, `/hngfbdv.jpg`, `/rtdgf.jpg`, `/yuthgdf.jpg`, `/DSC06417.jpg`, `/KRJ02364.jpg`, `/htgbfdf.jpg`, `/KRJ01743.jpg`, `/thrgdf.jpg`, `/ytr.jpg` | vairāku attēlu galerija |

Admin sadaļa: `Galerija`.

## 6. Video thumbnails

| Admin nosaukums | Datu vieta | Komponents | Fallback | Tips |
| --- | --- | --- | --- | --- |
| Video thumbnail URL | `site_videos.thumbnail_url` | `VideoSection.jsx` | YouTube `mqdefault.jpg` vai lokāla video priekšskatījums | izvēles attēla URL pie video |

Admin sadaļa: `Videoklipi`.

## Fiksētie zīmola faili

Šie attēli ir redzami publiskajā lapā, bet nav padarīti rediģējami admin panelī, jo tie ir zīmola sistēmas faili un tiem jāpaliek oriģinālajās krāsās:

| Fails | Kur redzams | Iemesls |
| --- | --- | --- |
| `/logopng2.png` | Header, Footer, favicon | galvenais logo |
| `/apviduskamanaswhite.png` | ProductOverview, About, Contact | zīmola/produkta marķējums |

Video faili `/heroooAT.mp4`, `/Vannas LAT.mp4`, `/small vid.mp4` ir video saturs, nevis attēlu sloti. Publiskie video saraksta ieraksti ir pārvaldāmi sadaļā `Videoklipi`.
