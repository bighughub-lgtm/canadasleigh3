-- Canada Sleigh admin CMS seed: existing public media
-- Run this after supabase/admin_cms_schema.sql.
--
-- This seed mirrors the current hardcoded fallback content from:
-- - src/components/Gallery.jsx
-- - src/components/VideoSection.jsx
-- - src/components/Partners.jsx
--
-- All gallery and partners images referenced below already use stable /public
-- paths, so no hashed build asset URLs are used and no files need to be copied
-- before running this seed.
--
-- The inserts are idempotent: each row is skipped when the same section + url
-- or video_url already exists.
-- YouTube rows use editable watch URLs for the same video IDs that are
-- currently hardcoded in VideoSection.jsx.

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
    ('gallery', 'Meža maršruts', 'Canada Pulkan ragavas reālā meža maršrutā', '/DSC06432.jpg', 0),
    ('gallery', 'Apvidus darbs', 'Ragavas skarbā apvidū', '/KRJ02427.jpg', 1),
    ('gallery', 'Vilcēja līnija', 'Ragavas pārvietošanas brīdī', '/KRJ02257.jpg', 2),
    ('gallery', 'Pārvadājums dabā', 'Ragavas meža un lauka apstākļos', '/hngfbdv.jpg', 3),
    ('gallery', 'Tuvplāna kadrs', 'Tuvplāna kadrs ar ragavām dabiskā vidē', '/rtdgf.jpg', 4),
    ('gallery', 'Noslēdzošais kadrs', 'Ragavas mežā un smaguma transportēšanā', '/yuthgdf.jpg', 5),
    ('gallery', 'Stāvā trase', 'Canada Pulkan ragavas slīpākā meža posmā', '/DSC06417.jpg', 6),
    ('gallery', 'Meža transportēšana', 'Ragavas smaguma pārvietošanai mežā', '/KRJ02364.jpg', 7),
    ('gallery', 'Nelīdzens reljefs', 'Ragavas nelīdzenā reljefā', '/htgbfdf.jpg', 8),
    ('gallery', 'Kravas maršruts', 'Ragavas smagākai kravai apvidū', '/KRJ01743.jpg', 9),
    ('gallery', 'Pierādīta lietošana', 'Ragavas autentiskā lietošanā dabā', '/thrgdf.jpg', 10),
    ('gallery', 'Bezceļa aina', 'Vertikāls bezceļa kadrs ar ragavām', '/ytr.jpg', 11),
    ('partners', 'Partneru sadaļas attēls', 'Canada ragavas praktiskas lietošanas vidē', '/PARTNERISSS.jpg', 0)
) as seed(section, title_lv, alt_lv, url, sort_order)
where not exists (
  select 1
  from public.site_media existing
  where existing.section = seed.section
    and existing.url = seed.url
);

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
    ('Pilns process no A-Z', 'Pilns darba process no sākuma līdz gatavam rezultātam.', '/Vannas LAT.mp4', null::text, 0),
    ('Kā mazā vanna ielien dzīvnieks', 'Praktisks piemērs, kā mazā vanna tiek izmantota medījuma ievietošanai un transportēšanai.', '/small vid.mp4', null::text, 1),
    ('Ragavas darbībā', 'Reāls piemērs, kā ragavas uzvedas praktiskā lietošanā dabā.', 'https://www.youtube.com/watch?v=9uT6r90BZwY', null::text, 2),
    ('Lietošana bezceļā', 'Skats uz ragavu lietošanu sarežģītākos apstākļos un reljefā.', 'https://www.youtube.com/watch?v=izPM9_FGDE0', null::text, 3),
    ('Pārvietošana un vilkšana', 'Kā ragavas tiek vilktas un izmantotas ikdienas darbā.', 'https://www.youtube.com/watch?v=dp_ivalzEe8', null::text, 4),
    ('Kravnesība praksē', 'Praktisks ieskats ragavu ietilpībā un to izmantošanā smagākām kravām.', 'https://www.youtube.com/watch?v=CKOWTuo_WJg', null::text, 5),
    ('Darbs meža apstākļos', 'Ragavu pielietojums mežā, starp kokiem, celmiem un nelīdzenā segumā.', 'https://www.youtube.com/watch?v=v2EYZRFkakw', null::text, 6),
    ('Izturība un pielietojums', 'Vēl viens piemērs, kas parāda ragavu izturību un praktisko vērtību.', 'https://www.youtube.com/watch?v=t8JmTwOfBss', null::text, 7),
    ('Papildu demonstrācija', 'Vēl viens reāls demonstrācijas video par ragavu lietošanu praksē.', 'https://www.youtube.com/watch?v=KEZ34NNd6dY', null::text, 8)
) as seed(title_lv, description_lv, video_url, thumbnail_url, sort_order)
where not exists (
  select 1
  from public.site_videos existing
  where existing.video_url = seed.video_url
);
