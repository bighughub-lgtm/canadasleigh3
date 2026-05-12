-- Canada Sleigh admin CMS seed: existing public media
-- Run this after supabase/admin_cms_schema.sql.
--
-- This seed mirrors the current hardcoded fallback content from:
-- - src/components/Gallery.jsx
-- - src/components/VideoSection.jsx
-- - src/components/ProductCatalog.jsx
-- - src/lib/mediaSlots.js
--
-- All referenced images and videos use stable /public paths or stable YouTube
-- URLs. No hashed build asset URLs are used and no files need to be copied
-- before running this seed.
--
-- Gallery and video inserts are idempotent by section+url/video_url.
-- Section image slots are singleton rows by section id.

insert into public.site_media (
  section,
  title_lv,
  alt_lv,
  url,
  sort_order,
  is_active
)
select
  seed.section,
  seed.title_lv,
  seed.alt_lv,
  seed.url,
  seed.sort_order,
  true
from (
  values
    ('gallery', 'Meža maršruts', 'Canada Pulkan ragavas reālā meža maršrutā', '/DSC06432.jpg', 1),
    ('gallery', 'Apvidus darbs', 'Ragavas skarbā apvidū', '/KRJ02427.jpg', 2),
    ('gallery', 'Vilcēja līnija', 'Ragavas pārvietošanas brīdī', '/KRJ02257.jpg', 3),
    ('gallery', 'Pārvadājums dabā', 'Ragavas meža un lauka apstākļos', '/hngfbdv.jpg', 4),
    ('gallery', 'Tuvplāna kadrs', 'Tuvplāna kadrs ar ragavām dabiskā vidē', '/rtdgf.jpg', 5),
    ('gallery', 'Noslēdzošais kadrs', 'Ragavas mežā un smaguma transportēšanā', '/yuthgdf.jpg', 6),
    ('gallery', 'Stāvā trase', 'Canada Pulkan ragavas slīpākā meža posmā', '/DSC06417.jpg', 7),
    ('gallery', 'Meža transportēšana', 'Ragavas smaguma pārvietošanai mežā', '/KRJ02364.jpg', 8),
    ('gallery', 'Nelīdzens reljefs', 'Ragavas nelīdzenā reljefā', '/htgbfdf.jpg', 9),
    ('gallery', 'Kravas maršruts', 'Ragavas smagākai kravai apvidū', '/KRJ01743.jpg', 10),
    ('gallery', 'Pierādīta lietošana', 'Ragavas autentiskā lietošanā dabā', '/thrgdf.jpg', 11),
    ('gallery', 'Bezceļa aina', 'Vertikāls bezceļa kadrs ar ragavām', '/ytr.jpg', 12)
) as seed(section, title_lv, alt_lv, url, sort_order)
where not exists (
  select 1
  from public.site_media existing
  where existing.section = seed.section
    and existing.url = seed.url
);

insert into public.site_media (
  section,
  title_lv,
  alt_lv,
  url,
  sort_order,
  is_active
)
select
  seed.section,
  seed.title_lv,
  seed.alt_lv,
  seed.url,
  seed.sort_order,
  true
