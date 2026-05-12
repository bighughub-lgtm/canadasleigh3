# Admin CMS Setup

This admin panel is a small media CMS for gallery images, video links, and fixed section image slots. It does not edit products, prices, checkout, legal pages, or text content.

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

`supabase/admin_cms_schema.sql` creates the CMS tables, indexes, triggers, and security policies. `supabase/admin_cms_seed_existing_content.sql` imports the current existing website gallery images, video list, and landing section image slots into the admin panel.

If the seed file is not run, the public website still works because it keeps the hardcoded fallback content, but the admin panel will look empty until media is imported or uploaded.

## Admin Content Model

Gallery images are a many-image list. The client can upload images, hide/show them, delete them, and move them up or down. The admin panel keeps the order normalized automatically, so the client does not need to edit order numbers.

Videos are editable links. YouTube URLs and local public video paths are supported. The client can update LV/EN/RU titles and descriptions, optionally add a thumbnail URL, hide/show videos, and move them up or down.

Section images are fixed slots, not a gallery. Uploading to a slot replaces that slot image instead of creating several competing active images. Current slots are:

```text
hero
benefits
product_overview
product_compact
product_classic
product_classic_open
apvidus_feature
about
contact
partners
```

The seed imports the current public images/videos into these admin tables. If a CMS row is missing or Supabase is unavailable, the public page still uses its local fallback image/video content.

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
7. Add one gallery image.
8. Move gallery images up/down and confirm the public gallery order changes.
9. Add one video link.
10. Check the public page and confirm fallbacks still work when no CMS data exists.

For local testing of signed image uploads, run the site through Cloudflare Pages Functions tooling or test on a Cloudflare Pages preview deployment with the server-side environment variables configured.

## Production Testing

1. Deploy to Cloudflare Pages.
2. Confirm all Cloudflare Pages environment variables are set.
3. Open `/admin/login`.
4. Upload one gallery image and one Partners section image.
5. Check the public homepage:
   - Gallery uses active uploaded images when available.
   - Video section uses active uploaded video links when available.
   - Partners section image uses the active `partners` section image when available.
   - If no active CMS items exist, the site falls back to the existing hardcoded content.
