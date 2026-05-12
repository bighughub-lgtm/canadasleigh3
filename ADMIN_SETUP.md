# Admin CMS Setup

This admin panel is a small CMS for public website texts, gallery images, product gallery images, video links, and fixed section image slots. It does not edit product prices, checkout/payment links, legal document bodies, or product media paths.

The admin UI uses only LV, EN, and RU fields. Older LT/EST database columns can remain in Supabase, but they are not shown to the client.

## Frontend Environment

Create `.env.local` locally:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Do not commit `.env.local`.

## Cloudflare Pages Environment

Add these variables in Cloudflare Pages project settings:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

`SUPABASE_SERVICE_ROLE_KEY` and `CLOUDINARY_API_SECRET` must stay server-side only. They are used only by `functions/api/cloudinary-signature.js`.

## Supabase Setup

1. Open Supabase SQL Editor.
2. Run `supabase/admin_cms_schema.sql`.
3. Run `supabase/admin_cms_seed_existing_content.sql`.
4. Create the first admin user in Supabase Authentication with email and password.
5. Add that user to `public.admin_users` by running:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'client@example.com'
on conflict (user_id) do update set email = excluded.email;
```

Replace `client@example.com` with the actual admin email.

`supabase/admin_cms_schema.sql` creates the CMS tables, indexes, triggers, and security policies. It now includes the `public.site_texts` table for optional public website text overrides, so run this schema once after pulling this update. `supabase/admin_cms_seed_existing_content.sql` imports the current existing website gallery images, product detail gallery images, product overview images, video list, and landing section image slots into the admin panel.

After pulling or deploying updates to this media model, run `supabase/admin_cms_seed_existing_content.sql` again. The seed is safe to rerun and adds missing rows without duplicating existing gallery URLs or single image slots. It also fills missing EN/RU public media titles, alt text, and video descriptions for seeded rows without overwriting existing non-empty translations. This update adds the explicit product overview slots listed below.

If the seed file is not run, the public website still works because it keeps the hardcoded fallback content, but the admin panel will look empty until media is imported or uploaded.

Text overrides do not require a seed. `/admin` shows the editable text list from the code definitions even when `public.site_texts` is empty. When a row is missing or a text is reset, the public site falls back to `src/content/publicTranslations.js`.

## Admin Content Model

Public website texts are managed in `Teksti`. The client can edit LV, EN, and RU values for safe public text keys such as headings, labels, CTA text, FAQ answers, cookie banner text, and legal page UI labels. Each row can be saved individually or restored to the code default.

The text CMS intentionally does not edit:

```text
product prices
Stripe/payment buy links
product media paths
Cloudinary folders
legal document body files
function-generated dynamic strings
```

For the text group map and fallback rules, see `ADMIN_TEXT_CMS_MAP.md`.

Main gallery images are a many-image list in `Galerija`. The client can upload images, replace an existing image, hide/show items, delete them, and move them up or down. The admin panel keeps the order normalized automatically, so the client does not need to edit order numbers.

Product gallery images are managed separately in `Produktu galerijas`. These are the images shown inside each product's `Pilna informācija` media viewer:

```text
product_compact_gallery
product_classic_gallery
product_classic_open_gallery
```

Each product gallery can contain many images. Uploading there adds a new image to that product gallery, while `Nomainīt attēlu` replaces one existing row.

Videos are editable links. YouTube URLs and local public video paths are supported. The client can update LV/EN/RU titles and descriptions, optionally add a thumbnail URL, hide/show videos, and move them up or down.

Section images are fixed slots, not a gallery. Uploading to a slot replaces that slot image instead of creating several competing active images. Current slots are:

```text
hero
benefits
product_overview_compact
product_overview_classic
product_overview_classic_open
product_compact
product_classic
product_classic_open
apvidus_feature
about
contact
partners
```

The old `product_overview` slot can remain in Supabase as a legacy fallback, but the admin UI now uses the three explicit overview slots. These slots are grouped in the admin as `Lapas sadaļas`, `Produktu pārskats`, and `Produktu kartītes`.

The seed imports the current public images/videos into these admin tables. If a CMS row is missing or Supabase is unavailable, the public page still uses its local fallback image/video content.

For a complete media map, see `ADMIN_MEDIA_MAP.md`.

## Cloudinary Setup

Use one Cloudinary account for image storage. The signed upload endpoint automatically uses:

```text
canadasleigh/gallery
canadasleigh/sections
```

No Cloudinary secret is exposed to the browser.

## Local Testing

1. Add `.env.local` with the frontend Supabase variables.
2. Run:

```bash
npm run dev
```

3. Open `/admin/login`.
4. Log in with the Supabase Auth admin user.
5. Replace the Partners image in `Sadaļu bildes`.
6. Replace the About image in `Sadaļu bildes`.
7. Replace one image under `Produktu pārskats` and confirm the matching ProductOverview tab changes.
8. Replace one product card image in `Sadaļu bildes`.
9. Add one COMPACT product detail image in `Produktu galerijas`.
10. Move product gallery images up/down and confirm the product detail media order changes.
11. Add one main gallery image in `Galerija`.
12. Move main gallery images up/down and confirm the public gallery order changes.
13. Add one video link.
14. Open `Teksti`, edit one public heading in LV/EN/RU, save it, and confirm the public page updates after reload or language switch.
15. Restore that text to noklusējums and confirm the public page falls back to the static translation.
16. Check the public page and confirm fallbacks still work when no CMS data exists.

For local testing of signed image uploads, run the site through Cloudflare Pages Functions tooling or test on a Cloudflare Pages preview deployment with the server-side environment variables configured.

## Production Testing

1. Deploy to Cloudflare Pages.
2. Confirm all Cloudflare Pages environment variables are set.
3. Open `/admin/login`.
4. Upload one gallery image and one Partners section image.
5. Check the public homepage:
   - Gallery uses active uploaded images when available.
   - Product detail galleries use active uploaded images when available.
   - ProductOverview tabs use the matching `product_overview_*` image when available.
   - Video section uses active uploaded video links when available.
   - Partners section image uses the active `partners` section image when available.
   - Edited rows in `Teksti` override public LV/EN/RU static text.
   - If no active CMS items exist, the site falls back to the existing hardcoded content.
