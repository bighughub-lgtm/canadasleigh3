# AGENTS.md

## Project type

This is a React + Vite single-page landing page project for Canada Pulkan rugged terrain sleds sold in the Baltics.

The public website is for:
- Canada rugged sled product presentation
- product model comparison
- gallery and video proof
- partner/distributor contact
- client-managed media through a small admin CMS

The project is not a large ecommerce platform yet. It is a focused premium landing page with lightweight CMS functionality for images and videos.

---

## Core working mode

When working on this repo:
- Always inspect the current project state first.
- Prefer targeted edits over rebuilding from scratch.
- Preserve working sections unless a change is necessary.
- Keep the current component structure if it already works well.
- Do not rewrite large sections only for style preference.
- Make changes that are practical, durable, and easy to maintain.
- After implementation, always run `npm run build`.
- Fix build errors before finishing.
- Report changed files clearly.

Do not commit or push unless explicitly asked.

---

## Main commands

```bash
npm run dev
npm run build
```

Before reporting work as finished, run:

```bash
npm run build
```

---

## Tech stack

Current stack:
- React
- Vite
- Plain CSS
- Cloudflare Pages
- Cloudflare Pages Functions
- Supabase
- Cloudinary
- framer-motion is available and may be used only for restrained animation

Do not:
- add Tailwind
- add Bootstrap
- add large UI frameworks
- migrate to another stack
- add unnecessary dependencies
- introduce heavy animation libraries
- add a backend framework unless explicitly requested

---

## Important files and folders

Core app:
- `src/App.jsx`
- `src/main.jsx`
- `src/index.css`
- `src/pages/MainPage.jsx`

Components:
- `src/components/`
- `src/components/Header.jsx`
- `src/components/Hero.jsx`
- `src/components/UseCases.jsx`
- `src/components/Benefits.jsx`
- `src/components/ProductOverview.jsx`
- `src/components/ProductCatalog.jsx`
- `src/components/Gallery.jsx`
- `src/components/VideoSection.jsx`
- `src/components/OrderSteps.jsx`
- `src/components/DeliveryPayment.jsx`
- `src/components/About.jsx`
- `src/components/Partners.jsx`
- `src/components/FAQ.jsx`
- `src/components/Contact.jsx`
- `src/components/Footer.jsx`

Admin CMS:
- `src/admin/`
- `src/admin/AdminLogin.jsx`
- `src/admin/AdminDashboard.jsx`
- `src/admin/AdminLayout.jsx`
- `src/admin/AdminGallery.jsx`
- `src/admin/AdminVideos.jsx`
- `src/admin/AdminSectionImages.jsx`
- `src/admin/AdminProductGalleries.jsx`
- `src/admin/admin.css`

CMS helpers:
- `src/lib/supabaseClient.js`
- `src/lib/cmsApi.js`
- `src/lib/cloudinaryUpload.js`
- `src/lib/mediaSlots.js`
- `src/lib/useImageSlot.js`

Cloudflare Functions:
- `functions/api/cloudinary-signature.js`

Supabase:
- `supabase/admin_cms_schema.sql`
- `supabase/admin_cms_seed_existing_content.sql`

Docs:
- `ADMIN_SETUP.md`
- `ADMIN_MEDIA_MAP.md`

Public assets:
- `public/`

Legal source files:
- `src/content/legal/lv/`

---

## Git / commit rules

Do not commit or push unless explicitly requested.

When committing is requested:
- Run `git status --short`.
- Run `npm run build`.
- Add only specific intended files.
- Do not use `git add .`.
- Do not accidentally commit `.env.local`.
- Do not delete or modify unrelated files.

Never commit:
- `.env.local`
- secrets
- Cloudinary API secret
- Supabase service role key
- temporary files

Safe commit style:
```bash
git status --short
npm run build
git add specific/file.jsx specific/file.css
git status --short
git commit -m "Clear commit message"
git push origin main
```

---

## Environment and secrets

Local frontend env file:
```bash
.env.local
```

Required local frontend variables:
```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Cloudflare Pages environment variables:
```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Security rules:
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.
- Never expose `CLOUDINARY_API_SECRET` in frontend code.
- Cloudinary uploads use signed uploads through `/api/cloudinary-signature`.
- Do not use `CLOUDINARY_UPLOAD_PRESET` in this project.
- Do not put secret values into committed files.
- `.env.local` must stay uncommitted.

