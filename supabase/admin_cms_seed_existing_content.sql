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

with seed(section, url, title_en, title_ru, alt_en, alt_ru) as (
  values
    ('gallery', '/DSC06432.jpg', 'Forest route', 'Лесной маршрут', 'Canada Pulkan sled on a real forest route', 'Сани Canada Pulkan на реальном лесном маршруте'),
    ('gallery', '/KRJ02427.jpg', 'Terrain work', 'Работа на рельефе', 'Sled in rugged terrain', 'Сани на сложном рельефе'),
    ('gallery', '/KRJ02257.jpg', 'Pulling line', 'Линия тяги', 'Sled while being moved', 'Сани в момент перемещения'),
    ('gallery', '/hngfbdv.jpg', 'Outdoor transport', 'Перевозка на природе', 'Sled in forest and field conditions', 'Сани в лесных и полевых условиях'),
    ('gallery', '/rtdgf.jpg', 'Close-up frame', 'Крупный план', 'Close-up of the sled in a natural setting', 'Крупный план саней в естественной среде'),
    ('gallery', '/yuthgdf.jpg', 'Final frame', 'Финальный кадр', 'Sled in the forest during heavy-load transport', 'Сани в лесу при перевозке груза'),
    ('gallery', '/DSC06417.jpg', 'Steep route', 'Крутая трасса', 'Canada Pulkan sled on a steeper forest section', 'Сани Canada Pulkan на более крутом лесном участке'),
    ('gallery', '/KRJ02364.jpg', 'Forest transport', 'Лесная перевозка', 'Sled for heavy-load movement in the forest', 'Сани для перемещения тяжёлого груза в лесу'),
    ('gallery', '/htgbfdf.jpg', 'Uneven terrain', 'Неровный рельеф', 'Sled on uneven terrain', 'Сани на неровном рельефе'),
    ('gallery', '/KRJ01743.jpg', 'Load route', 'Маршрут с грузом', 'Sled for heavier cargo in terrain', 'Сани для более тяжёлого груза на рельефе'),
    ('gallery', '/thrgdf.jpg', 'Proven use', 'Проверенное применение', 'Sled in authentic outdoor use', 'Сани в реальном использовании на природе'),
    ('gallery', '/ytr.jpg', 'Off-road scene', 'Сцена бездорожья', 'Vertical off-road frame with the sled', 'Вертикальный кадр бездорожья с санями'),
    ('product_compact_gallery', '/sm1.jpeg', 'Compact model in use', 'Компактная модель в работе', 'TERRAINSLEIGH CANADA COMPACT sled from the side', 'Сани TERRAINSLEIGH CANADA COMPACT сбоку'),
    ('product_compact_gallery', '/sm2.jpeg', 'Shape and depth for heavy pulling', 'Форма и глубина для тяжёлой тяги', 'TERRAINSLEIGH CANADA COMPACT sled in the forest', 'Сани TERRAINSLEIGH CANADA COMPACT в лесу'),
    ('product_compact_gallery', '/sm3.jpeg', 'Compact profile for everyday use', 'Компактный профиль для повседневного использования', 'TERRAINSLEIGH CANADA COMPACT sled close-up', 'Сани TERRAINSLEIGH CANADA COMPACT крупным планом'),
    ('product_compact_gallery', '/sm4.jpeg', 'Practical load capacity for hunting and fishing', 'Практичная грузоподъёмность для охоты и рыбалки', 'TERRAINSLEIGH CANADA COMPACT sled with equipment', 'Сани TERRAINSLEIGH CANADA COMPACT со снаряжением'),
    ('product_compact_gallery', '/sm5.jpeg', 'Easy-care HD material', 'Простой в уходе HD материал', 'TERRAINSLEIGH CANADA COMPACT sled on the ground', 'Сани TERRAINSLEIGH CANADA COMPACT на земле'),
    ('product_compact_gallery', '/sm6.jpg', 'Flexibility in difficult terrain', 'Гибкость на сложном рельефе', 'TERRAINSLEIGH CANADA COMPACT sled during transport', 'Сани TERRAINSLEIGH CANADA COMPACT при транспортировке'),
    ('product_compact_gallery', '/sm7.jpg', 'Compact size with full practical value', 'Компактный размер с полноценной практической пользой', 'TERRAINSLEIGH CANADA COMPACT sled from above', 'Сани TERRAINSLEIGH CANADA COMPACT сверху'),
    ('product_compact_gallery', '/sm8.jpg', 'Suitable for off-road work in the Baltics', 'Подходят для работы на бездорожье в странах Балтии', 'TERRAINSLEIGH CANADA COMPACT sled in use', 'Сани TERRAINSLEIGH CANADA COMPACT в использовании'),
    ('product_classic_gallery', '/b1.jpeg', 'Full-size body for heavy loads', 'Полноразмерный корпус для тяжёлых грузов', 'TERRAINSLEIGH CANADA CLASSIC sled in use', 'Сани TERRAINSLEIGH CANADA CLASSIC в работе'),
    ('product_classic_gallery', '/b2.jpeg', 'Stable pulling across difficult terrain', 'Стабильная тяга на сложном рельефе', 'TERRAINSLEIGH CANADA CLASSIC sled in forest terrain', 'Сани TERRAINSLEIGH CANADA CLASSIC на лесном рельефе'),
    ('product_classic_gallery', '/b3.jpg', 'Durable 8 mm HD material', 'Прочный 8 мм HD материал', 'TERRAINSLEIGH CANADA CLASSIC sled close-up', 'Сани TERRAINSLEIGH CANADA CLASSIC крупным планом'),
    ('product_classic_gallery', '/b4.jpeg', 'Suitable for large game and equipment', 'Подходят для крупной добычи и снаряжения', 'TERRAINSLEIGH CANADA CLASSIC sled with load', 'Сани TERRAINSLEIGH CANADA CLASSIC с грузом'),
    ('product_classic_gallery', '/b5.jpeg', 'Flexibility between stumps and rocks', 'Гибкость между пнями и камнями', 'TERRAINSLEIGH CANADA CLASSIC sled from the side', 'Сани TERRAINSLEIGH CANADA CLASSIC сбоку'),
    ('product_classic_gallery', '/b6.jpeg', 'Extra capacity for heavy transport', 'Дополнительная вместимость для тяжёлой перевозки', 'TERRAINSLEIGH CANADA CLASSIC sled size comparison', 'Сани TERRAINSLEIGH CANADA CLASSIC в сравнении размера'),
    ('product_classic_gallery', '/b7.jpg', 'Model for longer routes in the Baltics', 'Модель для более длинных маршрутов в странах Балтии', 'TERRAINSLEIGH CANADA CLASSIC sled in off-road conditions', 'Сани TERRAINSLEIGH CANADA CLASSIC в условиях бездорожья'),
    ('product_classic_open_gallery', '/a1.jpeg', 'Open model with a wide loading area', 'Открытая модель с широкой зоной загрузки', 'TERRAINSLEIGH CANADA CLASSIC OPEN sled in use', 'Сани TERRAINSLEIGH CANADA CLASSIC OPEN в работе'),
    ('product_classic_open_gallery', '/a2.jpeg', 'Easy access to equipment and game', 'Удобный доступ к снаряжению и добыче', 'TERRAINSLEIGH CANADA CLASSIC OPEN sled in off-road conditions', 'Сани TERRAINSLEIGH CANADA CLASSIC OPEN в условиях бездорожья'),
    ('product_classic_open_gallery', '/a3.jpeg', 'Compatible with the Xtension add-on up to 3.5 m', 'Совместимы с удлинителем Xtension до 3,5 m', 'TERRAINSLEIGH CANADA CLASSIC OPEN sled close-up', 'Сани TERRAINSLEIGH CANADA CLASSIC OPEN крупным планом'),
    ('product_classic_open_gallery', '/a4.jpeg', 'Full-size solution for heavy loads in the Baltics', 'Полноразмерное решение для тяжёлых грузов в странах Балтии', 'TERRAINSLEIGH CANADA CLASSIC OPEN sled with load', 'Сани TERRAINSLEIGH CANADA CLASSIC OPEN с грузом'),
    ('hero', '/statiska bilde.jpg', 'Opening view image', 'Изображение первого экрана', 'Canada rugged terrain sleds in the opening view', 'Сани Canada для бездорожья на первом экране'),
    ('benefits', '/KRJ01720.jpg', 'Benefits section image', 'Изображение раздела преимуществ', 'Canada Pulkan terrain sleds in use', 'Сани Canada Pulkan для бездорожья в использовании'),
    ('product_overview_compact', '/mazasragavas.jpg', 'Product overview — COMPACT', 'Обзор продукта — COMPACT', 'CANADA COMPACT sled in the product overview', 'Сани CANADA COMPACT в обзоре продукта'),
    ('product_overview_classic', '/canadaplukan.jpg', 'Product overview — CLASSIC', 'Обзор продукта — CLASSIC', 'CANADA CLASSIC sled in the product overview', 'Сани CANADA CLASSIC в обзоре продукта'),
    ('product_overview_classic_open', '/ragavasbig.png', 'Product overview — CLASSIC OPEN', 'Обзор продукта — CLASSIC OPEN', 'CANADA CLASSIC OPEN sled in the product overview', 'Сани CANADA CLASSIC OPEN в обзоре продукта'),
    ('product_compact', '/mazasragavas.jpg', 'COMPACT product image', 'Изображение продукта COMPACT', 'CANADA COMPACT sled', 'Сани CANADA COMPACT'),
    ('product_classic', '/canadaplukan.jpg', 'CLASSIC product image', 'Изображение продукта CLASSIC', 'CANADA CLASSIC sled', 'Сани CANADA CLASSIC'),
    ('product_classic_open', '/ragavasbig.png', 'CLASSIC OPEN product image', 'Изображение продукта CLASSIC OPEN', 'CANADA CLASSIC OPEN sled', 'Сани CANADA CLASSIC OPEN'),
    ('apvidus_feature', '/apvidus kamanas.png', 'Terrain section image', 'Изображение раздела бездорожья', 'Terrain sled', 'Сани для бездорожья'),
    ('about', '/KRJ02427.jpg', 'About us section image', 'Изображение раздела о нас', 'Canada Pulkan in the Baltics', 'Canada Pulkan в странах Балтии'),
    ('contact', '/KRJ02364.jpg', 'Contact section image', 'Изображение раздела контактов', 'Canada Pulkan terrain sleds', 'Сани Canada Pulkan для бездорожья'),
    ('partners', '/PARTNERISSS.jpg', 'Partners section image', 'Изображение раздела партнёров', 'Canada sleds in a practical-use setting', 'Сани Canada в среде практического применения')
)
update public.site_media
set
  title_en = coalesce(nullif(public.site_media.title_en, ''), seed.title_en),
  title_ru = coalesce(nullif(public.site_media.title_ru, ''), seed.title_ru),
  alt_en = coalesce(nullif(public.site_media.alt_en, ''), seed.alt_en),
  alt_ru = coalesce(nullif(public.site_media.alt_ru, ''), seed.alt_ru)