from (
  values
    ('product_compact_gallery', 'Kompaktais modelis darbībā', 'TERRAINSLEIGH CANADA COMPACT ragavas no sāna', '/sm1.jpeg', 1),
    ('product_compact_gallery', 'Forma un dziļums smagai vilkšanai', 'TERRAINSLEIGH CANADA COMPACT ragavas mežā', '/sm2.jpeg', 2),
    ('product_compact_gallery', 'Kompakts profils ikdienas lietošanai', 'TERRAINSLEIGH CANADA COMPACT ragavas tuvplānā', '/sm3.jpeg', 3),
    ('product_compact_gallery', 'Praktiska kravnesība medībām un makšķerēšanai', 'TERRAINSLEIGH CANADA COMPACT ragavas ar aprīkojumu', '/sm4.jpeg', 4),
    ('product_compact_gallery', 'Viegli kopjams HD materiāls', 'TERRAINSLEIGH CANADA COMPACT ragavas uz zemes', '/sm5.jpeg', 5),
    ('product_compact_gallery', 'Elastība sarežģītā apvidū', 'TERRAINSLEIGH CANADA COMPACT ragavas transportēšanā', '/sm6.jpg', 6),
    ('product_compact_gallery', 'Kompakts izmērs ar pilnvērtīgu lietderību', 'TERRAINSLEIGH CANADA COMPACT ragavas no augšas', '/sm7.jpg', 7),
    ('product_compact_gallery', 'Piemērotas bezceļu darbam Baltijā', 'TERRAINSLEIGH CANADA COMPACT ragavas lietošanā', '/sm8.jpg', 8),
    ('product_classic_gallery', 'Pilnā izmēra korpuss smagām slodzēm', 'TERRAINSLEIGH CANADA CLASSIC ragavas darbībā', '/b1.jpeg', 1),
    ('product_classic_gallery', 'Stabila vilkšana sarežģītā apvidū', 'TERRAINSLEIGH CANADA CLASSIC ragavas meža apvidū', '/b2.jpeg', 2),
    ('product_classic_gallery', 'Izturīgs 8 mm HD materiāls', 'TERRAINSLEIGH CANADA CLASSIC ragavas tuvplānā', '/b3.jpg', 3),
    ('product_classic_gallery', 'Piemērotas lielam medījumam un aprīkojumam', 'TERRAINSLEIGH CANADA CLASSIC ragavas ar kravu', '/b4.jpeg', 4),
    ('product_classic_gallery', 'Elastība starp celmiem un akmeņiem', 'TERRAINSLEIGH CANADA CLASSIC ragavas no sāna', '/b5.jpeg', 5),
    ('product_classic_gallery', 'Papildu ietilpība smagam transportam', 'TERRAINSLEIGH CANADA CLASSIC ragavas izmēra salīdzinājumā', '/b6.jpeg', 6),
    ('product_classic_gallery', 'Modelis garākiem maršrutiem Baltijā', 'TERRAINSLEIGH CANADA CLASSIC ragavas bezceļu apstākļos', '/b7.jpg', 7),
    ('product_classic_open_gallery', 'Atvērtais modelis ar plašu kravēšanas laukumu', 'TERRAINSLEIGH CANADA CLASSIC OPEN ragavas darbībā', '/a1.jpeg', 1),
    ('product_classic_open_gallery', 'Viegla piekļuve aprīkojumam un medījumam', 'TERRAINSLEIGH CANADA CLASSIC OPEN ragavas bezceļu apstākļos', '/a2.jpeg', 2),
    ('product_classic_open_gallery', 'Saderīgas ar Xtension pagarinājumu līdz 3,5 m', 'TERRAINSLEIGH CANADA CLASSIC OPEN ragavas tuvplānā', '/a3.jpeg', 3),
    ('product_classic_open_gallery', 'Pilna izmēra risinājums smagām kravām Baltijā', 'TERRAINSLEIGH CANADA CLASSIC OPEN ragavas ar kravu', '/a4.jpeg', 4)
) as seed(section, title_lv, alt_lv, url, sort_order)
where not exists (
  select 1
  from public.site_media existing
  where existing.section = seed.section
    and existing.url = seed.url
);

insert into public.site_media (
  section,
  title_lv,
  alt_lv,
  url,
  sort_order,
  is_active
)
select
  seed.section,
  seed.title_lv,
  seed.alt_lv,
  seed.url,
  1,
  true
from (
  values
    ('hero', 'Sākuma skata attēls', 'Canada apvidus ragavas sākuma skatā', '/statiska bilde.jpg'),
    ('benefits', 'Priekšrocību sadaļas attēls', 'Canada Pulkan apvidus ragavas lietošanā', '/KRJ01720.jpg'),
    ('product_overview_compact', 'Produkta pārskats — COMPACT', 'CANADA COMPACT ragavas produkta pārskatā', '/mazasragavas.jpg'),
    ('product_overview_classic', 'Produkta pārskats — CLASSIC', 'CANADA CLASSIC ragavas produkta pārskatā', '/canadaplukan.jpg'),
    ('product_overview_classic_open', 'Produkta pārskats — CLASSIC OPEN', 'CANADA CLASSIC OPEN ragavas produkta pārskatā', '/ragavasbig.png'),
    ('product_compact', 'COMPACT produkta attēls', 'CANADA COMPACT ragavas', '/mazasragavas.jpg'),
    ('product_classic', 'CLASSIC produkta attēls', 'CANADA CLASSIC ragavas', '/canadaplukan.jpg'),
    ('product_classic_open', 'CLASSIC OPEN produkta attēls', 'CANADA CLASSIC OPEN ragavas', '/ragavasbig.png'),
    ('apvidus_feature', 'Apvidus sadaļas attēls', 'Apvidus kamanas', '/apvidus kamanas.png'),
    ('about', 'Par mums sadaļas attēls', 'Canada Pulkan Baltijā', '/KRJ02427.jpg'),
    ('contact', 'Kontaktu sadaļas attēls', 'Canada Pulkan apvidus ragavas', '/KRJ02364.jpg'),
    ('partners', 'Partneru sadaļas attēls', 'Canada ragavas praktiskas lietošanas vidē', '/PARTNERISSS.jpg')
) as seed(section, title_lv, alt_lv, url)
where not exists (
  select 1
  from public.site_media existing
  where existing.section = seed.section
);

