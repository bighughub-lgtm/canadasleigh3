# Admin CMS Setup (Cloudflare)

The admin panel at `/admin` is a small CMS for public website texts, gallery images, product gallery images, video links and fixed section image slots. It does not edit product prices, checkout/payment links, legal document bodies or product media paths.

Everything runs on Cloudflare. There is no Supabase and no Cloudinary anymore.

| Part | Where it lives |
| --- | --- |
| Website (React + Vite) | Cloudflare Pages project `canadasleigh3` (auto-deploys from GitHub `main`) |
| API (`/api/*`) | Pages Functions: `functions/api/[[route]].js` → `server/api.js` |
| Image files (`/media/*`) | R2 bucket `canadasleigh-media`, binding `MEDIA`, served by `functions/media/[[path]].js` |
| Content + admin accounts | D1 database `canadasleigh-cms`, binding `DB` |

The admin UI uses only LV, EN and RU fields. Older LT/EST columns exist in the tables but are not shown to the client.

## Cloudflare bindings

Pages project → Settings → Bindings (set for both Production and Preview):

```text
DB     D1 database  canadasleigh-cms
MEDIA  R2 bucket    canadasleigh-media
```

No environment variables or secrets are needed. The bucket stays private; images are served through `/media/...`.

## Database

The schema is in `server/schema.js` (idempotent `CREATE TABLE IF NOT EXISTS`). Tables:

```text
site_media            gallery images, product gallery images, fixed image slots
site_videos           video links, titles, descriptions, thumbnails
site_texts            optional public text overrides
admin_users           admin accounts (email + PBKDF2 password hash)
admin_sessions        login sessions (only a SHA-256 of the cookie token is stored)
admin_setup_tokens    one-time invitation links for creating an account
admin_login_attempts  failed-login counter (10 failures per 15 min per IP)
```

## Admin accounts

There is no public sign-up. A new admin account is created from a one-time invitation link:

```text
https://canadasleigh.com/admin/setup#<token>
```

The person opens the link, enters their e-mail and chooses a password (at least 10 characters). The link works once and expires after 14 days. Only the SHA-256 of the token is stored in `admin_setup_tokens`.

To create a new invitation link (for a new person or a forgotten password), insert a new token hash into `admin_setup_tokens` with the D1 console. A forgotten-password account can be removed from `admin_users` first.

Login sessions last 7 days in an HttpOnly, Secure, SameSite=Strict cookie. All state-changing API calls also check that the request comes from the same site.

## Admin Content Model

Public website texts are managed in `Teksti`. The client can edit LV, EN and RU values for safe public text keys. Each row can be saved or restored to the code default. When a row is missing or reset, the site uses `src/content/publicTranslations.js`.

Main gallery images are a many-image list in `Galerija` (upload, replace, hide/show, delete, move up/down; order is normalized automatically).

Product gallery images are managed in `Produktu galerijas`:

```text
product_compact_gallery
product_classic_gallery
product_classic_open_gallery
```

Videos are editable links. YouTube URLs and local public video paths are supported.

Section images are fixed slots, not a gallery. Uploading to a slot replaces that slot image. Slots:

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

Uploaded files go to R2 under `uploads/<gallery|sections|product-galleries>/<year>/<uuid>.<ext>` (JPG, PNG, WEBP, AVIF or GIF, max 20 MB). Deleting an entry in the admin removes it from the list; the file stays in R2.

If the CMS has no row for something, or the API is unreachable, the public site keeps its hardcoded fallback content. See `ADMIN_MEDIA_MAP.md` and `ADMIN_TEXT_CMS_MAP.md`.

## Local development

```bash
npm run build
npx wrangler pages dev dist --d1 DB=local-cms --r2 MEDIA=local-media
```

`npm run dev` (Vite only) shows the site with fallback content, because the `/api` functions are not running there.

## Move from Supabase (November 2026)

Content was copied once from the old Supabase project with a one-time, key-protected import endpoint (removed after the move; see git history of `server/migrate.js`). Images that were on Cloudinary were copied to R2 under `migrated/`. English alt texts and video texts were changed from "sled" to "sleigh" during the move. Rows that were hidden in the old admin were not visible to the public read API and were not copied.