from seed
where public.site_media.section = seed.section
  and public.site_media.url = seed.url;

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

with seed(video_url, title_en, title_ru, description_en, description_ru) as (
  values
    ('/Vannas LAT.mp4', 'Full process from A to Z', 'Полный процесс от А до Я', 'A complete working process from start to finished result.', 'Полный рабочий процесс от начала до готового результата.'),
    ('/small vid.mp4', 'Loading game into the compact tub', 'Как добыча помещается в компактную ванну', 'A practical example of how the compact tub is used for loading and transporting game.', 'Практический пример использования компактной ванны для загрузки и перевозки добычи.'),
    ('https://www.youtube.com/watch?v=9uT6r90BZwY', 'Sleds in action', 'Сани в действии', 'A real example of how the sleds behave in practical outdoor use.', 'Реальный пример поведения саней в практическом использовании на природе.'),
    ('https://www.youtube.com/watch?v=izPM9_FGDE0', 'Off-road use', 'Использование на бездорожье', 'A look at sled use in more difficult conditions and terrain.', 'Взгляд на использование саней в более сложных условиях и рельефе.'),
    ('https://www.youtube.com/watch?v=dp_ivalzEe8', 'Moving and pulling', 'Перемещение и тяга', 'How the sleds are pulled and used in everyday work.', 'Как сани тянут и используют в повседневной работе.'),
    ('https://www.youtube.com/watch?v=CKOWTuo_WJg', 'Load capacity in practice', 'Грузоподъёмность на практике', 'A practical look at sled capacity and use with heavier loads.', 'Практический взгляд на вместимость саней и их применение с более тяжёлыми грузами.'),
    ('https://www.youtube.com/watch?v=v2EYZRFkakw', 'Work in forest conditions', 'Работа в лесных условиях', 'Sled use in the forest, between trees, stumps and uneven ground.', 'Применение саней в лесу, между деревьями, пнями и на неровном покрытии.'),
    ('https://www.youtube.com/watch?v=t8JmTwOfBss', 'Durability and use cases', 'Прочность и применение', 'Another example showing the sleds’ durability and practical value.', 'Ещё один пример, показывающий прочность саней и их практическую ценность.'),
    ('https://www.youtube.com/watch?v=KEZ34NNd6dY', 'Additional demonstration', 'Дополнительная демонстрация', 'Another real demonstration video of practical sled use.', 'Ещё одно реальное демонстрационное видео о практическом использовании саней.')
)
update public.site_videos
set
  title_en = coalesce(nullif(public.site_videos.title_en, ''), seed.title_en),
  title_ru = coalesce(nullif(public.site_videos.title_ru, ''), seed.title_ru),
  description_en = coalesce(nullif(public.site_videos.description_en, ''), seed.description_en),
  description_ru = coalesce(nullif(public.site_videos.description_ru, ''), seed.description_ru)
from seed
where public.site_videos.video_url = seed.video_url;