with slot_sections(section) as (
  values
    ('hero'),
    ('benefits'),
    ('product_overview_compact'),
    ('product_overview_classic'),
    ('product_overview_classic_open'),
    ('product_compact'),
    ('product_classic'),
    ('product_classic_open'),
    ('apvidus_feature'),
    ('about'),
    ('contact'),
    ('partners')
),
ranked as (
  select
    site_media.id,
    row_number() over (
      partition by site_media.section
      order by site_media.is_active desc, site_media.updated_at desc, site_media.created_at desc
    ) as row_index
  from public.site_media
  join slot_sections on slot_sections.section = site_media.section
)
update public.site_media
set
  is_active = (ranked.row_index = 1),
  sort_order = ranked.row_index
from ranked
where public.site_media.id = ranked.id;

with gallery_sections(section) as (
  values
    ('gallery'),
    ('product_compact_gallery'),
    ('product_classic_gallery'),
    ('product_classic_open_gallery')
),
ranked as (
  select
    site_media.id,
    row_number() over (
      partition by site_media.section
      order by site_media.sort_order asc, site_media.created_at asc, site_media.id asc
    ) as row_index
  from public.site_media
  join gallery_sections on gallery_sections.section = site_media.section
)
update public.site_media
set sort_order = ranked.row_index
from ranked
where public.site_media.id = ranked.id;

insert into public.site_videos (
  title_lv,
  description_lv,
  video_url,
  thumbnail_url,
  sort_order,
  is_active
)
select
  seed.title_lv,
  seed.description_lv,
  seed.video_url,
  seed.thumbnail_url,
  seed.sort_order,
  true
from (
  values
    ('Pilns process no A-Z', 'Pilns darba process no sākuma līdz gatavam rezultātam.', '/Vannas LAT.mp4', null::text, 1),
    ('Kā mazā vanna ielien dzīvnieks', 'Praktisks piemērs, kā mazā vanna tiek izmantota medījuma ievietošanai un transportēšanai.', '/small vid.mp4', null::text, 2),
    ('Ragavas darbībā', 'Reāls piemērs, kā ragavas uzvedas praktiskā lietošanā dabā.', 'https://www.youtube.com/watch?v=9uT6r90BZwY', null::text, 3),
    ('Lietošana bezceļā', 'Skats uz ragavu lietošanu sarežģītākos apstākļos un reljefā.', 'https://www.youtube.com/watch?v=izPM9_FGDE0', null::text, 4),
    ('Pārvietošana un vilkšana', 'Kā ragavas tiek vilktas un izmantotas ikdienas darbā.', 'https://www.youtube.com/watch?v=dp_ivalzEe8', null::text, 5),
    ('Kravnesība praksē', 'Praktisks ieskats ragavu ietilpībā un to izmantošanā smagākām kravām.', 'https://www.youtube.com/watch?v=CKOWTuo_WJg', null::text, 6),
    ('Darbs meža apstākļos', 'Ragavu pielietojums mežā, starp kokiem, celmiem un nelīdzenā segumā.', 'https://www.youtube.com/watch?v=v2EYZRFkakw', null::text, 7),
    ('Izturība un pielietojums', 'Vēl viens piemērs, kas parāda ragavu izturību un praktisko vērtību.', 'https://www.youtube.com/watch?v=t8JmTwOfBss', null::text, 8),
    ('Papildu demonstrācija', 'Vēl viens reāls demonstrācijas video par ragavu lietošanu praksē.', 'https://www.youtube.com/watch?v=KEZ34NNd6dY', null::text, 9)
) as seed(title_lv, description_lv, video_url, thumbnail_url, sort_order)
where not exists (
  select 1
  from public.site_videos existing
  where existing.video_url = seed.video_url
);