---

## Language rules

Public website:
- Visible public website content is currently Latvian.
- Keep public copy in Latvian unless a task explicitly asks for translation.
- Header language selector should show only:
  - `LAT`
  - `ENG`
  - `RUS`
- Do not re-add `LIT` or `EST` to the header selector.
- Only LAT is active for now.
- ENG/RUS are future placeholders unless multilingual functionality is explicitly requested.

Admin CMS:
- Admin fields should use only:
  - LV
  - EN
  - RU
- Do not show LT/EST fields in the admin UI.
- Older LT/EST database columns may exist, but do not expose them to the client.

Legal translation source files:
- Files under `src/content/legal/lv/` such as `cookiesEN.js`, `cookiesRU.js`, `delivery-returns_en.js`, `delivery-returns_ru.js`, `privacy_en.js`, `privacy_ru.js`, `purchase-terms_en.js`, and `purchase-terms_ru.js` are intentional.
- Do not delete them.
- Do not treat them as accidental files.
- They will be used later for AI/translation of EN/RU legal pages.

---

## Brand and factual rules

Keep these facts correct everywhere:
- The sleds are made in Sweden.
- VS Home SIA is the official representative / distributor in the Baltics.
- Canada Pulkan is the brand / product name.
- Canada Pulkan is not proof of Canadian manufacturing.
- Do not claim the sleds are made in Canada.
- Do not write “Ražots Kanādā”.
- Do not write “Canada Pulkan, Kanāda”.
- Do not write “Canada Pulkan ragavas tiek ražotas Kanādā”.

Correct wording examples:
- “Ražots Zviedrijā”
- “Zviedrijā ražotas apvidus ragavas”
- “VS Home SIA — oficiālais pārstāvis Baltijā”
- “Oficiālais izplatītājs Baltijā”

---

## Logo rules

Main logo file:
```text
/logopng2.png
```

Rules:
- Use the logo in original colors only.
- Do not apply tint.
- Do not apply overlay.
- Do not apply filter.
- Do not recolor.
- Do not invert.
- Do not apply gold effect.
- Do not apply accent-color treatment.
- Remove any CSS filters from logo usage.

Favicon:
- Use `/logopng2.png`.
- Keep original logo colors.

---

## Design direction

The site should feel:
- premium
- Nordic outdoors
- rugged but refined
- dark and elegant
- trustworthy
- structured
- modern
- readable
- practical

Avoid:
- generic ecommerce look
- clutter
- over-animation
- random bright colors
- neon accents
- fake luxury styling
- cheesy visual effects
- bloated cards
- oversized empty sections
- mobile-looking layouts on desktop

---

## Accent color rules

Use the warm amber / yellow-orange accent direction.

Accent should be used for:
- buttons
- pills
- labels
- borders
- highlights
- active tabs
- hover states
- floating controls
- selected states

Rules:
- Keep accent usage premium and restrained.
- Do not make the accent neon.
- Do not overuse glowing borders.
- Do not introduce random green/purple/blue accent systems.

---

## Copy style

Copy should be:
- clear
- factual
- practical
- premium
- trustworthy
- specific
- easy to understand

Avoid:
- generic AI fluff
- exaggerated claims
- empty marketing words
- fake urgency
- too much hype
- vague statements when a factual sentence is possible

Good style:
- practical buyer language
- direct benefits
- clear usage cases
- factual limitations
- honest ordering/delivery wording

---

## Public asset rules

Use local assets from `/public` unless working with CMS-uploaded media.

Handle filenames with spaces carefully.

Important public assets:
```text
/Vannas LAT.mp4
/heroooAT.mp4
/small vid.mp4
/logopng2.png
/apvidus kamanas.png
/apviduskamanaswhite.png
/canadaplukan.jpg
/mazasragavas.jpg
/ragavasbig.png
/PARTNERISSS.jpg
/statiska bilde.jpg
/DSC06417.jpg
/DSC06432.jpg
/KRJ01720.jpg
/KRJ02257.jpg
/KRJ02364.jpg
/KRJ02427.jpg
```

Compact product detail media:
```text
/sm1.jpeg
/sm2.jpeg
/sm3.jpeg
/sm4.jpeg
/sm5.jpeg
/sm6.jpg
/sm7.jpg
/sm8.jpg
/small vid.mp4
```

Classic product detail media:
```text
/b1.jpeg
/b2.jpeg
/b3.jpg
/b4.jpeg
/b5.jpeg
/b6.jpeg
/b7.jpg
```

Classic Open product detail media:
```text
/a1.jpeg
/a2.jpeg
/a3.jpeg
/a4.jpeg
```

Brand assets that should normally stay fixed:
```text
/logopng2.png
/apviduskamanaswhite.png
```

Do not make brand logo files editable in CMS unless explicitly requested.

---

## CMS / Admin panel rules

The project has a lightweight media admin panel.

Admin routes:
```text
/admin/login
/admin
```

The admin CMS manages:
- main gallery images
- product detail gallery images
- fixed section image slots
- video links and thumbnails

The admin CMS does not currently edit:
- product prices
- product names
- checkout logic
- Stripe links
- legal pages
- full website text content

Do not expand admin scope unless explicitly requested.

Admin UX rules:
- Keep the admin simple for a non-technical client.
- Use clear Latvian labels.
- Keep sections compact.
- Avoid huge form blocks.
- Do not expose raw technical IDs as primary labels.
- Technical IDs can appear only as small muted pills.
- Use clear grouping.

Admin media groups:
- `Galerija`
- `Videoklipi`
- `Sadaļu bildes`
- `Produktu galerijas`

Admin `Sadaļu bildes` grouping:
- `Lapas sadaļas`
- `Produktu pārskats`
- `Produktu kartītes`

Admin visible language fields:
- LV
- EN
- RU

Do not show:
- LT
- EST

---

## Supabase CMS rules

Supabase is used for admin authentication and CMS media data.

Schema file:
```text
supabase/admin_cms_schema.sql
```

Seed file:
```text
supabase/admin_cms_seed_existing_content.sql
```

Rules:
- Do not change schema unless explicitly needed.
- Do not break RLS policies.
- Do not remove admin access checks.
- Do not expose service role key to frontend.
- Keep seed idempotent.
- Seed should be safe to rerun.
- Do not create duplicate active rows for fixed slots.
- If seed changes, update `ADMIN_SETUP.md`.
- If media map changes, update `ADMIN_MEDIA_MAP.md`.

After media model changes, the seed should be rerun in Supabase SQL Editor:
```text
supabase/admin_cms_seed_existing_content.sql
```

---

## Cloudinary rules

Cloudinary is used for uploaded CMS images.

Rules:
- Use signed uploads only.
- Signed upload endpoint:
```text
/api/cloudinary-signature
```

Cloudinary env vars:
```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Do not use:
```text
CLOUDINARY_UPLOAD_PRESET
```

Do not expose:
```text
CLOUDINARY_API_SECRET
```

Upload folder direction:
```text
canadasleigh/gallery
canadasleigh/sections
```

---

## Media slot map

Fixed image slots are stored in `site_media.section`.

Current section image slots:
```text
hero
benefits
apvidus_feature
about
contact
partners
product_overview_compact
product_overview_classic
product_overview_classic_open
product_compact
product_classic
product_classic_open
```

Product detail gallery sections:
```text
product_compact_gallery
product_classic_gallery
product_classic_open_gallery
```

Main gallery section:
```text
gallery
```

Videos:
```text
site_videos
```

Video thumbnails:
```text
site_videos.thumbnail_url
```

Legacy:
- Old `product_overview` may exist as a legacy fallback.
- New code should prefer:
  - `product_overview_compact`
  - `product_overview_classic`
  - `product_overview_classic_open`

---

## Product facts and prices

Product prices must remain:

```text
CANADA COMPACT — €260.00
CANADA CLASSIC — €550.00
CANADA CLASSIC OPEN — €550.00
```

Do not change prices unless explicitly requested.

Product 1:
```text
CANADA COMPACT APVIDUS RAGAVAS
1.40 × 0.65 m · 5 kg
```

Product 2:
```text
CANADA CLASSIC APVIDUS RAGAVAS
2.33 × 0.85 m · 14 kg
```

Product 3:
```text
CANADA CLASSIC OPEN APVIDUS RAGAVAS
2.33 × 0.85 m · 14 kg
```

Factual product notes:
- Made in Sweden.
- HD polyethylene / HDPE material.
- Suitable for hunting, fishing, agriculture, forestry, expeditions, and heavy hauling.
- Resilient in harsh terrain.
- Can withstand heavy use.
- Not recommended for dragging on gravel or asphalt roads.
- More hygienic transport of game.
- VS Home SIA is the official Baltic representative.
- For Classic Open, mention that `Xtension` extension can be added separately if relevant.
- With Xtension, the sled can be extended up to 3.5 m if this feature is discussed.

---

## Product catalog rules

The product catalog is a priority section. Handle carefully.

Core behavior:
- Product cards must stay equal-height on desktop.
- Product cards must be clean in collapsed state.
- `Pilna informācija` opens a detail panel.
- Desktop detail panel opens below all cards, not inside one narrow card.
- Mobile detail can behave as an accordion, but must remain readable and compact.
- Only one product detail panel should be open at a time.
- Clicking the same `Pilna informācija` should close the panel.

CTA hierarchy:
- Primary accent button: `Pirkt`
- Secondary dark / outline button: `Pilna informācija`
- Inside expanded details, keep final CTA: `Pirkt`
- Additional contact CTA can be `Sazināties`
- Keep Stripe/payment links unchanged.

Do not:
- make product details look like admin blocks
- use huge mobile-like panels on desktop
- allow detail panel to stretch only one product card
- let product media dominate the entire section
- create horizontal overflow on mobile

Desktop detail panel should be:
- wide
- aligned with product grid
- readable
- premium
- compact
- structured

Mobile detail panel should:
- stack cleanly
- wrap text correctly
- use full-width buttons
- keep media usable
- avoid oversized typography
- avoid horizontal clipping

---

## Product media viewer rules

Product detail media:
- Use one main preview.
- Use compact thumbnails.
- Clicking a thumbnail updates main preview.
- Clicking main preview opens fullscreen viewer.
- Product media viewer should support images and videos in one list.
- Compact product includes local video `/small vid.mp4`.
- Video thumbnails should show a small `VIDEO` badge.
- Product media must keep CMS/fallback logic intact.

Fullscreen product media:
- Show full image with real aspect ratio.
- Use `object-fit: contain`.
- Do not crop.
- Support close.
- Support previous/next.
- Support bottom thumbnail strip.
- Support Escape / ArrowLeft / ArrowRight where implemented.
- Video should play with controls.
- Do not show image zoom controls for video.

---

## Main gallery rules

The main public gallery section must:
- show a premium two-column desktop browser
- large selected image on the left
- separate thumbnail panel on the right
- avoid thumbnail overlay over the main image
- allow thumbnail panel internal scroll when many images exist
- show selected state clearly
- remain responsive on tablet/mobile
- avoid horizontal overflow

Normal page gallery preview:
- May use `object-fit: cover`.
- May crop slightly for design.

Fullscreen gallery:
- Must show full original image.
- Must use real aspect ratio.
- Must use `object-fit: contain`.
- Must not crop portrait images.
- Must not crop landscape images.
- Must not crop unusual aspect ratios.
- Empty dark space around the image is acceptable.
- Cropping is not acceptable.

Fullscreen zoom:
- Zoom range should support 100% to 500%.
- Use slider control.
- Show current zoom percentage.
- Reset zoom to 100% when switching images.
- Reset zoom to 100% when closing modal.
- At 100%, full image must be visible.
- When zoomed above 100%, panning/dragging should work if implemented.
- Thumbnails must remain usable.

---

## Video section rules

Video section:
- Keep one main active video player.
- Playlist / video card area may be internally scrollable if videos grow.
- Keep the video section compact and easy to scan.
- Avoid oversized playlist cards.
- Avoid excessive vertical height.
- Maintain premium dark styling and amber accent.
- Improve tablet and mobile layout carefully.
- YouTube links and local video paths may both be supported.

---

## Partners section rules

The site has a partner/distributor cooperation section.

Purpose:
- invite cooperation partners in Latvia, Lithuania, and Estonia
- suitable for hunting shops, fishing shops, outdoor gear sellers, ATV/snowmobile dealers, forestry/agriculture contacts, clubs, and relevant communities

Style:
- factual
- professional
- not desperate
- clear CTA

Contact options:
- email
- phone
- WhatsApp if implemented

Image slot:
```text
partners
```

Fallback:
```text
/PARTNERISSS.jpg
```

---

## Payment / Stripe rules

Current state:
- Purchase buttons are visually ready.
- Stripe/payment links must not be changed unless explicitly requested.
- Product prices must not be changed unless explicitly requested.

Rules:
- Do not imply live checkout if it is not active.
- Do not remove payment placeholders/comments.
- Keep clear code comments where Stripe URLs can later be inserted.
- Do not modify checkout logic without explicit instruction.

---

## Scroll and anchor rules

Sticky header exists, so anchors must account for it.

Rules:
- Sections should use `scroll-margin-top` where needed.
- Header must not cover section titles after navigation.
- `Aizvērt informāciju` in product detail should close the panel and scroll back to the product catalog/cards area.
- Scroll-to-top button should remain amber-accented and accessible.
- Smooth scrolling should not create confusing jumps.

---

## Responsive rules

Always check:
- desktop
- tablet
- mobile

Responsive requirements:
- no horizontal overflow
- readable typography
- clean stacked layout on mobile
- touch-friendly buttons
- usable gallery thumbnails
- usable fullscreen modal
- compact product cards
- clean admin layout

Do not leave desktop sections behaving like stretched mobile accordions.

---

## Code quality rules

General:
- Keep code clean and maintainable.
- Use semantic HTML where appropriate.
- Keep CSS organized and readable.
- Avoid unnecessary abstraction.
- Avoid dead code.
- Avoid broken imports.
- Avoid duplicate logic unless extraction would create more risk.
- Prefer small, surgical edits over broad churn.
- Keep fallback logic intact.
- Keep CMS loading resilient.

CSS:
- Keep class names understandable.
- Avoid random one-off hacks.
- Avoid excessive `!important`.
- Avoid global CSS changes unless necessary.
- Keep component CSS scoped by class naming where possible.

React:
- Avoid unnecessary state complexity.
- Keep event handlers clear.
- Do not break existing CMS/fallback flows.
- Do not introduce hydration or routing issues.

---

## Protected / do-not-touch areas

Do not modify unless explicitly requested:
- product prices
- payment links
- Stripe logic
- legal pages
- legal source files under `src/content/legal/lv/`
- Supabase schema
- Cloudflare secrets
- auth/admin access security
- logo colors
- favicon/logo filters

Do not delete:
- `src/content/legal/lv/cookiesEN.js`
- `src/content/legal/lv/cookiesRU.js`
- `src/content/legal/lv/delivery-returns_en.js`
- `src/content/legal/lv/delivery-returns_ru.js`
- `src/content/legal/lv/privacy_en.js`
- `src/content/legal/lv/privacy_ru.js`
- `src/content/legal/lv/purchase-terms_en.js`
- `src/content/legal/lv/purchase-terms_ru.js`

These are intentional future EN/RU legal translation source files.

---

## Done means

A task is done only if:
- requested UI/content/code changes are implemented
- `npm run build` passes
- changed files are clearly reported
- asset paths work
- no false Canada origin claims remain
- no logo filters/recoloring are introduced
- no product prices are changed unless requested
- no payment links are changed unless requested
- no admin/Supabase/legal files are touched unless required by the task
- responsive behavior remains usable
- fallback content still works if CMS data is missing

For CMS/media tasks, also report:
- whether seed SQL changed
- whether schema SQL changed
- whether Supabase seed must be rerun
- new or changed media slot IDs

---

## Final report format

When finishing a task, report:

```text
Build:
- npm run build passed / failed

Changed files:
- file 1
- file 2

What changed:
- short practical summary

Checks:
- prices unchanged
- payment links unchanged
- legal files untouched
- admin/Supabase touched or untouched
- seed rerun needed: yes/no
```
